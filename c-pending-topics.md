## Pending C Topics – Tutorial Planning (Language: C)

### Meta

- **Target language**: `c`
- **Audience**: Absolute beginners to lower–intermediate
- **Goal**: Step–by–step, concept–first tutorials with lots of small code examples and practice
- **Exclusions**: Each topic has an **Exclusions** subsection. When prompting an AI to generate content for a topic, **always include that topic's exclusions** in the prompt so the AI does not mention or teach concepts that are outside that topic's scope. Copy the full Exclusions block for the topic you are generating; each request is standalone and must not refer to other topics or sections.

---

## 5. Loops – Repetition

### 5.1 `do-while` loop – Tutorial spec for AI

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `for` loop; functions (defining or calling); recursion; arrays; strings (beyond simple `printf`/`scanf`); pointers; structures.
  - Use only: variables, `printf`/`scanf`, `if`/`else`, and `while` loop. Do not introduce `break` or `continue` unless this topic explicitly includes them.
- **Positioning and comparison**
  - Clearly contrast `while` vs `do-while`:
    - `while`: condition checked **before** body (may run 0 times).
    - `do-while`: body runs **at least once**, then condition is checked.
  - Reuse the same explanation tone and depth as the existing `while` loop tutorial.
  - Include a simple natural-language analogy (e.g., "show menu at least once, then keep showing while user chooses X").
- **Syntax and flow (Concept lesson)**
  - Show the canonical syntax:
    - `do { /* body */ } while (condition);`
  - Use a mermaid `flowchart TD` diagram similar to the `while` loop tutorial, but highlighting:
    - "Execute body once" â†’ "Check condition" â†’ "Repeat or exit".
  - Small, focused C examples (each shown as short code **snippets**, 3–4 lines of C, following your existing example style):
    - Simple counter with `do-while` (1 to 5).
    - Input validation example where the prompt is guaranteed to appear once.
    - Menu snippet that runs at least once, then repeats based on user choice.
- **Menu-driven example (Core example, same style as existing tutorials)**
  - A text-based menu (e.g., calculator or options menu) that:
    - Shows the menu once.
    - Reads user choice.
    - Repeats while the user does **not** choose "Exit".
  - Use clear `printf` messages and integer `scanf` input, like earlier C tutorials.
  - Include explanation, common mistakes, and best practices sections:
    - Common mistakes: missing semicolon after `while (condition);`, writing `while(condition)` without space then forgetting `;`, writing `while = condition`, etc.
    - Best practices: keep `do-while` for "run at least once" cases, keep body small and readable, avoid deeply nested loops.
- **Lesson breakdown (match existing pattern)**
  - **Lesson 1 – Concept (`type: "concept"`)**
    - Explain when to choose `do-while` instead of `while`.
    - Show at least 2–3 tiny code examples with explanations and `printf` output.
    - Include:
      - `mermaid_code` flowchart for the loop.
      - `keyPoints`, `commonMistakes`, `bestPractices`, `practiceHints`.
  - **Lesson 2 – MCQ (`type: "mcq"`)**
    - 3–4 beginner"‘friendly questions:
      - "How many times does a `do-while` loop run at minimum?"
      - Identify where the semicolon goes in `do { ... } while (condition);`.
      - Predict output of a small `do-while` snippet (1–2 lines of body).
    - Include code snippets and, where helpful, simple mermaid diagrams (same style as existing MCQs).
  - **Lesson 3 – Code Rearranging (`type: "codeblock_rearranging"`)**
    - Ask learner to assemble:
      - A minimal `do-while` loop that prints numbers.
      - A menu loop that runs at least once.
    - Provide `blocks` and a `targetCode` exactly like the current `while`/syntax rearrange exercises.
  - **Lesson 4 – Fill in the Blanks (`type: "fill_in_blanks"`)**
    - 1–2 exercises where:
      - Learner fills in `do`, `while`, condition, or the final semicolon.
      - Another exercise to choose the correct condition to keep looping vs exit.
    - Use dropdown + text blanks in the same format as existing C syntax and variables FIB lessons.
- **Common pitfalls section (in concept + reference)**
  - Emphasize:
    - Forgetting the `;` after `while (condition);`
    - Assuming `do-while` might not run at all (clarify it **always** runs once).
    - Off"‘by"‘one errors with counters.
    - Using `do-while` when a regular `while` would be clearer.
  - Provide one short "buggy vs fixed" example, in the same style as the current "common_mistakes / correct_approach" content in other tutorials.
- **e.g codes**

```c
// 1. Print numbers from 1 to 100 using do-while
int i = 1;
do {
    printf("%d ", i);
    i++;
} while (i <= 100);
```

```c
// 2. Print numbers from 100 down to 1 using do-while
int i = 100;
do {
    printf("%d ", i);
    i--;
} while (i >= 1);
```

```c
// 3. Demonstrate: do-while loop executes at least once
int i = 100;
do {
    printf("%d\n", i); // This will print 100 even though i < 10 is false
} while (i < 10);
```

```c
// 4. Sum numbers from 1 to 10 using do-while
int sum = 0, i = 1;
do {
    sum += i;
    i++;
} while (i <= 10);
printf("Sum = %d\n", sum); // Outputs: Sum = 55
```

```c
// 5. Factorial of numbers from 1 to 10 using do-while
int fact, n = 1;
do {
    fact = 1;
    int j = 1;
    do {
        fact *= j;
        j++;
    } while (j <= n);
    printf("Factorial of %d = %d\n", n, fact);
    n++;
} while (n <= 10);
```

```c
// 6. Keep adding numbers until the user enters 0 (do-while exclusive pattern)
int num, sum = 0;
do {
    printf("Enter a number (0 to quit): ");
    scanf("%d", &num);
    sum += num;
} while (num != 0);
printf("Total sum = %d\n", sum);
```

```c
// 7. Input validation: Ask user for a value between 1 and 5
int val;
do {
    printf("Enter a number between 1 and 5: ");
    scanf("%d", &val);
} while (val < 1 || val > 5);
printf("You entered: %d\n", val);
```

---

### 5.2 `for` loop – Tutorial spec for AI

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions (defining or calling); recursion; arrays; strings (beyond simple `printf`/`scanf`); pointers; structures.
  - Use only: variables, `printf`/`scanf`, `if`/`else`, `while` and `do-while` loops. Star/shape patterns are excluded here

> **Pending tutorials requested here**: create **3–4 `for`-loop tutorials**, each with **4–6 lessons**, that together cover basic counting, numeric patterns (sum, factorial, tables, power), and simple nested loops (numeric only, **no star patterns** – star patterns will be a separate topic). Follow the same lesson structure as `while` / `do-while`: concept â†’ mcq â†’ codeblock_rearranging â†’ fill_in_blanks, with mermaid flowcharts, `keyPoints`, `commonMistakes`, `bestPractices`, `practiceHints`, and multiple tiny examples.

#### 5.2.A Topic – `for` Loop Basics (Counting)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions (defining or calling); recursion; arrays; strings (beyond simple `printf`/`scanf`); pointers; structures; star or shape patterns (separate topic).
  - Use only: variables, `printf`/`scanf`, `if`/`else`, `while` and `do-while` loops, and the `for` loop syntax (init; condition; increment).
- **Positioning vs `while`**
  - Explain that `for` is ideal when **all loop controls** belong together:
    - Initialization, condition, increment are all visible in **one line**, which is clearer and less error"‘prone than `while`, where these are often scattered.
  - Explicit comparison:
    - `while`: init above loop, condition in `while`, increment buried at the bottom of the body (easy to forget).
    - `for`: `for (init; condition; increment)` clearly expresses the full lifecycle of the loop variable.
- **Concept lessons (4–6)**
  - **Lesson ideas (each as its own `TutorialLesson`):**
    - L1: Structure of `for (initialization; condition; increment)` with mermaid flowchart.
    - L2: Simple counting 1 to 100.
    - L3: Counting 100 to 1 (decrementing loop).
    - L4: Counting from user"‘provided `start` to `end` (inclusive).
    - L5: Different step sizes (e.g. step 2, step 5).
    - L6: Why putting all controls in one line makes `for` safer than `while` for counting.
- **Example snippets (to embed in concept + reference)**

```c
// 1. Print numbers from 1 to 100 using for loop
for (int i = 1; i <= 100; i++) {
    printf("%d ", i);
}
```

```c
// 2. Print numbers from 100 down to 1 using for loop
for (int i = 100; i >= 1; i--) {
    printf("%d ", i);
}
```

```c
// 3. Print numbers from user start to user end (inclusive)
int start, end;
printf("Enter start: ");
scanf("%d", &start);
printf("Enter end: ");
scanf("%d", &end);

for (int i = start; i <= end; i++) {
    printf("%d ", i);
}
```

```c
// 4. Even numbers from 2 to 100
for (int i = 2; i <= 100; i += 2) {
    printf("%d ", i);
}
```

- **Exercises / other lesson types**
  - MCQ lessons: identify which part is init / condition / increment; predict output.
  - Code–rearrange lessons: assemble a 1â†’100 loop, 100â†’1 loop.
  - FIB lessons: fill in missing init, condition, or increment.

