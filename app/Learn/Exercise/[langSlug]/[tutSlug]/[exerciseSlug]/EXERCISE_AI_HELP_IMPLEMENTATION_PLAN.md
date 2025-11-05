# Exercise AI Help Implementation Plan

## Overview

This document outlines a multiphase plan to integrate AI help functionality into the Exercise page, similar to the Tutorial Playground. When users click an "AI Help" button, the left half of the screen will transform into an AI chat interface that provides context-aware assistance based on the exercise, student's code, and execution results.

**Important**: This feature works in both **ProblemView** and **SolutionView**, replacing the left panel in both views with the AI assistant.

## Architecture Overview

- **Location**: `client/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/`
- **Main Components**:
  - `ProblemView.tsx` (Question Panel + Code Editor split)
  - `SolutionView.tsx` (Solution Guide Panel + Solution Code split)
- **AI Component**: Will create `ExerciseAIAssistant.tsx` (similar to PlaygroundAIAssistant)
- **Context Service**: `services/ExerciseAIContextService.ts` (builds exercise-specific context)
- **API Endpoint**: Reuse `/api/chat/playground` with exercise context
- **Layout**:
  - **ProblemView**: Transform left panel (Question Panel) → AI Chat (50% width)
  - **SolutionView**: Transform left panel (Solution Guide Panel) → AI Chat (50% width)
  - Right panel (Code Editor) remains visible in both views

---

## Phase 1: Foundation & UI Integration

### Objectives

- Add AI Help button to ProblemView
- Create basic ExerciseAIAssistant component shell
- Set up split view transformation (Question Panel → AI Chat)

### Tasks

#### 1.1 Create ExerciseAIAssistant Component

- **File**: `components/ai/ExerciseAIAssistant.tsx`
- **Based on**: `PlaygroundAIAssistant.tsx`
- **Props**:
  - `exercise`: Exercise data
  - `language`: Language info
  - `tutorial`: Tutorial info (optional)
  - `currentCode`: User's current code
  - `codeOutput`: Execution output
  - `testResults`: Test case results (optional)
  - `onClose`: Close handler
- **Features**:
  - Same UI structure as PlaygroundAIAssistant
  - Model selector integration
  - Message display
  - Input area

#### 1.2 Add AI Help Button to Both Views

- **ProblemView**: `components/ExerciseViews/ProblemView.tsx`
  - **Placement**:
    - Option A: In the Question Panel header (top-right)
    - Option B: Floating button overlay on Question Panel
    - Option C: In toolbar/controls area (shared with other controls)
  - **Behavior**: Toggle `showAIHelp` state
- **SolutionView**: `components/ExerciseViews/SolutionView.tsx`
  - **Placement**:
    - Option A: In the Solution Guide Panel header (top-right, next to tabs)
    - Option B: Floating button overlay on Solution Guide Panel
    - Option C: In tab navigation area (as a tab or button)
  - **Behavior**: Toggle `showAIHelp` state

#### 1.3 Implement Split View Transformation

- **ProblemView**:
  - **Current**: Question Panel (50%) + Code Editor (50%)
  - **New**: When AI Help active:
    - AI Chat (50%) + Code Editor (50%)
    - Question Panel hidden
- **SolutionView**:
  - **Current**: Solution Guide Panel with tabs (50%) + Solution Code (50%)
  - **New**: When AI Help active:
    - AI Chat (50%) + Solution Code (50%)
    - Solution Guide Panel hidden
- **Mobile**: Toggle button at bottom (like playground) for both views
- **Implementation**:

  ```tsx
  // ProblemView
  {showAIHelp ? (
    <ExerciseAIAssistant ... />
  ) : (
    <QuestionPanel ... />
  )}

  // SolutionView
  {showAIHelp ? (
    <ExerciseAIAssistant ... />
  ) : (
    <div> {/* Solution Guide Panel with tabs */} </div>
  )}
  ```

#### 1.4 Create ExerciseAIContextService

- **File**: `services/ExerciseAIContextService.ts`
- **Function**: `buildExerciseAIContext(params)`
- **Context Includes**:
  - Exercise title, description
  - Problem statement
  - Difficulty level
  - Language
  - Constraints/requirements
  - Test cases (if available)
  - Current student code
  - Code execution output
  - Test results (passed/failed)

### Testing Checklist

- [ ] AI Help button appears in ProblemView
- [ ] AI Help button appears in SolutionView
- [ ] Clicking button toggles AI panel in ProblemView
- [ ] Clicking button toggles AI panel in SolutionView
- [ ] Question Panel disappears when AI is open (ProblemView)
- [ ] Solution Guide Panel disappears when AI is open (SolutionView)
- [ ] Code Editor remains visible on right (ProblemView)
- [ ] Solution Code remains visible on right (SolutionView)
- [ ] Mobile toggle button works in both views
- [ ] Close button in AI panel works
- [ ] Basic UI renders without errors in both views

---

## Phase 2: AI Context Integration

### Objectives

