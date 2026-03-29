# Test Series (Learn) — Multi‑Phase Implementation Plan

## Goal (as discussed)

Students go to **Learn → Test**, select a **language**, then pick **one or more tutorials** (within that language) that are enabled for tests. They confirm a **total number of questions (N)**. The app selects **N exercises total across selected tutorials**, shuffles order (seeded), and runs a timed test:

- Each question has its own timer (default **5 min** unless explicitly set, or derived from solution length per your rule).
- Switching questions **pauses** the previous question timer and **resumes** when revisiting.
- When a question’s time ends it is **auto‑submitted** (snapshot code saved) but **NOT sent to AI yet**.
- When all questions are done or the student ends test, the app sends the attempt (questions + official solutions + student code) **in one request** to OpenRouter for grading.
- Results UI shows verdict per question (correct/partial/incorrect) + brief explanation, with **student code + official solution**, and overall accuracy percentage.

This plan assumes you will **reuse existing `tutorials` and `exercises`** as the source of questions.

---

## Current codebase anchors (what to reuse)

- **Payload collections**
  - `Base/server/src/collections/Tutorial.ts`
  - `Base/server/src/collections/Exercise.ts`
- **Client data fetching**
  - `Base/client/lib/getData.ts`
    - `getLanguages()`
    - `getTutorialsWithExercisesByLanguageId()`
    - `getExercisesByTutorialId()`
    - `getExerciseBySlug()`
- **Code runner**
  - `Base/client/app/utils/codeExecution.ts` (`executeCode()` posts to `/api/run-code`)
  - Monaco patterns:
    - `Base/client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/TutorialCodePlayground.tsx`
    - `Base/client/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/StudentPlayground.tsx`
- **OpenRouter integration (server)**
  - `Base/server/src/app/api/chat/route.ts` (auth + spending + usage tracking)
  - `Base/server/src/utils/vivyUsageTracking.ts` (cost/token tracking)

---

## Data model changes (Payload) — minimal fields

### Tutorials (`tutorials`)

- **Add**: `isTestEnabled` (boolean, default false)
  - Purpose: tutorial appears in “Select tutorials for test” list.

### Exercises (`exercises`)

- **Add**: `isTestEnabled` (boolean, default false)
  - Purpose: exercise is eligible for random test selection.
- **Add**: `timeToSolveSeconds` (number, optional)
  - Purpose: per-question timer override.

---

## New modules (high level)

- **Learn UI**
  - `/Learn/Test` landing (language selection like `/Learn/Exercise`)
  - `/Learn/Test/[langSlug]` tutorial selector + N picker
  - `/Learn/Test/attempt/[attemptId]` test runner UI
  - `/Learn/Test/result/[attemptId]` results UI
- **Server API**
  - `POST /api/tests/create-attempt`
  - `POST /api/tests/autosubmit-question`
  - `POST /api/tests/end-attempt`
  - `POST /api/tests/grade-attempt` (OpenRouter call, structured JSON response)
- **Persistence**
  - Add a new Payload collection `test-attempts` (recommended) or store attempt state client-side (not recommended for fairness/resume).
- **Auth requirement**
  - Only **logged-in users** may create/run/grade attempts. Anonymous users should be redirected to login or shown an inline “Please log in to start a test” gate.

---

## Phase 0 — discovery & design lock

### Deliverables

- Finalize:
  - Time default/derivation rule (5 min default vs by-solution-lines)
  - Whether graders see official solution (you said **yes**)
  - Seed behavior (recommended: seeded order stored per attempt)
- Define the grading JSON schema (see Phase 5).

### Verification

- Review exercise authoring burden: ensure you can enable `isTestEnabled` on enough exercises.

---

## Phase 1 — Payload: enable “test-enabled” filtering

### Deliverables

- Add `isTestEnabled` on `tutorials`
- Add `isTestEnabled` + `timeToSolveSeconds` on `exercises`
- Update admin list columns (optional) to show these toggles for quick management.

### UI/API checks

- In Payload admin:
  - Toggle a tutorial/exercise as test-enabled.
  - Confirm it saves correctly.

### Console/log checks

- Watch server logs for Payload schema errors on startup.
- Confirm no validation errors when saving exercises (due to required fields).

---

## Phase 2 — Learn UI: “Create test” flow (language → tutorial selection → N confirmation)

### Deliverables

- Add a new entry point (e.g. button on `LearnPage` or separate nav item) to reach Test flow.
- `/Learn/Test` shows languages (reuse `getLanguages()` like `Learn/Exercise`).
- `/Learn/Test/[langSlug]`:
  - Fetch tutorials for language and filter by `isTestEnabled`.
  - For selected tutorials, compute:
    - available exercise count = sum of test-enabled exercises across chosen tutorials
  - N picker with guardrails:
    - `1 <= N <= availableExerciseCount`

