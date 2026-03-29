## Pending Java Topics - Tutorial Planning (Language: Java)

### Meta

- **Target language**: `java`
- **Audience**: Absolute beginners to lower-intermediate
- **Goal**: Step-by-step, concept-first tutorials with lots of small code examples and practice (same structure as C++ version, but using Java syntax and conventions).
- **Exclusions**: Each topic has an **Exclusions** subsection listing what must not be taught or mentioned in that topic. When prompting an AI to generate content for a topic, copy that topic's full Exclusions block into the prompt so the AI stays within scope. Each request is standalone; do not refer to other topics or sections.
- **Hard constraints for AI generation**
  - Do **not** mention excluded topics even as a “future note”, “best practice”, “advanced tip”, or “real-world note”.
  - **Allowed micro-mention**: at most **one sentence** to acknowledge something exists; **no rules**, **no examples**, **no exercises**, and **no comparisons**.
  - **Headers / boilerplate allowlist**:
    - `public class Main { public static void main(String[] args) { ... } }`
    - Optionally a single package line like `package com.codehub;` **only if explicitly allowed per topic**.
    - Do **not** add other classes in separate files, packages, frameworks, or imports unless a topic explicitly allows them.
  - **Class layout**: Do **not** define classes inside the `Main` class. Always use **top-level classes** (each class defined outside `Main`, in the same file or in separate files as the topic allows). Example: `class Student { ... }` then `public class Main { ... }` in the same file.
  - **Clean code formatting (mandatory in every code block)**
    - Write **one statement per line** (no `a(); b();` on the same line).
    - Always use curly braces `{ ... }` for `if`/`else`, all loops, and any conditional/loop bodies (even single-line bodies).
    - Do not write one-line method bodies (e.g., `int add(...) { return ...; }`). Methods/constructors must be multi-line and readable.
  - Output must follow the topic’s required structure exactly; do not add extra sections.

---

## 5. Loops - Repetition (Java)

### 5.1 `do-while` loop - Tutorial spec for AI (Java)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `for` loop; methods (defining or calling) beyond `main`; recursion; arrays; `String` as a topic (beyond basic console input/output text); objects; custom classes (define any class as a top-level class outside `Main`, not inside it).
  - Do **not** introduce: `break` or `continue` unless this topic explicitly includes them.
  - Do **not** introduce: exception handling (`try/catch`), `Scanner` pitfalls, or input validation as a full topic.
  - Use only: local variables, `System.out.print/println`, `if`/`else`, `while`, and `do { ... } while (condition);`.
- **Assumed Known (do not re-teach in this topic)**
  - Basic Java program shape:
    - `public class Main { public static void main(String[] args) { ... } }`
  - Primitive types `int`, `boolean`, and simple arithmetic/comparison.
  - Basic `if`/`else` usage.
  - Simple console output with `System.out.println`.
- **Positioning and comparison**
  - Clearly contrast `while` vs `do-while`:
    - `while`: condition checked **before** body (may run 0 times).
    - `do-while`: body runs **at least once**, then condition is checked.
  - Include a simple natural-language analogy (e.g., show a menu at least once, then keep showing while the user continues).
- **Syntax and flow (Concept lesson)**
  - Canonical syntax:
    - `do { /* body */ } while (condition);`
  - Include a mermaid `flowchart TD` diagram highlighting:
    - Execute body once -> check condition -> repeat or exit.
- **Menu-driven example (core example)**
  - Include one complete menu program using `do-while`:
    - Menu prints once.
    - Reads user choice (use a very simple input mechanism; if using `Scanner`, keep it minimal and do not turn it into an input-handling lesson).
    - Repeats until user chooses Exit.
  - Include: explanation, common mistakes, best practices.
- **Lesson breakdown (match existing pattern)**
  - Concept -> MCQ -> codeblock_rearranging -> fill_in_blanks
  - Include `mermaid_code`, `keyPoints`, `commonMistakes`, `bestPractices`, `practiceHints`.
- **e.g codes (Java)**

```java
// 1. Print numbers from 1 to 100 using do-while
public class Main {
    public static void main(String[] args) {
        int i = 1;
        do {
            System.out.print(i + " ");
            i++;
        } while (i <= 100);
    }
}
```

```java
// 2. Print numbers from 100 down to 1 using do-while
public class Main {
    public static void main(String[] args) {
        int i = 100;
        do {
            System.out.print(i + " ");
            i--;
        } while (i >= 1);
    }
}
```

```java
// 3. Demonstrate: do-while executes at least once
public class Main {
    public static void main(String[] args) {
        int i = 100;
        do {
            System.out.println(i); // prints once even though condition is false
        } while (i < 10);
    }
}
```

```java
// 4. Sum numbers from 1 to 10 using do-while
public class Main {
    public static void main(String[] args) {
        int sum = 0;
        int i = 1;
        do {
            sum += i;
            i++;
        } while (i <= 10);
        System.out.println("Sum = " + sum);
    }
}
```

---

### 5.2 `for` loop - Tutorial spec for AI (Java)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods beyond `main`; recursion; arrays; collections (`ArrayList`, etc.); `String` operations as a separate topic; objects and custom classes (define any class as a top-level class outside `Main`, not inside it).
  - Do **not** include star/shape patterns in this section (patterns will be a separate topic).
  - Use only: primitive variables, `System.out.print/println`, `if`/`else`, `while`, `do-while`, and `for` loops.
- **Assumed Known (do not re-teach in this section)**
  - Basic Java program shape and `main` method.
  - Variables, comparisons, and `if`/`else`.
  - Simple counting with `while`/`do-while` (this section adds `for`).

> **Pending tutorials requested here**: create **3–4 `for`-loop tutorials**, each with **4–6 lessons**, covering counting, numeric patterns (sum, factorial, tables, power), and nested loops (numeric only). Follow the lesson structure: concept -> mcq -> codeblock_rearranging -> fill_in_blanks, with mermaid flowcharts, `keyPoints`, `commonMistakes`, `bestPractices`, and multiple small Java code snippets.

#### 5.2.A Topic - `for` Loop Basics (Counting)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods beyond `main`; recursion; arrays; collections; strings as a topic; star/shape patterns.
  - Use only: `for` loops, counters, and console output with `System.out.print/println`.
- **Concept lessons (4–6)**
  - L1: Structure of `for (initialization; condition; update)` with mermaid flowchart.
  - L2: Simple counting 1 to 100.
  - L3: Counting 100 to 1 (decrementing loop).
  - L4: Counting from a given `start` to `end` (inclusive).
  - L5: Different step sizes (e.g. step 2, step 5).
  - L6: Why putting all controls in one line makes `for` safer than `while` for counting.
- **Example snippets (Java)**

```java
// 1. Print numbers from 1 to 100 using for loop
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 100; i++) {
            System.out.print(i + " ");
        }
    }
}
```

```java
// 2. Print numbers from 100 down to 1 using for loop
public class Main {
    public static void main(String[] args) {
        for (int i = 100; i >= 1; i--) {
            System.out.print(i + " ");
        }
    }
}
```