- Build comprehensive exercise context
- Integrate with playground API
- Pass code and output to AI

### Tasks

#### 2.1 Complete ExerciseAIContextService

- **Extract Exercise Data**:
  - Problem statement
  - Input/output format
  - Constraints
  - Example test cases
  - Expected behavior
  - Hints (if in problem view)
  - Solution explanation (if in solution view)
  - Key concepts (if in solution view)
- **Include Code Context**:
  - Current student code (trimmed) - from ProblemView
  - Solution code (if in SolutionView) - for reference
  - Execution output
  - Test case results
  - Error messages
- **View-Specific Context**:
  - **ProblemView**: Focus on helping solve, debugging, hints
  - **SolutionView**: Focus on explaining solution, concepts, understanding
- **Format Context**:
  - Structured prompt for AI
  - Clear instructions for AI behavior
  - Exercise-specific guidance
  - View-specific instructions (problem vs solution)

#### 2.2 Connect to Playground API

- **Reuse**: `/api/chat/playground` endpoint
- **System Context**: Pass exercise context via `systemContext`
- **Message Handling**: Same as playground (user/assistant only)
- **Error Handling**: Reuse existing error handling

#### 2.3 Real-time Context Updates

- **Code Changes**: Update context when code changes
- **Execution Results**: Update context after code execution
- **Test Results**: Include test pass/fail information
- **Debouncing**: Prevent excessive context updates

#### 2.4 Exercise-Specific AI Instructions

- **Guidance Type**:
  - Help debug code
  - Explain concepts
  - Provide hints (not full solutions)
  - Clarify requirements
  - Explain test failures
- **Avoid**:
  - Giving complete solutions
  - Writing code for student
  - Bypassing learning process

### Testing Checklist

- [ ] Context includes all exercise information
- [ ] Code is included in context
- [ ] Output is included in context
- [ ] Test results are included
- [ ] Context updates when code changes
- [ ] API calls succeed
- [ ] System context not visible in messages
- [ ] AI responses are relevant to exercise

---

## Phase 3: Advanced Features

### Objectives

- Add exercise-specific suggestions
- Integrate with test case results
- Provide contextual hints

### Tasks

#### 3.1 Exercise-Specific Suggestions

- **ProblemView Welcome Screen Suggestions**:
  - "Help me understand the problem"
  - "Explain why my code is failing"
  - "What am I missing in the requirements?"
  - "Give me a hint (not the solution)"
  - "Help debug my test case failures"
- **SolutionView Welcome Screen Suggestions**:
  - "Explain the solution approach"
  - "Why does this solution work?"
  - "What are the key concepts here?"
  - "Help me understand the code structure"
  - "Explain the algorithm/approach"
- **Context-Aware Suggestions**:
  - Show different suggestions based on view (problem vs solution)
  - Show different suggestions based on test results
  - Suggest based on error messages
  - Adapt to code state

#### 3.2 Test Case Integration

- **Parse Test Results**: Extract passed/failed tests
- **Include in Context**: Add test case details
- **AI Analysis**: Help understand why tests fail
- **Suggestions**: Guide toward passing tests

#### 3.3 Exercise State Awareness

- **Code State**: Empty, partial, complete
- **Test State**: All passed, some failed, all failed
- **Execution State**: Success, error, timeout
- **Adaptive Responses**: AI adjusts based on state

#### 3.4 Code Analysis Integration

- **Syntax Errors**: AI can explain syntax errors
- **Logic Errors**: Help identify logic issues
- **Performance**: Suggest optimizations (if relevant)
- **Best Practices**: Guide toward better code

### Testing Checklist

- [ ] Suggestions appear in welcome screen
- [ ] Suggestions adapt to exercise state
- [ ] Test case information included in context
- [ ] AI responds to test failures appropriately
- [ ] AI provides helpful hints without giving solutions
- [ ] Code analysis suggestions work
- [ ] Error explanations are helpful

---

## Phase 4: Polish & Optimization

### Objectives

- Improve UX/UI
- Add accessibility features
- Optimize performance
- Handle edge cases

### Tasks

#### 4.1 UI/UX Improvements

- **Button Placement**: Ensure AI Help button is discoverable
- **Visual Feedback**: Clear indication when AI is active
- **Smooth Transitions**: Animated panel transitions
- **Mobile Optimization**: Ensure mobile experience is good
- **Loading States**: Show loading indicators
- **Empty States**: Handle empty exercise data gracefully

#### 4.2 Accessibility

- **Keyboard Navigation**: Support keyboard access
- **Screen Readers**: Proper ARIA labels
- **Focus Management**: Proper focus handling
- **Error Announcements**: Accessible error messages

#### 4.3 Performance Optimization

- **Context Trimming**: Limit context size (code/output)
- **Debouncing**: Debounce context updates
- **Memoization**: Memoize expensive computations
- **Lazy Loading**: Load AI components only when needed

#### 4.4 Edge Cases & Error Handling

