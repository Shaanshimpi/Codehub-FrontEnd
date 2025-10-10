// Utility for generating clean and instructional boilerplate code
export interface BoilerplateResult {
  clean: string
  instructional: string
}

export class BoilerplateGenerator {
  static generate(exercise: any, language: any): BoilerplateResult {
    // If exercise has specific boilerplate, use it as instructional base
    const instructionalCode =
      exercise.boilerplate_code ||
      this.generateDefaultBoilerplate(language.slug)

    // Generate clean version by removing comments
    const cleanCode = this.removeComments(instructionalCode, language.slug)

    return {
      clean: cleanCode,
      instructional: instructionalCode,
    }
  }

  private static generateDefaultBoilerplate(languageSlug: string): string {
    switch (languageSlug) {
      case "c-programming":
      case "c":
        return `#include <stdio.h>

// TODO: Write your solution here
// HINT: Use printf() to output results
// EXAMPLE: printf("Hello World\\n");

int main() {
    // Write your code below

    return 0;
}`

      case "cpp":
      case "c++":
        return `#include <iostream>
using namespace std;

// TODO: Write your solution here
// HINT: Use cout to output results
// EXAMPLE: cout << "Hello World" << endl;

int main() {
    // Write your code below

    return 0;
}`

      case "java":
        return `public class Solution {
    // TODO: Write your solution here
    // HINT: Use System.out.println() to output results
    // EXAMPLE: System.out.println("Hello World");

    public static void main(String[] args) {
        // Write your code below

    }
}`

      case "python":
        return `# TODO: Write your solution here
# HINT: Use print() to output results
# EXAMPLE: print("Hello World")

def main():
    # Write your code below
    pass

if __name__ == "__main__":
    main()`

      case "javascript":
        return `// TODO: Write your solution here
// HINT: Use console.log() to output results
// EXAMPLE: console.log("Hello World");

function main() {
    // Write your code below

}

main();`

      case "typescript":
        return `// TODO: Write your solution here
// HINT: Use console.log() to output results
// EXAMPLE: console.log("Hello World");

function main(): void {
    // Write your code below

}

main();`

      default:
        return `// TODO: Write your solution here
// HINT: Follow the exercise requirements
// EXAMPLE: Start with basic structure

function main() {
    // Write your code below

}`
    }
  }

  private static removeComments(code: string, languageSlug: string): string {
    if (!code) return code

    let cleanCode = code

    try {
      switch (languageSlug) {
        case "javascript":
        case "typescript":
        case "java":
        case "c":
        case "c-programming":
        case "cpp":
        case "c++":
          // Remove single-line comments (// but keep #include, #define, etc.)
          cleanCode = cleanCode.replace(/^[ \t]*\/\/.*$/gm, "")
          // Remove multi-line comments (/* */)
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
          break

        case "python":
          // Remove single-line comments (#)
          cleanCode = cleanCode.replace(/^[ \t]*#.*$/gm, "")
          // Remove multi-line strings used as comments (""" or ''')
          cleanCode = cleanCode.replace(/"""[\s\S]*?"""/g, "")
          cleanCode = cleanCode.replace(/'''[\s\S]*?'''/g, "")
          break

        case "html":
          // Remove HTML comments
          cleanCode = cleanCode.replace(/<!--[\s\S]*?-->/g, "")
          break

        case "css":
          // Remove CSS comments
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
          break

        case "sql":
          // Remove SQL comments
          cleanCode = cleanCode.replace(/^[ \t]*--.*$/gm, "")
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
          break

        default:
          // Default: remove // and /* */ style comments
          cleanCode = cleanCode.replace(/^[ \t]*\/\/.*$/gm, "")
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
      }

      // Clean up excessive whitespace but preserve basic formatting
      cleanCode = cleanCode
        .replace(/\n\s*\n\s*\n/g, "\n\n") // Replace multiple empty lines with double line breaks
        .replace(/^\s*\n/gm, "") // Remove leading whitespace on empty lines
        .trim() // Remove leading/trailing whitespace

      return cleanCode
    } catch (error) {
      console.error("Error removing comments:", error)
      return code // Return original code if error
    }
  }
}
