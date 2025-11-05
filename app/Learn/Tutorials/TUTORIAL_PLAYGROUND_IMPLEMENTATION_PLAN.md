# Tutorial Code Playground & AI Integration - Phased Implementation Plan

## Overview

Add interactive code playground and AI assistance to Tutorial lessons. Students can practice coding during lessons with context-aware AI help.

**Key Requirements:**

- Client-side only (no database changes)
- Playground button → Full-width code editor
- AI Help button → 50-50 split view (editor + AI chat)
- Uses existing `/api/run-code` and Vivy infrastructure

---

## UI Flow States

### State 1: Lesson View (Default)

```
┌─────────────────────────────────────────────────────────┐
│  [Back to Reference]                                    │
├─────────────────────────────────────────────────────────┤
│  Lesson Content (Concept/MCQ/etc.)                      │
│  - Explanation                                           │
│  - Code Examples                                         │
│  - Key Points                                           │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  [▶ Playground]  ← Opens code editor           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  [Previous Lesson]  [Next Lesson]                        │
└─────────────────────────────────────────────────────────┘
```

### State 2: Playground View (Full Width)

```
┌─────────────────────────────────────────────────────────┐
│  [← Back to Lesson]  Lesson: Variables in Python         │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │  Monaco Code Editor (Full Width)                 │  │
│  │  def main():                                      │  │
│  │      x = 10                                       │  │
│  │      print(x)                                     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [▶ Run] [📋 Copy] [🗑️ Reset]  [🤖 AI Help]      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Output: > 10                                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### State 3: Split View (50-50 Editor + AI)

```
┌─────────────────────────────────────────────────────────┐
│  [← Back to Lesson]  Lesson: Variables in Python         │
├───────────────────────┬──────────────────────────────────┤
│  CODE EDITOR (50%)     │  AI ASSISTANT (50%)              │
│  ┌─────────────────┐  │  ┌────────────────────────────┐ │
│  │  Monaco Editor │  │  │  [Model: GPT-4o] [✕ Close] │ │
│  │  def main():    │  │  ├────────────────────────────┤ │
│  │      x = 10     │  │  │  User: How do I...?        │ │
│  │      print(x)   │  │  │  AI: You can try...        │ │
│  └─────────────────┘  │  └────────────────────────────┘ │
│  [▶ Run] [Copy]       │  [Type message...] [Send]       │
│  Output: > 10          │                                   │
└───────────────────────┴──────────────────────────────────┘
```

---

## Phase 1: Playground Button & Basic Code Editor

**Goal:** Add playground button to lessons and create basic code editor that opens full-width.

**Estimated Time:** 4-6 hours

### Implementation Tasks

#### 1.1 Create Playground Button Component

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/PlaygroundButton.tsx`

**What to build:**

- Button component with icon and text "▶ Open Playground"
- Styled to match tutorial UI
- Click handler to toggle playground view

**Code Structure:**

```tsx
interface PlaygroundButtonProps {
  onClick: () => void
  lessonTitle: string
}
```

#### 1.2 Create Basic Code Editor Component

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/TutorialCodePlayground.tsx`

**What to build:**

- Monaco Editor integration (reuse pattern from `Exercise/.../CodeEditor.tsx`)
- State management for code, output, isRunning
- Header with "Back to Lesson" button
- Basic toolbar with placeholder buttons (Run, Copy, Reset)
- Output panel (initially hidden)

**Props:**

```tsx
interface TutorialCodePlaygroundProps {
  language: Language
  lessonTitle: string
  tutorial: Tutorial
  lesson: Lesson
  onBack: () => void
  initialCode?: string
}
```

**Key Features:**

- Monaco Editor with language syntax highlighting
- Editor configuration matching Exercise CodeEditor
- Placeholder: `// Write your code here...`

