// Mock implementations for generate-tutorial and generate-exercise APIs
// Use for testing without API costs

// Mock tutorial response matching the expected structure
const mockTutorialResponse = {
  title: "Functions in Python - Complete Guide",
  description:
    "Master Python functions from basic syntax to advanced concepts. Learn parameter passing, return values, scope, and best practices through hands-on examples.",
  learningObjectives: [
    "Understand function definition syntax and structure",
    "Master parameter passing techniques and default values",
    "Learn about return values and function scope",
    "Apply functions to solve real-world programming problems",
  ],
  keyTopics: [
    "Function definition with def keyword",
    "Parameters and arguments",
    "Return statements",
    "Variable scope and lifetime",
    "Lambda functions",
    "Function documentation",
  ],
  difficulty: 1,
  lessons: [
    {
      id: "lesson-1",
      type: "concept",
      title: "Introduction to Functions",
      content: {
        text: "Functions are reusable blocks of code that perform specific tasks. They help organize code, reduce repetition, and make programs more modular and easier to maintain.",
        codeExamples: [
          {
            title: "Basic Function Definition",
            description: "A simple function that prints a greeting",
            code: "def greet():\n    print('Hello, World!')\n\n# Call the function\ngreet()",
            language: "python",
            explanation:
              "The def keyword defines a function. The function name is followed by parentheses and a colon. The function body is indented.",
          },
          {
            title: "Function with Parameters",
            description: "A function that accepts input parameters",
            code: "def greet_person(name):\n    print(f'Hello, {name}!')\n\n# Call with argument\ngreet_person('Alice')",
            language: "python",
            explanation:
              "Parameters allow functions to accept input values, making them more flexible and reusable.",
          },
        ],
      },
    },
    {
      id: "lesson-2",
      type: "mcq",
      title: "Function Syntax Quiz",
      content: {
        question: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "func", "define"],
        correctAnswer: 1,
        explanation:
          "The 'def' keyword is used to define functions in Python. It's followed by the function name and parameters in parentheses.",
      },
    },
    {
      id: "lesson-3",
      type: "practical_example",
      title: "Return Values and Parameters",
      content: {
        text: "Functions can return values using the return statement and accept multiple parameters with default values.",
        codeExamples: [
          {
            title: "Function with Return Value",
            description: "Calculate the area of a rectangle",
            code: "def calculate_area(length, width):\n    area = length * width\n    return area\n\n# Use the returned value\nresult = calculate_area(5, 3)\nprint(f'Area: {result} square units')",
            language: "python",
            explanation:
              "The return statement sends a value back to the caller. This value can be stored in a variable or used directly.",
          },
        ],
        diagram_data: {
          type: "flowchart",
          title: "Function Call Flow",
          nodes: [
            {
              id: "start",
              label: "Call calculate_area(5, 3)",
              shape: "rounded",
            },
            {
              id: "assign",
              label: "length = 5, width = 3",
              shape: "rectangle",
            },
            {
              id: "calculate",
              label: "area = length * width",
              shape: "rectangle",
            },
            { id: "return", label: "return area", shape: "rectangle" },
            { id: "result", label: "result = 15", shape: "rounded" },
          ],
          edges: [
            { from: "start", to: "assign", type: "arrow" },
            { from: "assign", to: "calculate", type: "arrow" },
            { from: "calculate", to: "return", type: "arrow" },
            { from: "return", to: "result", type: "arrow" },
          ],
        },
      },
    },
  ],
  practicalApplications: [
    "Web development with Flask/Django frameworks",
    "Data analysis and scientific computing with NumPy/Pandas",
    "API development and microservices",
    "Automation scripts and task scheduling",
    "Machine learning model development",
  ],
  tags: [
    "functions",
    "python",
    "programming",
    "basics",
    "syntax",
    "parameters",
  ],
  reference: {
    title: "Python Functions Reference",
    subtitle: "Complete guide to defining and using functions in Python",
    introduction:
      "Functions are fundamental building blocks in Python that allow you to organize code into reusable, modular components. They accept inputs, process data, and can return outputs.",
    examples: [
      {
        title: "Simple Function",
        description: "Basic function definition and call",
        code: "def say_hello():\n    print('Hello!')\n\nsay_hello()",
        explanation:
          "This function has no parameters and no return value. It simply executes the print statement when called.",
      },
      {
        title: "Function with Parameters",
        description: "Function accepting input arguments",
        code: "def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(5, 3)\nprint(result)  # Output: 8",
        explanation:
          "This function accepts two parameters and returns their sum. The returned value is stored in the 'result' variable.",
      },
      {
        title: "Function with Default Parameters",
        description: "Function with default parameter values",
        code: "def greet(name, greeting='Hello'):\n    return f'{greeting}, {name}!'\n\nprint(greet('Alice'))  # Hello, Alice!\nprint(greet('Bob', 'Hi'))  # Hi, Bob!",
        explanation:
          "Default parameters allow functions to be called with fewer arguments. If not provided, the default value is used.",
      },
      {
        title: "Lambda Functions",
        description: "Anonymous functions for simple operations",
        code: "# Regular function\ndef square(x):\n    return x ** 2\n\n# Lambda function\nsquare_lambda = lambda x: x ** 2\n\nprint(square(4))  # 16\nprint(square_lambda(4))  # 16",
        explanation:
          "Lambda functions are concise way to define simple functions inline, commonly used with map(), filter(), and sort().",
      },
    ],
    key_points: [
      "Functions promote code reusability and organization",
      "Use descriptive function names that indicate their purpose",
      "Functions can accept parameters and return values",
      "Local variables inside functions have function scope",
      "Default parameters make functions more flexible",
      "Document functions with docstrings for better maintainability",
    ],
    common_mistakes: [
      {
        mistake: "Forgetting the colon after function definition",
        why_wrong:
          "Python requires a colon to start the function block, similar to if statements and loops",
        correct_approach:
          "Always include a colon after the function signature: def function_name():",
      },
      {
        mistake: "Not returning a value when needed",
        why_wrong:
          "Functions that should return values but don't explicitly return will return None",
        correct_approach:
          "Use the return statement to send values back to the caller",
      },
      {
        mistake: "Modifying mutable default parameters",
        why_wrong:
          "Mutable defaults (like lists) are shared between function calls, causing unexpected behavior",
        correct_approach:
          "Use None as default and create mutable objects inside the function",
      },
      {
        mistake: "Using global variables instead of parameters",
        why_wrong:
          "Global variables make functions less reusable and harder to test",
        correct_approach:
          "Pass values as parameters to make functions more modular and testable",
      },
    ],
    syntax_guide: {
      basic_syntax:
        'def function_name(parameters):\n    """Optional docstring"""\n    # function body\n    return value  # optional',
      parameters: [
        "function_name: Descriptive name using snake_case",
        "parameters: Comma-separated list of input variables",
        "docstring: Optional documentation string",
        "return: Optional value to send back to caller",
      ],
    },
  },
};

