## Pending Python Topics – Tutorial Planning (Language: Python)

### Meta

- **Target language**: `python`
- **Audience**: Absolute beginners to lower–intermediate
- **Goal**: Step-by-step, concept-first tutorials with lots of small code examples and practice (same spirit as `c-pending-topics.md`, `cpp-pending-topics.md`, `java-pending-topics.md`)
- **Already covered on the site (do not repeat here)**: Tutorials up through loops (`while`, `for`, `range`, `for-else`, nested loops), plus variables, data types, strings, lists, tuples, sets, dictionaries, if/elif/else, logical operators, match statements.
- **Exclusions**: Each topic has an **Exclusions** subsection listing what must not be taught or mentioned in that topic. When prompting an AI to generate content for a topic, copy that topic’s full Exclusions block into the prompt so the AI stays within scope. Each request is standalone; do not refer to other topics or sections.
- **Hard constraints for AI generation**
  - Do **not** mention excluded topics even as a “future note”, “best practice”, “advanced tip”, or “real-world note”.
  - **Allowed micro-mention**: at most **one sentence** to acknowledge something exists; **no rules**, **no examples**, **no exercises**, and **no comparisons**.
  - **Imports allowlist (default)**: do **not** import anything unless a topic explicitly allows an import.
    - Allowed by default: **no imports**.
  - **Clean code formatting (mandatory in every code block)**
    - Write **one statement per line** (no `a = 1; b = 2`, no chained “do-everything” lines).
    - Use **4 spaces** indentation (no tabs).
    - Avoid one-line `if` / `for` / `while` bodies (always use multi-line blocks).
    - Keep functions multi-line and readable (no one-line `def f(): return ...`).
  - Output must follow the topic’s required structure exactly; do not add extra sections.

---

## 6. Functions – Tutorial specs for AI (Python)

> **Pending tutorials requested here**: create **2–4 function tutorials**, each with **4–6 lessons**, that gradually introduce: defining/calling functions, parameters, return values, and then “predicate/helper” functions. Follow the same lesson structure pattern: concept → MCQ → codeblock_rearranging → fill_in_blanks, with mermaid flowcharts, `keyPoints`, `commonMistakes`, `bestPractices`, `practiceHints`, and multiple tiny examples.

### 6.1 Topic – Introduction to Functions (define + call, no parameters)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: parameters; return values; recursion; lambdas; `*args`/`**kwargs`; default arguments; modules/imports; classes/objects; exceptions.
  - Do **not** teach “scope” theory (locals/globals) beyond what is strictly needed to run examples.
- **Assumed Known (do not re-teach in this topic)**
  - Printing with `print(...)`
  - Variables (`int`, `float`, `str`) and simple expressions
  - `if`/`else` and loops at a “use it” level
- **What to teach**
  - A function is a **named reusable block**.
  - Defining vs calling: if you don’t call it, it doesn’t run.
  - Call a function once and multiple times to show reuse.
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
def say_hello():
    print("Hello CodeHub")

say_hello()
say_hello()
```

```python
def print_1_to_5():
    i = 1
    while i <= 5:
        print(i)
        i += 1

print_1_to_5()
```

### 6.2 Topic – Functions with Parameters (no return yet)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: return values (no returning results for later use); recursion; default arguments; keyword arguments; `*args`/`**kwargs`; modules/imports; classes/objects; exceptions.
  - Do **not** teach input parsing as a topic; if input is used, keep it minimal.
- **Assumed Known (do not re-teach in this topic)**
  - Defining and calling a simple function
  - Variables and printing
- **What to teach**
  - Parameters are **inputs** to a function.
  - Passing different values shows reuse.
  - Functions can print results (but do not return yet).
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
def greet(name):
    print("Hello", name)

greet("Aman")
greet("Neha")
```

```python
def print_sum(a, b):
    total = a + b
    print("Sum =", total)

print_sum(3, 5)
print_sum(10, 20)
```

### 6.3 Topic – Functions with Return Values (using function output)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: recursion; default arguments; keyword arguments; `*args`/`**kwargs`; modules/imports; classes/objects; exceptions.
  - Do **not** use advanced built-ins (`map`, `filter`, `reduce`) here.