#### 1.3 Integrate Playground Button into TutorialPageContainer

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/TutorialPageContainer.tsx`

**Changes:**

- Add state: `const [showPlayground, setShowPlayground] = useState(false)`
- Add PlaygroundButton after lesson content (after line ~2031)
- Conditionally render TutorialCodePlayground when `showPlayground === true`
- Render playground for ALL lesson types (concept, mcq, etc.)

**Location:**

```tsx
{
  /* After lesson content, before navigation buttons */
}
{
  !showPlayground && (
    <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <PlaygroundButton
        onClick={() => setShowPlayground(true)}
        lessonTitle={currentLesson?.title}
      />
    </div>
  )
}

{
  showPlayground && currentLesson && (
    <TutorialCodePlayground
      language={language}
      lessonTitle={currentLesson.title}
      tutorial={tutorial}
      lesson={currentLesson}
      onBack={() => setShowPlayground(false)}
    />
  )
}
```

### Phase 1 Testing Checklist

**Functionality Tests:**

- [ ] **Playground Button Appears**

  - Button shows in lesson view for all lesson types (concept, mcq, codeblock_rearranging, fill_in_blanks)
  - Button has correct icon and text
  - Button is styled correctly (matches tutorial theme)

- [ ] **Playground Opens**

  - Clicking playground button hides lesson content
  - Playground view renders with header
  - "Back to Lesson" button appears in header
  - Header shows correct lesson title

- [ ] **Code Editor Renders**

  - Monaco Editor loads without errors
  - Editor shows placeholder text when empty
  - Syntax highlighting works for tutorial language (Python, Java, C, C++, etc.)
  - Editor has correct theme (vs-dark)
  - Editor is full-width (100% of container)

- [ ] **Back Navigation Works**

  - Clicking "Back to Lesson" closes playground
  - Lesson content reappears correctly
  - Playground state resets (code is cleared)

- [ ] **Editor Interactions**
  - User can type code in editor
  - Code appears correctly in editor
  - Line numbers show/hide correctly
  - Editor scrolls properly with long code

**Visual/UI Tests:**

- [ ] No layout shifts when opening playground
- [ ] Playground view fills available space
- [ ] Editor height is appropriate (not too small/large)
- [ ] Colors match tutorial theme (dark mode support)
- [ ] Buttons are properly sized and accessible

**Edge Cases:**

- [ ] Playground works when lesson has no content
- [ ] Playground works when switching between lessons
- [ ] Playground state doesn't persist when navigating away (expected)

**Browser Tests:**

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in mobile viewport (responsive layout)

---

## Phase 2: Code Execution

**Goal:** Implement code execution functionality using `/api/run-code`.

**Estimated Time:** 3-4 hours

### Implementation Tasks

#### 2.1 Add Code Execution Logic

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/TutorialCodePlayground.tsx`

**What to build:**

- Import `executeCode` from `@/app/utils/codeExecution`
- Add `handleRunCode` function
- Add loading state during execution
- Display output in output panel
- Handle errors (network, syntax, runtime)

**Implementation:**

```tsx
const handleRunCode = async () => {
  if (!code.trim() || isRunning) return

  setIsRunning(true)
  setOutput("")

  try {
    const result = await executeCode({
      code: code,
      language: language.slug,
      input: inputValue, // Optional program input
    })

    if (result.success) {
      setOutput(result.output)
    } else {
      setOutput(`Error: ${result.error || result.stderr}`)
    }
  } catch (error) {
    setOutput(`Network Error: ${error.message}`)
  } finally {
    setIsRunning(false)
  }
}
```

#### 2.2 Add Program Input Support

**What to build:**

- Input textarea for languages that support stdin (Python, Java, C, C++)
- Conditional rendering based on language
- Pass input to executeCode function

**Use:** `supportsInput` utility from `@/app/utils/codeExecution`