// Mock exercise response matching the expected structure
const mockExerciseResponse = {
  title_en: "Write a function to check if a number is prime",
  title_hi: "Ek function banayiye jo check kare ki number prime hai ya nahi",
  title_mr: "Ek function banawa jo check karel ki number prime ahe ka nahi",
  solution_code: `def is_prime(n):
    # [1] Check for numbers less than 2
    if n < 2:
        return False
    
    # [2] Check divisibility from 2 to sqrt(n)
    for i in range(2, int(n**0.5) + 1):
        # [3] If divisible, not prime
        if n % i == 0:
            return False
    
    # [4] If no divisors found, number is prime
    return True

# Test the function
print(is_prime(17))  # True
print(is_prime(15))  # False
print(is_prime(2))   # True
print(is_prime(1))   # False`,
  mermaid_diagram: `flowchart TD
    A["Start: Input n"] --> B{"n < 2?"}
    B -->|"Yes"| C["Return False"]
    B -->|"No"| D["i = 2"]
    D --> E{"i <= sqrt(n)?"}
    E -->|"No"| F["Return True"]
    E -->|"Yes"| G{"n % i == 0?"}
    G -->|"Yes"| C
    G -->|"No"| H["i = i + 1"]
    H --> E`,
  hints_en: [
    {
      text: "Prime numbers are only divisible by 1 and themselves. Numbers less than 2 are not prime.",
      code_snippet: "if n < 2: return False",
    },
    {
      text: "You only need to check divisors up to the square root of n for efficiency.",
      code_snippet: "range(2, int(n**0.5) + 1)",
    },
    {
      text: "Use the modulo operator (%) to check if a number divides evenly.",
      code_snippet: "if n % i == 0:",
    },
    {
      text: "If you find any divisor, the number is not prime. Return False immediately.",
    },
  ],
  explanation_en: [
    {
      text: "[1] First, we handle the edge case where n is less than 2. By definition, numbers less than 2 (including negative numbers, 0, and 1) are not prime numbers.",
      type: "concept",
      code_ref: [1],
    },
    {
      text: "[2] We iterate from 2 to the square root of n to check for potential divisors. This optimization works because factors come in pairs - if n has a factor greater than sqrt(n), it must also have a corresponding factor less than sqrt(n).",
      type: "concept",
      code_ref: [2],
    },
    {
      text: "[3] For each potential divisor i, we check if n is evenly divisible by i using the modulo operator. If n % i equals 0, then i is a factor of n, which means n is not prime.",
      type: "concept",
      code_ref: [3],
    },
    {
      text: "[4] If we complete the entire loop without finding any divisors, then n has no factors other than 1 and itself, making it a prime number. We return True.",
      type: "concept",
      code_ref: [4],
    },
  ],
  hints_hi: [
    {
      text: "Prime numbers sirf 1 aur khud se divide hote hain. 2 se kam ke numbers prime nahi hote.",
    },
    {
      text: "Efficiency ke liye sirf square root tak check karna kaafi hai.",
    },
  ],
  explanation_hi: [
    {
      text: "[1] Pehle hum check karte hain ki n 2 se kam hai ya nahi, kyunki definition ke hisaab se 2 se kam ke numbers prime nahi hote.",
      type: "concept",
      code_ref: [1],
    },
    {
      text: "[2] Hum 2 se lekar sqrt(n) tak loop chalate hain divisors dhundne ke liye.",
      type: "concept",
      code_ref: [2],
    },
  ],
  hints_mr: [
    {
      text: "Prime numbers fakt 1 ani swatahch divide hotaat. 2 peksha kami numbers prime nasatat.",
    },
    {
      text: "Efficiency sathi fakt square root paryant check karayla pahije.",
    },
  ],
  explanation_mr: [
    {
      text: "[1] Pahile apan check karto ki n 2 peksha kami ahe ka, karan definition pramane 2 peksha kami numbers prime nasatat.",
      type: "concept",
      code_ref: [1],
    },
    {
      text: "[2] Apan 2 pasun sqrt(n) paryant loop chalato divisors shodhnyasathi.",
      type: "concept",
      code_ref: [2],
    },
  ],
  visual_elements: {
    execution_steps: [
      {
        step: 1,
        line_number: 2,
        line: "if n < 2:",
        description: "Check if input is less than 2",
        output: "",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
        ],
      },
      {
        step: 2,
        line_number: 5,
        line: "for i in range(2, int(n**0.5) + 1):",
        description: "Start loop from 2 to sqrt(17) ≈ 4",
        output: "",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
          {
            name: "i",
            value: "2",
            type: "int",
            changed: true,
          },
        ],
      },
      {
        step: 3,
        line_number: 7,
        line: "if n % i == 0:",
        description: "Check if 17 is divisible by 2",
        output: "",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
          {
            name: "i",
            value: "2",
            type: "int",
            changed: false,
          },
        ],
      },
      {
        step: 4,
        line_number: 5,
        line: "for i in range(2, int(n**0.5) + 1):",
        description: "Continue loop, i becomes 3",
        output: "",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
          {
            name: "i",
            value: "3",
            type: "int",
            changed: true,
          },
        ],
      },
      {
        step: 5,
        line_number: 7,
        line: "if n % i == 0:",
        description: "Check if 17 is divisible by 3",
        output: "",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
          {
            name: "i",
            value: "3",
            type: "int",
            changed: false,
          },
        ],
      },
      {
        step: 6,
        line_number: 5,
        line: "for i in range(2, int(n**0.5) + 1):",
        description: "Continue loop, i becomes 4",
        output: "",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
          {
            name: "i",
            value: "4",
            type: "int",
            changed: true,
          },
        ],
      },
      {
        step: 7,
        line_number: 7,
        line: "if n % i == 0:",
        description: "Check if 17 is divisible by 4",
        output: "",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
          {
            name: "i",
            value: "4",
            type: "int",
            changed: false,
          },
        ],
      },
      {
        step: 8,
        line_number: 11,
        line: "return True",
        description: "No divisors found, return True",
        output: "True",
        memory_state: [
          {
            name: "n",
            value: "17",
            type: "int",
            changed: false,
          },
          {
            name: "i",
            value: "4",
            type: "int",
            changed: false,
          },
        ],
      },
    ],
    concepts: [
      {
        name: "Prime Numbers",
        description:
          "Natural numbers greater than 1 that have exactly two positive divisors: 1 and themselves",
        visual_metaphor:
          "Like a fortress with only two doors - one marked '1' and one marked with the number itself. No other numbers can enter (divide evenly).",
      },
      {
        name: "Square Root Optimization",
        description:
          "We only need to check divisors up to the square root because factors come in pairs",
        visual_metaphor:
          "Like checking half of a mirror - if you don't see something in one half, its reflection won't be in the other half either.",
      },
      {
        name: "Modulo Operator (%)",
        description:
          "Returns the remainder after division. If remainder is 0, the division is exact (no remainder)",
        visual_metaphor:
          "Like sharing cookies equally among friends - if there are leftover cookies, that's the remainder.",
      },
      {
        name: "Early Return Pattern",
        description:
          "Returning immediately when a condition is met, avoiding unnecessary computation",
        visual_metaphor:
          "Like stopping a search as soon as you find what you're looking for - no need to keep searching.",
      },
    ],
  },
  boilerplate_code: `def is_prime(n):
    # TODO: Handle edge case for numbers less than 2
    # Hint: Numbers less than 2 are not prime by definition
    
    # TODO: Create a loop to check divisors from 2 to sqrt(n)
    # Hint: Use range(2, int(n**0.5) + 1)
    
    # TODO: Inside the loop, check if n is divisible by current number
    # Hint: Use the modulo operator (%) to check for remainder
    
    # TODO: If divisible, return False (not prime)
    
    # TODO: If loop completes without finding divisors, return True (prime)

# Test your function
print(is_prime(17))  # Should return True
print(is_prime(15))  # Should return False
print(is_prime(2))   # Should return True  
print(is_prime(1))   # Should return False`,
  tags: [
    "algorithms",
    "mathematics",
    "prime-numbers",
    "functions",
    "loops",
    "optimization",
  ],
  learning_objectives: [
    "Understand the mathematical concept of prime numbers",
    "Implement efficient divisibility checking using modulo operator",
    "Apply square root optimization technique to reduce time complexity",
    "Practice early return pattern for efficient function design",
  ],
};