#### 5.2.B Topic – `for` Loop for Numeric Patterns (Sum, Factorial, Tables, Power)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: Nested loops functions (defining or calling); recursion; arrays; strings ; pointers; structures; star or shape patterns (separate topic).
  - Use only: variables, `printf`/`scanf`, `if`/`else`, `while` and `do-while` loops, and `for` loops (including nested `for` for numeric patterns only).
- **Concept lessons (4–6)**
  - Suggested lesson breakdown:
    - L1: Sum of numbers from 1 to `n`.
    - L2: Factorial of a single number `n`.
    - L3: Multiplication table of a number (1 to 10).
    - L4: Power of a number (`a^b`) via repeated multiplication.
    - L5: Sum of even / odd numbers up to `n`.
    - L6: Common mistakes (off"‘by"‘one errors, wrong condition, forgetting to reset accumulators).
- **Example snippets**

```c
// 5. Sum of numbers from 1 to n
int n;
printf("Enter n: ");
scanf("%d", &n);

int sum = 0;
for (int i = 1; i <= n; i++) {
    sum += i;
}
printf("Sum = %d\n", sum);
```

```c
// 6. Factorial of a number n (n!)
int n;
printf("Enter n: ");
scanf("%d", &n);

int fact = 1;
for (int i = 1; i <= n; i++) {
    fact *= i;
}
printf("Factorial of %d = %d\n", n, fact);
```

```c
// 7. Multiplication table of a number n (1 to 10)
int n;
printf("Enter a number: ");
scanf("%d", &n);

for (int i = 1; i <= 10; i++) {
    printf("%d x %d = %d\n", n, i, n * i);
}
```

```c
// 8. Compute a^b using repeated multiplication
int a, b;
printf("Enter base (a): ");
scanf("%d", &a);
printf("Enter exponent (b): ");
scanf("%d", &b);

int result = 1;
for (int i = 1; i <= b; i++) {
    result *= a;
}
printf("%d^%d = %d\n", a, b, result);
```

```c
// 9. Sum of even numbers from 1 to n
int n;
printf("Enter n: ");
scanf("%d", &n);

int sumEven = 0;
for (int i = 2; i <= n; i += 2) {
    sumEven += i;
}
printf("Sum of even numbers = %d\n", sumEven);
```

- **Exercises / other lesson types**
  - MCQ: choose correct loop to compute a given pattern; spot off"‘by"‘one bugs.
  - Code–rearrange: assemble table / sum / power loops.
  - FIB: fill missing accumulator initialization or loop bounds.

#### 5.2.C Topic – Nested `for` Loops (Numeric Only)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions (defining or calling); recursion; arrays; strings (beyond simple `printf`/`scanf`); pointers; structures; star or shape patterns (use numeric grids/tables only, no `*` or character patterns).
  - Use only: variables, `printf`/`scanf`, `if`/`else`, loops, and nested `for` loops with numeric output (e.g. grids, tables of numbers, factorials 1 to 10).
- **Scope of this topic**
  - Focus only on **numeric nested loops**, **exclude star/shape patterns** (those will be a separate patterns tutorial).
  - Examples:
    - Printing a small numeric grid.
    - Table of tables (e.g., tables 1 to 5).
    - Factorials of 1 to 10 using inner loops.
- **Concept lessons (4–6)**
  - Suggested lesson breakdown:
    - L1: What is a nested loop? (outer vs inner, with mermaid flowchart).
    - L2: Simple numeric grid (rows and columns of numbers).
    - L3: Multiple tables (e.g., tables of 2, 3, 4, 5).
    - L4: Factorials of 1 to 10 using nested `for`.
    - L5: Tracing nested loops step by step.
    - L6: Common mistakes (reusing same loop variable, wrong bounds, forgetting to reset inner variables).
- **Example snippets**

```c
// 10. Print a 3x4 grid of numbers (row, col)
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 4; col++) {
        printf("(%d,%d) ", row, col);
    }
    printf("\n");
}
```

```c
// 11. Tables of numbers from 1 to 5 (each 1 to 10)
for (int n = 1; n <= 5; n++) {
    printf("Table of %d:\n", n);
    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\n", n, i, n * i);
    }
    printf("\n");
}
```

```c
// 12. Factorials of numbers from 1 to 10 using nested for
for (int n = 1; n <= 10; n++) {
    int fact = 1;
    for (int i = 1; i <= n; i++) {
        fact *= i;
    }
    printf("Factorial of %d = %d\n", n, fact);
}
```

- **Exercises / other lesson types**
  - MCQ: reasoning about number of iterations, final values.
  - Code–rearrange: assemble nested loops for "tables of tables".
  - FIB: fill in outer/inner loop bounds, or missing initialization inside outer loop.

#### 5.2.D Topic – `for` vs `while` Trade"‘offs (Optional Short Tutorial)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions (defining or calling); recursion; arrays; strings (beyond simple `printf`/`scanf`); pointers; structures.
  - Use only: variables, `printf`/`scanf`, `if`/`else`, `while`, `do-while`, and `for` loops for side-by-side comparison.
- Short tutorial (4–5 lessons) that:
  - Shows the same task implemented with `while` and `for` and asks learners:
    - Which is clearer and why (especially for loops where all three controls belong together).
  - Lessons can be:
    - Side"‘by"‘side code comparisons.
    - MCQs asking which version is easier to maintain.
    - Code–rearrange / FIB exercises to convert `while` to `for` and vice versa.

---

### 5.3 Patterns with `for` loops – Tutorial spec for AI

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions; recursion; arrays (beyond loop indices); strings (beyond simple `printf`); pointers; structures.
  - Use only: nested `for` loops, `printf` with `*`/numbers, variables. No numeric algorithms (sum, factorial, etc.)"”those belong in 5.2.

> **Pending tutorials requested here**: create **3–4 pattern tutorials**, each with **4–6 lessons**, that teach nested `for` loops through **rectangles and triangles**. For every shape, build three variants: print `*`, print row index, print column index. Use the same lesson structure as other tutorials (concept â†’ mcq â†’ codeblock_rearranging â†’ fill_in_blanks) with mermaid flowcharts and multiple small C **snippets**.

#### 5.3.A Topic – Rectangle Patterns (Rows Ã— Columns)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions; recursion; arrays (beyond loop indices/counters); strings (beyond simple `printf`); pointers; structures; numeric algorithms (sum, factorial, power, etc.).
  - Use only: nested `for` loops, `printf` with `*` or numbers for pattern output, variables for row/column counts.
- **Concept focus**
  - Two nested `for` loops:
    - Outer loop â†’ rows.
    - Inner loop â†’ columns.
  - Show how changing only the **inner `printf`** changes the pattern (stars â†’ row numbers â†’ column numbers).
- **Concept lessons (4–6)**
  - L1: Basic rectangle of `*` (fixed size, e.g. 3Ã—5).
  - L2: Rectangle of row numbers.
  - L3: Rectangle of column numbers.
  - L4: User"‘input rows and columns (flexible rectangle).
  - L5: Common mistakes (wrong bounds, missing newline).
  - L6: Practice: choose right loops for a described rectangle.
- **Example snippets**

```c
// 1. Rectangle of '*' (3 rows, 5 columns)
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 5; col++) {
        printf("* ");
    }
    printf("\n");
}
```

```c
// 2. Rectangle of row numbers
// 1 1 1 1 1
// 2 2 2 2 2
// 3 3 3 3 3
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 5; col++) {
        printf("%d ", row);
    }
    printf("\n");
}
```

```c
// 3. Rectangle of column numbers
// 1 2 3 4 5
// 1 2 3 4 5
// 1 2 3 4 5
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 5; col++) {
        printf("%d ", col);
    }
    printf("\n");
}
```

```c
// 4. User-defined rows and columns with '*'
int rows, cols;
printf("Enter rows: ");
scanf("%d", &rows);
printf("Enter columns: ");
scanf("%d", &cols);

for (int row = 1; row <= rows; row++) {
    for (int col = 1; col <= cols; col++) {
        printf("* ");
    }
    printf("\n");
}
```

#### 5.3.B Topic – Left Triangle Patterns (Right-angle on the left)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions; recursion; arrays (beyond loop indices/counters); strings (beyond simple `printf`); pointers; structures; numeric algorithms (sum, factorial, power, etc.).
  - Use only: nested `for` loops, `printf` with `*` or numbers for pattern output, variables for row/column counts.
- **Concept focus**
  - Outer loop controls height (1 to `n`).
  - Inner loop runs from 1 to `row`, so row length grows each line.
- **Concept lessons (4–6)**
  - L1: Left triangle of `*` (fixed height).
  - L2: Left triangle of row index.
  - L3: Left triangle of column index.
  - L4: User"‘input height.
  - L5: Off"‘by"‘one and bounds mistakes.
  - L6: Practice (MCQ / rearranging / FIB).
- **Example snippets**

```c
// 5. Left triangle of '*' (5 rows)
for (int row = 1; row <= 5; row++) {
    for (int col = 1; col <= row; col++) {
        printf("* ");
    }
    printf("\n");
}
```