```java
// 3. Print from start to end (inclusive)
public class Main {
    public static void main(String[] args) {
        int start = 5;
        int end = 10;
        for (int i = start; i <= end; i++) {
            System.out.print(i + " ");
        }
    }
}
```

```java
// 4. Even numbers from 2 to 100
public class Main {
    public static void main(String[] args) {
        for (int i = 2; i <= 100; i += 2) {
            System.out.print(i + " ");
        }
    }
}
```

#### 5.2.B Topic - `for` Loop for Numeric Patterns (Sum, Factorial, Tables, Power)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods beyond `main`; recursion; arrays; collections; strings as a topic; star/shape patterns.
  - Use only: `for` loops, accumulators, primitive types, and console output.
- **Concept lessons (4–6)**
  - L1: Sum of numbers from 1 to `n`.
  - L2: Factorial of a single number `n`.
  - L3: Multiplication table of a number (1 to 10).
  - L4: Power of a number (`a^b`) via repeated multiplication.
  - L5: Sum of even / odd numbers up to `n`.
  - L6: Common mistakes (off-by-one errors, wrong condition, forgetting to reset accumulators).
- **Example snippets (Java)**

```java
// Sum of numbers from 1 to n
public class Main {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println("Sum = " + sum);
    }
}
```

```java
// Factorial of n
public class Main {
    public static void main(String[] args) {
        int n = 5;
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        System.out.println("Factorial of " + n + " = " + fact);
    }
}
```

```java
// Multiplication table of a number (1 to 10)
public class Main {
    public static void main(String[] args) {
        int n = 7;
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }
    }
}
```

```java
// Compute a^b using repeated multiplication
public class Main {
    public static void main(String[] args) {
        int a = 2;
        int b = 5;
        long result = 1;
        for (int i = 1; i <= b; i++) {
            result *= a;
        }
        System.out.println(a + "^" + b + " = " + result);
    }
}
```

```java
// Sum of even numbers from 1 to n
public class Main {
    public static void main(String[] args) {
        int n = 10;
        int sumEven = 0;
        for (int i = 2; i <= n; i += 2) {
            sumEven += i;
        }
        System.out.println("Sum of even numbers = " + sumEven);
    }
}
```

#### 5.2.C Topic - Nested `for` Loops (Numeric Only)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods beyond `main`; recursion; arrays; collections; strings as a topic; star or shape patterns.
  - Use only: nested `for` loops with numeric output (grids, tables, factorials 1 to 10).
- **Concept lessons (4–6)**
  - L1: What is a nested loop? (outer vs inner, with mermaid flowchart).
  - L2: Simple numeric grid.
  - L3: Table of tables.
  - L4: Factorials of 1 to 10 using nested `for`.
  - L5: Tracing nested loops step by step.
  - L6: Common mistakes (reusing same loop variable, wrong bounds, forgetting to reset inner variables).
- **Example snippets (Java)**

```java
// 3x4 grid of (row, col)
public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 4; col++) {
                System.out.print("(" + row + "," + col + ") ");
            }
            System.out.println();
        }
    }
}
```

```java
// Tables from 1 to 5 (each 1 to 10)
public class Main {
    public static void main(String[] args) {
        for (int n = 1; n <= 5; n++) {
            System.out.println("Table of " + n + ":");
            for (int i = 1; i <= 10; i++) {
                System.out.println(n + " x " + i + " = " + (n * i));
            }
            System.out.println();
        }
    }
}
```

```java
// Factorials of numbers from 1 to 10 using nested for
public class Main {
    public static void main(String[] args) {
        for (int n = 1; n <= 10; n++) {
            long fact = 1;
            for (int i = 1; i <= n; i++) {
                fact *= i;
            }
            System.out.println("Factorial of " + n + " = " + fact);
        }
    }
}
```

---

### 5.3 Patterns with `for` loops - Tutorial spec for AI (Java)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods beyond `main`; recursion; arrays (beyond simple loop counters); collections; strings as a topic.
  - Do **not** include numeric algorithms (sum, factorial, power, etc.).
  - Use only: nested `for` loops, `System.out.print/println`, and printing `*` or small integers for pattern output.

#### 5.3.A Topic - Rectangle Patterns (Rows x Columns)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods; recursion; arrays (beyond counters); collections; strings as a topic; numeric algorithms.
  - Use only: nested `for` loops and console printing.

```java
// Rectangle of '*' (3 rows, 5 columns)
public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 5; col++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}
```

```java
// Rectangle of row numbers
// 1 1 1 1 1
// 2 2 2 2 2
// 3 3 3 3 3
public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 5; col++) {
                System.out.print(row + " ");
            }
            System.out.println();
        }
    }
}
```

```java
// Rectangle of column numbers
// 1 2 3 4 5
// 1 2 3 4 5
// 1 2 3 4 5
public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 5; col++) {
                System.out.print(col + " ");
            }
            System.out.println();
        }
    }
}
```

#### 5.3.B Topic - Left Triangle Patterns (Right-angle on the left)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods; recursion; arrays (beyond counters); collections; strings as a topic; numeric algorithms.
  - Use only: nested `for` loops and simple printing.

```java
// Left triangle of '*'
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = 1; row <= rows; row++) {
            for (int col = 1; col <= row; col++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}
```

```java
// Left triangle of row numbers
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = 1; row <= rows; row++) {
            for (int col = 1; col <= row; col++) {
                System.out.print(row + " ");
            }
            System.out.println();
        }
    }
}
```

```java
// Left triangle of column numbers
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = 1; row <= rows; row++) {
            for (int col = 1; col <= row; col++) {
                System.out.print(col + " ");
            }
            System.out.println();
        }
    }
}
```

#### 5.3.C Topic - Inverted Left Triangle Patterns

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods; recursion; arrays (beyond counters); collections; strings as a topic; numeric algorithms.
  - Use only: nested `for` loops and printing.

```java
// Inverted left triangle of '*'
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = rows; row >= 1; row--) {
            for (int col = 1; col <= row; col++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}
```

```java
// Inverted left triangle of row numbers
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = rows; row >= 1; row--) {
            for (int col = 1; col <= row; col++) {
                System.out.print(row + " ");
            }
            System.out.println();
        }
    }
}
```

```java
// Inverted left triangle of column numbers
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = rows; row >= 1; row--) {
            for (int col = 1; col <= row; col++) {
                System.out.print(col + " ");
            }
            System.out.println();
        }
    }
}
```

#### 5.3.D Topic - Right & Inverted Right Triangles (Right-angle on the right)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods; recursion; arrays (beyond counters); collections; strings as a topic; numeric algorithms.
  - Use only: nested `for` loops and printing.

```java
// Right triangle of '*' (right angle on the right)
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = 1; row <= rows; row++) {
            for (int s = 1; s <= rows - row; s++) {
                System.out.print("  ");
            }
            for (int col = 1; col <= row; col++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}
```

```java
// Inverted right triangle of '*'
public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int row = rows; row >= 1; row--) {
            for (int s = 1; s <= rows - row; s++) {
                System.out.print("  ");
            }
            for (int col = 1; col <= row; col++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}
```

---

## 6. Methods - Tutorial specs for AI (Java)

