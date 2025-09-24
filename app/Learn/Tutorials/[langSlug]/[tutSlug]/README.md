# Tutorial Learning Interface

This directory contains the interactive tutorial learning interface with a maintainable, modular structure.

## 📁 Directory Structure

```
[langSlug]/[tutSlug]/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Badge.tsx          # Status badges, scores, difficulty
│   │   ├── Breadcrumb.tsx     # Navigation breadcrumbs
│   │   ├── Button.tsx         # Consistent button component
│   │   ├── CodeBlock.tsx      # Enhanced code display with syntax highlighting
│   │   ├── LessonCard.tsx     # Lesson list item component
│   │   ├── ProgressBar.tsx    # Progress indicators
│   │   ├── StatCard.tsx       # Metric display cards
│   │   └── index.ts           # UI components exports
│   ├── lessons/               # Lesson type components
│   │   ├── ConceptLesson.tsx
│   │   ├── MCQLesson.tsx
│   │   ├── CodeRearrangeLesson.tsx
│   │   └── FillBlanksLesson.tsx
│   ├── BookmarkNotesPanel.tsx # Progress tracking panel
│   ├── MermaidRenderer.tsx    # Diagram rendering
│   └── TutorialPageContainer.tsx # Main container
├── helpers/                   # Tutorial-specific business logic
│   ├── contentHelpers.ts     # Content processing and formatting
│   ├── navigationHelpers.ts  # Navigation logic and URL handling
│   ├── progressHelpers.ts    # Progress calculations and insights
│   └── index.ts              # Helpers exports
├── hooks/                     # Custom React hooks
│   ├── useKeyboardNavigation.ts
│   ├── useTheme.ts
│   └── useTutorialProgress.ts
├── utils/                     # Pure utility functions
│   ├── constants.ts          # App constants and configuration
│   ├── formatters.ts         # Data formatting functions
│   ├── validation.ts         # Data validation utilities
│   └── index.ts              # Utils exports
└── page.tsx                   # Next.js page component
```

## 🎯 Component Responsibilities

### UI Components (`components/ui/`)

- **Reusable**: Used across multiple parts of the application
- **Styled**: Consistent design system implementation
- **Interactive**: Handle user interactions with proper accessibility
- **Configurable**: Accept props for customization

### Helpers (`helpers/`)

- **Business Logic**: Tutorial-specific calculations and processing
- **Data Transformation**: Convert raw data to display formats
- **Complex Operations**: Multi-step operations that components use

### Utils (`utils/`)

- **Pure Functions**: No side effects, predictable outputs
- **Data Formatting**: Simple transformations and formatting
- **Constants**: Application-wide configuration values
- **Validation**: Data structure and content validation

### Hooks (`hooks/`)

- **State Management**: Encapsulate stateful logic
- **Side Effects**: Handle API calls, localStorage, etc.
- **Reusable Logic**: Share logic between components

## 🚀 Usage Examples

### Using UI Components

```tsx
import { Button, Badge, ProgressBar, CodeBlock } from './components/ui'

// Enhanced button with loading state
<Button variant="primary" loading={isLoading} icon={<SaveIcon />}>
  Save Progress
</Button>

// Progress bar with click navigation
<ProgressBar
  progress={75}
  onClick={(position) => navigateToPosition(position)}
  animated
/>

// Code block with syntax highlighting
<CodeBlock
  code={lessonCode}
  language="javascript"
  copyable
  showLineNumbers
/>
```

### Using Helpers

```tsx
import {
  calculateProgressStats,
  extractMermaidCode,
  formatDifficulty,
} from "./helpers"

// Format difficulty for display
const difficultyLabel = formatDifficulty(tutorial.difficulty) // "Beginner"

// Calculate detailed progress statistics
const stats = calculateProgressStats(progress, totalLessons)

// Extract diagram code for rendering
const diagramCode = extractMermaidCode(lesson.mermaid_code)
```

### Using Utils

```tsx
import { LESSON_TYPES, formatTime, validateTutorial } from "./utils"

// Use constants for type checking
if (lesson.type === LESSON_TYPES.CONCEPT) {
  // Handle concept lesson
}

// Format time duration
const timeSpent = formatTime(progressData.totalTimeSpent) // "1h 23m"

// Validate data structure
const { isValid, errors } = validateTutorial(tutorialData)
```

## 🎨 Design System

### Colors

- **Primary**: Blue (#3B82F6) - Learning, progress
- **Success**: Green (#10B981) - Completed, correct
- **Warning**: Yellow (#F59E0B) - In progress, attention
- **Error**: Red (#EF4444) - Incorrect, failed
- **Info**: Purple (#6366F1) - Additional information

### Components Styling

- Consistent border radius (8px for cards, 4px for buttons)
- Proper focus states for accessibility
- Dark mode support throughout
- Responsive design with mobile-first approach

## 📱 Responsive Behavior

### Breakpoints

- **SM**: 640px - Small tablets
- **MD**: 768px - Tablets
- **LG**: 1024px - Small laptops
- **XL**: 1280px - Desktop

### Mobile Adaptations

- Collapsible sidebar becomes bottom navigation
- Touch-friendly button sizes (minimum 44px)
- Swipe gestures for lesson navigation
- Optimized typography for reading

## ♿ Accessibility Features

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- Color contrast compliance
- Semantic HTML structure

## 🔧 Maintenance Guidelines

### Adding New Components

1. Create component in appropriate directory
2. Export from index.ts file
3. Add TypeScript interfaces
4. Include accessibility features
5. Add to design system documentation

### Modifying Existing Components

1. Check for breaking changes in props
2. Update TypeScript interfaces
3. Test across different screen sizes
4. Verify accessibility compliance
5. Update documentation if needed

### Performance Considerations

- Lazy load heavy components
- Memoize expensive calculations
- Optimize re-renders with React.memo
- Use proper key props for lists
- Implement virtual scrolling for long lists

## 🧪 Testing

### Component Testing

- Unit tests for utility functions
- Component tests for UI interactions
- Integration tests for complex flows
- Accessibility testing with tools

### Test Files Location

```
__tests__/
├── components/
├── helpers/
├── utils/
└── hooks/
```

This structure ensures maintainable, scalable, and accessible tutorial interface that provides excellent user experience across all devices.