- **Assumed Known (do not re-teach in this topic)**
  - Functions with parameters
  - Variables and assignments
  - Printing results
- **What to teach**
  - `return` sends a value back to the caller.
  - Using return values in expressions and assignments.
  - Difference between printing inside a function vs returning.
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
def square(x):
    result = x * x
    return result

value = square(7)
print("Square =", value)
print("Square + 1 =", square(7) + 1)
```

```python
def add(a, b):
    return a + b

sum_1 = add(2, 3)
sum_2 = add(10, 20)
print(sum_1)
print(sum_2)
```

### 6.4 Topic – Predicate and Helper Functions

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: recursion; lambdas; `map`/`filter`; classes/objects; exceptions; imports.
  - Do **not** introduce Boolean algebra as theory; keep it practical.
- **Assumed Known (do not re-teach in this topic)**
  - Return values from functions
  - Using a function call inside `if`
  - Loops and counters
- **What to teach**
  - **Predicate functions** return `True`/`False` (e.g., `is_even`).
  - **Helper functions** return a computed value (e.g., `max2`).
  - Using predicates inside loops (count evens, filter by condition using `if`).
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
def is_even(n):
    return n % 2 == 0

print(is_even(10))
print(is_even(7))
```

```python
def max2(a, b):
    if a > b:
        return a
    return b

print(max2(10, 20))
print(max2(5, 3))
```

```python
def count_evens_upto(n):
    count = 0
    i = 1
    while i <= n:
        if is_even(i):
            count += 1
        i += 1
    return count

print(count_evens_upto(10))
```

---

## 7. Recursion – Tutorial specs for AI (Python)

> **Pending tutorials requested here**: create **1–2 recursion tutorials**, each with **4–6 lessons**, that introduce the idea of a function calling itself, base cases, and classic numeric recursion problems (sum, factorial, power, sum of digits). Keep it beginner-friendly and visual.

### 7.1 Topic – Recursion Basics (base case + simple printing)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: returning computed values from recursion (save for 7.2); lists/strings as recursion inputs; advanced recursion topics (tail recursion, call stack deep dive); exceptions.
  - Do **not** use imports.
- **Assumed Known (do not re-teach in this topic)**
  - Functions with parameters
  - `if`/`else`
  - Printing
- **What to teach**
  - Recursion = function calls itself.
  - Base case prevents infinite recursion.
  - Use recursion for visible tasks: print down/up.
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
def print_down(n):
    if n < 0:
        return
    print(n)
    print_down(n - 1)

print_down(5)
```

```python
def print_up(start, end):
    if start > end:
        return
    print(start)
    print_up(start + 1, end)

print_up(3, 7)
```

### 7.2 Topic – Classic Recursive Problems (sum, factorial, power, sum of digits)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: recursion on lists/strings; memoization; performance analysis; exceptions; imports.
- **Assumed Known (do not re-teach in this topic)**
  - Base case + recursive call pattern
  - Returning values from a function
  - Basic arithmetic
- **What to teach**
  - Base case + recursive step for numeric problems.
  - Returning a computed value.
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
def sum_to_n(n):
    if n <= 0:
        return 0
    return n + sum_to_n(n - 1)

print(sum_to_n(5))
```

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

```python
def power(a, b):
    if b == 0:
        return 1
    return a * power(a, b - 1)

print(power(2, 5))
```

```python
def sum_of_digits(n):
    if n == 0:
        return 0
    return (n % 10) + sum_of_digits(n // 10)

print(sum_of_digits(1234))
```

---

## 8. Lists – Algorithms and Practice (Python)

> Lists are already introduced on the site. This section focuses on using loops + conditions to solve classic list problems without jumping to advanced built-ins.

### 8.1 Topic – List Traversal Patterns (index loop vs direct loop)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: list comprehensions; `map`/`filter`; sorting built-ins (`sorted`, `.sort`) as solutions; slicing tricks; imports; exceptions.
- **Assumed Known (do not re-teach in this topic)**
  - List basics: create a list, append, access by index
  - `for` loops
  - `len(...)`
- **What to teach**
  - Two traversal styles:
    - Index-based loop: `for i in range(len(nums))`
    - Direct loop: `for x in nums`
  - When each style is useful (e.g., when you need the index).
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
nums = [10, 20, 30, 40]