> In Java, "functions" are **methods** (static methods in one class for beginners). Mirror the C++ function progression: void no-params → params no return → return values → predicate/helper.

#### 6.1 Topic - Introduction to Methods (void, no parameters)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: method parameters; return types other than `void`; returning values; recursion; arrays; String as a topic (beyond simple print); objects/custom classes (beyond the class containing `main`); overloading.
  - Use only: `static void methodName()` with empty parentheses, calling from `main`, and basic control flow/loops inside the method body. Any input must be read inside the method (not passed as parameters).
- **Assumed Known (do not re-teach in this topic)**

  - Basic Java program shape: `public class Main { public static void main(String[] args) { ... } }`
  - Variables and console I/O
  - `if` and loops at a basic "use it" level

- **Example snippets (Java)**

```java
// 1. Method defined but not called
public class Main {
    static void hello() {
        System.out.println("Hello Codehub");
    }
    public static void main(String[] args) {
        // hello(); // not called
    }
}
```

```java
// 2. Calling a simple void method once
public class Main {
    static void hello() {
        System.out.println("Hello Codehub");
    }
    public static void main(String[] args) {
        hello();
    }
}
```

```java
// 3. Reusing the same method multiple times
public class Main {
    static void hello() {
        System.out.println("Hello Codehub");
    }
    public static void main(String[] args) {
        hello();
        hello();
        hello();
    }
}
```

```java
// 4. Method to check voting eligibility (no parameters)
public class Main {
    static void checkVoting() {
        int age = 17;
        if (age >= 18) {
            System.out.println("You are eligible to vote.");
        } else {
            System.out.println("You are not eligible to vote.");
        }
    }
    public static void main(String[] args) {
        checkVoting();
    }
}
```

#### 6.2 Topic - Methods with Parameters (no return yet)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: return statements returning a value; non-void return types; recursion; passing arrays; passing objects; method overloading; varargs.
  - Use only: `static void methodName(int a, int b)` style parameters, passing arguments, and printing results inside the method.
- **Assumed Known (do not re-teach in this topic)**
  - What a static method is and how to call it from `main()`
  - Variables and basic types (`int`)
  - Printing with `System.out.println`

```java
// Function with two parameters: print sum
public class Main {
    static void printSum(int a, int b) {
        System.out.println("Sum = " + (a + b));
    }
    public static void main(String[] args) {
        printSum(3, 5);
    }
}
```

```java
// Function with one parameter: print square
public class Main {
    static void printSquare(int x) {
        System.out.println("Square of " + x + " = " + (x * x));
    }
    public static void main(String[] args) {
        printSquare(4);
        printSquare(7);
    }
}
```

#### 6.3 Topic - Methods with Return Values (using method output)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: recursion; passing arrays; passing objects; generics.
  - Use only: parameters (ints), non-void return types (e.g. `int`, `long`), and using return values in `main`.
- **Assumed Known (do not re-teach in this topic)**
  - Methods with parameters
  - Variables, expressions, and assignments
  - Printing results with `System.out.println`

```java
// Method that returns square
public class Main {
    static int square(int x) {
        return x * x;
    }
    public static void main(String[] args) {
        System.out.println(square(7));
    }
}
```

```java
// Method with two parameters: return sum (used in expression)
public class Main {
    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        int x = 5, y = 7;
        int s = add(x, y);
        System.out.println("Sum = " + s);
        System.out.println("Sum + 10 = " + (add(x, y) + 10));
    }
}
```

#### 6.4 Topic - Predicate and Helper Methods

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: recursion; passing arrays; passing objects; generics.
  - Use only: methods with parameters and return values returning `boolean` or `int` (e.g. 0/1) and helpers like `max2`.
- **Assumed Known (do not re-teach in this topic)**
  - Methods with parameters + return values
  - Using a method call inside `if (...)`
  - Printing outputs

```java
// Predicate method: isEven
public class Main {
    static boolean isEven(int x) {
        return x % 2 == 0;
    }
    public static void main(String[] args) {
        int n = 10;
        if (isEven(n)) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}
```

```java
// Helper method: max2
public class Main {
    static int max2(int a, int b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }
    public static void main(String[] args) {
        int x = 10, y = 20;
        System.out.println("Max = " + max2(x, y));
    }
}
```

---

## 7. Recursion - Tutorial specs for AI (Java)

#### 7.1 Topic - Recursion Basics (hello Codehub, counters, simple printing)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: arrays; String as parameters (beyond simple use); objects; return-value recursion for computation (sum/factorial return).
  - Use only: recursion with `void` methods, base cases, and printing/counting with `System.out.println`.
- **Assumed Known (do not re-teach in this topic)**

  - Static methods with parameters and return
  - `if` and base case idea

- **Example snippets (Java)**

```java
// 1. Infinite recursion example (DO NOT RUN AS-IS)
public class Main {
    static void helloRec() {
        System.out.println("Hello Codehub");
        helloRec();
    }
    public static void main(String[] args) {
        // helloRec(); // would stack overflow
    }
}
```

```java
// 2. Controlled recursion using a counter
public class Main {
    static void helloRec(int count) {
        if (count == 0) {
            return;
        }
        System.out.println("Hello Codehub");
        helloRec(count - 1);
    }
    public static void main(String[] args) {
        helloRec(5);
    }
}
```

```java
// 3. Print from n down to 0 using recursion
public class Main {
    static void printDown(int n) {
        if (n < 0) {
            return;
        }
        System.out.println(n);
        printDown(n - 1);
    }
    public static void main(String[] args) {
        printDown(5);
    }
}
```

```java
// 4. Print from start up to end (forward recursion)
public class Main {
    static void printUpRange(int start, int end) {
        if (start > end) {
            return;
        }
        System.out.println(start);
        printUpRange(start + 1, end);
    }
    public static void main(String[] args) {
        printUpRange(3, 10);
    }
}
```

#### 7.2 Topic - Classic Recursive Problems (sum, factorial, and more)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: arrays; String as parameters; objects; dynamic memory.
  - Use only: scalar parameters and return values for classic problems (sum, factorial, power, sum of digits).
- **Assumed Known (do not re-teach in this topic)**
  - Recursion with base case and recursive call
  - Methods that return values

```java
// Recursive sum of numbers from 1 to n
public class Main {
    static int sumToN(int n) {
        if (n <= 0) {
            return 0;
        }
        return n + sumToN(n - 1);
    }
    public static void main(String[] args) {
        int n = 5;
        System.out.println("Sum from 1 to " + n + " = " + sumToN(n));
    }
}
```

```java
// Recursive factorial
public class Main {
    static long factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        int n = 5;
        System.out.println("Factorial of " + n + " = " + factorial(n));
    }
}
```

```java
// Recursive power: compute a^b
public class Main {
    static long power(int a, int b) {
        if (b == 0) {
            return 1;
        }
        return a * power(a, b - 1);
    }
    public static void main(String[] args) {
        System.out.println("2^5 = " + power(2, 5));
    }
}
```

```java
// Recursive sum of digits
public class Main {
    static int sumOfDigits(int n) {
        if (n == 0) {
            return 0;
        }
        return (n % 10) + sumOfDigits(n / 10);
    }
    public static void main(String[] args) {
        int n = 1234;
        System.out.println("Sum of digits = " + sumOfDigits(n));
    }
}
```