### Verification (UI)

- **Happy path**
  - Choose language → tutorial list shows only test-enabled tutorials.
  - Select multiple tutorials → “available questions” updates.
  - Set N → confirm button enables.
- **Auth gate**
  - As a logged-out user, visiting `/Learn/Test` or `/Learn/Test/[langSlug]`:
    - shows login gate and prevents starting attempt
    - confirm “Start Test” triggers redirect to login (or opens login modal) and does not call attempt API
  - After logging in, returning to the Test page allows starting attempt normally.
- **Edge cases**
  - Selecting tutorials with 0 test-enabled exercises should block or show warning.
  - N greater than available should show validation error.
  - Reloading the page shouldn’t lose selected tutorials if you persist draft selection (optional).

### Verification (logs)

- Add temporary debug logs on the client during development:
  - Selected tutorial IDs
  - Available eligible exercise IDs count
  - Chosen N

---

## Phase 3 — Attempts: create attempt + select random questions (seeded)

### Deliverables

- Create `test-attempts` collection:
  - `user` (relationship), `language`, selected `tutorialIds`
  - `seed` (string/int)
  - `exerciseIdsOrdered` (array of relationships/ids)
  - `questionState[]`:
    - `exerciseId`
    - `timeAllocatedMs`, `timeRemainingMs`
    - `status` (`unseen|active|autosubmitted|submitted`)
    - `studentCode` (text)
    - optional `lastRunOutput`/`stderr`
  - `startedAt`, `endedAt`, `endedByUser`
- `POST /api/tests/create-attempt`
  - Input: `languageSlug`, `tutorialIds[]`, `n`
  - Auth: require logged-in user; return `401` if not authenticated.
  - Server action:
    - Fetch eligible exercises: `tutorial in tutorialIds AND isTestEnabled=true`
    - Sample N using RNG seeded by `seed`
    - Assign `timeAllocatedMs` per exercise:
      - if `timeToSolveSeconds` present: use it
      - else: default 5min (or by-solution-lines if you implement that rule)
    - Persist and return `attemptId` + ordered questions (minimal payload)

### Verification (API)

- Create attempt returns:
  - stable `attemptId`
  - exactly N questions
  - order stable if repeated with same seed (for debug/admin) OR stable when reloading attempt by `attemptId`
- Unauthenticated calls:
  - `POST /api/tests/create-attempt` returns `401`
  - Attempt routes should not leak exercise solutions to logged-out users.

### Verification (logs)

- Server logs for create attempt should include:
  - user id (if authenticated)
  - tutorialIds
  - eligibleExerciseCount
  - N requested vs N returned
  - seed

---

## Phase 4 — Test Runner UI (timers + per-question pause/resume + autosubmit)

### Deliverables

- `/Learn/Test/attempt/[attemptId]`:
  - question navigator (list / next/prev)
  - timer display for active question
  - Monaco editor + Run button (reuse existing runner utilities)
  - autosave student code per question (local state + persist to attempt periodically)
- Timer implementation:
  - store `timeRemainingMs` per question
  - store `activeQuestionStartedAtMs`
  - on switch:
    - compute elapsed for previous active
    - decrement its remaining
    - set new active startedAt
  - when remaining hits 0:
    - lock editor
    - autosubmit snapshot (`POST /api/tests/autosubmit-question`)
    - advance to next unanswered
- Proctoring-lite (violations) policy:
  - Treat these as violations:
    - leaving fullscreen (if you require fullscreen)
    - tab hidden (`visibilitychange` → `document.hidden === true`)
    - window loses focus (`window.blur`)
  - On **each violation**:
    - show a **red 10-second countdown overlay/banner**
    - if the student returns focus / re-enters fullscreen within 10s → continue test, increment `violationCount`
    - if they do not return within 10s → **end the attempt immediately**
  - If `violationCount >= 3` at any time → **end the attempt immediately**
  - Persist violation events to the attempt record:
    - `violationCount`
    - `violations[]`: `{ type, startedAt, resolvedAt, resolved, countdownSeconds, questionIdAtTime }`

### Verification (UI)

- **Timer correctness**
  - Start question 1 → countdown starts.
  - Switch to question 2 → question 1 timer pauses; question 2 starts.
  - Switch back → question 1 resumes where it left off.