#### 2.3 Implement Toolbar Buttons

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/TutorialCodePlayground.tsx`

**What to build:**

- **Run Code Button:** Triggers code execution
  - Disabled when code is empty or already running
  - Shows "Running..." text during execution
  - Icon: Play icon
- **Copy Code Button:** Copies code to clipboard
  - Uses `navigator.clipboard.writeText`
  - Optional: Show toast notification
- **Reset Button:** Clears code and output
  - Resets code to empty string
  - Clears output panel

**Toolbar Layout:**

```tsx
<div className="flex gap-2 border-t p-2">
  <button onClick={handleRunCode} disabled={isRunning}>
    <Play /> {isRunning ? "Running..." : "Run Code"}
  </button>
  <button onClick={handleCopyCode}>Copy</button>
  <button onClick={handleReset}>Reset</button>
</div>
```

#### 2.4 Add Output Panel

**What to build:**

- Display code execution output
- Show error messages for failed executions
- Show loading indicator during execution
- Clear button for output
- Scrollable for long output
- Syntax highlighting for errors (optional)

### Phase 2 Testing Checklist

**Code Execution Tests:**

- [ ] **Run Code Button Works**

  - Button is enabled when code has content
  - Button is disabled when code is empty
  - Button is disabled while code is running
  - Button shows "Running..." during execution
  - Button shows "Run Code" when idle

- [ ] **Code Executes Successfully**

  - Simple Python print statement works (`print("Hello")`)
  - Java code executes correctly
  - C code compiles and runs
  - C++ code compiles and runs
  - JavaScript code executes

- [ ] **Output Display**

  - Output appears in output panel after execution
  - Output is formatted correctly (preserves newlines)
  - Output is scrollable for long content
  - Empty output is handled gracefully

- [ ] **Error Handling**

  - Syntax errors show error message
  - Runtime errors show error message
  - Network errors show appropriate message
  - Error messages are readable and helpful

- [ ] **Program Input**

  - Input field appears for Python
  - Input field appears for Java
  - Input field appears for C/C++
  - Input is passed correctly to code execution
  - Multi-line input works correctly

- [ ] **Copy Code**

  - Clicking copy copies code to clipboard
  - Copied code is correct (no truncation)
  - Works with special characters

- [ ] **Reset Button**
  - Clears editor code
  - Clears output panel
  - Editor shows placeholder after reset

**Edge Cases:**

- [ ] Very long code executes (no timeout issues)
- [ ] Code with infinite loops (timeout handled)
- [ ] Code with no output (empty output shown)
- [ ] Special characters in code/output handled correctly
- [ ] Rapid clicking Run button (prevents duplicate executions)

**Performance Tests:**

- [ ] Code execution completes within reasonable time (< 10s for simple code)
- [ ] UI remains responsive during execution
- [ ] No memory leaks from multiple executions

---

## Phase 3: AI Help Integration

**Goal:** Add AI assistant panel that splits view 50-50 when AI Help button is clicked.

**Estimated Time:** 6-8 hours

### Implementation Tasks

#### 3.1 Create AI Assistant Component

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/ai/TutorialAIAssistant.tsx`

**What to build:**

- Reuse Vivy chat infrastructure
- Import `useChat` from `@/app/Learn/Vivy/hooks/useChat`
- Import `modelService` from `@/app/Learn/Vivy/services/ModelService`
- Compact UI (smaller than full Vivy page)
- Model selector dropdown
- Message list with user/AI messages
- Chat input with send button
- Close button in header

**Props:**

```tsx
interface TutorialAIAssistantProps {
  tutorial: Tutorial
  lesson: Lesson
  currentCode?: string
  language: Language
  onClose: () => void
}
```

**Features:**

- Message history with user/AI distinction
- Loading indicator during AI response
- Error display for failed requests
- Auto-scroll to latest message