---

## 8. Arrays - Tutorial specs for AI (Java)

> These array topics are for **primitive/simple arrays** first (e.g. `int[] nums`), not `ArrayList`.

#### 8.1 Topic - Intro to 1D Arrays (declaration, initialization, index access)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `ArrayList`; passing arrays to methods; String as a topic; classes/objects; dynamic sizing.
  - Use only: fixed-size `int[]` arrays, index-based read/write first, then a simple loop to print.
- **Assumed Known (do not re-teach in this topic)**

  - Variables and `for` loops
  - `main` and `System.out.println`

- **Example snippets (Java)**

```java
// 1. Declare and initialize an array, read/write using index (no loops first)
public class Main {
    public static void main(String[] args) {
        int[] nums = {10, 20, 30, 40, 50};
        System.out.println("First element = " + nums[0]);
        System.out.println("Second element = " + nums[1]);
        nums[2] = 99;
        System.out.println("Updated third element = " + nums[2]);
    }
}
```

```java
// 2. Print all elements using a for loop
public class Main {
    public static void main(String[] args) {
        int[] nums = {10, 20, 30, 40, 50};
        int size = 5;
        for (int i = 0; i < size; i++) {
            System.out.println("nums[" + i + "] = " + nums[i]);
        }
    }
}
```

#### 8.2 Topic - Fixed-size Arrays with Loops (read, write, print)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `ArrayList`; passing arrays to methods; Scanner as a full topic; classes/structs.
  - Use only: `int[] nums = new int[10]`, reading with `Scanner` (minimal), printing with loops.
- **Assumed Known (do not re-teach in this topic)**
  - Array declaration and indexing
  - `for` loops

```java
// 3. Read 10 integers into an array and print (forward + backward)
public class Main {
    public static void main(String[] args) {
        int[] nums = new int[10];
        java.util.Scanner sc = new java.util.Scanner(System.in);
        for (int i = 0; i < 10; i++) {
            System.out.print("Enter element " + i + ": ");
            nums[i] = sc.nextInt();
        }
        System.out.println("Forward:");
        for (int i = 0; i < 10; i++) {
            System.out.print(nums[i] + " ");
        }
        System.out.println();
        System.out.println("Backward:");
        for (int i = 9; i >= 0; i--) {
            System.out.print(nums[i] + " ");
        }
    }
}
```

#### 8.3 Topic - Simple Algorithms on Arrays (max, min, bubble sort)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `Arrays.sort`; `ArrayList`; passing arrays to methods; other sorting algorithms.
  - Use only: loops + swapping + bubble sort; max/min scan.
- **Assumed Known (do not re-teach in this topic)**
  - Arrays and loops
  - `if` and temporary variable for swap

```java
// Find maximum in an array
public class Main {
    public static void main(String[] args) {
        int[] nums = {30, 10, 50, 20, 40};
        int n = nums.length;
        int mx = nums[0];
        for (int i = 1; i < n; i++) {
            if (nums[i] > mx) {
                mx = nums[i];
            }
        }
        System.out.println("Maximum value = " + mx);
    }
}
```

```java
// Bubble sort in ascending order
public class Main {
    public static void main(String[] args) {
        int[] nums = {30, 10, 50, 20, 40};
        int n = nums.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (nums[j] > nums[j + 1]) {
                    int temp = nums[j];
                    nums[j] = nums[j + 1];
                    nums[j + 1] = temp;
                }
            }
        }
        System.out.print("Sorted: ");
        for (int i = 0; i < n; i++) {
            System.out.print(nums[i] + " ");
        }
    }
}
```

#### 8.4 Topic - 2D Arrays (brief intro)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `ArrayList` of lists; passing 2D arrays to methods; ragged arrays as a topic.
  - Use only: fixed small `int[][]` style arrays, nested loops, simple I/O.
- **Assumed Known (do not re-teach in this topic)**
  - 1D arrays and nested `for` loops

```java
// Declare and initialize a 2x3 array, then print it
public class Main {
    public static void main(String[] args) {
        int[][] nums = {{1, 2, 3}, {4, 5, 6}};
        System.out.println("2x3 matrix:");
        for (int row = 0; row < 2; row++) {
            for (int col = 0; col < 3; col++) {
                System.out.print(nums[row][col] + " ");
            }
            System.out.println();
        }
    }
}
```

---

## 9. Strings (Java)

### 9.1 Topic - `String` Basics

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `StringBuilder`; `char[]` as string; advanced regex; immutability as a deep topic.
  - Use only: `String`, literal and variables, `+` concatenation, `length()`, indexing `charAt(i)`, and simple print.
- **Assumed Known (do not re-teach in this topic)**
  - Basic program structure and `System.out.println`

```java
// Basic String
public class Main {
    public static void main(String[] args) {
        String name = "Codehub";
        System.out.println(name);
        System.out.println("Length = " + name.length());
        // Strings are immutable; show substring or charAt
        System.out.println("First char: " + name.charAt(0));
    }
}
```

### 9.2 Topic - Common `String` Operations

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `StringBuilder`; regex; complex parsing.
  - Use only: `length()`, `+` concatenation, `equals()` comparison, `indexOf()` (optional), and simple `substring()` (optional).
- **Assumed Known (do not re-teach in this topic)**
  - String basics and `charAt`

---

## 10. Object References (Java)

> **Note**: Java does **not** have pointers. This section replaces "Pointers" with **object references**: variables that hold objects refer to them; assigning one reference to another does not copy the object. Primitives are copied by value.

### 10.1 Topic - References vs Primitives (copy behavior, two references to same object)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `null` pitfalls in depth; garbage collection; pass-by-value vs pass-by-reference terminology debate; reflection.
  - Use only: simple classes with fields, two variables of that class type, assigning one to the other (same object), changing state through one reference and seeing it in the other; contrast with primitive copy.
- **Assumed Known (do not re-teach in this topic)**

  - Simple classes with public fields and object creation

- **Example snippets (Java)**

```java
// Two primitive variables: copying values (independent)
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = a;
        System.out.println("Initially: a = " + a + ", b = " + b);
        a = 20;
        System.out.println("After changing a: a = " + a + ", b = " + b);
    }
}
```

```java
// Two references to same object: changing through one affects the other
class Box {
    int value;
}

public class Main {
    public static void main(String[] args) {
        Box b1 = new Box();
        b1.value = 10;
        Box b2 = b1;  // b2 refers to same object as b1
        System.out.println("Initially: b1.value = " + b1.value + ", b2.value = " + b2.value);
        b2.value = 20;
        System.out.println("After b2.value = 20: b1.value = " + b1.value + ", b2.value = " + b2.value);
    }
}
```

---

## 11. Simple Classes (Data Holders) - Tutorial specs for AI (Java)

> Like C++ structs: classes used mainly to group related data (public fields), before teaching methods/constructors in depth.

### 11.1 Topic - Why use a class? (grouping related data)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: private fields; constructors; methods (beyond a simple `main`); inheritance; getters/setters.
  - Use only: a class with public fields, `.` member access, arrays of that class type, read/print fields with `System.out`.