```c
// 6. Left triangle of row numbers
// 1
// 2 2
// 3 3 3
for (int row = 1; row <= 5; row++) {
    for (int col = 1; col <= row; col++) {
        printf("%d ", row);
    }
    printf("\n");
}
```

```c
// 7. Left triangle of column numbers
// 1
// 1 2
// 1 2 3
for (int row = 1; row <= 5; row++) {
    for (int col = 1; col <= row; col++) {
        printf("%d ", col);
    }
    printf("\n");
}
```

```c
// 8. Left triangle of '*' with user-defined height
int n;
printf("Enter height: ");
scanf("%d", &n);

for (int row = 1; row <= n; row++) {
    for (int col = 1; col <= row; col++) {
        printf("* ");
    }
    printf("\n");
}
```

#### 5.3.C Topic – Inverted Left Triangle Patterns

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions; recursion; arrays (beyond loop indices/counters); strings (beyond simple `printf`); pointers; structures; numeric algorithms (sum, factorial, power, etc.).
  - Use only: nested `for` loops, `printf` with `*` or numbers for pattern output, variables for row/column counts.
- **Concept focus**
  - Start with `n` items in first row, decrease until 1.
- **Concept lessons (4–6)**
  - L1: Inverted left triangle of `*`.
  - L2: Inverted left triangle of row index.
  - L3: Inverted left triangle of column index.
  - L4: User"‘input height inverted triangle.
  - L5: Loop direction and off"‘by"‘one errors.
  - L6: Practice (MCQ / rearranging / FIB).
- **Example snippets**

```c
// 9. Inverted left triangle of '*' (5 rows)
for (int row = 5; row >= 1; row--) {
    for (int col = 1; col <= row; col++) {
        printf("* ");
    }
    printf("\n");
}
```

```c
// 10. Inverted left triangle of row numbers
// 5 5 5 5 5
// 4 4 4 4
// ...
for (int row = 5; row >= 1; row--) {
    for (int col = 1; col <= row; col++) {
        printf("%d ", row);
    }
    printf("\n");
}
```

```c
// 11. Inverted left triangle of column numbers
// 1 2 3 4 5
// 1 2 3 4
// ...
for (int row = 5; row >= 1; row--) {
    for (int col = 1; col <= row; col++) {
        printf("%d ", col);
    }
    printf("\n");
}
```

```c
// 12. Inverted left triangle with user-defined height
int n;
printf("Enter height: ");
scanf("%d", &n);

for (int row = n; row >= 1; row--) {
    for (int col = 1; col <= row; col++) {
        printf("* ");
    }
    printf("\n");
}
```

#### 5.3.D Topic – Right & Inverted Right Triangles (Right-angle on the right)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: functions; recursion; arrays (beyond loop indices/counters); strings (beyond simple `printf`); pointers; structures; numeric algorithms (sum, factorial, power, etc.).
  - Use only: nested `for` loops, `printf` with `*` or numbers for pattern output, variables for row/column counts.
- **Concept focus**
  - Combine spaces + pattern:
    - First inner loop: spaces.
    - Second inner loop: `*` / row / column.
- **Concept lessons (4–6)**
  - L1: Right triangle of `*`.
  - L2: Right triangle of row index.
  - L3: Right triangle of column index.
  - L4: Inverted right triangle of `*`.
  - L5: Inverted right triangle of row / column.
  - L6: Practice and common spacing mistakes.
- **Example snippets – right triangle**

```c
// 13. Right triangle of '*' (5 rows)
for (int row = 1; row <= 5; row++) {
    for (int space = 1; space <= 5 - row; space++) {
        printf("  ");
    }
    for (int col = 1; col <= row; col++) {
        printf("* ");
    }
    printf("\n");
}
```

```c
// 14. Right triangle of row numbers
for (int row = 1; row <= 5; row++) {
    for (int space = 1; space <= 5 - row; space++) {
        printf("  ");
    }
    for (int col = 1; col <= row; col++) {
        printf("%d ", row);
    }
    printf("\n");
}
```

```c
// 15. Right triangle of column numbers
for (int row = 1; row <= 5; row++) {
    for (int space = 1; space <= 5 - row; space++) {
        printf("  ");
    }
    for (int col = 1; col <= row; col++) {
        printf("%d ", col);
    }
    printf("\n");
}
```

- **Example snippets – inverted right triangle**

```c
// 16. Inverted right triangle of '*' (5 rows)
for (int row = 5; row >= 1; row--) {
    for (int space = 1; space <= 5 - row; space++) {
        printf("  ");
    }
    for (int col = 1; col <= row; col++) {
        printf("* ");
    }
    printf("\n");
}
```

```c
// 17. Inverted right triangle of row numbers
for (int row = 5; row >= 1; row--) {
    for (int space = 1; space <= 5 - row; space++) {
        printf("  ");
    }
    for (int col = 1; col <= row; col++) {
        printf("%d ", row);
    }
    printf("\n");
}
```

```c
// 18. Inverted right triangle of column numbers
for (int row = 5; row >= 1; row--) {
    for (int space = 1; space <= 5 - row; space++) {
        printf("  ");
    }
    for (int col = 1; col <= row; col++) {
        printf("%d ", col);
    }
    printf("\n");
}
```

---

## 6. Functions – Tutorial specs for AI

> **Pending tutorials requested here**: create **2–3 function tutorials**, each with **4–6 lessons**, that gradually introduce: basic void functions, reusing functions, parameters (no return), and then return values. Follow the existing pattern (concept â†’ mcq â†’ codeblock_rearranging â†’ fill_in_blanks) with mermaid flowcharts, `keyPoints`, `commonMistakes`, `bestPractices`, `practiceHints`, and several short C **snippets**.

#### 6.1 Topic – Introduction to Functions (void, no parameters)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: function parameters (no `(int x)` or `(int a, int b)`); return type other than `void` (no `int` or other return types; no `return value;`); recursion; arrays; strings (beyond simple `printf`/`scanf` in `main`); pointers; structures.
  - Use only: `void functionName()` with empty parentheses, calling from `main`, and control flow/loops inside the function body (e.g. `if`/`for`). All input (e.g. age) must be read inside the function, not passed in as parameters.
- **Core concepts**
  - Explain that:
    - A **function** is a reusable block of code with a name.
    - `**main`\** is the *entry point\* and is called automatically by the system.
    - **All other functions must be called** from `main` (or from other functions) to run.
  - Use very simple examples with `void` and **no parameters / no return value**.
- **Concept lessons (4–6)**
  - L1: Define a simple `void` function that is **never called**; explain why nothing happens.
  - L2: Call the function once from `main`.
  - L3: Call the same function multiple times from `main` to show reuse.
  - L4: Update the function body once and show that **all calls** now use the new behavior.
  - L5: Use functions that perform simple tasks:
    - A function that prints a voting message based on age (uses `if-else`, but age is read inside, no parameters yet).
    - A function that prints numbers from 1 to 100 (`for` loop inside, no parameters/return).
  - L6: Common mistakes: forgetting to call, placing function below `main` without a prototype (can be mentioned gently), missing return type (`int` vs `void`).
- **Example snippets**

```c
// 1. Function defined but not called
void hello() {
    printf("Hello Codehub\n");
}

int main() {
    // hello();  // Not called yet, so nothing from hello() appears
    return 0;
}
```

```c
// 2. Calling a simple void function once
void hello() {
    printf("Hello Codehub\n");
}

int main() {
    hello(); // Function call
    return 0;
}
```

```c
// 3. Reusing the same function multiple times
void hello() {
    printf("Hello Codehub\n");
}

int main() {
    hello();
    hello();
    hello();
    hello();
    return 0;
}
```

```c
// 4. Changing function implementation once, all calls updated
void hello() {
    printf("Welcome to Codehub!\n");
}

int main() {
    hello();
    hello();
    hello();
    hello();
    return 0;
}
```

```c
// 5. Function to check voting eligibility (no parameters)
void checkVoting() {
    int age;
    printf("Enter your age: ");
    scanf("%d", &age);

    if (age >= 18) {
        printf("You are eligible to vote.\n");
    } else {
        printf("You are not eligible to vote.\n");
    }
}

int main() {
    checkVoting();
    return 0;
}
```

```c
// 6. Function to print numbers from 1 to 100
void printOneToHundred() {
    for (int i = 1; i <= 100; i++) {
        printf("%d ", i);
    }
    printf("\n");
}

int main() {
    printOneToHundred();
    return 0;
}
```

#### 6.2 Topic – Functions with Parameters (no return yet)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: **return statements** or **return values** (functions must be `void` and only print or do side effects); recursion; passing arrays to functions; strings as parameters (keep to simple `int`/numeric); pointers; structures.
  - Use only: `void func(int a, int b)` style parameters, passing arguments in calls, and printing results inside the function. Do not use `return value;` or non-`void` return types.
- **Core concepts**
  - Introduce **parameters** as input values that functions receive.
  - Still use `void` return type; show functions that:
    - Print a value passed in.
    - Print the square of a number.
    - Add two numbers and print the result.
    - Group multiple related functions in a single file.