#### 3.2 Create AI Context Service

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/services/AIContextService.ts`

**What to build:**

- Build system context message from tutorial/lesson data
- Include current code in context (if provided)
- Format context as instructional prompt for AI

**Function:**

```tsx
export function buildAIContext(
  tutorial: Tutorial,
  lesson: Lesson,
  language: Language,
  currentCode?: string
): string {
  // Build comprehensive context string
  // Include: tutorial title, lesson info, objectives, topics, code
}
```

**Context Structure:**

````
You are helping a student learn [Tutorial Title] in [Language].

Current Lesson: [Lesson Title]
Type: [concept/mcq/etc]
Learning Objectives:
- [Objective 1]
- [Objective 2]

Key Topics:
- [Topic 1]
- [Topic 2]

[If code provided:]
Student's current code:
```[language]
[code]
````

Provide helpful, educational guidance. Help them learn, don't just give answers.

````

#### 3.3 Integrate AI Context into Chat

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/ai/TutorialAIAssistant.tsx`

**What to build:**
- Build context on component mount
- Prepend context as system message to chat
- Update context when code changes (optional: debounced)

**Implementation:**
```tsx
useEffect(() => {
  const context = buildAIContext(tutorial, lesson, language, currentCode)
  // Add as system message or prepend to first user message
}, [tutorial, lesson, language, currentCode])
````

#### 3.4 Implement Split View Layout

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/TutorialCodePlayground.tsx`

**What to build:**

- Add state: `const [showAI, setShowAI] = useState(false)`
- Conditional width classes:
  - Editor container: `showAI ? 'w-1/2' : 'w-full'`
  - AI panel: `showAI ? 'w-1/2 border-l' : 'hidden'`
- Use flexbox: `flex flex-row`
- Add "AI Help" button in toolbar
- Smooth transition when opening/closing

**Layout:**

```tsx
<div className="flex h-full flex-row">
  {/* Editor Panel */}
  <div
    className={`flex flex-col transition-all duration-300 ${
      showAI ? "w-1/2" : "w-full"
    }`}
  >
    {/* Monaco Editor */}
    {/* Toolbar */}
    {/* Output Panel */}
  </div>

  {/* AI Panel */}
  {showAI && (
    <div className="w-1/2 border-l border-slate-300 dark:border-slate-600">
      <TutorialAIAssistant
        tutorial={tutorial}
        lesson={lesson}
        currentCode={code}
        language={language}
        onClose={() => setShowAI(false)}
      />
    </div>
  )}
</div>
```

#### 3.5 Add AI Help Button to Toolbar

**What to build:**

- "AI Help" or "🤖 AI Help" button in toolbar
- Icon: Bot/AI icon (can use Lucide icons)
- Click handler: `setShowAI(true)`
- Optional: Show badge/indicator when AI is active

### Phase 3 Testing Checklist

**AI Panel Display Tests:**

- [ ] **AI Help Button Appears**

  - Button shows in playground toolbar
  - Button has icon and text
  - Button is styled correctly

- [ ] **Split View Opens**

  - Clicking AI Help splits view 50-50
  - Editor resizes to 50% width smoothly
  - AI panel appears on right side (50% width)
  - Border between editor and AI is visible
  - Transition is smooth (no janky resize)

- [ ] **AI Panel Renders**

  - AI panel header shows with model selector
  - Close button (X) appears in header
  - Message area is visible and scrollable
  - Chat input appears at bottom
  - Panel is properly sized (50% width)

- [ ] **Close AI Panel**
  - Clicking X closes AI panel
  - Editor expands back to 100% width
  - Transition is smooth
  - Editor state is preserved (code not lost)

**AI Chat Functionality Tests:**

- [ ] **Model Selection**

  - Model dropdown shows available models
  - Can select different models
  - Selected model is used for chat

- [ ] **Send Message**

  - Can type message in input
  - Send button is enabled when message has text
  - Clicking send sends message
  - Message appears in message list as "User"
  - Loading indicator shows while AI responds

- [ ] **Receive AI Response**

  - AI response appears after sending message
  - Response is marked as "AI" or "Assistant"
  - Response is formatted correctly
  - Auto-scrolls to latest message

- [ ] **Context Injection**

  - First message includes tutorial context
  - Lesson information is included in context
  - Current code is included if available
  - AI responses are contextually relevant

- [ ] **Multiple Messages**
  - Can send multiple messages
  - Conversation history is maintained
  - Previous messages remain visible
  - Context is included appropriately

**Error Handling Tests:**

- [ ] **Network Errors**

  - Network error shows user-friendly message
  - Error doesn't break UI
  - Can retry after error

- [ ] **Authentication Errors**

  - Unauthenticated users can still use free models
  - Paid model requests show appropriate message
  - Upgrade prompt appears when needed

- [ ] **Empty Messages**
  - Send button disabled for empty input
  - Empty messages not sent

**Visual/UI Tests:**

- [ ] Messages are styled correctly (user vs AI)
- [ ] Message list scrolls properly
- [ ] Input field is accessible
- [ ] Loading indicators are visible
- [ ] Colors match tutorial theme
- [ ] Panel doesn't overflow container

**Integration Tests:**

- [ ] AI panel works with code execution
- [ ] Code changes update AI context (optional)
- [ ] Switching lessons resets AI conversation
- [ ] Back to lesson closes both playground and AI

---

## Phase 4: Enhanced Features & Polish

**Goal:** Add code persistence, improved context, and final polish.

**Estimated Time:** 4-6 hours

### Implementation Tasks

#### 4.1 Code Persistence (LocalStorage)

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/TutorialCodePlayground.tsx`

