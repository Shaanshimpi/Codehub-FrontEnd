export default function CNotes() {
  const tutorials = {
    docs: [
      {
        id: 51,
        title: "What is C",
        slug: "what-is-c",
        description: null,
        content:
          '\u003Cdiv class="content-container"\u003E\n  \u003Cp\u003E\n    C is a general-purpose programming language created by \u003Cstrong\u003EDennis Ritchie\u003C/strong\u003E at the Bell Laboratories in 1972.\n  \u003C/p\u003E\n  \u003Cp\u003E\n    It is a very popular language, despite being old. The main reason for its popularity is because it is a \u003Cstrong\u003Efundamental language\u003C/strong\u003E in the field of computer science.\n  \u003C/p\u003E\n  \u003Cp\u003E\n    C is strongly associated with \u003Cstrong\u003EUNIX\u003C/strong\u003E, as it was developed to write the UNIX operating system.\n  \u003C/p\u003E\n\n  \u003Ch2\u003EWhy Learn C?\u003C/h2\u003E\n  \u003Cul\u003E\n    \u003Cli\u003EIt is one of the most popular programming languages in the world\u003C/li\u003E\n    \u003Cli\u003EIf you know C, you will have no problem learning other popular programming languages such as Java, Python, C++, C#, etc., as the syntax is similar\u003C/li\u003E\n    \u003Cli\u003EC is very fast, compared to other programming languages, like Java and Python\u003C/li\u003E\n    \u003Cli\u003EC is very versatile; it can be used in both applications and technologies\u003C/li\u003E\n  \u003C/ul\u003E\n\n  \u003Ch2\u003EDifference between C and C++\u003C/h2\u003E\n  \u003Cul\u003E\n    \u003Cli\u003EC++ was developed as an extension of C, and both languages have almost the same syntax\u003C/li\u003E\n    \u003Cli\u003EThe main difference between C and C++ is that \u003Cstrong\u003EC++ supports classes and objects\u003C/strong\u003E, while C does not\u003C/li\u003E\n  \u003C/ul\u003E\n\u003C/div\u003E\n',
        videoUrl: null,
        index: 1,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:04.694Z",
        createdAt: "2025-07-04T06:36:04.693Z",
      },
      {
        id: 52,
        title: " C Syntax",
        slug: "-c-syntax",
        description: null,
        content:
          '\u003Cdiv class="content-container"\u003E\n \n\n  \u003Cdiv class="code-block"\u003E\n    \u003Cpre\u003E\n#include &lt;stdio.h&gt;\n\nint main() {\n  printf("Hello World!");\n  return 0;\n}\n    \u003C/pre\u003E\n  \u003C/div\u003E\n\n  \u003Ch3\u003EExample Explained\u003C/h3\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ELine 1:\u003C/strong\u003E \u003Ccode\u003E#include &lt;stdio.h&gt;\u003C/code\u003E is a header file library that lets us work with input and output functions, such as \u003Ccode\u003Eprintf()\u003C/code\u003E (used in line 4). Header files add functionality to C programs.\u003C/p\u003E\n  \n  \u003Cp\u003EDon\'t worry if you don\'t understand how \u003Ccode\u003E#include &lt;stdio.h&gt;\u003C/code\u003E works. Just think of it as something that (almost) always appears in your program.\u003C/p\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ELine 2:\u003C/strong\u003E A blank line. C ignores white space. But we use it to make the code more readable.\u003C/p\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ELine 3:\u003C/strong\u003E Another thing that always appears in a C program is \u003Ccode\u003Emain()\u003C/code\u003E. This is called a \u003Cstrong\u003Efunction\u003C/strong\u003E. Any code inside its curly brackets \u003Ccode\u003E{}\u003C/code\u003E will be executed.\u003C/p\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ELine 4:\u003C/strong\u003E \u003Ccode\u003Eprintf()\u003C/code\u003E is a function used to output/print text to the screen. In our example, it will output \u003Cstrong\u003E"Hello World!"\u003C/strong\u003E.\u003C/p\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ENote:\u003C/strong\u003E Every C statement ends with a \u003Cstrong\u003Esemicolon ;\u003C/strong\u003E\u003C/p\u003E\n\n  \u003Cdiv class="code-block"\u003E\n    \u003Cpre\u003E\nint main(){printf("Hello World!");return 0;}\n    \u003C/pre\u003E\n    \u003Cp\u003EThe body of \u003Ccode\u003Eint main()\u003C/code\u003E could also be written like this.\u003C/p\u003E\n  \u003C/div\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ERemember:\u003C/strong\u003E The compiler ignores white spaces. However, multiple lines make the code more readable.\u003C/p\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ELine 5:\u003C/strong\u003E \u003Ccode\u003Ereturn 0;\u003C/code\u003E ends the \u003Ccode\u003Emain()\u003C/code\u003E function.\u003C/p\u003E\n\n  \u003Cp\u003E\u003Cstrong\u003ELine 6:\u003C/strong\u003E Do not forget to add the closing curly bracket \u003Ccode\u003E}\u003C/code\u003E to actually end the main function.\u003C/p\u003E\n\u003C/div\u003E\n',
        videoUrl: null,
        index: 2,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:05.076Z",
        createdAt: "2025-07-04T06:36:05.057Z",
      },
      {
        id: 53,
        title: "Output (printf)",
        slug: "output-(printf)",
        description: null,
        content:
          '\u003Ch2 class="content-topic-title"\u003EC Output\u003C/h2\u003E\u003Ch3 class="content-topic-title"\u003EUnderstanding Output in C: `printf`, Multiple Lines, and `\\n`\u003C/h3\u003E\u003Cp\u003EDisplaying output is a fundamental aspect of any programming language. In C, this is primarily achieved using the `printf()` function. Understanding how to print text, combine multiple print statements, and control line breaks with characters like `\\n` is crucial for creating interactive and readable programs, debugging code, and communicating results to the user.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EUnderstanding the Concept\u003C/h3\u003E\u003Cp\u003EIn C, the standard way to send output to the console (your screen) is by using the `printf()` function, which stands for &quot;print formatted&quot;. This function is defined in the `stdio.h` (standard input/output) header file, so you must include this file at the beginning of your C programs. `printf()` can display simple text strings, values of variables, and formatted output. A string literal is a sequence of characters enclosed in double quotes, like &quot;Hello, World!&quot;. To control the layout, special characters called escape sequences are used. The most common is `\\n`, the newline character, which moves the output cursor to the beginning of the next line.\u003C/p\u003E\u003Cul\u003E\u003Cli\u003EThe `printf()` function is the primary tool for displaying output.\u003C/li\u003E\u003Cli\u003EYou must include the `&lt;stdio.h&gt;` header file to use `printf()`.\u003C/li\u003E\u003Cli\u003EText to be printed directly (string literals) must be enclosed in double quotes (`&quot;&quot;`).\u003C/li\u003E\u003Cli\u003EThe newline character `\\n` is an escape sequence used to start a new line in the output.\u003C/li\u003E\u003Cli\u003EWithout `\\n`, subsequent `printf()` calls will continue printing on the same line.\u003C/li\u003E\u003C/ul\u003E\u003Ch3 class="content-topic-title"\u003EGeneral Example\u003C/h3\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  // This line prints a message to the console\n  printf(&quot;Hello, C programming!\\n&quot;);\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This is a classic &quot;Hello, World!&quot; style C program. The `#include &lt;stdio.h&gt;` line includes the standard input/output library. Inside the `main` function, `printf(&quot;Hello, C programming!\\n&quot;);` prints the string &quot;Hello, C programming!&quot; followed by a newline character, which moves the cursor to the next line. The program then successfully exits with `return 0;`.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003EReal-World Use Cases\u003C/h3\u003E\u003Cp\u003EDisplaying output is essential in many real-world applications: \n- **User Interaction:** Providing prompts, messages, and feedback to users in console applications.\n- **Debugging:** Printing variable values or messages at different points in the code to understand program flow and identify errors.\n- **Reporting:** Generating simple text-based reports or summaries of operations.\n- **Logging:** Recording events, errors, or informational messages to a file or console for later analysis.\n- **Displaying Results:** Showing the outcome of calculations or data processing.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003ESpecific Examples\u003C/h3\u003E\u003Ch4 class="content-topic-title"\u003ESpecific Example 1: Printing &quot;Welcome to Codehub&quot;\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  printf(&quot;Welcome to Codehub\\n&quot;);\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This program demonstrates a single `printf()` statement. It prints the message &quot;Welcome to Codehub&quot; to the console. The `\\n` at the end of the string ensures that the cursor moves to the next line after the message is printed, making the terminal output cleaner if subsequent programs are run.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003ESpecific Example 2: Multiple Print Statements on a Single Line\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  printf(&quot;Welcome to Codehub. &quot;); // First part of the message\n  printf(&quot;We are learning C. &quot;); // Second part, continues on the same line\n  printf(&quot;Output is fun!\\n&quot;);  // Third part, ends with a newline\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This example shows how multiple `printf()` statements behave by default. The first two `printf()` calls do not end with `\\n`. As a result, their output (&quot;Welcome to Codehub. &quot; and &quot;We are learning C. &quot;) appears consecutively on the same line. The third `printf()` also prints on that same line but then adds a `\\n`, so any subsequent output would start on a new line. Notice the explicit spaces at the end of the first two strings to separate words.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003ESpecific Example 3: Using `\\n` for Multi-Line Output\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  printf(&quot;Welcome to Codehub\\n&quot;);\n  printf(&quot;This is the second line.\\n&quot;);\n  printf(&quot;And this is the third line.\\n&quot;);\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This program illustrates the use of the newline character `\\n` to format output across multiple lines. Each `printf()` statement includes `\\n` at the end of its string. This causes each message to be printed on a new, separate line, making the output more organized and readable.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003ECommon Mistakes\u003C/h3\u003E\u003Cp\u003EWhen working with output in C, beginners often make a few common mistakes:\n- **Forgetting `#include &lt;stdio.h&gt;`:** `printf()` is declared in this header. Missing it will cause a compilation error.\n- **Missing Semicolons:** Every C statement, including `printf()`, must end with a semicolon (`;`).\n- **Mismatched Quotes:** String literals must be enclosed in double quotes (`&quot;&quot;`). Using single quotes (`&#039;&#039;`) or forgetting one of the quotes will lead to errors.\n- **Forgetting `\\n`:** Expecting output to automatically go to a new line for each `printf()` call. Without `\\n`, output continues on the same line.\n- **Using Forward Slash instead of Backslash for `\\n`:** Writing `/n` instead of `\\n`. `/n` is just two characters, while `\\n` is the newline escape sequence.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EConclusion\u003C/h3\u003E\u003Cp\u003EYou&#039;ve now learned the basics of producing output in C using the `printf()` function. We covered how to print simple messages, how multiple `printf()` calls can print on the same or different lines, and the crucial role of the newline character `\\n` for formatting. Being able to control output is a fundamental skill for any C programmer. Keep practicing by writing small programs that display different types of messages and experiment with formatting to solidify your understanding.\u003C/p\u003E',
        videoUrl: null,
        index: 3,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:05.403Z",
        createdAt: "2025-07-04T06:36:05.402Z",
      },
      {
        id: 54,
        title: "Variables",
        slug: "variables",
        description: null,
        content:
          '\u003Ch2 class="content-topic-title"\u003EVariables\u003C/h2\u003E\u003Ch3 class="content-topic-title"\u003EUnderstanding Variables: Your Data Containers\u003C/h3\u003E\u003Cp\u003EVariables are a fundamental concept in programming. They act as named placeholders for storing data that your program can use and manipulate. Think of them as labeled containers where you can keep information. Understanding variables is crucial because they allow programs to be dynamic and process different data without rewriting the code. They are used everywhere, from storing a user&#039;s input to keeping track of a game score or managing complex calculations.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EUnderstanding the Concept\u003C/h3\u003E\u003Cp\u003EImagine your computer&#039;s memory as a vast warehouse full of storage boxes. Each box has a unique, complicated address (a memory address). It would be very hard to remember these numerical addresses every time you want to store or retrieve something. This is where variables come in. A variable is like putting a simple, human-readable label on one of these storage boxes (memory locations). So, instead of referring to memory address &#039;0x7ffc1234abcd&#039;, you can just use a label like &#039;userAge&#039;. When you create a variable, you&#039;re essentially telling the computer: &#039;Reserve a spot in memory for me, and I&#039;ll refer to it using this name.&#039; For this tutorial, we&#039;ll focus on variables that hold whole numbers, which we can specify using &#039;int&#039;. So, &#039;int userAge;&#039; means we&#039;re creating a container labeled &#039;userAge&#039; that&#039;s specifically designed to hold an integer (a whole number).\u003C/p\u003E\u003Cul\u003E\u003Cli\u003EVariables are named storage locations in memory.\u003C/li\u003E\u003Cli\u003EThey act as human-readable labels for complex memory addresses.\u003C/li\u003E\u003Cli\u003EThink of a variable as a container: it has a label (the variable name) and can hold a value (like an integer).\u003C/li\u003E\u003C/ul\u003E\u003Ch3 class="content-topic-title"\u003EGeneral Example\u003C/h3\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E// Step 1: Declare an integer variable named &#039;itemCount&#039;\nint itemCount;\n\n// Step 2: Assign a value to the variable &#039;itemCount&#039;\nitemCount = 10;\n\n// Step 3: Accessing the value (e.g., to print it)\n// print(itemCount); // This would output 10\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E 1. `int itemCount;`: This is called a declaration. We&#039;re telling the computer to set aside a memory location (our container) and label it `itemCount`. The `int` keyword specifies that this container is intended to store whole numbers.\n2. `itemCount = 10;`: This is called an assignment. We are placing the value `10` into the container labeled `itemCount`. Now, the memory location associated with `itemCount` holds the number 10.\n3. `// print(itemCount);`: This commented line shows how you might use the variable. If you were to print `itemCount`, the program would look up the memory location labeled `itemCount` and retrieve the value stored there, which is `10`.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003EReal-World Use Cases\u003C/h3\u003E\u003Cp\u003EVariables are indispensable in real-world programming. They are used to store quantities like the number of items in a shopping cart, a player&#039;s score in a game, the current year, a user&#039;s ID, or the number of attempts remaining in a login system. Any piece of information that might change or needs to be referenced by a name is typically stored in a variable. By using a label (the variable name) for a memory address, we make our code much easier to read, understand, and modify.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003ESpecific Examples\u003C/h3\u003E\u003Ch4 class="content-topic-title"\u003ETracking Available Books\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E// Declare an integer variable for the number of available books\nint availableBooks;\n\n// Initially, there are 50 books in stock\navailableBooks = 50;\n\n// A customer borrows 3 books\navailableBooks = availableBooks - 3;\n\n// print(availableBooks); // Output: 47\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E Here, `availableBooks` is our labeled container for an integer. First, we create this container (`int availableBooks;`). Then, we put the number `50` into it (`availableBooks = 50;`). When a customer borrows books, we update the value: we take the current value from the `availableBooks` container (which is 50, stored at its memory address), subtract 3, and then store the new result (47) back into the same `availableBooks` container. The label `availableBooks` always points to the same memory location, but the contents of that location can change.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003EPlayer&#039;s Score in a Game\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E// Declare an integer variable for player&#039;s score\nint playerScore;\n\n// Player starts with 0 points\nplayerScore = 0;\n\n// Player completes a level and gets 100 points\nplayerScore = playerScore + 100;\n\n// Player finds a bonus and gets 50 more points\nplayerScore = playerScore + 50;\n\n// print(playerScore); // Output: 150\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E The `playerScore` variable is a container labeled to hold the player&#039;s current score (an integer). It&#039;s initialized to `0`. Each time the player earns points, we retrieve the current value from the `playerScore` container (its memory address), add the new points, and store the updated total back into the `playerScore` container. The label `playerScore` makes it easy to refer to and update this specific piece of stored data in memory.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003ECounting User Clicks\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E// Declare an integer variable to count clicks\nint clickCount;\n\n// Initialize click count to zero\nclickCount = 0;\n\n// User clicks a button (simulated)\nclickCount = clickCount + 1; // clickCount is now 1\n\n// User clicks again\nclickCount = clickCount + 1; // clickCount is now 2\n\n// print(clickCount); // Output: 2\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E `clickCount` acts as our labeled container for tracking the number of times a user performs an action. We start with an empty count by putting `0` into the `clickCount` container. Each time a click occurs, we get the current value from the memory location labeled `clickCount`, add 1 to it, and then store this new value back into the `clickCount` container. The variable `clickCount` provides a convenient label for the memory address where this count is stored and updated.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003ECommon Mistakes\u003C/h3\u003E\u003Cp\u003E1. **Using a variable before declaration:** Trying to put something in a container or get something from a container that doesn&#039;t have a label yet (e.g., `myValue = 5;` before `int myValue;`). The computer won&#039;t know which memory address you&#039;re referring to.\n2. **Using a variable before initialization (assignment):** Declaring a variable (e.g., `int userAge;`) creates the labeled container, but it might contain random, leftover data from previous memory use. If you try to use `userAge` before putting a specific value into it, you might get unexpected results.\n3. **Case sensitivity:** Most programming languages treat `myVariable` and `myvariable` as two different labels for two different containers. Be consistent with your naming.\n4. **Choosing uninformative names:** Naming a variable `x` instead of `numberOfStudents` makes it harder to understand what kind of data its container (memory location) is holding.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EConclusion\u003C/h3\u003E\u003Cp\u003EVariables are essential building blocks in programming. They serve as named containers (labels for memory addresses) that hold data your program works with. By using `int` variables, we can store and manipulate whole numbers effectively. Understanding how to declare, assign, and use variables is a key step in learning to program. Remember the container analogy: variables are labeled boxes in memory, making it easy to store, retrieve, and update information. Practice using them, and they&#039;ll quickly become a natural part of your programming toolkit!\u003C/p\u003E',
        videoUrl: null,
        index: 4,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:05.735Z",
        createdAt: "2025-07-04T06:36:05.734Z",
      },
      {
        id: 55,
        title: "Variable rules",
        slug: "variable-rules",
        description: null,
        content:
          '\u003Cp\u003EThe general rules for naming variables are:\u003C/p\u003E\n\u003Cul\u003E\n  \u003Cli\u003E\u003Cstrong\u003ENames can contain\u003C/strong\u003E letters, digits and \u003Cspan class="keyword"\u003E_\u003C/span\u003E\u003C/li\u003E\n  \u003Cli\u003E\u003Cstrong\u003ENames must begin with\u003C/strong\u003E a letter or an underscore (\u003Cspan class="keyword"\u003E_\u003C/span\u003E)\u003C/li\u003E\n  \u003Cli\u003E\u003Cstrong\u003ENames are case-sensitive\u003C/strong\u003E (\u003Cspan class="keyword"\u003EmyVar\u003C/span\u003E and \u003Cspan class="keyword"\u003Emyvar\u003C/span\u003E are different variables)\u003C/li\u003E\n  \u003Cli\u003E\u003Cstrong\u003ENames cannot contain\u003C/strong\u003E whitespaces or special characters like \u003Cspan class="keyword"\u003E!\u003C/span\u003E, \u003Cspan class="keyword"\u003E#\u003C/span\u003E, \u003Cspan class="keyword"\u003E%\u003C/span\u003E, etc.\u003C/li\u003E\n  \u003Cli\u003E\u003Cstrong\u003EReserved words\u003C/strong\u003E (such as \u003Cspan class="keyword"\u003Eint\u003C/span\u003E) cannot be used as names\u003C/li\u003E\n\u003C/ul\u003E\n',
        videoUrl: null,
        index: 5,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:06.090Z",
        createdAt: "2025-07-04T06:36:06.083Z",
      },
      {
        id: 56,
        title: "Variable Output",
        slug: "variable-output",
        description: null,
        content:
          '\u003Cdiv class="content-container"\u003E \u003Cp\u003EIn programming, we often want to display values that can change — such as a score, age, number of items, etc. These changing values are stored in variables. In C, we use the \u003Cstrong\u003E\u003Ccode\u003Eprintf()\u003C/code\u003E\u003C/strong\u003E function to print values to the screen.\u003C/p\u003E \u003Cp\u003ETo print a number stored in a variable, we use something called a \u003Cstrong\u003Eplaceholder\u003C/strong\u003E.\u003C/p\u003E \u003Cp\u003ESince we are working with numbers (whole numbers only), we use \u003Cstrong\u003E\u003Ccode\u003E%d\u003C/code\u003E\u003C/strong\u003E as the placeholder. It tells \u003Ccode\u003Eprintf()\u003C/code\u003E: "I want to print a number here."\u003C/p\u003E \u003Cdiv class="code-block"\u003E \u003Cpre\u003E int myAge = 25; printf("I am %d years old.", myAge); \u003C/pre\u003E \u003Cp\u003EThis will output:\u003C/p\u003E \u003Cpre\u003EI am 25 years old.\u003C/pre\u003E \u003C/div\u003E \u003Cp\u003ESo what is happening here?\u003C/p\u003E \u003Cul\u003E \u003Cli\u003E\u003Ccode\u003EmyAge\u003C/code\u003E is a variable storing the number \u003Ccode\u003E25\u003C/code\u003E.\u003C/li\u003E \u003Cli\u003E\u003Ccode\u003E%d\u003C/code\u003E is the placeholder inside the string.\u003C/li\u003E \u003Cli\u003E\u003Ccode\u003Eprintf()\u003C/code\u003E replaces \u003Ccode\u003E%d\u003C/code\u003E with the value of \u003Ccode\u003EmyAge\u003C/code\u003E.\u003C/li\u003E \u003C/ul\u003E \u003Cp\u003EYou can also use more than one \u003Ccode\u003E%d\u003C/code\u003E if you want to print multiple numbers:\u003C/p\u003E \u003Cdiv class="code-block"\u003E \u003Cpre\u003E int a = 10; int b = 20; printf("a = %d and b = %d", a, b); \u003C/pre\u003E \u003Cp\u003EThis will output:\u003C/p\u003E \u003Cpre\u003Ea = 10 and b = 20\u003C/pre\u003E \u003C/div\u003E \u003Cp\u003EJust remember: use \u003Ccode\u003E%d\u003C/code\u003E every time you want to print a number from a variable. Later, when we learn other types like \u003Ccode\u003Efloat\u003C/code\u003E or \u003Ccode\u003Echar\u003C/code\u003E, we’ll use different placeholders — but for now, \u003Cstrong\u003E\u003Ccode\u003E%d\u003C/code\u003E is your go-to tool\u003C/strong\u003E for printing numbers.\u003C/p\u003E \u003C/div\u003E',
        videoUrl: null,
        index: 6,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:06.428Z",
        createdAt: "2025-07-04T06:36:06.427Z",
      },
      {
        id: 57,
        title: "Data Types",
        slug: "data-types",
        description: null,
        content:
          '\u003Ch3 class="content-topic-title"\u003EData Types in C\u003C/h3\u003E\n\u003Cp\u003EIn C programming, data types are used to define the type of data a variable can hold. Choosing the correct data type is essential to optimize memory and maintain accuracy in your programs.\u003C/p\u003E\n\n\u003Ch4 class="content-topic-title"\u003EFundamental (Primary) Data Types\u003C/h4\u003E\n\u003Cp\u003EC provides three primary data types:\u003C/p\u003E\n\n\u003Cul\u003E\n  \u003Cli\u003E\u003Cstrong\u003Eint\u003C/strong\u003E: Stores integers (whole numbers)\u003C/li\u003E\n  \u003Cli\u003E\u003Cstrong\u003Efloat\u003C/strong\u003E: Stores decimal (floating-point) numbers\u003C/li\u003E\n  \u003Cli\u003E\u003Cstrong\u003Echar\u003C/strong\u003E: Stores a single character\u003C/li\u003E\n\u003C/ul\u003E\n\n\u003Ch4 class="content-topic-subtitle"\u003EExample\u003C/h4\u003E\n\u003Cdiv class="code-block"\u003E\n\u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n    int age = 15;\n    float weight = 48.5;\n    char grade = \'A\';\n\n    printf("Age: %d\\n", age);\n    printf("Weight: %.2f\\n", weight);\n    printf("Grade: %c\\n", grade);\n\n    return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n\u003C/div\u003E\n\u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This program demonstrates storing an integer, a float, and a character using the fundamental data types.\u003C/p\u003E\n\n\u003Ch4 class="content-topic-title"\u003EData Type Summary Table\u003C/h4\u003E\n\u003Ctable border="1" cellpadding="8" cellspacing="0"\u003E\n  \u003Cthead\u003E\n    \u003Ctr\u003E\n      \u003Cth\u003EData Type\u003C/th\u003E\n      \u003Cth\u003ESize (Bytes)\u003C/th\u003E\n      \u003Cth\u003ERange (Approx.)\u003C/th\u003E\n      \u003Cth\u003EFormat Specifier\u003C/th\u003E\n    \u003C/tr\u003E\n  \u003C/thead\u003E\n  \u003Ctbody\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Eint\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E4\u003C/td\u003E\n      \u003Ctd\u003E-2,147,483,648 to 2,147,483,647\u003C/td\u003E\n      \u003Ctd\u003E\u003Ccode\u003E%d\u003C/code\u003E\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Efloat\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E4\u003C/td\u003E\n      \u003Ctd\u003E±3.4e±38 (6 decimal digits)\u003C/td\u003E\n      \u003Ctd\u003E\u003Ccode\u003E%f\u003C/code\u003E\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Echar\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E1\u003C/td\u003E\n      \u003Ctd\u003E-128 to 127 or 0 to 255\u003C/td\u003E\n      \u003Ctd\u003E\u003Ccode\u003E%c\u003C/code\u003E\u003C/td\u003E\n    \u003C/tr\u003E\n  \u003C/tbody\u003E\n\u003C/table\u003E\n\n\u003Ch3 class="content-topic-title"\u003EDerived Data Types (Modifiers)\u003C/h3\u003E\n\u003Cp\u003EC provides variations of basic types using modifiers such as \u003Ccode\u003Eshort\u003C/code\u003E, \u003Ccode\u003Elong\u003C/code\u003E, \u003Ccode\u003Esigned\u003C/code\u003E, and \u003Ccode\u003Eunsigned\u003C/code\u003E. These allow better control over memory usage and range of values.\u003C/p\u003E\n\n\u003Ch4 class="content-topic-title"\u003EModified \u003Ccode\u003Eint\u003C/code\u003E Types\u003C/h4\u003E\n\u003Ctable border="1" cellpadding="8" cellspacing="0"\u003E\n  \u003Cthead\u003E\n    \u003Ctr\u003E\n      \u003Cth\u003EType\u003C/th\u003E\n      \u003Cth\u003ESize (Bytes)\u003C/th\u003E\n      \u003Cth\u003ERange\u003C/th\u003E\n      \u003Cth\u003EUsage\u003C/th\u003E\n    \u003C/tr\u003E\n  \u003C/thead\u003E\n  \u003Ctbody\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Eshort int\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E2\u003C/td\u003E\n      \u003Ctd\u003E-32,768 to 32,767\u003C/td\u003E\n      \u003Ctd\u003EUse for small-range integers\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Eunsigned short int\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E2\u003C/td\u003E\n      \u003Ctd\u003E0 to 65,535\u003C/td\u003E\n      \u003Ctd\u003ENo negatives, larger positive range\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Elong int\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E4 or 8\u003C/td\u003E\n      \u003Ctd\u003E–9,223,372,036,854,775,808 to 9,223,372,036,854,775,807\u003C/td\u003E\n      \u003Ctd\u003EUse for large-range integers\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Eunsigned int\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E4\u003C/td\u003E\n      \u003Ctd\u003E0 to 4,294,967,295\u003C/td\u003E\n      \u003Ctd\u003EOnly positive integers\u003C/td\u003E\n    \u003C/tr\u003E\n  \u003C/tbody\u003E\n\u003C/table\u003E\n\n\u003Ch4 class="content-topic-title"\u003EModified \u003Ccode\u003Efloat\u003C/code\u003E Types\u003C/h4\u003E\n\u003Ctable border="1" cellpadding="8" cellspacing="0"\u003E\n  \u003Cthead\u003E\n    \u003Ctr\u003E\n      \u003Cth\u003EType\u003C/th\u003E\n      \u003Cth\u003ESize (Bytes)\u003C/th\u003E\n      \u003Cth\u003EPrecision\u003C/th\u003E\n      \u003Cth\u003EUsage\u003C/th\u003E\n    \u003C/tr\u003E\n  \u003C/thead\u003E\n  \u003Ctbody\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Efloat\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E4\u003C/td\u003E\n      \u003Ctd\u003E6 digits\u003C/td\u003E\n      \u003Ctd\u003EStandard decimal numbers\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Edouble\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E8\u003C/td\u003E\n      \u003Ctd\u003E15 digits\u003C/td\u003E\n      \u003Ctd\u003EHigh-precision decimals\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Elong double\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E12 or 16\u003C/td\u003E\n      \u003Ctd\u003EMore than 15 digits\u003C/td\u003E\n      \u003Ctd\u003EVery high-precision decimals\u003C/td\u003E\n    \u003C/tr\u003E\n  \u003C/tbody\u003E\n\u003C/table\u003E\n\n\u003Ch4 class="content-topic-title"\u003EModified \u003Ccode\u003Echar\u003C/code\u003E Types\u003C/h4\u003E\n\u003Ctable border="1" cellpadding="8" cellspacing="0"\u003E\n  \u003Cthead\u003E\n    \u003Ctr\u003E\n      \u003Cth\u003EType\u003C/th\u003E\n      \u003Cth\u003ESize\u003C/th\u003E\n      \u003Cth\u003ERange\u003C/th\u003E\n      \u003Cth\u003EUsage\u003C/th\u003E\n    \u003C/tr\u003E\n  \u003C/thead\u003E\n  \u003Ctbody\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Esigned char\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E1\u003C/td\u003E\n      \u003Ctd\u003E-128 to 127\u003C/td\u003E\n      \u003Ctd\u003EDefault char type with negatives\u003C/td\u003E\n    \u003C/tr\u003E\n    \u003Ctr\u003E\n      \u003Ctd\u003E\u003Ccode\u003Eunsigned char\u003C/code\u003E\u003C/td\u003E\n      \u003Ctd\u003E1\u003C/td\u003E\n      \u003Ctd\u003E0 to 255\u003C/td\u003E\n      \u003Ctd\u003EFor raw data or bytes\u003C/td\u003E\n    \u003C/tr\u003E\n  \u003C/tbody\u003E\n\u003C/table\u003E\n\n\u003Ch4 class="content-topic-title"\u003EConclusion\u003C/h4\u003E\n\u003Cp\u003EUnderstanding C\'s data types is crucial for memory efficiency and program correctness. Use modifiers to fine-tune the behavior of your variables depending on whether you need small numbers, large numbers, only positives, or higher precision.\u003C/p\u003E\n',
        videoUrl: null,
        index: 7,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:06.765Z",
        createdAt: "2025-07-04T06:36:06.762Z",
      },
      {
        id: 58,
        title: "Format specifier",
        slug: "format-specifier",
        description: null,
        content:
          '\u003Ch2 class="content-topic-title"\u003EPrinting formatted output using placeholder\u003C/h2\u003E\u003Ch3 class="content-topic-title"\u003EFormat Specifiers\u003C/h3\u003E\u003Cp\u003EFormat specifiers are special characters used in C programming to control the formatting of output. They tell the `printf()` function how to interpret and display data. Mastering format specifiers is essential for producing readable and well-formatted output in your programs. These specifiers allow you to print integers, floating-point numbers, characters, and strings with specific precision, width, and alignment.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EUnderstanding the Concept\u003C/h3\u003E\u003Cp\u003EIn C, the `printf()` function is your primary tool for displaying output. To print variables with specific formatting, you use format specifiers within the `printf()` statement&#039;s string argument. Each format specifier begins with a percent sign (`%`) followed by a character that indicates the data type to be printed. For example, `%d` is used for integers, `%f` for floating-point numbers, `%c` for characters, and `%s` for strings.\u003C/p\u003E\u003Cul\u003E\u003Cli\u003EFormat specifiers always start with a `%` sign.\u003C/li\u003E\u003Cli\u003EThe character following the `%` sign determines the data type to be printed.\u003C/li\u003E\u003Cli\u003EYou can add optional modifiers to control width, precision, and alignment.\u003C/li\u003E\u003C/ul\u003E\u003Ch3 class="content-topic-title"\u003EGeneral Example\u003C/h3\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  int age = 30;\n  float height = 5.9;\n  char initial = &#039;J&#039;;\n\n  printf(&quot;Age: %d, Height: %.1f, Initial: %c\\n&quot;, age, height, initial);\n\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This program demonstrates the basic usage of format specifiers.  `%d` is used to print the integer `age`, `%.1f` is used to print the float `height` with one decimal place, and `%c` is used to print the character `initial`. The output will be &#039;Age: 30, Height: 5.9, Initial: J&#039;.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003EReal-World Use Cases\u003C/h3\u003E\u003Cp\u003EFormat specifiers are used extensively in various programming scenarios. They are crucial for displaying data in a user-friendly format, generating reports, debugging code and creating logs. Properly formatted output is essential for readability and understanding the program&#039;s behavior.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003ESpecific Examples\u003C/h3\u003E\u003Ch4 class="content-topic-title"\u003EPrinting an Integer\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  int number = 123;\n  printf(&quot;The number is: %d\\n&quot;, number);\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This example shows how to print an integer variable using the `%d` format specifier. The output will be &#039;The number is: 123&#039;.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003EPrinting a Floating-Point Number\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  float pi = 3.14159;\n  printf(&quot;The value of pi is: %.2f\\n&quot;, pi);\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This example demonstrates how to print a floating-point number with a specific number of decimal places using `%.2f`. The `.2` specifies that only two decimal places should be displayed. The output will be &#039;The value of pi is: 3.14&#039;.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003EPrinting a Character\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  char letter = &#039;A&#039;;\n  printf(&quot;The letter is: %c\\n&quot;, letter);\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This example demonstrates how to print a character variable using the `%c` format specifier. The output will be &#039;The letter is: A&#039;.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003ECommon Mistakes\u003C/h3\u003E\u003Cp\u003EA common mistake is using the wrong format specifier for a particular data type. For instance, using `%d` to print a float or `%f` to print an integer. This can lead to unexpected output or even program crashes. Another mistake is forgetting to include the correct number of arguments for the provided format specifiers, resulting in undefined behavior.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EConclusion\u003C/h3\u003E\u003Cp\u003EFormat specifiers are fundamental to controlling output in C programming. By understanding and using them correctly, you can create programs that display data in a clear and understandable manner. Experiment with different format specifiers and modifiers to master their use and improve the readability of your programs. Continued practice will reinforce your understanding and enable you to create polished and professional-looking output.\u003C/p\u003E',
        videoUrl: null,
        index: 8,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:07.079Z",
        createdAt: "2025-07-04T06:36:07.078Z",
      },
      {
        id: 59,
        title: "User Input (scanf)",
        slug: "user-input-(scanf)",
        description: null,
        content:
          '\u003Ch3 class="content-topic-title"\u003ETaking Input from the User in C\u003C/h3\u003E\n\n\u003Ch3 class="content-topic-title"\u003EUsing `scanf()`\u003C/h3\u003E\n\u003Cp\u003ESo far, we have used `printf()` to display values on the screen. But how do we let users input values into our program? This is where `scanf()` comes in. It allows your program to pause and wait for the user to type something, which it then reads and stores in a variable.\u003C/p\u003E\n\n\u003Ch3 class="content-topic-title"\u003EGetting Input Without a Prompt\u003C/h3\u003E\n\u003Cp\u003EIn this first example, we ask the user to enter a number, but we do not give any prompt. The program simply stops and waits for input.\u003C/p\u003E\n\n\u003Cdiv class="code-block"\u003E\n  \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nvoid main() {\n    int myNum;\n    scanf("%d", &amp;myNum);\n    printf("You entered: %d", myNum);\n}\u003C/code\u003E\u003C/pre\u003E\n  \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E When the program reaches the `scanf()` line, it pauses and waits for the user to enter a number. The `&amp;myNum` means the input value will be stored in the variable `myNum`. Once the user types a number and presses Enter, the value is printed using `printf()`.\u003C/p\u003E\n\u003C/div\u003E\n\n\u003Ch3 class="content-topic-title"\u003EGetting Input With a Prompt\u003C/h3\u003E\n\u003Cp\u003EThis version is better for user experience. We tell the user what to enter before pausing for input.\u003C/p\u003E\n\n\u003Cdiv class="code-block"\u003E\n  \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nvoid main() {\n    int age;\n    printf("Enter your age: ");\n    scanf("%d", &amp;age);\n    printf("You are %d years old.", age);\n}\u003C/code\u003E\u003C/pre\u003E\n  \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E The message "Enter your age:" is displayed using `printf()`. Then, `scanf()` waits for user input and stores the value in the `age` variable.\u003C/p\u003E\n\u003C/div\u003E\n\n\u003Ch3 class="content-topic-title"\u003EInput for All Basic Data Types\u003C/h3\u003E\n\u003Cp\u003EYou can also take input for different types of data like `int`, `float`, `double`, and `char`. Here\'s an example:\u003C/p\u003E\n\n\u003Cdiv class="code-block"\u003E\n  \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nvoid main() {\n    int num;\n    float fnum;\n    double dnum;\n    char letter;\n\n    printf("Enter an integer: ");\n    scanf("%d", &amp;num);\n\n    printf("Enter a float: ");\n    scanf("%f", &amp;fnum);\n\n    printf("Enter a double: ");\n    scanf("%lf", &amp;dnum);\n\n    printf("Enter a character: ");\n    scanf(" %c", &amp;letter);  // Note the space before %c\n\n    printf("You entered: %d, %.2f, %.5lf, %c", num, fnum, dnum, letter);\n}\u003C/code\u003E\u003C/pre\u003E\n  \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E This example shows how to read multiple types of values. The space before `%c` in `scanf(" %c", &amp;letter);` is important — it helps avoid capturing leftover newline characters from previous input. Without the space, the character might not be read correctly.\u003C/p\u003E\n\u003C/div\u003E\n\n\u003Ch3 class="content-topic-title"\u003EFormat Specifiers in `scanf()` and `printf()`\u003C/h3\u003E\n\u003Cul\u003E\n  \u003Cli\u003E\u003Ccode\u003E%d\u003C/code\u003E — for \u003Ccode\u003Eint\u003C/code\u003E\u003C/li\u003E\n  \u003Cli\u003E\u003Ccode\u003E%f\u003C/code\u003E — for \u003Ccode\u003Efloat\u003C/code\u003E\u003C/li\u003E\n  \u003Cli\u003E\u003Ccode\u003E%lf\u003C/code\u003E — for \u003Ccode\u003Edouble\u003C/code\u003E\u003C/li\u003E\n  \u003Cli\u003E\u003Ccode\u003E%c\u003C/code\u003E — for \u003Ccode\u003Echar\u003C/code\u003E\u003C/li\u003E\n\u003C/ul\u003E\n\u003Cp\u003EThese specifiers are used in both `scanf()` for input and `printf()` for output. As you continue learning, you\'ll explore more advanced input techniques including strings and formatted input validation. For now, this foundation is enough to begin making dynamic, interactive programs.\u003C/p\u003E\n',
        videoUrl: null,
        index: 9,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:07.418Z",
        createdAt: "2025-07-04T06:36:07.417Z",
      },
      {
        id: 60,
        title: "Const Variable",
        slug: "const-variable",
        description: null,
        content:
          '\u003Ch2 class="content-topic-title"\u003EConstant Variables\u003C/h2\u003E\u003Ch3 class="content-topic-title"\u003EUsing `const` for Unchangeable Variables in C\u003C/h3\u003E\u003Cp\u003EIf you don&#039;t want others (or yourself) to change existing variable values after they are set, you can use the `const` keyword in C. This will declare the variable as &quot;constant&quot;, which means its value becomes unchangeable and read-only once initialized. Using `const` is important for writing safer, more reliable code by clearly defining values that should not be altered during program execution.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EUnderstanding the Concept\u003C/h3\u003E\u003Cp\u003EThe `const` keyword is a qualifier that you can add to a variable declaration. When a variable is declared as `const`, you must assign it a value at the time of its declaration. After this initialization, the C compiler will prevent any attempts to modify this value later in your code. This is a powerful feature for defining fixed values like mathematical constants (e.g., PI) or configuration parameters (e.g., maximum attempts) that you want to protect from accidental changes.\u003C/p\u003E\u003Cul\u003E\u003Cli\u003EA `const` variable must be initialized when it is declared.\u003C/li\u003E\u003Cli\u003EOnce initialized, the value of a `const` variable cannot be changed. Any attempt to do so will result in a compile-time error.\u003C/li\u003E\u003Cli\u003EUsing `const` improves code readability by signaling that a value is fixed, and it helps prevent bugs related to unintended variable modifications.\u003C/li\u003E\u003C/ul\u003E\u003Ch3 class="content-topic-title"\u003EGeneral Example\u003C/h3\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  const int MY_AGE = 30;\n  const float PI = 3.14159;\n  const char FAVORITE_LETTER = &#039;C&#039;;\n\n  printf(&quot;My age (which won&#039;t change in this program) is: %d\\n&quot;, MY_AGE);\n  printf(&quot;The value of PI is: %f\\n&quot;, PI);\n  printf(&quot;My favorite letter for programming is: %c\\n&quot;, FAVORITE_LETTER);\n\n  // The following line, if uncommented, would cause a compile-time error:\n  // MY_AGE = 31; \n  // printf(&quot;Trying to change age: %d\\n&quot;, MY_AGE);\n\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E In this example, `MY_AGE`, `PI`, and `FAVORITE_LETTER` are declared as constant variables. They are initialized with values that cannot be altered later. If you try to uncomment the line `MY_AGE = 31;` and compile the program, the compiler will issue an error because you&#039;re attempting to modify a `const` variable.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003EReal-World Use Cases\u003C/h3\u003E\u003Cp\u003E`const` variables are very useful in many real-world programming scenarios. For example, you might use them to define: \n- Mathematical constants like Pi or Euler&#039;s number.\n- Physical constants like the speed of light.\n- Configuration settings that should not change during program execution, such as the maximum number of connections, a fixed port number, or a version number.\n- Game parameters like maximum player lives, points needed for a power-up, or board dimensions.\nUsing `const` makes the intent clear that these values are fixed and protects them from accidental modification, leading to more robust and maintainable code.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003ESpecific Examples\u003C/h3\u003E\u003Ch4 class="content-topic-title"\u003ESpecific Example 1: Calculating Circle Area\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  const float PI_CONSTANT = 3.14159;\n  float radius = 5.0;\n  float area;\n\n  // Calculate the area using the constant PI\n  area = PI_CONSTANT * radius * radius;\n\n  printf(&quot;Radius of the circle: %f\\n&quot;, radius);\n  printf(&quot;Area of the circle: %f\\n&quot;, area);\n\n  // Attempting to change PI_CONSTANT would be an error:\n  // PI_CONSTANT = 3.14; // This line would cause a compile error.\n\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E Here, `PI_CONSTANT` is declared as a `const float`. It&#039;s used in the calculation for the area of a circle. Since Pi is a mathematical constant, its value should never change. Declaring it as `const` ensures this.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003ESpecific Example 2: Maximum Login Attempts\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  const int MAX_LOGIN_ATTEMPTS = 3;\n  int currentAttempts = 0;\n\n  printf(&quot;You have a maximum of %d login attempts.\\n&quot;, MAX_LOGIN_ATTEMPTS);\n\n  // Simulate login process (simplified)\n  while (currentAttempts &lt; MAX_LOGIN_ATTEMPTS) {\n    printf(&quot;Login attempt #%d...\\n&quot;, currentAttempts + 1);\n    // In a real app, actual login logic would be here\n    currentAttempts++;\n  }\n\n  printf(&quot;Maximum login attempts reached.\\n&quot;);\n\n  // MAX_LOGIN_ATTEMPTS = 4; // This would be a compile error.\n\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E In this scenario, `MAX_LOGIN_ATTEMPTS` is a configuration value defining how many times a user can try to log in. It&#039;s a rule that shouldn&#039;t change while the program is running, so `const` is appropriate to enforce this.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch4 class="content-topic-title"\u003ESpecific Example 3: Days in a Week\u003C/h4\u003E\u003Cdiv class="code-block"\u003E\n          \u003Cpre\u003E\u003Ccode\u003E#include &lt;stdio.h&gt;\n\nint main() {\n  const int DAYS_IN_A_WEEK = 7;\n  int numberOfWeeks = 4;\n  int totalDays;\n\n  totalDays = numberOfWeeks * DAYS_IN_A_WEEK;\n\n  printf(&quot;There are %d days in %d weeks.\\n&quot;, totalDays, numberOfWeeks);\n\n  // DAYS_IN_A_WEEK = 8; // Error! The number of days in a week is constant.\n  return 0;\n}\u003C/code\u003E\u003C/pre\u003E\n          \u003Cp\u003E\u003Cstrong\u003EExplanation:\u003C/strong\u003E The number of days in a week is a universally fixed value. Using `const int DAYS_IN_A_WEEK = 7;` makes the code clear and prevents any part of the program from accidentally trying to redefine this fundamental fact.\u003C/p\u003E\n        \u003C/div\u003E\u003Ch3 class="content-topic-title"\u003ECommon Mistakes\u003C/h3\u003E\u003Cp\u003EWhen learning to use `const`, beginners might encounter a few common issues:\n1. **Forgetting to initialize:** A `const` variable *must* be given a value when it&#039;s declared. For example, `const int myValue;` followed by `myValue = 10;` on a later line is incorrect. It should be `const int myValue = 10;`.\n2. **Trying to reassign a value:** The whole point of `const` is to make a variable unchangeable. Code like `const int TAX_RATE = 5; TAX_RATE = 6;` will cause a compile-time error.\n3. **Minor Confusion with `#define`:**  Sometimes, learners might see `#define PI 3.14159` used for constants. While `#define` is a preprocessor directive that substitutes text, `const` variables are actual variables with types and scope, which the compiler understands. For simple unchangeable values, `const` variables are generally preferred in modern C for better type-safety and easier debugging.\u003C/p\u003E\u003Ch3 class="content-topic-title"\u003EConclusion\u003C/h3\u003E\u003Cp\u003EYou&#039;ve now learned about the `const` keyword in C and how it helps you create variables whose values cannot be changed after initialization. This makes your programs more robust, easier to read, and safer by preventing accidental modifications to important data. As you continue your C programming journey, make it a habit to use `const` for any variable whose value is meant to remain fixed. Practice by identifying values in your programs that should be constant and apply the `const` qualifier to them!\u003C/p\u003E',
        videoUrl: null,
        index: 10,
        learningObjectives: [],
        keyTopics: [],
        difficulty: "1",
        practicalApplications: [],
        tags: [],
        programmingLanguage: {
          id: 3,
          title: "C Programming",
          index: 1,
          slug: "c-programming",
          logo: null,
          tutorials: {
            docs: [84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
            hasNextPage: true,
          },
        },
        isLocked: null,
        lessons: [],
        reference: {
          title: null,
          subtitle: null,
          introduction: null,
          examples: [],
          key_points: [],
          common_mistakes: [],
          syntax_guide: {
            basic_syntax: null,
            parameters: [],
          },
        },
        tutorialData: null,
        updatedAt: "2025-07-04T06:36:07.944Z",
        createdAt: "2025-07-04T06:36:07.943Z",
      },
    ],
    hasNextPage: true,
    hasPrevPage: false,
    limit: 10,
    nextPage: 2,
    page: 1,
    pagingCounter: 1,
    prevPage: null,
    totalDocs: 34,
    totalPages: 4,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          C Programming Notes
        </h1>
        <p className="mb-8 text-gray-600">
          Temporary notes page for C programming tutorials
        </p>

        <div className="space-y-6">
          {tutorials.docs.map((tutorial) => (
            <div
              key={tutorial.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {tutorial.title}
              </h2>
              <div className="mb-4 text-sm text-gray-500">
                <span>Index: {tutorial.index}</span>
                <span className="mx-2">•</span>
                <span>Difficulty: {tutorial.difficulty}</span>
                <span className="mx-2">•</span>
                <span>
                  Updated: {new Date(tutorial.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: tutorial.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