- **Assumed Known (do not re-teach in this topic)**

  - Variables, types, arrays of primitives
  - Loops and `if`

- **Example snippets (Java)**

```java
// Managing student data with separate variables (hard to scale)
public class Main {
    public static void main(String[] args) {
        String student1Name = "Alice";
        int student1Age = 18;
        double student1Marks = 92.5;
        String student2Name = "Bob";
        int student2Age = 19;
        double student2Marks = 85.0;
        System.out.println("Student 1: " + student1Name + ", " + student1Age + ", " + student1Marks);
        System.out.println("Student 2: " + student2Name + ", " + student2Age + ", " + student2Marks);
    }
}
```

```java
// Using a class to group student data
class Student {
    String name;
    int age;
    double marks;
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "Alice";
        s1.age = 18;
        s1.marks = 92.5;
        Student s2 = new Student();
        s2.name = "Bob";
        s2.age = 19;
        s2.marks = 85.0;
        System.out.println("Student 1: " + s1.name + ", " + s1.age + ", " + s1.marks);
        System.out.println("Student 2: " + s2.name + ", " + s2.age + ", " + s2.marks);
    }
}
```

```java
// Array of students
class Student {
    String name;
    int age;
    double marks;
}

public class Main {
    public static void main(String[] args) {
        Student[] students = new Student[3];
        students[0] = new Student();
        students[0].name = "Alice";
        students[0].age = 18;
        students[0].marks = 92.5;

        students[1] = new Student();
        students[1].name = "Bob";
        students[1].age = 19;
        students[1].marks = 85.0;

        students[2] = new Student();
        students[2].name = "Carol";
        students[2].age = 20;
        students[2].marks = 78.0;

        for (int i = 0; i < 3; i++) {
            System.out.println(
                "Student " + (i + 1) + ": " + students[i].name + ", " + students[i].age + ", " + students[i].marks
            );
        }
    }
}
```

### 11.2 Topic - More class examples (Car, Animal, etc.)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: methods; constructors; private; inheritance.
  - Use only: plain classes with public fields and loops over arrays of objects.

```java
// Car example
class Car {
    String brand;
    String model;
    int year;
    double price;
}

public class Main {
    public static void main(String[] args) {
        Car c1 = new Car();
        c1.brand = "Toyota";
        c1.model = "Corolla";
        c1.year = 2020;
        c1.price = 15000;
        Car c2 = new Car();
        c2.brand = "Honda";
        c2.model = "Civic";
        c2.year = 2019;
        c2.price = 14000;
        System.out.println("Car 1: " + c1.brand + " " + c1.model + ", " + c1.year + ", " + c1.price);
        System.out.println("Car 2: " + c2.brand + " " + c2.model + ", " + c2.year + ", " + c2.price);
    }
}
```

---

## 12. Enums - Tutorial specs for AI (Java)

### 12.1 Topic - Basic Enums (named constants)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: enum with methods/constructors; enum in switch as advanced topic; ordinal() reliance.
  - Use only: `enum Name { CONST1, CONST2, ... }`, enum variables, comparisons in `if`/`switch`, and printing (e.g. `name()` or simple messages).
- **Assumed Known (do not re-teach in this topic)**
  - Classes and `if`/`switch`

```java
// Basic enum for days
enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY }

public class Main {
    public static void main(String[] args) {
        Day today = Day.WEDNESDAY;
        System.out.println("Today = " + today);
        if (today == Day.FRIDAY) {
            System.out.println("Weekend soon!");
        }
    }
}
```

```java
// Enum with explicit values (Java enums can have fields and constructor - keep minimal here)
// Simple enum used in menu choice
enum MenuOption { ADD, SUB, MUL, EXIT }

public class Main {
    public static void main(String[] args) {
        MenuOption choice = MenuOption.EXIT;
        if (choice == MenuOption.EXIT) {
            System.out.println("Goodbye");
        } else if (choice == MenuOption.ADD) {
            System.out.println("Add selected");
        } else if (choice == MenuOption.SUB) {
            System.out.println("Sub selected");
        } else if (choice == MenuOption.MUL) {
            System.out.println("Mul selected");
        }
    }
}
```

---

## 13. OOP - Tutorial specs for AI (Java)

> **Pending tutorials requested here**: create **1 intro OOP tutorial**, with **4–6 lessons**, that introduces: what OOP means at a beginner level, **classes and objects** in Java. Follow the lesson structure: concept -> mcq -> codeblock_rearranging -> fill_in_blanks, with small Java snippets, `keyPoints`, `commonMistakes`, `bestPractices`, and `practiceHints`.

### 13.1 Topic - Intro to OOP: Classes & Objects

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: access specifiers as a full topic (`private`, `protected`); constructors; method overloading; `this`; inheritance; interfaces; abstract classes.
  - Use only: class definitions with **public** fields, creating objects with `new`, assigning to fields, reading fields, and printing results with `System.out`. You may mention "encapsulation later" in one sentence, but do not teach access control here.
- **Core concepts**
  - OOP idea for beginners: "model real-world things as objects with data."
  - A **class** is a blueprint; an **object** is created with `new ClassName()`.
  - In this topic, use public fields so learners can access them without learning getters/setters yet.
- **Lesson breakdown (4–6 lessons)**
  - L1 (concept): What is a class? What is an object? Create 1 object and print its fields.
  - L2 (concept): Multiple objects of the same class; changing one doesn't change another.
  - L3 (concept): Array of objects.
  - L4 (mcq): Predict output / choose correct declaration / identify object vs class.
  - L5 (codeblock_rearranging): Rearrange blocks to build a minimal class + object program.
  - L6 (fill_in_blanks): Fill missing `class`, object creation `new`, member access `.`.
- **Common mistakes**
  - Forgetting `new` when creating an object (e.g. `Student s = Student();` is wrong).
  - Confusing class name with variable name (e.g. `Student.name` instead of `s.name`).
- **Best practices (for this beginner topic)**

  - Use meaningful names (`Student`, `Car`). Keep examples tiny: 2–3 fields, 1–2 objects.

- **Example snippets (Java)**

```java
// Class and object (public fields)
class Student {
    public String name;
    public int age;
    public double marks;
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.name = "Alice";
        s.age = 18;
        s.marks = 92.5;
        System.out.println("Name: " + s.name + ", Age: " + s.age + ", Marks: " + s.marks);
    }
}
```

```java
// Multiple objects from the same class
class Car {
    public String brand;
    public int year;
}

public class Main {
    public static void main(String[] args) {
        Car c1 = new Car();
        c1.brand = "Toyota";
        c1.year = 2020;
        Car c2 = new Car();
        c2.brand = "Honda";
        c2.year = 2019;
        c1.year = 2021;
        System.out.println("Car 1: " + c1.brand + " " + c1.year);
        System.out.println("Car 2: " + c2.brand + " " + c2.year);
    }
}
```

### 13.2 Topic - Instance Methods (no params/return -> params/return -> setAll + display)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: constructors; inheritance; `this` (as a separate concept); overloading; abstract; interfaces.
  - Do **not** teach "access specifiers" as a theory topic. Use only: classes with instance methods, calling with `obj.method()`, methods with: void no-params, params only (void), return only, params + return; a single "set all" method + display method. Keep fields public in examples.