for i in range(len(nums)):
    print("index:", i, "value:", nums[i])
```

```python
nums = [10, 20, 30, 40]

for x in nums:
    print("value:", x)
```

### 8.2 Topic – Classic List Algorithms (max/min, count, search, reverse)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: built-in `max`, `min`, `sum` as the primary solution; comprehensions; slicing tricks (`[::-1]`); imports; exceptions.
- **Assumed Known (do not re-teach in this topic)**
  - List traversal (8.1)
  - `if`/`else`
  - Variables and counters
- **What to teach**
  - Max/min scan with a loop.
  - Counting items that match a condition (e.g., evens).
  - Linear search (find if present, or find index).
  - Reverse via loop (create a new list) without slicing.
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
nums = [30, 10, 50, 20, 40]

largest = nums[0]
for x in nums:
    if x > largest:
        largest = x

print("largest =", largest)
```

```python
nums = [1, 2, 3, 4, 5, 6]

count_even = 0
for x in nums:
    if x % 2 == 0:
        count_even += 1

print("count_even =", count_even)
```

```python
nums = [5, 8, 2, 9]
target = 2

found = False
for x in nums:
    if x == target:
        found = True

print("found =", found)
```

```python
nums = [10, 20, 30]
reversed_nums = []

i = len(nums) - 1
while i >= 0:
    reversed_nums.append(nums[i])
    i -= 1

print(reversed_nums)
```

### 8.3 Topic – Sorting a List (Bubble Sort)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `sorted(...)`, `.sort()`, other sorting algorithms (merge/quick); comprehensions; imports; exceptions.
- **Assumed Known (do not re-teach in this topic)**
  - Swapping with a temporary variable
  - Nested loops
  - List indexing
- **What to teach**
  - Bubble sort step-by-step with `i` and `j`.
  - Print list before and after.
  - Common mistakes (wrong bounds, swapping wrong elements).
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
nums = [30, 10, 50, 20, 40]
n = len(nums)

i = 0
while i < n - 1:
    j = 0
    while j < n - 1 - i:
        if nums[j] > nums[j + 1]:
            temp = nums[j]
            nums[j] = nums[j + 1]
            nums[j + 1] = temp
        j += 1
    i += 1

print(nums)
```

---

## 9. Strings – Practical String Operations (Python)

> Basic strings are already covered on the site. This section focuses on commonly used **string methods** and simple text-processing patterns, while staying beginner-friendly.

### 9.1 Topic – Common String Methods (strip, lower/upper, startswith/endswith, find, replace)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: regex; advanced formatting; f-string deep dive; files; exceptions; imports.
- **Assumed Known (do not re-teach in this topic)**
  - `len(s)` and indexing `s[i]`
  - `for` loops over a string
- **What to teach**
  - `strip()`, `lower()`, `upper()`
  - `startswith(...)`, `endswith(...)`
  - `find(...)` (and what `-1` means)
  - `replace(...)`
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
text = "  CodeHub  "
clean = text.strip()
print(clean)
print(clean.lower())
print(clean.upper())
```

```python
word = "codehub"
print(word.startswith("code"))
print(word.endswith("hub"))
```

```python
msg = "hello world"
pos = msg.find("world")
print(pos)
```

```python
msg = "I like Java"
new_msg = msg.replace("Java", "Python")
print(new_msg)
```

### 9.2 Topic – Splitting and Joining Text (simple parsing)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: regex; file I/O; exceptions; imports; advanced CSV parsing.
- **Assumed Known (do not re-teach in this topic)**
  - Basic string methods from 9.1
  - Lists basics (`append`)
- **What to teach**
  - `split(...)` to break a sentence into words.
  - `join(...)` to build a string from a list of words.
  - Simple “normalize spaces” examples.
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
sentence = "I love CodeHub"
words = sentence.split(" ")
print(words)
```

```python
words = ["I", "love", "CodeHub"]
sentence = " ".join(words)
print(sentence)
```

---

## 10. Dictionaries – Common Patterns (Python)

> Dictionaries are already introduced on the site. This section focuses on practical “dictionary patterns” used in beginner problems.

### 10.1 Topic – Counting Frequencies (numbers and words)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: `collections.Counter`; dictionary comprehensions; regex; file I/O; exceptions; imports.
- **Assumed Known (do not re-teach in this topic)**
  - Dictionary basics: add/update, check key with `in`
  - Loops over lists/strings
- **What to teach**
  - Frequency count pattern:
    - If key not present → set to 1
    - Else → increment
  - Apply to:
    - A list of numbers
    - A sentence’s words (after `split`)
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
nums = [1, 2, 1, 3, 2, 1]
freq = {}

for x in nums:
    if x in freq:
        freq[x] += 1
    else:
        freq[x] = 1

print(freq)
```