- **No Exercise Data**: Handle missing exercise gracefully
- **API Failures**: Graceful error handling
- **Network Issues**: Retry logic
- **Timeout Handling**: Handle long-running AI requests
- **Empty Code**: Handle empty code state
- **No Test Results**: Handle missing test data

#### 4.5 Code Persistence (Optional)

- **LocalStorage**: Save code state per exercise
- **Auto-save**: Auto-save code periodically
- **Restore**: Restore code on page reload

### Testing Checklist

- [ ] UI is responsive and polished
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Performance is acceptable
- [ ] All edge cases handled
- [ ] Error messages are user-friendly
- [ ] Loading states are clear
- [ ] Mobile experience is good

---

## Implementation Details

### File Structure

```
client/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/
├── components/
│   ├── ai/
│   │   └── ExerciseAIAssistant.tsx (NEW)
│   ├── ExerciseViews/
│   │   ├── ProblemView.tsx (MODIFY)
│   │   └── SolutionView.tsx (MODIFY)
│   └── Shared/
│       ├── StudentPlayground.tsx (may need to pass code/output)
│       └── SolutionCodePlayground.tsx (may need to pass solution code)
├── services/
│   └── ExerciseAIContextService.ts (NEW)
└── EXERCISE_AI_HELP_IMPLEMENTATION_PLAN.md (THIS FILE)
```

### Key Components

#### ExerciseAIAssistant.tsx

- Similar structure to PlaygroundAIAssistant
- Reuses Vivy infrastructure (API, models, auth)
- Custom UI for exercise context
- Exercise-specific welcome suggestions
- **Props**:
  - `exercise`: Exercise data
  - `language`: Language info
  - `tutorial`: Tutorial info (optional)
  - `currentCode`: User's current code (ProblemView) or solution code (SolutionView)
  - `codeOutput`: Execution output
  - `testResults`: Test case results (optional)
  - `viewType`: "problem" | "solution" (to adapt suggestions and context)
  - `onClose`: Close handler

#### ExerciseAIContextService.ts

- Builds context from exercise data
- Includes problem statement
- Includes test cases
- Includes code/output
- Includes test results

#### ProblemView.tsx Modifications

- Add `showAIHelp` state
- Add AI Help button
- Conditional rendering: Question Panel vs AI Assistant
- Pass code/output to AI assistant
- Pass `viewType="problem"` to AI assistant
- Handle test results

#### SolutionView.tsx Modifications

- Add `showAIHelp` state
- Add AI Help button (in header or tab area)
- Conditional rendering: Solution Guide Panel vs AI Assistant
- Pass solution code to AI assistant
- Pass `viewType="solution"` to AI assistant
- Include solution explanation, concepts in context

### Integration Points

1. **Exercise Data**: Access exercise object from ProblemView props
2. **Code State**: Access from `playgroundCode` state in ProblemView
3. **Output State**: Access from execution results
4. **Test Results**: Access from test execution (if available)
5. **Language**: Already available in ProblemView props

### API Integration

- **Endpoint**: `/api/chat/playground`
- **System Context**: Exercise context from ExerciseAIContextService
- **Messages**: Standard user/assistant messages
- **Model Selection**: Same as playground (coding models)

---

## Success Criteria

### Phase 1

✅ AI Help button visible and functional in both views
✅ AI panel replaces left panel (Question Panel or Solution Guide) when active
✅ Basic chat UI works in both ProblemView and SolutionView

### Phase 2

✅ AI receives exercise context (problem view)
✅ AI receives exercise context (solution view)
✅ AI can see student's code (problem view)
✅ AI can see solution code (solution view)
✅ AI can see execution output
✅ Responses are contextually relevant to current view

### Phase 3

✅ Exercise-specific suggestions work (both views)
✅ View-specific suggestions (problem vs solution)
✅ Test case integration works (problem view)
✅ Solution explanation integration works (solution view)
✅ AI provides helpful hints (problem view)
✅ AI explains solutions clearly (solution view)

### Phase 4

✅ UI is polished and accessible
✅ Performance is good
✅ All edge cases handled
✅ Ready for production

---

## Future Enhancements (Post-Phase 4)

1. **Progressive Hints**: AI provides hints that get more specific over time
2. **Code Review**: AI reviews code and suggests improvements
3. **Solution Comparison**: Compare student code with solution (without revealing solution)
4. **Learning Analytics**: Track AI usage patterns
5. **Multi-language Support**: AI responses in multiple languages
6. **Voice Input**: Support voice input for questions
7. **Code Suggestions**: AI suggests code snippets (with user approval)

---

## Notes

- **Reusability**: Maximum reuse of playground components and services
- **Consistency**: UI should match playground AI assistant style
- **Performance**: Keep context size manageable
- **Privacy**: Don't log sensitive exercise data
- **Learning First**: AI should guide, not give answers

---

## Timeline Estimate

- **Phase 1**: 2-3 hours
- **Phase 2**: 2-3 hours
- **Phase 3**: 2-3 hours
- **Phase 4**: 2-3 hours
- **Total**: 8-12 hours