- **Core concepts**
  - A **method** is written inside the class and called on an object: `obj.method();`
  - Progression: void method -> method with parameters -> method with return -> setData + display.
- **Lesson breakdown (4–6 lessons)**
  - L1: Method with no parameters and no return. L2: Method with parameters only. L3: Method with return only. L4: Method with parameters + return. L5: setData + display on Student. L6: setData + display on Car. Add MCQ + rearranging + fill-in-blanks.
- **Common mistakes**
  - Forgetting parentheses: `obj.print` instead of `obj.print()`.
  - Calling instance method without an object.
- **Best practices**

  - Method names verb-like: `display`, `setData`, `printInfo`.

- **Example snippets (Java)**

```java
// Method with no parameters and no return
class Greeter {
    void sayHello() {
        System.out.println("Hello Codehub");
    }
}

public class Main {
    public static void main(String[] args) {
        Greeter g = new Greeter();
        g.sayHello();
        g.sayHello();
    }
}
```

```java
// Student: setData() + display() (public fields)
class Student {
    public String name;
    public int age;
    public double marks;
    void setData(String n, int a, double m) {
        name = n;
        age = a;
        marks = m;
    }
    void display() {
        System.out.println("Name: " + name + ", Age: " + age + ", Marks: " + marks);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.setData("Alice", 18, 92.5);
        s.display();
    }
}
```

### 13.3 Topic - Constructors (object creation + constructor runs automatically)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: inheritance; `this` as a topic; copy constructor; overloading constructors in depth (one default + one parameterized is enough).
  - Use only: default constructor (no-args) and parameterized constructor (sets fields), object creation with `new`, and a simple `display()` method.
- **Core concepts**
  - Constructor has the **same name as the class** and **no return type**. It runs **when an object is created** with `new`.
- **Lesson breakdown (4–6 lessons)**
  - L1: Default constructor that prints "Object created". L2: Parameterized constructor + display. L3: Multiple objects, constructor runs each time. L4 (mcq): output order, valid syntax. L5 (rearrange): class with constructor + display. L6 (FIB): constructor name, `new`, display call.
- **Common mistakes**
  - Writing a return type for the constructor (`void Student()` is wrong in Java – use `Student()`).
  - Forgetting `new` when creating object.
- **Best practices**

  - Keep constructors simple: set fields, maybe one print for learning.

- **Example snippets (Java)**

```java
// Default constructor runs on object creation
class Demo {
    Demo() {
        System.out.println("Demo object created");
    }
    void display() {
        System.out.println("display() called");
    }
}

public class Main {
    public static void main(String[] args) {
        Demo d = new Demo();
        d.display();
    }
}
```

```java
// Student: parameterized constructor + display
class Student {
    String name;
    int age;
    double marks;
    Student(String n, int a, double m) {
        System.out.println("Student object created");
        name = n;
        age = a;
        marks = m;
    }
    void display() {
        System.out.println("Name: " + name + ", Age: " + age + ", Marks: " + marks);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Alice", 18, 92.5);
        s.display();
    }
}
```

### 13.4 Topic - Encapsulation: `public` vs `private` (why private matters)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `protected` (save for after inheritance); inheritance; reflection; packages.
  - Use only: `public` and `private`, simple classes, object creation, and public methods that safely change private data (getters/setters or action methods).
- **Core concepts**
  - `public`: accessible from outside. `private`: only the class's methods can access it. Use private for fields that must change only through controlled methods (e.g. balance, marks, password).
- **Lesson breakdown (4–6 lessons)**
  - L1: Demo class: public vs private, what compiles. L2: Student with private marks, update via method. L3: Car with private price, applyDiscount method. L4: Real-world analogy (ATM balance). L5 (mcq): access, compile errors. L6 (rearrange + FIB): class with one private field and two public methods.
- **Common mistakes**
  - Expecting `obj.privateField` to work (compile error). Putting everything public and losing control.
- **Best practices**

  - Make important data private; provide public methods for valid actions.

- **Example snippets (Java)**

```java
// Demo: public vs private
class DemoAccess {
    public int publicValue;
    private int secretValue;
    void setSecretValue(int v) {
        secretValue = v;
    }
    void display() {
        System.out.println("publicValue = " + publicValue + ", secretValue = " + secretValue);
    }
}

public class Main {
    public static void main(String[] args) {
        DemoAccess d = new DemoAccess();
        d.publicValue = 10;
        d.setSecretValue(99);
        d.display();
    }
}
```

```java
// Student: private marks, update via public method
class Student {
    public String name;
    public int age;
    private double marks;
    Student(String n, int a, double m) {
        name = n;
        age = a;
        marks = m;
    }
    void updateMarks(double newMarks) {
        if (newMarks < 0 || newMarks > 100) {
            System.out.println("Invalid marks");
            return;
        }
        marks = newMarks;
    }
    void display() {
        System.out.println("Name: " + name + ", Age: " + age + ", Marks: " + marks);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Alice", 18, 92.5);
        s.updateMarks(95.0);
        s.display();
    }
}
```

---

## 14. Inheritance - Tutorial specs for AI (Java)

> **Pending tutorials requested here**: create **3–4 inheritance tutorials**, each with **4–6 lessons**, that introduce inheritance step-by-step. Start with single inheritance, then multilevel, then **interfaces** (Java has single class inheritance; "multiple types" is done via interfaces). Then teach `protected` after learners understand inheritance.

### 14.1 Topic - Inheritance Basics (Single inheritance + reusability)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: multilevel inheritance; interfaces; `protected`; overriding; polymorphism; abstract classes; `super` in constructors (optional minimal mention).
  - Use only: `class Child extends Parent { ... }`, calling inherited methods from child objects, showing "code reuse".
- **Core concepts**
  - Inheritance: child class **reuses** (inherits) fields/methods from parent. Syntax: `class Child extends Parent { ... }`.
  - Reusability: put common parts in the base class (e.g. User -> Student/Teacher).
- **Lesson breakdown (4–6 lessons)**
  - L1: DemoParent -> DemoChild. L2: User -> Student. L3: Vehicle -> Car. L4: One base, many derived: User -> Student/Teacher, Vehicle -> Car/Bike/Truck. L5 (mcq): base vs derived, inherited members. L6 (rearrange + FIB): `extends Parent`.
- **Example snippets (Java)**

```java
// DemoParent and DemoChild (single inheritance)
class DemoParent {
    void parentMsg() {
        System.out.println("I am Parent");
    }
}

class DemoChild extends DemoParent {
    void childMsg() {
        System.out.println("I am Child");
    }
}

public class Main {
    public static void main(String[] args) {
        DemoChild c = new DemoChild();
        c.parentMsg();
        c.childMsg();
    }
}
```

