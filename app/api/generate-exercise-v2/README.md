# Generate Exercise API v2 - Modular Architecture

This is a refactored version of the `generate-exercise` API with a proper modular structure similar to `generate-tutorial`.

## Directory Structure

```
generate-exercise-v2/
├── interfaces/
│   └── types.ts              # TypeScript interfaces and types
├── prompts/
│   └── systemPrompts.ts      # System prompts and prompt building
├── schemas/
│   └── ExerciseSchemas.ts    # JSON Schema definitions
├── utilities/
│   └── helpers.ts            # Utility functions and validation helpers
├── validators/
│   └── requestValidator.ts   # Request validation logic
├── route.ts                  # Main API route handler
└── README.md                 # This documentation
```

## Key Improvements

### 1. **Modular Architecture**

- **Separation of Concerns**: Each component has a single responsibility
- **Maintainability**: Easy to modify individual components
- **Testability**: Each module can be tested independently
- **Reusability**: Components can be used across different parts of the application

### 2. **Enhanced Type Safety**

- **TypeScript Interfaces**: Complete type definitions for all data structures
- **Type Guards**: Runtime type validation with TypeScript integration
- **Improved IDE Support**: Better autocomplete and error detection

### 3. **Comprehensive Validation**

- **Request Validation**: Multi-level validation for incoming requests
- **Response Validation**: Thorough validation of AI-generated content
- **Error Handling**: Detailed error messages with specific issue identification

### 4. **Better Error Handling**

- **Structured Errors**: Consistent error format across all endpoints
- **Detailed Logging**: Comprehensive logging for debugging
- **Graceful Degradation**: Proper fallbacks for various failure scenarios

## Components Overview

### **interfaces/types.ts**

Contains all TypeScript interfaces used throughout the application:

- `GenerateExerciseRequest`: Request payload structure
- `ExerciseResponse`: AI response structure
- `HintItem`, `ExplanationItem`, `VisualElements`: Sub-components
- `APIError`: Error response structure

### **schemas/ExerciseSchemas.ts**

JSON Schema definitions for OpenAI structured output:

- Individual schemas for each field (TITLE_SCHEMA, CODE_SCHEMA, etc.)
- Composite schemas (VISUAL_ELEMENTS_SCHEMA, EXERCISE_RESPONSE_SCHEMA)
- Validation rules and constraints

### **prompts/systemPrompts.ts**

System prompts and prompt building logic:

- `CORE_REQUIREMENTS`: Base requirements for exercise generation
- `CODE_FORMATTING`: Code formatting guidelines
- `VISUAL_ELEMENTS_RULES`: Visual elements requirements
- `buildPrompt()`: Dynamic prompt construction

### **validators/requestValidator.ts**

Request validation functions:

- `validateExerciseRequest()`: Basic request structure validation
- `sanitizeRequest()`: Data sanitization and normalization
- `validateGenerationParams()`: Advanced parameter validation

### **utilities/helpers.ts**

Utility functions for validation and processing:

- `validateVisualElements()`: Visual elements validation
- `validateCodeFormat()`: Code format validation
- `validateCodeCompleteness()`: Code completeness checks
- `createValidationSummary()`: Comprehensive validation reporting

## API Usage

### Endpoint

```
POST /api/generate-exercise-v2
```

### Request Body

```typescript
{
  questionInput: string      // Exercise description
  selectedLanguage: string   // Programming language
  difficulty: number         // 1-5 difficulty level
  selectedModel: string      // AI model to use
  exclusions?: string        // Optional concepts to exclude
}
```

### Response

```typescript
{
  title: string
  description: string
  solution_code: string
  mermaid_diagram: string
  hints: HintItem[]
  explanation: ExplanationItem[]
  tags: string[]
  learning_objectives: string[]
  visual_elements: VisualElements
  boilerplate_code: string
}
```

## Migration from v1

The v2 API maintains the same interface as v1 but provides:

- Better error handling and validation
- More detailed logging and debugging information
- Improved code organization and maintainability
- Enhanced type safety

To migrate:

1. Update API endpoint from `/api/generate-exercise` to `/api/generate-exercise-v2`
2. No changes needed to request/response format
3. Enhanced error responses provide more detailed information

## Development

### Adding New Validation Rules

1. Add validation logic to `utilities/helpers.ts`
2. Update validation summary in `createValidationSummary()`
3. Test with various AI responses

### Modifying Prompts

1. Update relevant sections in `prompts/systemPrompts.ts`
2. Test prompt changes with different difficulty levels and languages
3. Validate output quality

### Adding New Schema Fields

1. Update TypeScript interfaces in `interfaces/types.ts`
2. Add corresponding JSON schemas in `schemas/ExerciseSchemas.ts`
3. Update validation logic in `utilities/helpers.ts`
4. Test with AI generation

## Testing

Each module can be tested independently:

- **Unit Tests**: Test individual validation functions
- **Integration Tests**: Test API endpoint with various inputs
- **Schema Tests**: Validate JSON schema definitions
- **Prompt Tests**: Test prompt generation with different parameters

## Performance Considerations

- **Modular Loading**: Only required modules are loaded
- **Efficient Validation**: Validation stops at first critical error
- **Caching**: Static imports allow for module caching
- **Memory Usage**: Structured objects reduce memory overhead

## Future Enhancements

1. **Caching Layer**: Add Redis caching for frequently requested exercises
2. **Batch Processing**: Support for generating multiple exercises
3. **Custom Templates**: User-defined exercise templates
4. **Analytics**: Track generation patterns and success rates
5. **Rate Limiting**: Implement request rate limiting
6. **Model Selection**: Dynamic model selection based on complexity