- **Concept lessons (4–6)**
  - L1: Single parameter function that just prints the parameter.
  - L2: Single parameter function that prints its square.
  - L3: Two-parameter function that prints sum.
  - L4: Program with multiple functions: `printSquare`, `add`, `sub`, `multiply` (all void, all just print results).
  - L5: Calling these functions with different arguments to show reuse.
  - L6: Common mistakes: wrong order of parameters, mismatched types, forgetting to pass arguments.
- **Example snippets**

```c
// 7. Function with one parameter: print the value
void printValue(int x) {
    printf("Value = %d\n", x);
}

int main() {
    printValue(10);
    printValue(25);
    return 0;
}
```

```c
// 8. Function with one parameter: print square
void printSquare(int x) {
    printf("Square of %d = %d\n", x, x * x);
}

int main() {
    printSquare(4);
    printSquare(7);
    return 0;
}
```

```c
// 9. Function with two parameters: print sum
void printSum(int a, int b) {
    int sum = a + b;
    printf("Sum of %d and %d = %d\n", a, b, sum);
}

int main() {
    printSum(3, 5);
    printSum(10, 20);
    return 0;
}
```

```c
// 10. Multiple void functions in one program (no return values)
void printSquare(int x) {
    printf("Square: %d\n", x * x);
}

void printAdd(int a, int b) {
    printf("Add: %d\n", a + b);
}

void printSub(int a, int b) {
    printf("Sub: %d\n", a - b);
}

void printMul(int a, int b) {
    printf("Mul: %d\n", a * b);
}

int main() {
    printSquare(5);
    printAdd(10, 3);
    printSub(10, 3);
    printMul(4, 6);
    return 0;
}
```

#### 6.3 Topic – Functions with Return Values (using function output)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: recursion; passing arrays to functions; strings as parameters or return types; pointers; structures.
  - Use only: function parameters (e.g. `int a, int b`), **return** with a value, non-`void` return types (e.g. `int`), and using the returned value in `main` (assign to variable, use in expression, pass to `printf`).
- **Core concepts**
  - Show how to **use a function's output** via `return`:
    - Single-parameter functions that return a value.
    - Two-parameter functions that return a result instead of printing it directly.
    - Assign return values to variables and print/use them later.
  - Revisit the same shapes (single-param print square, two-param print sum, multiple void functions), but now with `return` instead of printing inside the function:
    - Return the same value.
    - Return square.
    - Return sum.
    - Multiple functions: `square`, `add`, `sub`, `multiply` returning results.
- **Concept lessons (4–6)**
  - L1: Single-parameter function that returns the parameter (identity), value used in `main`.
  - L2: Single-parameter function that returns square, then printed in `main`.
  - L3: Two-parameter function that returns sum, used in an expression.
  - L4: Program with multiple returning functions: `square`, `add`, `sub`, `multiply`.
  - L5: Using return values multiple times; difference between printing inside vs returning.
  - L6: Common mistakes: missing `return`, wrong return type, ignoring return value when needed.
- **Example snippets**

```c
// 11. Function that returns the same value
int getValue(int x) {
    return x;
}

int main() {
    int num = getValue(42);
    printf("Returned value = %d\n", num);
    return 0;
}
```

```c
// 12. Function that returns square
int square(int x) {
    return x * x;
}

int main() {
    int a = 4;
    int result = square(a);
    printf("Square of %d = %d\n", a, result);
    return 0;
}
```

```c
// 13. Function with two parameters: return sum
int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 5, y = 7;
    int s = add(x, y);
    printf("Sum = %d\n", s);
    // Using the function directly in an expression
    printf("Sum + 10 = %d\n", add(x, y) + 10);
    return 0;
}
```

```c
// 14. Multiple returning functions in one program
int square(int x) {
    return x * x;
}

int add(int a, int b) {
    return a + b;
}

int sub(int a, int b) {
    return a - b;
}

int mul(int a, int b) {
    return a * b;
}

int main() {
    int x = 5, y = 3;

    printf("square(%d) = %d\n", x, square(x));
    printf("add(%d, %d) = %d\n", x, y, add(x, y));
    printf("sub(%d, %d) = %d\n", x, y, sub(x, y));
    printf("mul(%d, %d) = %d\n", x, y, mul(x, y));

    return 0;
}
```

- **Exercises / other lesson types for 6.2 & 6.3**
  - MCQ: identify correct function signatures, predict outputs, differentiate between printing vs returning.
  - Code–rearrange: build small programs with multiple functions and `main`.
  - FIB: fill missing return types, parameters, or `return` statements.

#### 6.4 Topic – Predicate and Helper Functions

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: recursion; passing arrays to functions; strings (beyond simple use in `main`); pointers; structures.
  - Use only: functions with parameters and return values (e.g. `int isEven(int x)`, `int max2(int a, int b)`), returning 0/1 for predicates and computed values for helpers, used in `if` conditions and loops.
- **Core concepts**
  - Introduce **predicate functions** that answer yes/no by returning 0 or 1 (e.g. `isEven`, `isPositive`, `isMultipleOf3`).
  - Introduce simple **helper functions** such as `max2` that return a computed result.
  - Show how these functions make `if` conditions and other logic more readable (`if (isEven(x))`), and prepare learners for more advanced topics like recursion.
- **Concept lessons (4–6)**
  - L1: `isEven(int x)` returning 1 if even, 0 if odd, used in `if` inside `main`.
  - L2: `isPositive(int x)` or `isMultipleOf3(int x)` as variations (reuse pattern).
  - L3: `max2(int a, int b)` returning the larger of two integers.
  - L4: Using `max2` for multiple pairs, showing code reuse.
  - L5: Combining predicate/helper functions with loops (e.g. counting even numbers up to `n`).
  - L6: Common mistakes: misunderstanding 0/1 meaning, writing assignments (`=`) instead of comparisons (`==`) in predicates.
- **Example snippets**

```c
// 1. Predicate function: check if a number is even
int isEven(int x) {
    return x % 2 == 0;  // returns 1 (true) if even, 0 (false) if odd
}

int main() {
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);

    if (isEven(n)) {
        printf("%d is even\n", n);
    } else {
        printf("%d is odd\n", n);
    }

    return 0;
}
```

```c
// 2. Predicate function: check if a number is positive
int isPositive(int x) {
    return x > 0;
}

int main() {
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);

    if (isPositive(n)) {
        printf("%d is positive\n", n);
    } else {
        printf("%d is not positive\n", n);
    }

    return 0;
}
```

```c
// 3. Helper function: find maximum of two numbers
int max2(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    int x = 10, y = 20;
    int m = max2(x, y);
    printf("Max = %d\n", m);
    return 0;
}
```

```c
// 4. Using max2 multiple times
int max2(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    int a = 5, b = 12, c = 7;

    int maxAB = max2(a, b);
    int maxBC = max2(b, c);

    printf("Max of (%d, %d) = %d\n", a, b, maxAB);
    printf("Max of (%d, %d) = %d\n", b, c, maxBC);

    return 0;
}
```

```c
// 5. Using isEven in a loop: count evens from 1 to n
int isEven(int x) {
    return x % 2 == 0;
}

int main() {
    int n;
    printf("Enter n: ");
    scanf("%d", &n);

    int count = 0;
    for (int i = 1; i <= n; i++) {
        if (isEven(i)) {
            count++;
        }
    }

    printf("There are %d even numbers from 1 to %d\n", count, n);
    return 0;
}
```

---

## 7. Recursion – Tutorial specs for AI

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions; strings (beyond simple `printf`/`scanf` in examples); pointers; structures; dynamic memory.
  - Use only: functions with parameters and return values; recursive calls; base cases; simple numeric or printing examples; loops and conditionals where needed.

> **Pending tutorials requested here**: create **1–2 recursion tutorials**, each with **4–6 lessons**, that gently introduce the idea of a function calling itself, base cases, and classic recursive problems. Start from infinite recursion (no base case), then add a stopping condition with a counter, then move to recursive printing and simple numeric problems (sum, factorial, etc.) in the same teaching style as earlier topics.

#### 7.1 Topic – Recursion Basics (hello Codehub, counters, simple printing)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions; strings (as a topic, beyond simple `printf`/`scanf` in examples); pointers; structures; dynamic memory; return values used for computation (e.g. returning sum or factorial from recursion).
  - Use only: functions with parameters and return type `void` or simple return; recursive calls; base cases (e.g. `if (count == 0) return;`); printing or counting; no computed return values from recursion in this topic.
- **Core concepts**
  - Explain recursion as "a function calling itself".
  - Show **what happens if there is no base case** (stack overflow / infinite recursion in theory).
  - Introduce the idea of a **base case** using a `count` parameter.
  - Use recursion for simple, visible tasks: printing numbers in different directions.
- **Concept lessons (4–6)**
  - L1: A recursive function that prints `"Hello Codehub"` forever (no base case) – explain why this is a problem.
  - L2: Add a `count` parameter and use an `if` check to stop after N calls.
  - L3: Recursive function to print from `n` down to `0` (e.g. 5,4,3,2,1,0).
  - L4: Recursive function to print from `start` down to `end` (e.g. 10 to 3).
  - L5: Recursive function to print from `start` up to `end` (forward direction).
  - L6: Common mistakes: missing base case, wrong direction in step, base case off"‘by"‘one.
