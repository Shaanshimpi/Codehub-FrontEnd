// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/page.tsx
import React from "react"
import ExerciseLayout from "./components/ExerciseLayout"

interface ExercisePageProps {
  params: Promise<{
    langSlug: string
    tutSlug: string
    exerciseSlug: string
  }>
}

// Demo data structure based on your provided object
const mockExerciseData = {
  id: 4,
  title_en:
    "Write a C program to determine if a person is eligible to vote based on their age.",

  hints_en: [
    {
      id: "6880857769416211282b7cf0",
      text: "Use an `if` statement to check the age.",
      code_snippet: "if (age >= 18) { ... }",
    },

    {
      id: "6880857769416211282b7cf1",
      text: "Use `printf` to display the appropriate message based on the age.",
      code_snippet: 'printf("You are eligible to vote.\\n");',
    },

    {
      id: "6880857769416211282b7cf2",
      text: "Remember to use `else` to handle the case where the age is less than 18.",
      code_snippet: "else { ... }",
    },
  ],

  explanation_en: [
    {
      id: "6880857769416211282b7cf4",
      text: "[1] This line prints a message to the console asking the user to enter their age. `printf` is a standard C function used for output.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7cf3",
          ref_number: 1,
        },
      ],
    },

    {
      id: "6880857769416211282b7cf6",
      text: "[2] This is where you will add the conditional check to determine if the age entered by the user is sufficient to vote. The voting age is generally 18 or higher.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7cf5",
          ref_number: 2,
        },
      ],
    },

    {
      id: "6880857769416211282b7cf8",
      text: "[3] If the condition in step [2] is true (age is greater than or equal to 18), this line will print a message indicating that the user is eligible to vote. Use `printf` to display the message.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7cf7",
          ref_number: 3,
        },
      ],
    },

    {
      id: "6880857769416211282b7cfa",
      text: "[4] If the condition in step [2] is false (age is less than 18), this line will print a message indicating that the user is not eligible to vote. Again, use `printf` to display the message.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7cf9",
          ref_number: 4,
        },
      ],
    },

    {
      id: "6880857769416211282b7cfb",
      text: '```c\n#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n int age;\n\n printf("Enter your age: ");\n scanf("%d", &age);\n\n if (age >= 18) {\n printf("You are eligible to vote.\\n");\n } else {\n printf("You are not eligible to vote.\\n");\n }\n\n return 0;\n}\n```',
      type: "solution_code",

      code_ref: [],
    },

    {
      id: "6880857769416211282b7cfc",
      text: "The `if` statement checks if the `age` is greater than or equal to 18. If it is, the code inside the `if` block is executed. Otherwise, the code inside the `else` block is executed.",
      type: "concept",

      code_ref: [],
    },

    {
      id: "6880857769416211282b7cfd",
      text: "Remember to include the necessary header files (`stdio.h`) for input and output operations.",
      type: "tip",

      code_ref: [],
    },
  ],
  title_hi:
    "Ek C program likhiye jo yeh nirdharit kare ki ek vyakti apni age ke aadhar par vote dene ke liye eligible hai ya nahi.",

  hints_hi: [
    {
      id: "6880857769416211282b7cfe",
      text: "Age check karne ke liye ek `if` statement use karein.",
      code_snippet: "if (age >= 18) { ... }",
    },

    {
      id: "6880857769416211282b7cff",
      text: "Age ke basis par appropriate message display karne ke liye `printf` use karein.",
      code_snippet: 'printf("You are eligible to vote.\\n");',
    },

    {
      id: "6880857769416211282b7d00",
      text: "Age 18 se kam hone ki situation ko handle karne ke liye `else` use karna yaad rakhein.",
      code_snippet: "else { ... }",
    },
  ],

  explanation_hi: [
    {
      id: "6880857769416211282b7d02",
      text: "[1] Yeh line console mein ek message print karti hai, jo user ko apni age enter karne ko kehta hai. `printf` ek standard C function hai jo output ke liye use hota hai.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d01",
          ref_number: 1,
        },
      ],
    },

    {
      id: "6880857769416211282b7d04",
      text: "[2] Yahan aapko ek conditional check add karna hai yeh determine karne ke liye ki user dwara enter ki gayi age voting ke liye sufficient hai ya nahi. Voting age generally 18 ya usse zyada hoti hai.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d03",
          ref_number: 2,
        },
      ],
    },

    {
      id: "6880857769416211282b7d06",
      text: "[3] Agar step [2] mein condition true hai (age 18 ya usse zyada hai), toh yeh line ek message print karegi jo indicate karega ki user vote karne ke liye eligible hai. Message display karne ke liye `printf` use karein.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d05",
          ref_number: 3,
        },
      ],
    },

    {
      id: "6880857769416211282b7d08",
      text: "[4] Agar step [2] mein condition false hai (age 18 se kam hai), toh yeh line ek message print karegi jo indicate karega ki user vote karne ke liye eligible nahi hai. Phir se, message display karne ke liye `printf` use karein.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d07",
          ref_number: 4,
        },
      ],
    },

    {
      id: "6880857769416211282b7d09",
      text: "`if` statement check karta hai ki `age` 18 se greater than ya equal to hai ya nahi. Agar hai, toh `if` block ke andar ka code execute hota hai. Otherwise, `else` block ke andar ka code execute hota hai.",
      type: "concept",

      code_ref: [],
    },

    {
      id: "6880857769416211282b7d0a",
      text: "Input aur output operations ke liye necessary header files (`stdio.h`) include karna yaad rakhein.",
      type: "tip",

      code_ref: [],
    },
  ],
  title_mr:
    "Ek C program liha jo he nirdharit kareel ki ek vyakti tyachya vayachya aadharavar vote denyas eligible aahe ki nahi.",

  hints_mr: [
    {
      id: "6880857769416211282b7d0b",
      text: "Vay check karanyasathi ek `if` statement vapara.",
      code_snippet: "if (age >= 18) { ... }",
    },

    {
      id: "6880857769416211282b7d0c",
      text: "Vayachya aadharavar yogya to message display karanyasathi `printf` vapara.",
      code_snippet: 'printf("You are eligible to vote.\\n");',
    },

    {
      id: "6880857769416211282b7d0d",
      text: "Vay 18 peksha kami aslyas handle karanyasathi `else` vaparane lakshat theva.",
      code_snippet: "else { ... }",
    },
  ],

  explanation_mr: [
    {
      id: "6880857769416211282b7d0f",
      text: "[1] He line console madhye ek message print karate, ji userala tyache vay enter karanyas sangate. `printf` ek standard C function aahe jo output sathi vaparala jato.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d0e",
          ref_number: 1,
        },
      ],
    },

    {
      id: "6880857769416211282b7d11",
      text: "[2] Yethe tumhi ek conditional check add karayacha aahe he nirdharit karanyasathi ki user ne enter kelele vay voting sathi puresa aahe ki nahi. Voting age samanyatah 18 kinva tyahun adhik aste.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d10",
          ref_number: 2,
        },
      ],
    },

    {
      id: "6880857769416211282b7d13",
      text: "[3] Agar step [2] madhil condition true aahe (vay 18 kinva tyahun adhik aahe), tar he line ek message print karel je suchavite ki user vote karanyas eligible aahe. Message dakhavanyasathi `printf` vapara.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d12",
          ref_number: 3,
        },
      ],
    },

    {
      id: "6880857769416211282b7d15",
      text: "[4] Agar step [2] madhil condition false aahe (vay 18 peksha kami aahe), tar he line ek message print karel je suchavite ki user vote karanyas eligible nahi. Punha, message dakhavanyasathi `printf` vapara.",
      type: "text",

      code_ref: [
        {
          id: "6880857769416211282b7d14",
          ref_number: 4,
        },
      ],
    },

    {
      id: "6880857769416211282b7d16",
      text: "`if` statement check karate ki `age` 18 peksha jast kinva equal aahe ki nahi. Agar aahe, tar `if` block chya aatla code execute hoto. Otherwise, `else` block chya aatla code execute hoto.",
      type: "concept",

      code_ref: [],
    },

    {
      id: "6880857769416211282b7d17",
      text: "Input aani output operations sathi avashyak header files (`stdio.h`) include karane lakshat theva.",
      type: "tip",

      code_ref: [],
    },
  ],
  index: 1,
  slug: "write-a-c-program-to-determine-if-a-person-is-eligible-to-vote-based-on-their-age",
  solution_code:
    '#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n int age;\n\n // [1] Prompt the user to enter their age\n printf("Enter your age: ");\n scanf("%d", &age);\n\n // [2] Check if the age is greater than or equal to 18\n if (age >= 18) {\n // [3] If the age is greater than or equal to 18, print "You are eligible to vote.\\n"\n printf("You are eligible to vote.\\n");\n } else {\n // [4] Otherwise, print "You are not eligible to vote.\\n"\n printf("You are not eligible to vote.\\n");\n }\n\n return 0;\n}',
  boilerplate_code:
    '#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n int age;\n\n // [1] Prompt the user to enter their age\n printf("Enter your age: ");\n scanf("%d", &age);\n\n // [2] TODO: Check if the age is greater than or equal to 18\n // [3] TODO: If the age is greater than or equal to 18, print "You are eligible to vote.\\n"\n // [4] TODO: Otherwise, print "You are not eligible to vote.\\n"\n\n return 0;\n}',
  mermaid_diagram:
    'flowchart TD\n A["Start"] --> B["Enter age"]\n B --> C{"Is age >= 18"}\n C -->|Yes| D["Print \'You are eligible to vote.\'"]\n C -->|No| E["Print \'You are not eligible to vote.\'"]\n D --> F["End"]\n E --> F\n style A fill:#a8e6cf,stroke:#333,stroke-width:2px\n style F fill:#ffaaa5,stroke:#333,stroke-width:2px\n style D fill:#1dd1a1,stroke:#333,stroke-width:2px\n style E fill:#ff6b6b,stroke:#333,stroke-width:2px',

  learning_objectives: [
    {
      id: "6880857769416211282b7d18",
      objective:
        "Understand how to use conditional statements (`if`, `else`) to control the flow of execution based on a condition.",
    },

    {
      id: "6880857769416211282b7d19",
      objective:
        "Apply input/output functions (`printf`, `scanf`) to interact with the user.",
    },

    {
      id: "6880857769416211282b7d1a",
      objective:
        "Implement a program that makes a decision based on user input.",
    },
  ],

  tags: [
    {
      id: "6880857769416211282b7d1b",
      tag: "conditionals",
    },

    {
      id: "6880857769416211282b7d1c",
      tag: "input/output",
    },

    {
      id: "6880857769416211282b7d1d",
      tag: "decision-making",
    },

    {
      id: "6880857769416211282b7d1e",
      tag: "c-programming",
    },
  ],

  memory_states: [
    {
      id: "6880857769416211282b7d20",
      step: "Initialization",

      variables: [
        {
          id: "6880857769416211282b7d1f",
          name: "age",
          value: "Uninitialized",
          type: "int",
        },
      ],
    },

    {
      id: "6880857769416211282b7d22",
      step: "After Input",

      variables: [
        {
          id: "6880857769416211282b7d21",
          name: "age",
          value: "25",
          type: "int",
        },
      ],
    },

    {
      id: "6880857769416211282b7d24",
      step: "After Condition",

      variables: [
        {
          id: "6880857769416211282b7d23",
          name: "age",
          value: "25",
          type: "int",
        },
      ],
    },
  ],

  execution_steps: [
    {
      id: "6880857769416211282b7d25",
      step: 1,
      line: "int main() {",
      description: "The program starts execution.",
      output: "",
    },

    {
      id: "6880857769416211282b7d26",
      step: 2,
      line: "int age;",
      description: "An integer variable `age` is declared.",
      output: "",
    },

    {
      id: "6880857769416211282b7d27",
      step: 3,
      line: 'printf("Enter your age: ");',
      description: "The program prompts the user to enter their age.",
      output: "Enter your age: ",
    },

    {
      id: "6880857769416211282b7d28",
      step: 4,
      line: 'scanf("%d", &age);',
      description: "The program reads the age entered by the user.",
      output: "User enters 25",
    },

    {
      id: "6880857769416211282b7d29",
      step: 5,
      line: "if (age >= 18) {",
      description:
        "The program checks if the age is greater than or equal to 18.",
      output: "",
    },

    {
      id: "6880857769416211282b7d2a",
      step: 6,
      line: "age >= 18",
      description:
        "Since 25 is greater than or equal to 18, the condition is true.",
      output: "True",
    },

    {
      id: "6880857769416211282b7d2b",
      step: 7,
      line: 'printf("You are eligible to vote.\\n");',
      description: 'The program prints "You are eligible to vote."',
      output: "You are eligible to vote.",
    },

    {
      id: "6880857769416211282b7d2c",
      step: 8,
      line: "return 0;",
      description: "The program finishes execution.",
      output: "",
    },
  ],

  concepts: [
    {
      id: "6880857769416211282b7d2d",
      name: "Conditional Statements",
      description:
        "Conditional statements allow a program to execute different code blocks based on whether a condition is true or false.",
      visual_metaphor:
        "A fork in the road, where the program takes different paths based on a condition.",
    },

    {
      id: "6880857769416211282b7d2e",
      name: "Input/Output",
      description:
        "Input/Output operations allow a program to interact with the user by receiving input and displaying output.",
      visual_metaphor:
        "A two-way radio, where the program can send messages (output) and receive messages (input).",
    },
  ],
  difficultyLevel: 1,

  programmingLanguage: {
    id: 3,
    title: "C Programming",
    index: 1,
    slug: "c-programming",
    logo: null,
  },

  tutorial: {
    id: 51,
    title: "What is C",
    index: 1,
    slug: "what-is-c",

    programmingLanguage: {
      id: 3,
      title: "C Programming",
      index: 1,
      slug: "c-programming",
      logo: null,
    },
    content:
      '<div class="content-container">\n <p>\n C is a general-purpose programming language created by <strong>Dennis Ritchie</strong> at the Bell Laboratories in 1972.\n </p>\n <p>\n It is a very popular language, despite being old. The main reason for its popularity is because it is a <strong>fundamental language</strong> in the field of computer science.\n </p>\n <p>\n C is strongly associated with <strong>UNIX</strong>, as it was developed to write the UNIX operating system.\n </p>\n\n <h2>Why Learn C?</h2>\n <ul>\n <li>It is one of the most popular programming languages in the world</li>\n <li>If you know C, you will have no problem learning other popular programming languages such as Java, Python, C++, C#, etc., as the syntax is similar</li>\n <li>C is very fast, compared to other programming languages, like Java and Python</li>\n <li>C is very versatile; it can be used in both applications and technologies</li>\n </ul>\n\n <h2>Difference between C and C++</h2>\n <ul>\n <li>C++ was developed as an extension of C, and both languages have almost the same syntax</li>\n <li>The main difference between C and C++ is that <strong>C++ supports classes and objects</strong>, while C does not</li>\n </ul>\n</div>\n',
    isLocked: null,
    updatedAt: "2025-07-04T06:36:04.694Z",
    createdAt: "2025-07-04T06:36:04.693Z",
  },
  isLocked: true,
  updatedAt: "2025-07-23T06:47:20.479Z",
  createdAt: "2025-07-23T06:47:19.397Z",
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { langSlug, tutSlug, exerciseSlug } = await params

  // In real implementation, you would fetch the exercise data here
  // const exercise = await getExerciseBySlug(exerciseSlug, tutorialId)
  // const language = await getLanguageBySlug(langSlug)
  // const tutorial = await getTutorialBySlug(tutSlug, languageId)

  // For now, using mock data
  const exercise = mockExerciseData
  const language = mockExerciseData.programmingLanguage
  const tutorial = mockExerciseData.tutorial

  if (!exercise) {
    // In real implementation, this would be notFound()
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">Exercise Not Found</h1>
          <p className="mt-2 text-slate-400">
            The requested exercise could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ExerciseLayout
      exercise={exercise}
      language={language}
      tutorial={tutorial}
      params={{ langSlug, tutSlug, exerciseSlug }}
    />
  )
}

// Fixed metadata function
export async function generateMetadata({ params }: ExercisePageProps) {
  const { langSlug, tutSlug, exerciseSlug } = await params

  // In real implementation, you would fetch the actual data:
  // const exercise = await getExerciseBySlug(exerciseSlug, tutorialId)
  // const language = await getLanguageBySlug(langSlug)

  // For now, using the mock data but making it dynamic based on params
  return {
    title: `${mockExerciseData.title_en} - ${mockExerciseData.programmingLanguage.title} Exercise`,
    description: `Practice ${mockExerciseData.programmingLanguage.title} programming with this hands-on exercise. Learn ${mockExerciseData.tags.map((t) => t.tag).join(", ")}.`,
    keywords: `${mockExerciseData.programmingLanguage.title}, programming, exercise, ${mockExerciseData.tags.map((t) => t.tag).join(", ")}, ${langSlug}, ${tutSlug}, ${exerciseSlug}`,
    openGraph: {
      title: `${mockExerciseData.title_en}`,
      description: `Practice ${mockExerciseData.programmingLanguage.title} programming with interactive exercises`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${mockExerciseData.title_en}`,
      description: `Practice ${mockExerciseData.programmingLanguage.title} programming with interactive exercises`,
    },
  }
}