```java
// User -> Student (multiple properties)
class User {
    String name;
    int age;
    String phone;

    void setUser(String n, int a, String p) {
        name = n;
        age = a;
        phone = p;
    }

    void displayUser() {
        System.out.println("Name: " + name + ", Age: " + age + ", Phone: " + phone);
    }
}

class Student extends User {
    int rollNo;
    double marks;

    void setStudent(int r, double m) {
        rollNo = r;
        marks = m;
    }
    void displayStudent() {
        displayUser();
        System.out.println("RollNo: " + rollNo + ", Marks: " + marks);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.setUser("Alice", 18, "9999999999");
        s.setStudent(101, 92.5);
        s.displayStudent();
    }
}
```

### 14.2 Topic - Multilevel Inheritance (Parent -> Child -> GrandChild)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: interfaces; `protected`; overriding/polymorphism; `super` in depth.
  - Use only: `class A`, `class B extends A`, `class C extends B`, reuse across 3 levels.
- **Core concepts**
  - Multilevel: a class inherits from a class that already extends another. GrandChild gets features from both Parent and Child.
- **Example snippets (Java)**

```java
// DemoParent -> DemoChild -> DemoGrandChild
class DemoParent {
    void msgParent() {
        System.out.println("Parent");
    }
}

class DemoChild extends DemoParent {
    void msgChild() {
        System.out.println("Child");
    }
}

class DemoGrandChild extends DemoChild {
    void msgGrandChild() {
        System.out.println("GrandChild");
    }
}

public class Main {
    public static void main(String[] args) {
        DemoGrandChild g = new DemoGrandChild();
        g.msgParent();
        g.msgChild();
        g.msgGrandChild();
    }
}
```

```java
// User -> Student -> TopperStudent
class User {
    String name;
    int age;
    String city;

    void setUser(String n, int a, String c) {
        name = n;
        age = a;
        city = c;
    }

    void displayUser() {
        System.out.println("Name: " + name + ", Age: " + age + ", City: " + city);
    }
}

class Student extends User {
    int rollNo;
    double marks;

    void setStudent(int r, double m) {
        rollNo = r;
        marks = m;
    }

    void displayStudent() {
        displayUser();
        System.out.println("RollNo: " + rollNo + ", Marks: " + marks);
    }
}

class TopperStudent extends Student {
    int rank;
    String scholarship;

    void setTopper(int r, String s) {
        rank = r;
        scholarship = s;
    }

    void displayTopper() {
        displayStudent();
        System.out.println("Rank: " + rank + ", Scholarship: " + scholarship);
    }
}

public class Main {
    public static void main(String[] args) {
        TopperStudent ts = new TopperStudent();
        ts.setUser("Aman", 18, "Mumbai");
        ts.setStudent(5, 98.5);
        ts.setTopper(1, "Merit");
        ts.displayTopper();
    }
}
```

### 14.3 Topic - Interfaces (implementing multiple types)

> **Note**: Java does **not** have multiple inheritance of classes. Use **interfaces** to allow a class to fulfill multiple types (contracts).

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: default methods in interfaces; abstract classes; diamond problem; `protected` in interfaces.
  - Use only: `interface Name { ... }`, `class C implements I1, I2`, and simple method implementations.
- **Core concepts**
  - An **interface** is a contract (method signatures). A class can **implement** multiple interfaces: `class Child implements A, B { ... }`.
  - Use when a class needs to provide multiple "roles" (e.g. Drawable + Comparable).
- **Lesson breakdown (4–6 lessons)**
  - L1: Simple interface with one method, one class implements it. L2: Class implements two interfaces. L3: One base class + one interface (e.g. Student extends User implements Printable). L4 (mcq): valid syntax, which methods must be implemented. L5 (rearrange + FIB): interface + class implements.
- **Example snippets (Java)**

```java
// Class implements one interface
interface Greetable {
    void greet();
}

class Person implements Greetable {
    public void greet() {
        System.out.println("Hello!");
    }
}

public class Main {
    public static void main(String[] args) {
        Person p = new Person();
        p.greet();
    }
}
```

```java
// Class implements two interfaces
interface Named { String getName(); }
interface Printable { void print(); }

class Student implements Named, Printable {
    String name;
    Student(String n) {
        name = n;
    }
    public String getName() {
        return name;
    }
    public void print() {
        System.out.println("Student: " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Alice");
        s.print();
        System.out.println(s.getName());
    }
}
```

### 14.4 Topic - `protected` Specifier (after inheritance)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: polymorphism; default (package) access in depth; reflection.
  - Use only: `public`, `private`, `protected`, and inheritance examples showing that `protected` is accessible in subclasses but not from outside.
- **Core concepts**
  - `private`: only same class. `public`: everywhere. `protected`: same package and subclasses can access; outside code cannot.
  - Beginner shortcut: treat `protected` as “usable in child classes, not usable from normal outside code”. (Do not go into package rules.)
- **Example snippets (Java)**

```java
// Protected field accessible in subclass, not from main
class Parent {
    protected int value;
    void setValue(int v) {
        value = v;
    }
}

class Child extends Parent {
    void showValue() {
        System.out.println("value = " + value);
    }
}

public class Main {
    public static void main(String[] args) {
        Child c = new Child();
        c.setValue(10);
        c.showValue();
    }
}
```

---

### 14.5 Topic - `super` in Constructors (calling the parent constructor)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: method overriding, runtime polymorphism, `super` for calling parent methods, `this` keyword as a separate topic, access modifiers theory, abstract classes, interfaces.
  - Use only: `extends`, base and derived constructors, and `super(...)` as the **first statement** in a derived constructor.
- **Assumed Known (do not re-teach in this topic)**
  - Basic inheritance syntax: `class Child extends Parent { ... }`
  - Constructors and object creation with `new`
- **Core concepts**
  - `super(...)` calls a **parent class constructor**.
  - If you do not write `super(...)`, Java will try `super()` automatically (only if the parent has a no-arg constructor).
  - In a constructor, `super(...)` must be the **first statement**.
- **Example snippets (Java)**

```java
// 1. super() works when parent has a no-arg constructor
class Parent {
    Parent() {
        System.out.println("Parent constructor");
    }
}

class Child extends Parent {
    Child() {
        super();
        System.out.println("Child constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        Child c = new Child();
    }
}
```

```java
// 2. super(args) calls a specific parent constructor
class User {
    int id;
    String name;

    User(int userId, String userName) {
        id = userId;
        name = userName;
    }
}

class Student extends User {
    int rollNo;

    Student(int userId, String userName, int roll) {
        super(userId, userName);
        rollNo = roll;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student(101, "Aman", 10);
        System.out.println("Created student");
    }
}
```

---

## 15. Polymorphism - Tutorial specs for AI (Java)

### 15.1 Topic - Polymorphism Intro (meaning + two types)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: generics; collections; exceptions; operator overloading (Java doesn't have it).
  - Do **not** go deep into JVM/runtime dispatch. Keep code beginner-friendly.
- **Core concepts**
  - Polymorphism means **one name, many forms**. In Java: **compile-time polymorphism** (method overloading) and **runtime polymorphism** (method overriding via inheritance). In this section focus only on **overloading**; overriding can be a separate short topic or one lesson.
- **Lesson structure**

  - Concept -> MCQ -> codeblock_rearranging -> fill_in_blanks. Use very small code snippets.

- **Example snippets (Java)**

