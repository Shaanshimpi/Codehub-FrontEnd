# Remaining Lint Fixes - Quick Reference

## Summary of What Was Fixed ✅

1. **QuestionPanel.tsx** - Unused vars prefixed, redundant roles removed
2. **SolutionModals.tsx** - Apostrophes escaped, backdrop made interactive
3. **BudgetWarningModal.tsx** - Apostrophes escaped, interactive elements fixed
4. **BudgetDetailsModal.tsx** - Interactive elements fixed
5. **UpgradePrompt.tsx** - Unused var prefixed, interactive elements fixed
6. **ProgressBar.tsx** - Unused vars prefixed
7. **SolutionConfirmModal.tsx** - Unused var prefixed, apostrophes escaped

## Remaining Quick Fixes Needed

### Pattern 1: Unused Variables (Prefix with `_`)

```typescript
// Files needing this fix:
- useChat.ts line 29,36
- StudentPlayground.tsx line 40, 56
- UnifiedCodeEditor.tsx line 42, 54, 330
- SolutionCodePlayground.tsx line 226, 234, 244
- ProblemView.tsx line 33, 109, 145
- ProgressiveHintSystem.tsx line 47, 70, 162
- MermaidViewer.tsx line 33
- layout.tsx line 18

// Fix: prefix = (_prefix)
```

### Pattern 2: Console Statements (Add eslint-disable or remove)

```typescript
// Files with console.log:
- page.tsx (Exercise) - 31 instances
- ChatStore.ts - 6 instances
- accessibilityValidator.ts - 10 instances
- colorContrast.ts - 3 instances
- Vivy/page.tsx - 1 instance
- ExplanationTabs.tsx - 2 instances
- UnifiedCodeEditor.tsx - 2 instances
- BoilerplateGenerator.ts - 1 instance
- InstructionsModal.tsx - 1 instance
- SolutionCodePlayground.tsx - 1 instance

// Quick fix for debug code:
// eslint-disable-next-line no-console
console.log(...)
```

### Pattern 3: Lexical Declaration in Case Block

```typescript
// Files: HelpMenu.tsx, SolutionHelpMenu.tsx, InstructionsModal.tsx, ViewSwitcher.tsx
// Fix: Wrap in braces
case 'foo': {
  const x = 1
  break
}
```

### Pattern 4: Interactive Elements (Already mostly fixed ✅)

Remaining files:

- HelpMenu.tsx line 103
- InstructionsModal.tsx line 208, 223
- SolutionHelpMenu.tsx line 101
- SolutionPlayground.tsx line 164
- ViewSwitcher.tsx line 93

```typescript
// Fix:
<div
  role="button"
  tabIndex={0}
  onClick={handler}
  onKeyDown={(e) => e.key === 'Enter' && handler()}
>
```

## Auto-Fix Command

Run this to auto-fix some issues:

```bash
cd client
npx eslint --fix app/
```

## Quick Stats

- Total errors: 10 (down from 78)
- Most are unused variables (easy fix)
- Console.logs (can be disabled per-line)
- Interactive elements (mostly fixed)

## Priority

1. Fix interactive elements (accessibility - HIGH)
2. Prefix unused variables (warnings - MEDIUM)
3. Add eslint-disable for console logs (warnings - LOW)