// Mock function for generate-tutorial API
export async function mockGenerateTutorial(
  topic: string,
  language: string,
  difficulty: number,
  numLessons: number,
  selectedModel: string,
  focusAreas?: string,
  exclusions?: string,
  customPrompts?: {
    coreRequirements: string;
    lessonProgression: string;
    contentQuality: string;
    jsonStructure: string;
  },
): Promise<any> {
  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("🎭 Mock Tutorial Generation:", {
    topic,
    language,
    difficulty,
    numLessons,
    selectedModel,
    focusAreas,
    exclusions,
    customPrompts: !!customPrompts,
  });

  // Customize response based on input parameters
  const customizedResponse = {
    ...mockTutorialResponse,
    title: `${topic} in ${language}`,
    description: `Master ${topic} concepts in ${language} programming language through comprehensive lessons and practical examples.`,
    difficulty: difficulty,
    lessons: mockTutorialResponse.lessons.slice(0, numLessons),
    keyTopics: focusAreas
      ? focusAreas.split(",").map((area) => area.trim())
      : mockTutorialResponse.keyTopics,
    tags: [
      ...mockTutorialResponse.tags,
      language.toLowerCase(),
      topic.toLowerCase().replace(/\s+/g, "-"),
    ],
  };

  return customizedResponse;
}