```java
// Same method name, different parameter lists (overloading)
public class Main {
    static int add(int a, int b) {
        return a + b;
    }
    static double add(double a, double b) {
        return a + b;
    }
    public static void main(String[] args) {
        System.out.println(add(2, 3));
        System.out.println(add(2.5, 3.5));
    }
}
```

```java
// Same method name, different parameter counts (in a class)
class Printer {
    void show(int x) {
        System.out.println("int: " + x);
    }
    void show(int x, int y) {
        System.out.println("two ints: " + x + ", " + y);
    }
}

public class Main {
    public static void main(String[] args) {
        Printer p = new Printer();
        p.show(10);
        p.show(10, 20);
    }
}
```

### 15.2 Topic - Compile-time Polymorphism (Method Overloading)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: overriding as the main focus; abstract classes; varargs; generics.
  - Do **not** introduce operator overloading (Java does not support it).
- **What to teach**
  - Overloading = same method name, different parameter list (type/count/order). Return type alone cannot overload.
- **Mini-lesson sequence (4–6 lessons)**
  - L1: Overload `add(int,int)` vs `add(double,double)`. L2: Different count: `area(int side)` vs `area(int l, int w)`. L3: In a class: `print(int)` vs `print(String)`. L4: Common mistake: ambiguous call. L5: Practice: `calculate(...)` overloads.
- **MCQ ideas**: Which call matches which overload? Is `int f(int)` and `double f(int)` valid overloading? (No.)
- **Example snippets (Java)**

```java
// add() overloads
public class Main {
    static int add(int a, int b) {
        return a + b;
    }
    static double add(double a, double b) {
        return a + b;
    }
    public static void main(String[] args) {
        int x = add(10, 20);
        double y = add(1.5, 2.5);
        System.out.println(x);
        System.out.println(y);
    }
}
```

```java
// area() overloads (count differs)
public class Main {
    static int area(int side) {
        return side * side;
    }
    static int area(int length, int width) {
        return length * width;
    }
    public static void main(String[] args) {
        System.out.println(area(5));
        System.out.println(area(4, 6));
    }
}
```

---

## 16. OOP Capstone - Use all taught OOP concepts (Java)

### 16.1 Topic - Final OOP Mini Project (Combine: class/object + methods + constructors + private/public + inheritance + protected + overloading)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or use: abstract classes; interfaces (unless already taught); reflection; generics; collections; exceptions as a topic; file I/O; multithreading.
  - Use only what was taught earlier: classes/objects, instance methods, `public`/`private`, constructors (default + parameterized), inheritance (single + one base -> many derived), `protected` (after inheritance), and method overloading (compile-time).
- **Assumed Known (do not re-teach in this capstone)**
  - Basic `String` usage: `length()` and `equals(...)`
  - `super()` / `super(...)` for calling the parent constructor (from section 14.5)
- **Goal**
  - Build **one complete beginner project** that combines the earlier OOP concepts. Keep it **console-based**, with clear output and simple validations.
- **Project theme**
  - Option A: **CodeHub School Portal** (User -> Student/Teacher). Option B: **Vehicle Showroom** (Vehicle -> Car/Bike/Truck).
  - Requirements: at least 1 base class with 3+ fields; at least 2 derived classes with 2+ fields each; at least 1 private field with public methods; at least 1 protected field in base used in derived; at least 1 constructor per class; at least 1 overloaded method (same name, different parameters).
- **Lesson breakdown (4–6 lessons)**
  - L1 (concept): Identify problem + classes (base vs derived). L2 (concept): Base class with constructor + private data + public methods. L3 (concept): Derived classes with inheritance and protected reuse. L4 (concept): Add overloaded method for a real use-case. L5 (mcq): Predict output, access errors, inheritance syntax. L6 (rearrange + FIB): Skeleton with missing keywords (`class`, `extends`, `public`, `private`, `protected`, constructor names).
- **Common mistakes**
  - Accessing private from main or from wrong class. Forgetting protected is for subclasses only. Confusing overloading with overriding.
- **Best practices**

  - Keep methods readable. Validate inputs with simple `if`. Use consistent naming (`set...`, `display...`).

- **Example skeleton (Option A: CodeHub School Portal) – Java**

```java
// Final OOP mini project: CodeHub School Portal (skeleton)
class User {
    protected int userId;
    protected String name;
    private String password;
    User() {
        userId = 0;
        name = "unknown";
        password = "0000";
    }
    User(int id, String n, String pass) {
        userId = id;
        name = n;
        password = pass;
    }
    void setPassword(String oldPass, String newPass) {
        if (!oldPass.equals(password)) {
            System.out.println("Password change failed");
            return;
        }
        if (newPass.length() < 4) {
            System.out.println("New password too short");
            return;
        }
        password = newPass;
        System.out.println("Password updated");
    }
    boolean login(String pass) {
        return pass.equals(password);
    }
    void displayUser() {
        System.out.println("UserId: " + userId + ", Name: " + name);
    }
}

class Student extends User {
    private double marks;
    int rollNo;
    String course;
    Student() {
        super();
        rollNo = 0;
        course = "NA";
        marks = 0;
    }
    Student(int id, String n, String pass, int r, String c, double m) {
        super(id, n, pass);
        rollNo = r;
        course = c;
        marks = m;
    }
    void updateMarks(double newMarks) {
        if (newMarks < 0 || newMarks > 100) {
            System.out.println("Invalid marks");
            return;
        }
        marks = newMarks;
    }
    void displayStudent() {
        displayUser();
        System.out.println("RollNo: " + rollNo + ", Course: " + course + ", Marks: " + marks);
    }
}

class Teacher extends User {
    String subject;
    int experienceYears;
    Teacher() {
        super();
        subject = "NA";
        experienceYears = 0;
    }
    Teacher(int id, String n, String pass, String sub, int exp) {
        super(id, n, pass);
        subject = sub;
        experienceYears = exp;
    }
    void displayTeacher() {
        displayUser();
        System.out.println("Subject: " + subject + ", Experience: " + experienceYears + " years");
    }
}

class FeeCalculator {
    int fee(int months) {
        return months * 1000;
    }
    int fee(int months, int discountPercent) {
        if (discountPercent < 0) {
            discountPercent = 0;
        }
        if (discountPercent > 50) {
            discountPercent = 50;
        }
        int total = months * 1000;
        return total - (total * discountPercent / 100);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student(101, "Aman", "1234", 10, "Java", 88.0);
        Teacher t = new Teacher(201, "Neha", "9999", "Math", 6);
        s.displayStudent();
        t.displayTeacher();
        if (s.login("1234")) {
            System.out.println("Student login success");
        }
        s.updateMarks(95.0);
        FeeCalculator fc = new FeeCalculator();
        System.out.println("Fee 3 months: " + fc.fee(3));
        System.out.println("Fee 3 months with 10% discount: " + fc.fee(3, 10));
    }
}
```

- **Practice tasks (must include)**
  - Add a derived class `TopperStudent` (multilevel) with 2 extra fields and `displayTopper()`.
  - Add one more overload: `fee(months, discountPercent, extraCharge)`.
  - Add input mode: read one Student and one Teacher from console, then display them.