- **Violation countdown**
  - Start attempt, then switch tab or blur window:
    - red “Return to test” overlay appears with 10s countdown
    - returning before 0 hides overlay and continues timers
    - confirm `violationCount` increments
  - Trigger 3 violations:
    - attempt ends immediately (navigate to end/summary screen)
  - Trigger a violation and _don’t_ return within 10s:
    - attempt ends automatically
- **Timeout autosubmit**
  - Set a tiny timer in dev (e.g. 10s) for one exercise and confirm:
    - editor locks at 0
    - question status becomes autosubmitted
    - navigation still works
- **Persistence**
  - Refresh page mid-attempt:
    - attempt loads
    - remaining time is consistent (no free extra time)
    - code snapshots restored for each question

### Verification (console logs to add during dev)

- On each navigation:
  - `prevQuestionId`, `prevRemainingMsBefore`, `elapsedMs`, `prevRemainingMsAfter`
  - `nextQuestionId`, `nextRemainingMs`, `startedAt`
- On timeout:
  - `questionId`, `autosubmittedAt`, `studentCodeLength`
- On violation start/resolve:
  - `violationType`, `questionIdAtTime`, `violationCount`, `countdownStartedAt`
  - `resolvedAt`, `resolvedWithinSeconds`, `endedAttempt` (boolean)

---

## Phase 5 — End attempt + AI grading (single batch) with structured JSON

### Deliverables

- `POST /api/tests/end-attempt`
  - Marks attempt ended (endedAt, endedByUser), freezes timers.
- `POST /api/tests/grade-attempt`
  - Loads attempt, fetches:
    - exercise statement (title/description)
    - official solution (`solution_code`)
    - student code snapshots
    - language slug
    - time stats
  - Calls OpenRouter (use the **server** OpenRouter pattern for auth/cost tracking).
  - Forces response format: **JSON only**, matching schema:

```json
{
  "attemptId": "string",
  "overall": {
    "correct": 0,
    "partial": 0,
    "incorrect": 0,
    "total": 0,
    "percentage": 0
  },
  "results": [
    {
      "exerciseId": "string",
      "verdict": "correct|partial|incorrect",
      "brief": "string",
      "keyIssues": ["string"],
      "suggestedFixes": ["string"],
      "confidence": 0.0
    }
  ]
}
```

> Recommendation: implement a strict JSON parse on the server. If it fails, do a single “repair” retry asking the model to output valid JSON only.

### Verification (API)

- Grade endpoint:
  - returns valid JSON per schema
  - contains exactly N results
  - percentage calculation matches counts

### Verification (logs)

- Server logs should include:
  - attemptId
  - model id
  - prompt size metrics (approx chars)
  - OpenRouter usage: tokens + cost (you already track this pattern)
  - JSON parse success/failure + retry if needed

---

## Phase 6 — Results UI (per-question verdict + code + solution + overall stats)

### Deliverables

- `/Learn/Test/result/[attemptId]`:
  - overall score summary (correct/partial/incorrect, percentage)
  - per-question cards:
    - verdict chip
    - AI brief
    - tabs: “Your Code” + “Official Solution”
    - optionally show time used
- Make sure solutions are **only** shown on results page (not during the test).

### Verification (UI)

- Check:
  - Results page loads after grading
  - Each question shows correct mapping (exerciseId → statement/solution/student code)
  - Monaco editors are read-only
  - Overall percentage matches counts

---

## Phase 7 — Hardening (security, fairness, performance)

### Security/Fairness

- Ensure attempt endpoints require auth (**tests are logged-in only**).
- Prevent re-grading spamming:
  - only allow `grade-attempt` once, or cache result in attempt.
- Ensure timer cannot be extended by refresh:
  - compute remaining time from persisted timestamps and server time where possible.

### Performance

- Batch fetch exercises by IDs efficiently (avoid N round-trips).
- Consider compressing prompt by:
  - trimming long solution_code comments if needed
  - limiting exercise fields included

### Verification

- Rapid switching between questions doesn’t break timer math.
- Attempt remains consistent across refresh and network hiccups.

---

## Manual test checklist (end-to-end)

1. **Admin setup**

- Pick a language
- Enable `isTestEnabled` on 2–3 tutorials and 10+ exercises across them
- Set `timeToSolveSeconds` on at least 1 exercise for validation

2. **Student flow**

- Navigate: `/Learn/Test` → select language
- Choose 2 tutorials → set N=5 → create attempt
- Run code on Q1 and Q2 (ensure runner works)
- Switch questions quickly (timer pauses/resumes correctly)
- Let one question time out (autosubmit happens)
- End test early → grading runs → results show

3. **Observability**

- Confirm server logs show:
  - attempt creation details
  - autosubmit event
  - end attempt
  - OpenRouter grade call with usage/cost tracking