// Mock function for generate-exercise API
export async function mockGenerateExercise(
  questionInput: string,
  selectedLanguage: string,
  difficulty: string,
  selectedModel: string,
  exclusions?: string,
): Promise<any> {
  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log("🎭 Mock Exercise Generation:", {
    questionInput,
    selectedLanguage,
    difficulty,
    selectedModel,
    exclusions,
  });

  // Customize response based on input parameters
  const customizedResponse = {
    ...mockExerciseResponse,
    title_en: questionInput,
    solution_code: mockExerciseResponse.solution_code.replace(
      /python/gi,
      selectedLanguage,
    ),
    tags: [
      ...mockExerciseResponse.tags,
      selectedLanguage.toLowerCase(),
      difficulty,
    ],
  };

  // Adjust complexity based on difficulty
  if (difficulty === "advanced") {
    customizedResponse.visual_elements.execution_steps =
      mockExerciseResponse.visual_elements.execution_steps.slice(0, 4);
    customizedResponse.hints_en = mockExerciseResponse.hints_en.slice(0, 2);
  } else if (difficulty === "beginner") {
    customizedResponse.hints_en = [
      ...mockExerciseResponse.hints_en,
      {
        text: "Start by understanding what makes a number prime before writing code.",
        code_snippet: "# Prime: only divisible by 1 and itself",
      },
    ];
  }

  return customizedResponse;
}