**What to build:**

- Save code to localStorage on change (debounced)
- Load code from localStorage on mount
- Key format: `tutorial-playground-${tutorial.id}-${lesson.id}`
- Clear storage option (optional)

**Implementation:**

```tsx
// Save code
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (code) {
      localStorage.setItem(
        `tutorial-playground-${tutorial.id}-${lesson.id}`,
        code
      )
    }
  }, 500)
  return () => clearTimeout(timeoutId)
}, [code])

// Load code
useEffect(() => {
  const saved = localStorage.getItem(
    `tutorial-playground-${tutorial.id}-${lesson.id}`
  )
  if (saved) setCode(saved)
}, [])
```

#### 4.2 Enhanced AI Context

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/services/AIContextService.ts`

**What to build:**

- Include lesson explanation text
- Include code examples from lesson
- Include lesson difficulty
- Include student's code output (if available)

#### 4.3 AI Suggestions

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/ai/AISuggestions.tsx`

**What to build:**

- Show contextual suggestions in AI panel
- Suggestions based on lesson content
- Clicking suggestion sends it as message

**Suggestions Examples:**

- "Explain [key topic from lesson]"
- "Help me debug my code"
- "Show me an example of [concept]"

#### 4.4 Responsive Design

**File:** `client/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/playground/TutorialCodePlayground.tsx`

**What to build:**

- Mobile layout: Stack editor and AI vertically
- Tablet layout: 50-50 split (or vertical stack)
- Desktop layout: 50-50 split horizontal

**Breakpoints:**

- Mobile: `< 768px` - Vertical stack or full-width toggle
- Tablet: `768px - 1024px` - 50-50 or vertical stack
- Desktop: `> 1024px` - 50-50 horizontal

#### 4.5 Error States & Loading

**What to build:**

- Better error messages
- Retry buttons for failed operations
- Loading states for all async operations
- Empty states with helpful messages

#### 4.6 Keyboard Shortcuts

**What to build:**

- `Ctrl+Enter` or `Cmd+Enter`: Run code
- `Ctrl+S` or `Cmd+S`: Save code (optional)
- `Escape`: Close AI panel (when open)

### Phase 4 Testing Checklist

**Code Persistence Tests:**

- [ ] **Save Code**

  - Code is saved to localStorage after typing (debounced)
  - Code persists across page refreshes
  - Code persists when closing/opening playground
  - Different lessons have separate saved code

- [ ] **Load Code**
  - Previously saved code loads on playground open
  - Code loads for correct lesson (not mixed between lessons)
  - Empty code doesn't overwrite saved code

**Enhanced Context Tests:**