- **Example snippets**

```c
// 1. Infinite recursion example (DO NOT RUN AS-IS)
void helloRec() {
    printf("Hello Codehub\n");
    helloRec();  // recursive call with no base case -> infinite recursion
}

int main() {
    // helloRec(); // If you call this, it will keep calling itself until the program crashes.
    return 0;
}
```

```c
// 2. Controlled recursion using a counter
void helloRec(int count) {
    if (count == 0) {
        return; // base case: stop recursion
    }

    printf("Hello Codehub\n");
    helloRec(count - 1); // recursive call with smaller count
}

int main() {
    helloRec(5); // prints "Hello Codehub" 5 times
    return 0;
}
```

```c
// 3. Print from n down to 0 using recursion
void printDown(int n) {
    if (n < 0) {
        return; // base case
    }

    printf("%d\n", n);
    printDown(n - 1); // recursive call with smaller n
}

int main() {
    printDown(5); // 5 4 3 2 1 0
    return 0;
}
```

```c
// 4. Print from end down to start (any start/end)
void printDownRange(int start, int end) {
    if (start < end) {
        return; // base case: range finished
    }

    printf("%d\n", start);
    printDownRange(start - 1, end);
}

int main() {
    printDownRange(10, 3); // 10 9 8 7 6 5 4 3
    return 0;
}
```

```c
// 5. Print from start up to end (forward recursion)
void printUpRange(int start, int end) {
    if (start > end) {
        return; // base case
    }

    printf("%d\n", start);
    printUpRange(start + 1, end);
}

int main() {
    printUpRange(3, 10); // 3 4 5 6 7 8 9 10
    return 0;
}
```

#### 7.2 Topic – Classic Recursive Problems (sum, factorial, and more)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions; strings (as a topic); pointers; structures; dynamic memory.
  - Use only: functions with scalar parameters and return values (e.g. `int sumToN(int n)`), recursive calls, base cases, and simple numeric problems (sum to n, factorial, power, sum of digits). No arrays, no string parameters.