// Flag to enable/disable mock mode
export const MOCK_MODE = {
  enabled: false, // Set to true to use mock responses
  tutorial: false, // Set to true to mock tutorial API only
  exercise: false, // Set to true to mock exercise API only
};

// Enhanced versions of existing functions with mock support
export async function generateTutorialWithMock(
  topic: string,
  language: string,
  difficulty: number,
  numLessons: number,
  selectedModel: string,
  focusAreas?: string,
  exclusions?: string,
  customPrompts?: {
    coreRequirements: string;
    lessonProgression: string;
    contentQuality: string;
    jsonStructure: string;
  },
) {
  if (MOCK_MODE.enabled || MOCK_MODE.tutorial) {
    console.log("🎭 Using mock tutorial generation");
    return mockGenerateTutorial(
      topic,
      language,
      difficulty,
      numLessons,
      selectedModel,
      focusAreas,
      exclusions,
      customPrompts,
    );
  }

  // Use real API implementation from getData.ts
  const { generateTutorial } = await import("./getData");
  return generateTutorial(
    topic,
    language,
    difficulty,
    numLessons,
    selectedModel,
    focusAreas,
    exclusions,
    customPrompts,
  );
}

export async function generateExerciseWithMock(
  questionInput: string,
  selectedLanguage: string,
  difficulty: number,
  selectedModel: string,
  exclusions?: string,
) {
  if (MOCK_MODE.enabled || MOCK_MODE.exercise) {
    console.log("🎭 Using mock exercise generation");
    return mockGenerateExercise(
      questionInput,
      selectedLanguage,
      difficulty.toString(),
      selectedModel,
      exclusions,
    );
  }

  // Use real API implementation from getData.ts
  const { generateExercise } = await import("./getData");
  return generateExercise(
    questionInput,
    selectedLanguage,
    difficulty,
    selectedModel,
    exclusions,
  );
}