- [ ] **Rich Context**
  - AI context includes lesson explanation
  - AI context includes code examples from lesson
  - AI context includes difficulty level
  - AI responses reflect full context

**AI Suggestions Tests:**

- [ ] **Suggestions Display**
  - Suggestions appear in AI panel (when no messages)
  - Suggestions are relevant to lesson content
  - Can click suggestion to send as message
  - Suggestions hide after first message sent

**Responsive Design Tests:**

- [ ] **Mobile (< 768px)**

  - Layout adapts to mobile screen
  - Editor is readable (not too small)
  - AI panel is accessible (full-width or toggle)
  - Buttons are touch-friendly

- [ ] **Tablet (768px - 1024px)**

  - Layout works well in tablet size
  - 50-50 split is usable or vertical stack works

- [ ] **Desktop (> 1024px)**
  - 50-50 split works perfectly
  - No horizontal scrolling issues

**Error Handling Tests:**

- [ ] All error states display correctly
- [ ] Retry buttons work when available
- [ ] Loading states don't block UI
- [ ] Network failures handled gracefully

**Keyboard Shortcuts Tests:**

- [ ] `Ctrl+Enter` / `Cmd+Enter` runs code
- [ ] `Escape` closes AI panel
- [ ] Shortcuts work when editor is focused
- [ ] Shortcuts don't conflict with browser shortcuts

**Performance Tests:**

- [ ] No performance degradation with code persistence
- [ ] Large code files (1000+ lines) work smoothly
- [ ] Multiple localStorage saves don't cause issues
- [ ] AI context building is fast (< 100ms)

**Accessibility Tests:**

- [ ] Screen reader announces button actions
- [ ] Keyboard navigation works throughout
- [ ] Focus management is correct
- [ ] ARIA labels are present

---

## File Structure

```
client/app/Learn/Tutorials/[langSlug]/[tutSlug]/
├── components/
│   ├── playground/
│   │   ├── TutorialCodePlayground.tsx      [Phase 1]
│   │   └── PlaygroundButton.tsx           [Phase 1]
│   ├── ai/
│   │   ├── TutorialAIAssistant.tsx        [Phase 3]
│   │   ├── AIChatHeader.tsx                [Phase 3]
│   │   ├── AIChatMessages.tsx             [Phase 3]
│   │   ├── AIChatInput.tsx                 [Phase 3]
│   │   └── AISuggestions.tsx               [Phase 4]
│   └── TutorialPageContainer.tsx          [Phase 1 - Modify]
└── services/
    └── AIContextService.ts                [Phase 3]
```

---

## Dependencies (Already Exist)

- ✅ `/api/run-code` - Code execution
- ✅ `/api/chat` - AI chat proxy
- ✅ `@/app/utils/codeExecution` - Code execution utility
- ✅ `@/app/Learn/Vivy/hooks/useChat` - Chat hook
- ✅ `@/app/Learn/Vivy/services/ModelService` - Model management
- ✅ Monaco Editor - Already installed

---

## Success Criteria

**Phase 1 Complete:**

- ✅ Playground button appears in all lessons
- ✅ Clicking button opens code editor
- ✅ Editor loads and renders correctly
- ✅ Back navigation works

**Phase 2 Complete:**

- ✅ Code execution works for all languages
- ✅ Output displays correctly
- ✅ Error handling works
- ✅ Toolbar buttons functional

**Phase 3 Complete:**

- ✅ AI Help button splits view 50-50
- ✅ AI chat sends/receives messages
- ✅ Context is injected correctly
- ✅ Close button works

**Phase 4 Complete:**

- ✅ Code persists across sessions
- ✅ Enhanced context improves AI responses
- ✅ Responsive design works
- ✅ All edge cases handled

---

## Total Estimated Time

- **Phase 1:** 4-6 hours
- **Phase 2:** 3-4 hours
- **Phase 3:** 6-8 hours
- **Phase 4:** 4-6 hours

**Total:** 17-24 hours