- **Core concepts**
  - Reinforce the **two essential parts** of a recursive function:
    - Base case (when to stop).
    - Recursive step (smaller sub"‘problem).
  - Use familiar arithmetic problems so students can focus on the recursion idea, not new math.
- **Concept lessons (4–6)**
  - L1: Sum of numbers from 1 to `n` using recursion.
  - L2: Factorial of `n` using recursion.
  - L3: Recursive power function (`a^b`) with integer exponent.
  - L4: Another simple recursive example (e.g. sum of digits of a number).
  - L5: Comparing recursive vs iterative versions for the same problem.
  - L6: Common mistakes: missing / incorrect base case, changing the wrong variable, forgetting to return the recursive result.
- **Example snippets**

```c
// 6. Recursive sum of numbers from 1 to n
int sumToN(int n) {
    if (n <= 0) {
        return 0; // base case
    }
    return n + sumToN(n - 1); // recursive step
}

int main() {
    int n;
    printf("Enter n: ");
    scanf("%d", &n);

    int result = sumToN(n);
    printf("Sum from 1 to %d = %d\n", n, result);
    return 0;
}
```

```c
// 7. Recursive factorial function
int factorial(int n) {
    if (n <= 1) {
        return 1; // base case: 0! = 1, 1! = 1
    }
    return n * factorial(n - 1); // recursive step
}

int main() {
    int n;
    printf("Enter n: ");
    scanf("%d", &n);

    int result = factorial(n);
    printf("Factorial of %d = %d\n", n, result);
    return 0;
}
```

```c
// 8. Recursive power: compute a^b
int power(int a, int b) {
    if (b == 0) {
        return 1; // anything^0 = 1
    }
    return a * power(a, b - 1);
}

int main() {
    int a, b;
    printf("Enter base (a): ");
    scanf("%d", &a);
    printf("Enter exponent (b): ");
    scanf("%d", &b);

    int result = power(a, b);
    printf("%d^%d = %d\n", a, b, result);
    return 0;
}
```

```c
// 9. Recursive sum of digits of a number
int sumOfDigits(int n) {
    if (n == 0) {
        return 0; // base case
    }
    return (n % 10) + sumOfDigits(n / 10);
}

int main() {
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);

    int result = sumOfDigits(n);
    printf("Sum of digits = %d\n", result);
    return 0;
}
```

- **Exercises / other lesson types**
  - MCQ: identify base case and recursive step; predict small outputs.
  - Code–rearrange: assemble a recursive `factorial` or `sumToN` from shuffled blocks.
  - FIB: fill missing base case condition or recursive call.

---

## 8. Arrays – Tutorial specs for AI

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions (or array parameters); strings (as a separate topic"”use only `int` arrays in 8.1–8.3); pointers (except `&var` in `scanf`); structures; dynamic allocation.
  - Use only: variables, loops, `printf`/`scanf`, and fixed-size arrays. In 8.4 (2D), keep to declaration, input, and print only.

> **Pending tutorials requested here**: create **2–3 array tutorials (1D only, no multidimensional yet)**, each with **4–6 lessons**, that introduce: basic declaration/initialization, index"‘based access without loops, then loops to read/write/print, then small algorithms (max, min, bubble sort).

#### 8.1 Topic – Intro to 1D Arrays (declaration, initialization, index access)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions (or array parameters); strings (as a separate topic"”use only `int` arrays here); pointers (except `&var` in `scanf`); structures; dynamic allocation; loops for array access in the _first_ lessons (introduce index-based read/write without loops first, then add loop-based printing once indices are clear).
  - Use only: variables, `printf`/`scanf`, fixed-size `int` arrays, index-based read/write (`arr[0]`, `arr[i]`), and later a simple loop to print all elements.
- **Core concepts**
  - Explain what an **array** is: a fixed"‘size collection of elements of the same type, stored in contiguous memory, accessed by index starting from 0.
  - Start with **initialized array** and **no loop**, so focus stays on the idea of indices.
- **Concept lessons (4–6)**
  - L1: Simple declaration and initialization with brace list: `int nums[] = {...};`.
  - L2: Reading individual elements with an index: `nums[0]`, `nums[1]`, etc. (no loop).
  - L3: Writing/updating elements with an index (no loop).
  - L4: Using a loop to **print** all elements of the initialized array.
  - L5: Common mistakes: out"‘of"‘bounds access, wrong index, uninitialized elements.
  - L6: Gentle intro to array length using a constant or macro (not `sizeof` details yet, unless you already use it elsewhere).
- **Example snippets (no loops first)**

```c
// 1. Declare and initialize an array
int nums[] = {10, 20, 30, 40, 50};

int main() {
    printf("First element = %d\n", nums[0]);
    printf("Second element = %d\n", nums[1]);

    // Write / update using index
    nums[2] = 99;  // change third element
    printf("Updated third element = %d\n", nums[2]);

    return 0;
}
```

```c
// 2. Print all elements using a for loop
int nums[] = {10, 20, 30, 40, 50};
int size = 5;  // known size

int main() {
    for (int i = 0; i < size; i++) {
        printf("nums[%d] = %d\n", i, nums[i]);
    }
    return 0;
}
```

#### 8.2 Topic – Fixed"‘size Arrays with Loops (read, write, print)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions (or array parameters); strings (as a topic"”use only `int` arrays); pointers (except `&var` in `scanf`); structures; dynamic allocation. Do **not** put array logic inside separate functions"”keep all read/write/print in `main` or a single scope.
  - Use only: variables, loops, `printf`/`scanf`, fixed-size `int` arrays, reading input into array with a loop, printing forward/backward/evens.
- **Core concepts**
  - Declare an **empty array with fixed size**, e.g. `int nums[10];`.
  - Use loops to **read input into the array**, then to **print** or process it.
- **Concept lessons (4–6)**
  - L1: Declare `int nums[10];` and read 10 numbers from the user into it with a loop.
  - L2: Print the array:
    - Forward.
    - Backwards.
    - Only even elements.
  - L3: Simple validation: show what happens if you try to access `nums[10]` (explain it's invalid).
  - L4: Small exercises: change all values (e.g. add 1 to each).
  - L5: Examples with different sizes (e.g. `n` from user, but limit to max size).
  - L6: Common mistakes: reusing wrong loop bounds, mixing up `< size` vs `<= size`.
- **Example snippets**

```c
// 3. Read 10 integers into an array and print them
int nums[10];

int main() {
    // Read
    for (int i = 0; i < 10; i++) {
        printf("Enter element %d: ", i);
        scanf("%d", &nums[i]);
    }

    // Print forward
    printf("Array elements (forward):\n");
    for (int i = 0; i < 10; i++) {
        printf("%d ", nums[i]);
    }
    printf("\n");

    // Print backward
    printf("Array elements (backward):\n");
    for (int i = 9; i >= 0; i--) {
        printf("%d ", nums[i]);
    }
    printf("\n");

    return 0;
}
```

```c
// 4. Print only even elements of an array
int nums[10];

int main() {
    for (int i = 0; i < 10; i++) {
        printf("Enter element %d: ", i);
        scanf("%d", &nums[i]);
    }

    printf("Even elements:\n");
    for (int i = 0; i < 10; i++) {
        if (nums[i] % 2 == 0) {
            printf("%d ", nums[i]);
        }
    }
    printf("\n");

    return 0;
}
```

#### 8.3 Topic – Simple Algorithms on Arrays (max, min, bubble sort)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions; strings (as a topic); pointers (except `&var` in `scanf`); structures; dynamic allocation; other sorting algorithms (quick sort, merge sort, etc.). Stick to finding max, finding min, and bubble sort only.
  - Use only: variables, loops, `printf`/`scanf`, fixed-size `int` arrays, and algorithms for max, min, and bubble sort in ascending order.
- **Core concepts**
  - Use arrays with loops to solve small, classic problems:
    - Find **maximum** in an array.
    - Find **minimum** in an array.
    - Simple **bubble sort** to sort the array in ascending order.
  - Emphasize loop structure and how indices move.
- **Concept lessons (4–6)**
  - L1: Read `n` and `n` elements into `nums`, then find **max**.
  - L2: Find **min** similarly.
  - L3: Implement basic bubble sort, step–by–step.
  - L4: Print the array before/after sorting.
  - L5: Explain time complexity qualitatively (optional, at a very high level).
  - L6: Common mistakes: not initializing max/min, wrong inner loop bounds in bubble sort.
- **Example snippets**

```c
// 5. Find maximum in an array
int nums[100];

int main() {
    int n;
    printf("Enter number of elements (max 100): ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        printf("Enter element %d: ", i);
        scanf("%d", &nums[i]);
    }

    int max = nums[0];
    for (int i = 1; i < n; i++) {
        if (nums[i] > max) {
            max = nums[i];
        }
    }

    printf("Maximum value = %d\n", max);
    return 0;
}
```

```c
// 6. Find minimum in an array
int nums[100];

int main() {
    int n;
    printf("Enter number of elements (max 100): ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        printf("Enter element %d: ", i);
        scanf("%d", &nums[i]);
    }

    int min = nums[0];
    for (int i = 1; i < n; i++) {
        if (nums[i] < min) {
            min = nums[i];
        }
    }

    printf("Minimum value = %d\n", min);
    return 0;
}
```

```c
// 7. Bubble sort in ascending order
int nums[100];

int main() {
    int n;
    printf("Enter number of elements (max 100): ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        printf("Enter element %d: ", i);
        scanf("%d", &nums[i]);
    }

    // Bubble sort
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (nums[j] > nums[j + 1]) {
                int temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            }
        }
    }

    printf("Sorted array:\n");
    for (int i = 0; i < n; i++) {
        printf("%d ", nums[i]);
    }
    printf("\n");

    return 0;
}
```

- **Exercises / other lesson types**
  - MCQ: identify valid/invalid array indexing; choose correct loop bounds.
  - Code–rearrange: build max/min/bubble sort from blocks.
  - FIB: fill missing indexes or initial values (`max = nums[0];`, `i < n - 1`, etc.).

#### 8.4 Topic – 2D Arrays (brief intro)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: passing arrays to functions (including 2D arrays); strings (as a topic); pointers (except `&var` in `scanf`); pointers to rows or pointer–array relationship; structures; dynamic allocation.
  - Use only: variables, nested loops, `printf`/`scanf`, fixed-size 2D `int` arrays, declaration, initialization, user input, and printing with nested loops.
- **Scope**
  - Very short introduction to **2D integer arrays** as "rows and columns".
  - 1st program: declare and initialize a small 2D array, then print it.
  - 2nd program: declare a 2D array, read values from user, then print.
- **Concept lessons (2–3, inside this brief topic)**
  - L1: `int a[2][3] = { {..}, {..} };` and nested loops to print all elements.
  - L2: `int a[rows][cols];` with fixed small sizes (e.g. 2Ã—3 or 3Ã—3), user input then print.
  - L3: Explain row/column indexing and how `a[row][col]` looks similar to nested `for` loops used in patterns.
- **Example snippets**

```c
// 1. Declare and initialize a 2x3 array, then print it
int nums[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};

int main() {
    printf("2x3 matrix values:\n");

    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            printf("%d ", nums[row][col]);
        }
        printf("\n");
    }

    return 0;
}
```

```c
// 2. Read values into a 2x3 array from user, then print
int nums[2][3];

int main() {
    // Read values
    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            printf("Enter element [%d][%d]: ", row, col);
            scanf("%d", &nums[row][col]);
        }
    }

    // Print values
    printf("You entered:\n");
    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            printf("%d ", nums[row][col]);
        }
        printf("\n");
    }

    return 0;
}
```

---

## 9 Strings

### 9.1 Topic – Basic C Strings (char arrays, literals, `%s`)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: string library functions (`strlen`, `strcpy`, `strcmp`, `strcat`); pointers (to `char`); structures; dynamic allocation.
  - Use only: `char` arrays, the null character `'\0'`, string literals `"..."`, `%s` with `printf`/`scanf`, and index-based read/write. Use only concepts needed for basic arrays (indexing, loops) without teaching full array topic here.
- **Core concepts**
  - A C string is an **array of `char`** ending with a special **null character** `'\0'`.
  - There are two main ways to create a string:
    - Manually with a `char` array and characters.
    - Using double quotes `"..."` which automatically adds `'\0'`.
  - `%s` in `printf` and `scanf` works with C strings (arrays of `char`).
- **Concept lessons (4–6)**
  - L1: Declare a `char` array and initialize it character"‘by"‘character (with `'\0'`).
  - L2: Use the **better way**: double quotes `"Codehub"`, automatic null terminator.
  - L3: Print strings using `%s` with `printf`.
  - L4: Access and change characters using index (`name[0]`, `name[1]`, etc.).
  - L5: Simple input with `scanf("%s", name)` (mention that it stops at space).
  - L6: Common mistakes: forgetting `'\0'` in manual arrays, not leaving enough space, going out of bounds.
- **Example snippets**

```c
// 1. Manual char array with explicit characters (not yet a safe C string)
char name1[7] = {'C', 'o', 'd', 'e', 'h', 'u', 'b'}; // no '\0'
int main() {
    // This is NOT a proper C string for %s, because there is no '\0'.
    // printf("%s\n", name1); // Unsafe: may print garbage
    return 0;
}
// 2. Proper char array with null terminator
char name2[8] = {'C', 'o', 'd', 'e', 'h', 'u', 'b', '\0'};
int main() {
    printf("%s\n", name2); // Safe: prints "Codehub"
    return 0;
}
// 3. Better way: using double quotes
char name3[] = "Codehub"; // compiler adds '\0' automatically
int main() {
    printf("%s\n", name3); // prints "Codehub"
    return 0;
}
// 4. Index-based read and write
char word[6] = "hello"; // 'h','e','l','l','o','\0'
int main() {
    printf("Original: %s\n", word);
    // Read characters by index
    printf("First character: %c\n", word[0]);
    printf("Second character: %c\n", word[1]);
    // Write / modify a character
    word[0] = 'H'; // change 'h' to 'H'
    printf("Modified: %s\n", word); // prints "Hello"
    return 0;
}

// 5. Simple input and output using %s
char name[20];
int main() {
    printf("Enter your name (no spaces): ");
    scanf("%19s", name); // read up to 19 chars + '\0'
    printf("Hello, %s!\n", name);
    return 0;
}

```

### 9.2 Topic – Common String Functions (`strlen`, `strcpy`, `strcmp`, more)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: pointers (to `char` or string args); structures; manual loop-based implementations of `strlen`/`strcpy` (unless as optional "how it works"); other `<string.h>` functions beyond the 4 listed (e.g. `strncpy`, `strstr`).
  - Use only: basic C strings (9.1), `#include <string.h>`, and the four functions: `strlen`, `strcpy`, `strcmp`, `strcat`.
- **Core concepts**
  - Introduce a few **essential string library functions** from `<string.h>`:
    - `strlen` – find length of a string (number of characters before `'\0'`).
    - `strcpy` – copy one string into another.
    - `strcmp` – compare two strings lexicographically.
    - Optionally `strcat` – append one string to another.
  - Emphasize that:
    - You must include `#include <string.h>`.
    - Destination arrays must be large enough before copying or concatenating.
- **Concept lessons (4–6)**
  - L1: Use `strlen` to print the length of a string literal and of a user input string.
  - L2: Use `strcpy` to copy one string into another (show before and after).
  - L3: Use `strcmp` to compare two strings (equal vs not equal, and basic ordering).
  - L4: Use `strcat` to join two small strings (e.g. first name + last name), with a note on buffer size.
  - L5: Simple "login/password" style comparison using `strcmp`.
  - L6: Common mistakes: forgetting `<string.h>`, using too small destination buffers, misunderstanding `strcmp` return value.
- **Example snippets**

```c
// 1. Using strlen to find length of a string
#include <stdio.h>
#include <string.h>

int main() {
    char word[] = "Codehub";
    int length = strlen(word);

    printf("String: %s\n", word);
    printf("Length = %d\n", length); // prints 7

    return 0;
}
```

```c
// 2. Using strcpy to copy one string into another
#include <stdio.h>
#include <string.h>

int main() {
    char source[] = "Codehub";
    char destination[20]; // large enough to hold source

    strcpy(destination, source);

    printf("Source: %s\n", source);
    printf("Destination: %s\n", destination);

    return 0;
}
```

```c
// 3. Using strcmp to compare two strings
#include <stdio.h>
#include <string.h>

int main() {
    char password[] = "codehub123";
    char input[20];

    printf("Enter password: ");
    scanf("%19s", input);

    if (strcmp(password, input) == 0) {
        printf("Access granted.\n");
    } else {
        printf("Access denied.\n");
    }

    return 0;
}
```

```c
// 4. Using strcat to join first name and last name
#include <stdio.h>
#include <string.h>

int main() {
    char firstName[20] = "Code";
    char lastName[20]  = "hub";
    char fullName[40];

    // Copy firstName into fullName
    strcpy(fullName, firstName);
    // Append lastName to fullName
    strcat(fullName, lastName);

    printf("Full name: %s\n", fullName); // "Codehub"
    return 0;
}
```

```c
// 5. strlen with user input
#include <stdio.h>
#include <string.h>

int main() {
    char name[50];

    printf("Enter your name (no spaces): ");
    scanf("%49s", name);

    printf("Hello, %s! Your name has %d characters.\n", name, strlen(name));
    return 0;
}
```

---

## 10. Pointers – Tutorial specs for AI

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: pointer arithmetic; relationship between arrays and pointers (array decay); passing pointers to functions (pass-by-reference); pointers to structs (`->`); dynamic memory (`malloc`/`free`); double pointers.
  - Use only: variables and basic types; `printf`/`scanf`; `&` (address-of); `*` (dereference); `int *p`; storing and printing addresses with `%p`; reading and changing a single `int` through a pointer.

> **Pending tutorials requested here**: create **1–2 pointer tutorials** that introduce addresses, pointer variables, and basic pointer use with integers, in a very visual, beginner"‘friendly way.

### 10.1 Topic – Addresses and Basic int Pointers

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: pointer arithmetic; relationship between arrays and pointers (array decay); passing pointers to functions (pass-by-reference); pointers to structs or the `->` operator; dynamic memory (`malloc`/`free`); double pointers.
  - Use only: `&` (address-of), `*` (dereference), `int *p`, storing and printing addresses with `%p`, reading and changing a single `int` through a pointer. Restrict to single variables and `int *` only.
- **Core concepts**

  - Use `&` in `printf` to show that it gives the **address of a variable**.
  - Introduce `int *p;` as a **pointer to int** that can store such an address.
  - Compare:
    - Copying values between two normal variables (independent copies).
    - Copying addresses into a pointer (both names referencing the same underlying value).

- **Concept lessons (4–6)**

  - L1: Print address of a simple `int` using `&` and `%p` (explain "this is a memory address").
  - L2: Store that address in an `int *` pointer and print the pointer value.
  - L3: Use `*p` to read and change the value through the pointer.
  - L4: Show that with **two separate `int` variables** changing one does **not** change the other.
  - L5: Show that with a pointer both names (`x` and `*ptr`) refer to the same memory, so changing one changes what the other "sees".
  - L6: Common mistakes: forgetting to initialize a pointer, using the wrong format specifier, confusing `&` and `*`.

- **Example snippets**

```c
// 1. Using & in printf to show the address of a variable
#include <stdio.h>

int main() {
    int x = 10;
    printf("Value of x = %d\n", x);
    printf("Address of x = %p\n", &x); // %p prints an address
    return 0;
}
```

```c
// 2. Storing an address in a pointer
#include <stdio.h>

int main() {
    int x = 10;
    int *ptr;       // pointer to int
    ptr = &x;       // store address of x

    printf("Value of x      = %d\n", x);
    printf("Value via *ptr  = %d\n", *ptr);
    printf("Address of x    = %p\n", &x);
    printf("Value of ptr    = %p\n", ptr); // same as &x

    return 0;
}
```

```c
// 3. Two normal variables: copying values (independent)
#include <stdio.h>

int main() {
    int a = 10;
    int b = a;  // copy value of a into b

    printf("Initially: a = %d, b = %d\n", a, b);

    a = 20;     // change a only
    printf("After changing a: a = %d, b = %d\n", a, b);
    // b is still 10 – independent copy

    return 0;
}
```

```c
// 4. Pointer: changing through pointer affects original variable
#include <stdio.h>

int main() {
    int a = 10;
    int *p = &a;   // p points to a

    printf("Initially: a = %d, *p = %d\n", a, *p);

    *p = 20;       // change value via pointer
    printf("After *p = 20: a = %d, *p = %d\n", a, *p);
    // Both show 20 – they refer to the same memory

    return 0;
}
```

```c
// 5. Using pointer to copy value from one variable to another
#include <stdio.h>

int main() {
    int source = 42;
    int dest = 0;
    int *p = &source;

    printf("Before copy: source = %d, dest = %d\n", source, dest);

    dest = *p; // copy value from source via pointer

    printf("After copy: source = %d, dest = %d\n", source, dest);

    source = 100; // change source again
    printf("After changing source: source = %d, dest = %d\n", source, dest);
    // dest remains 42 (it's a copy), while source changed

    return 0;
}
```

---

## 11. Structures – Tutorial specs for AI

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: pointers to structs; the `->` operator; passing structs by pointer; dynamic allocation of structs; unions; typedef; nested structs.
  - Use only: `struct` definition; declaring struct variables; member access with `.`; arrays of structs; reading and printing struct fields. For `scanf` on struct members use `&var.member`; do not teach or use pointers to structs.

> **Pending tutorials requested here**: create **1–2 structure tutorials** that motivate `struct` by showing how messy it is to track many separate variables, then show how a `struct` groups related data and scales cleanly to multiple entities (students, cars, animals, etc.).

### 11.1 Topic – Why Structures? (Motivation with separate variables vs `struct`)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: pointers to structs; the `->` operator; passing structs by pointer; dynamic allocation of structs; unions; typedef (unless already in curriculum); nested structs.
  - Use only: `struct` definition, declaring struct variables, member access with `.`, arrays of structs, reading/printing struct fields. For `scanf` on struct members use `&var.member` only; do not teach struct pointers.
- **Core concepts**

  - Show the "pain" of managing many separate variables for a single concept (e.g. one student's name, age, roll number, marks).
  - Show how this becomes even worse when you need to handle **multiple students**.
  - Introduce `struct` as a way to group related fields into **one custom type**.

- **Concept lessons (4–6)**

  - L1: Example with individual variables for one student: `student1Name`, `student1Age`, `student1Marks`.
  - L2: Extend to multiple students with separate variables (student2, student3) and show how hard it is to scale.
  - L3: Introduce `struct Student` with fields for name, age, marks.
  - L4: Create and print one `struct Student`.
  - L5: Create an **array of `struct Student`** and show a loop over them.
  - L6: Repeat the idea with other domains (Car, Animal) to reinforce patterns.

- **Example snippets – separate variables (student)**

```c
// 1. Managing student data with separate variables (hard to scale)
#include <stdio.h>

int main() {
    // Student 1
    char student1Name[20] = "Alice";
    int  student1Age = 18;
    float student1Marks = 92.5f;

    // Student 2
    char student2Name[20] = "Bob";
    int  student2Age = 19;
    float student2Marks = 85.0f;

    printf("Student 1: %s, Age: %d, Marks: %.2f\n",
           student1Name, student1Age, student1Marks);
    printf("Student 2: %s, Age: %d, Marks: %.2f\n",
           student2Name, student2Age, student2Marks);

    // Adding Student 3 means adding more separate variables...

    return 0;
}
```

```c
// 2. Using struct to group student data
#include <stdio.h>

struct Student {
    char  name[20];
    int   age;
    float marks;
};

int main() {
    struct Student s1 = {"Alice", 18, 92.5f};
    struct Student s2 = {"Bob",   19, 85.0f};

    printf("Student 1: %s, Age: %d, Marks: %.2f\n",
           s1.name, s1.age, s1.marks);
    printf("Student 2: %s, Age: %d, Marks: %.2f\n",
           s2.name, s2.age, s2.marks);

    return 0;
}
```

```c
// 3. Array of structures: multiple students
#include <stdio.h>

struct Student {
    char  name[20];
    int   age;
    float marks;
};

int main() {
    struct Student students[3] = {
        {"Alice", 18, 92.5f},
        {"Bob",   19, 85.0f},
        {"Carol", 20, 78.0f}
    };

    for (int i = 0; i < 3; i++) {
        printf("Student %d: %s, Age: %d, Marks: %.2f\n",
               i + 1,
               students[i].name,
               students[i].age,
               students[i].marks);
    }

    return 0;
}
```

```c
// 4. Reading one student from user input
#include <stdio.h>

struct Student {
    char  name[20];
    int   age;
    float marks;
};

int main() {
    struct Student s;

    printf("Enter name: ");
    scanf("%19s", s.name);

    printf("Enter age: ");
    scanf("%d", &s.age);

    printf("Enter marks: ");
    scanf("%f", &s.marks);

    printf("You entered: %s, Age: %d, Marks: %.2f\n",
           s.name, s.age, s.marks);

    return 0;
}
```

```c
// 5. Reading multiple students into an array
#include <stdio.h>

struct Student {
    char  name[20];
    int   age;
    float marks;
};

int main() {
    struct Student students[3];

    for (int i = 0; i < 3; i++) {
        printf("Enter name for student %d: ", i + 1);
        scanf("%19s", students[i].name);

        printf("Enter age for student %d: ", i + 1);
        scanf("%d", &students[i].age);

        printf("Enter marks for student %d: ", i + 1);
        scanf("%f", &students[i].marks);
    }

    printf("\nStudent details:\n");
    for (int i = 0; i < 3; i++) {
        printf("Student %d: %s, Age: %d, Marks: %.2f\n",
               i + 1,
               students[i].name,
               students[i].age,
               students[i].marks);
    }

    return 0;
}
```

### 11.2 Topic – More Struct Examples (Car, Animal, etc.)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: pointers to structs; the `->` operator (you may mention it exists in a later topic"”do not teach or use it here); passing structs by pointer; dynamic allocation of structs; unions; typedef; nested structs.
  - Use only: `struct` definition, struct variables, member access with `.`, arrays of structs, reading/printing/updating fields. If L6 mentions "`.` vs `->`", only state that `->` is used later with pointers"”do not teach `->` here.
- **Core concepts**

  - Reuse the same "group related data" idea in different domains:
    - `struct Car` with brand, model, year, price.
    - `struct Animal` with species, age, weight or sound.
  - Show how adding new entities is just adding new `struct` variables (or array elements), not dozens of separate variables.

- **Concept lessons (4–6)**

  - L1: Define `struct Car` and create one car instance.
  - L2: Create and print multiple cars (array of `struct Car`).
  - L3: Define `struct Animal` and create a few animals.
  - L4: Loop over arrays of structs to print summaries.
  - L5: Small updates: changing one field (e.g. car's price).
  - L6: Common mistakes: forgetting `struct` keyword, using `.` vs `->` (you can mention pointers to structs later).

- **Example snippets – Car**

```c
// 4. Struct example: Car
#include <stdio.h>

struct Car {
    char brand[20];
    char model[20];
    int  year;
    float price;
};

int main() {
    struct Car car1 = {"Toyota", "Corolla", 2020, 15000.0f};
    struct Car car2 = {"Honda",  "Civic",   2019, 14000.0f};

    printf("Car 1: %s %s, Year: %d, Price: %.2f\n",
           car1.brand, car1.model, car1.year, car1.price);
    printf("Car 2: %s %s, Year: %d, Price: %.2f\n",
           car2.brand, car2.model, car2.year, car2.price);

    return 0;
}
```

```c
// 5. Array of cars
#include <stdio.h>

struct Car {
    char brand[20];
    char model[20];
    int  year;
    float price;
};

int main() {
    struct Car cars[3] = {
        {"Toyota", "Corolla", 2020, 15000.0f},
        {"Honda",  "Civic",   2019, 14000.0f},
        {"Ford",   "Focus",   2018, 12000.0f}
    };

    for (int i = 0; i < 3; i++) {
        printf("Car %d: %s %s, Year: %d, Price: %.2f\n",
               i + 1,
               cars[i].brand,
               cars[i].model,
               cars[i].year,
               cars[i].price);
    }

    return 0;
}
```

```c
// 6. Reading one car from user input
#include <stdio.h>

struct Car {
    char brand[20];
    char model[20];
    int  year;
    float price;
};

int main() {
    struct Car car;

    printf("Enter brand: ");
    scanf("%19s", car.brand);

    printf("Enter model: ");
    scanf("%19s", car.model);

    printf("Enter year: ");
    scanf("%d", &car.year);

    printf("Enter price: ");
    scanf("%f", &car.price);

    printf("Car: %s %s, Year: %d, Price: %.2f\n",
           car.brand, car.model, car.year, car.price);

    return 0;
}
```

- **Example snippets – Animal**

```c
// 6. Struct example: Animal
#include <stdio.h>

struct Animal {
    char species[20];
    int  age;
    float weight;
};

int main() {
    struct Animal a1 = {"Dog", 3, 12.5f};
    struct Animal a2 = {"Cat", 2,  4.0f};

    printf("Animal 1: %s, Age: %d, Weight: %.1f\n",
           a1.species, a1.age, a1.weight);
    printf("Animal 2: %s, Age: %d, Weight: %.1f\n",
           a2.species, a2.age, a2.weight);

    return 0;
}
```

```c
// 7. Array of animals
#include <stdio.h>

struct Animal {
    char species[20];
    int  age;
    float weight;
};

int main() {
    struct Animal animals[3] = {
        {"Dog",  3, 12.5f},
        {"Cat",  2,  4.0f},
        {"Cow",  5, 250.0f}
    };

    for (int i = 0; i < 3; i++) {
        printf("Animal %d: %s, Age: %d, Weight: %.1f\n",
               i + 1,
               animals[i].species,
               animals[i].age,
               animals[i].weight);
    }

    return 0;
}
```

---

## 12. Enums – Tutorial specs for AI

> **Pending tutorials requested here**: create **1–2 enum tutorials**, each with **4–6 lessons**, that introduce `enum` as a way to give readable names to integer constants, show how to declare and use enums, and combine enums with `if`/`switch` in small programs. Follow the same lesson structure (concept → mcq → codeblock_rearranging → fill_in_blanks) with small C **snippets**, common mistakes, and best practices.

### 12.1 Topic – Basic Enums (named integer constants)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `typedef enum` aliases; assigning custom underlying types; bit flags or bitwise operators; using enums across multiple files; pointers to enums; advanced casting.
  - Use only: simple `enum` declarations in the same file, default integer values starting from 0 (or simple manual assignments), variables of enum type, and printing enum values as integers or with simple `if`/`else` text messages.
- **Core concepts**
  - Explain that an **enum** is a way to give **names** to a small set of related integer constants (e.g. days, directions, colors, menu options).
  - Show the basic syntax:
    - `enum Day { MONDAY, TUESDAY, WEDNESDAY };`
    - Declare a variable: `enum Day today = MONDAY;`
  - Emphasize:
    - Enums are stored as integers under the hood.
    - First value is 0 by default, next is 1, 2, … (or as explicitly assigned).
    - Enums make code **more readable** than using raw numbers like `0`, `1`, `2`.
- **Concept lessons (4–6)**
  - L1: Define a simple enum with 3–5 values (e.g. `enum Day`), assign a variable, and print the value as an integer.
  - L2: Show how default enum values increment (0, 1, 2, …) and how to set one explicit value (e.g. start from 1).
  - L3: Use `if`/`else` with enum variables to print human-friendly messages.
  - L4: Show a small example where using enums is clearer than `#define` or magic numbers.
  - L5: Common mistakes: forgetting `enum` keyword in variable declarations, using invalid enum names, assuming enums are strings.
  - L6: Best practices: use ALL_CAPS names for enum members; group related constants into one enum; avoid relying on the exact numeric value unless really needed.
- **Example snippets**

```c
// 1. Basic enum for days of the week
#include <stdio.h>

enum Day {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY
};

int main() {
    enum Day today = WEDNESDAY;

    printf("Today (as number) = %d\n", today); // likely prints 2

    if (today == MONDAY) {
        printf("It is Monday.\n");
    } else if (today == FRIDAY) {
        printf("It is Friday.\n");
    } else {
        printf("It is a mid-week day.\n");
    }

    return 0;
}
```

```c
// 2. Enum with explicit starting value
#include <stdio.h>

enum Status {
    STATUS_OK = 1,
    STATUS_WARNING = 2,
    STATUS_ERROR = 3
};

int main() {
    enum Status current = STATUS_WARNING;

    printf("Current status code = %d\n", current); // prints 2

    if (current == STATUS_OK) {
        printf("All good.\n");
    } else if (current == STATUS_WARNING) {
        printf("Be careful, warning!\n");
    } else if (current == STATUS_ERROR) {
        printf("Something went wrong.\n");
    }

    return 0;
}
```

```c
// 3. Using enum for menu choices instead of magic numbers
#include <stdio.h>

enum MenuOption {
    MENU_ADD = 1,
    MENU_SUBTRACT = 2,
    MENU_MULTIPLY = 3,
    MENU_EXIT = 4
};

int main() {
    int choice;

    printf("1. Add\n");
    printf("2. Subtract\n");
    printf("3. Multiply\n");
    printf("4. Exit\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);

    if (choice == MENU_ADD) {
        printf("You chose Add.\n");
    } else if (choice == MENU_SUBTRACT) {
        printf("You chose Subtract.\n");
    } else if (choice == MENU_MULTIPLY) {
        printf("You chose Multiply.\n");
    } else if (choice == MENU_EXIT) {
        printf("You chose Exit.\n");
    } else {
        printf("Invalid choice.\n");
    }

    return 0;
}
```

---