```python
sentence = "codehub makes learning fun"
words = sentence.split(" ")
freq = {}

for w in words:
    if w in freq:
        freq[w] += 1
    else:
        freq[w] = 1

print(freq)
```

---

## 11. OOP – Classes and Objects (Python)

### 11.1 Topic – Class Basics (`class`, `__init__`, attributes, methods)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: inheritance; decorators; `@property`; dataclasses; magic methods beyond `__init__`; exceptions; imports.
  - Do **not** teach advanced OOP vocabulary; keep it concrete and example-driven.
- **Assumed Known (do not re-teach in this topic)**
  - Functions and parameters
  - Strings and basic printing
- **What to teach**
  - Class = blueprint; object = created instance.
  - `__init__` sets starting values.
  - Instance method uses `self`.
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def display(self):
        print("Name:", self.name)
        print("Age:", self.age)

s1 = Student("Aman", 18)
s1.display()
```

```python
class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        self.balance = self.balance + amount

    def show_balance(self):
        print("Balance:", self.balance)

acc = BankAccount(1000)
acc.deposit(200)
acc.show_balance()
```

---

## 12. Inheritance – Reuse with `extends`-like behavior (Python)

### 12.1 Topic – Single Inheritance (base → derived, `super().__init__`)

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: multiple inheritance; mixins; abstract base classes; method resolution order; decorators; exceptions; imports.
  - Do **not** teach deep theory (MRO, dynamic dispatch). Keep it practical.
- **Assumed Known (do not re-teach in this topic)**
  - Classes, `__init__`, methods, `self`
- **What to teach**
  - `class Child(Parent): ...`
  - Derived class reuses base fields/methods.
  - Use `super().__init__(...)` to initialize base fields.
  - Simple overriding (optional): child method with same name replacing parent behavior (keep it minimal).
- **Required lesson structure**
  - Concept → MCQ → codeblock_rearranging → fill_in_blanks
- **e.g codes**

```python
class User:
    def __init__(self, name):
        self.name = name

    def display_user(self):
        print("User:", self.name)

class Student(User):
    def __init__(self, name, roll_no):
        super().__init__(name)
        self.roll_no = roll_no

    def display_student(self):
        self.display_user()
        print("Roll:", self.roll_no)

s = Student("Neha", 10)
s.display_student()
```

---

## 13. OOP Capstone – Small Console Project (Python)

### 13.1 Topic – Final Mini Project: “CodeHub Student Tracker”

- **Exclusions (do not teach or mention in this topic)**
  - Do **not** introduce or reference: files; exceptions as a topic; modules/imports; external libraries; GUI/web.
  - Do **not** introduce advanced OOP patterns; keep it beginner-level.
- **Assumed Known (do not re-teach in this topic)**
  - Functions (including helper/predicate style)
  - Lists and dictionaries
  - Classes and simple inheritance
- **Goal**
  - One program that uses:
    - At least 2 classes
    - A list of objects
    - A helper function (e.g., `find_student_by_roll`)
    - A simple menu loop (already taught, so just use it)
- **Example skeleton**

```python
class Student:
    def __init__(self, name, roll_no, marks):
        self.name = name
        self.roll_no = roll_no
        self.marks = marks

    def display(self):
        print("Name:", self.name)
        print("Roll:", self.roll_no)
        print("Marks:", self.marks)

def find_student_by_roll(students, roll_no):
    for s in students:
        if s.roll_no == roll_no:
            return s
    return None

students = []
students.append(Student("Aman", 1, 88))
students.append(Student("Neha", 2, 92))

target = find_student_by_roll(students, 2)
if target is not None:
    target.display()
else:
    print("Not found")
```
