let configured = false

type Monaco = any

export type SnippetDef = {
  label: string
  detail?: string
  documentation?: string
  insertText: string
  filterText?: string
  sortText?: string
  additionalTextEdits?: (args: {
    monaco: Monaco
    model: any
  }) => any[] | undefined
}

function getWordRange(model: any, position: any) {
  const word = model.getWordUntilPosition(position)
  return {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  }
}

function registerSnippetProvider(
  monaco: Monaco,
  languageId: string,
  snippets: SnippetDef[]
) {
  return monaco.languages.registerCompletionItemProvider(languageId, {
    triggerCharacters: ["(", "{", ":"],
    provideCompletionItems(model: any, position: any) {
      const range = getWordRange(model, position)
      return {
        suggestions: snippets.map((s) => ({
          label: s.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: s.insertText,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: s.detail,
          documentation: s.documentation,
          filterText: s.filterText,
          sortText: s.sortText,
          additionalTextEdits: s.additionalTextEdits?.({ monaco, model }),
          range,
        })),
      }
    },
  })
}

function javaHasImport(model: any, importLine: string) {
  const target = importLine.trim()
  const lineCount = model.getLineCount?.() ?? 0
  for (let i = 1; i <= lineCount; i++) {
    const line = String(model.getLineContent(i) || "").trim()
    if (line === target) return true
  }
  return false
}

function findJavaImportInsertRange(model: any) {
  const lineCount = model.getLineCount?.() ?? 0
  let packageLine = 0
  let lastImportLine = 0

  for (let i = 1; i <= lineCount; i++) {
    const line = String(model.getLineContent(i) || "").trim()
    if (!packageLine && line.startsWith("package ") && line.endsWith(";")) {
      packageLine = i
      continue
    }
    if (line.startsWith("import ") && line.endsWith(";")) {
      lastImportLine = i
    }
  }

  const insertAfter = lastImportLine || packageLine || 0
  const insertAtLine = insertAfter ? insertAfter + 1 : 1

  return {
    startLineNumber: insertAtLine,
    startColumn: 1,
    endLineNumber: insertAtLine,
    endColumn: 1,
  }
}

function cSnippets(): SnippetDef[] {
  return [
    {
      label: "include",
      detail: "#include <...>",
      sortText: "00_include",
      insertText: "#include <${1:stdio.h}>$0",
    },
    {
      label: "includeio",
      detail: "#include stdio/stdlib",
      sortText: "00_includeio",
      filterText: "include stdio stdlib",
      insertText: ["#include <stdio.h>", "#include <stdlib.h>", "$0"].join(
        "\n"
      ),
    },
    {
      label: "if",
      detail: "if statement",
      sortText: "01_if",
      insertText: ["if (${1:condition}) {", "\t$0", "}"].join("\n"),
    },
    {
      label: "ifelse",
      detail: "if/else statement",
      sortText: "02_ifelse",
      filterText: "if else",
      insertText: [
        "if (${1:condition}) {",
        "\t$2",
        "} else {",
        "\t$0",
        "}",
      ].join("\n"),
    },
    {
      label: "for",
      detail: "for loop (index)",
      sortText: "03_for",
      insertText: [
        "for (${1:int i = 0}; ${2:i < n}; ${3:i++}) {",
        "\t$0",
        "}",
      ].join("\n"),
    },
    {
      label: "while",
      detail: "while loop",
      sortText: "04_while",
      insertText: ["while (${1:condition}) {", "\t$0", "}"].join("\n"),
    },
    {
      label: "do",
      detail: "do/while loop",
      sortText: "05_do",
      filterText: "do while",
      insertText: ["do {", "\t$0", "} while (${1:condition});"].join("\n"),
    },
    {
      label: "switch",
      detail: "switch statement",
      sortText: "06_switch",
      insertText: [
        "switch (${1:expr}) {",
        "\tcase ${2:value}:",
        "\t\t$0",
        "\t\tbreak;",
        "\tdefault:",
        "\t\tbreak;",
        "}",
      ].join("\n"),
    },
    {
      label: "main",
      detail: "main() template",
      sortText: "00_main",
      insertText: ["void main() {", "\t$0", "}"].join("\n"),
    },
    {
      label: "printf",
      detail: "printf template",
      sortText: "10_printf",
      insertText: 'printf("${1:%d}\\n");$0',
    },
    {
      label: "scanf",
      detail: "scanf template",
      sortText: "11_scanf",
      insertText: 'scanf("${1:%d}", &${2:value});$0',
    },
    {
      label: "inputint",
      detail: "read int (scanf)",
      sortText: "12_input",
      filterText: "input read int scanf",
      insertText: 'int ${1:x};\nscanf("%d", &${1:x});\n$0',
    },
  ]
}

function cppSnippets(): SnippetDef[] {
  return [
    ...cSnippets().filter((s) => !["printf", "scanf"].includes(s.label)),
    {
      label: "include",
      detail: "#include <...>",
      sortText: "00_include",
      insertText: "#include <${1:iostream}>$0",
    },
    {
      label: "includeall",
      detail: "CP header (#include <bits/stdc++.h>)",
      sortText: "00_includeall",
      filterText: "include bits stdc++",
      insertText: [
        "#include <bits/stdc++.h>",
        "using namespace std;",
        "$0",
      ].join("\n"),
    },
    {
      label: "main",
      detail: "main() template (C++)",
      sortText: "00_main",
      insertText: ["int main() {", "\t$0", "\treturn 0;", "}"].join("\n"),
    },
    {
      label: "cout",
      detail: "std::cout print",
      sortText: "10_cout",
      insertText: "std::cout << ${1:value} << std::endl;$0",
    },
    {
      label: "cin",
      detail: "std::cin input",
      sortText: "11_cin",
      insertText: "std::cin >> ${1:var};$0",
    },
    {
      label: "inputint",
      detail: "read int (cin)",
      sortText: "12_input",
      filterText: "input read int cin",
      insertText: "int ${1:x};\nstd::cin >> ${1:x};\n$0",
    },
    {
      label: "vector",
      detail: "std::vector declaration",
      sortText: "12_vector",
      insertText: "std::vector<${1:int}> ${2:v};$0",
    },
  ]
}

function javaSnippets(): SnippetDef[] {
  return [
    {
      label: "import",
      detail: "import java.util.*;",
      sortText: "00_import",
      insertText: "import java.util.*;\n$0",
    },
    {
      label: "main",
      detail: "public static void main",
      sortText: "00_main",
      insertText: [
        "public class Main {",
        "\tpublic static void main(String[] args) {",
        "\t\t$0",
        "\t}",
        "}",
      ].join("\n"),
    },
    {
      label: "if",
      detail: "if statement",
      sortText: "01_if",
      insertText: ["if (${1:condition}) {", "\t$0", "}"].join("\n"),
    },
    {
      label: "ifelse",
      detail: "if/else statement",
      sortText: "02_ifelse",
      filterText: "if else",
      insertText: [
        "if (${1:condition}) {",
        "\t$2",
        "} else {",
        "\t$0",
        "}",
      ].join("\n"),
    },
    {
      label: "for",
      detail: "for loop (index)",
      sortText: "03_for",
      insertText: [
        "for (int ${1:i} = 0; ${2:i} < ${3:n}; ${2:i}++) {",
        "\t$0",
        "}",
      ].join("\n"),
    },
    {
      label: "while",
      detail: "while loop",
      sortText: "04_while",
      insertText: ["while (${1:condition}) {", "\t$0", "}"].join("\n"),
    },
    {
      label: "switch",
      detail: "switch statement",
      sortText: "06_switch",
      insertText: [
        "switch (${1:expr}) {",
        "\tcase ${2:value}:",
        "\t\t$0",
        "\t\tbreak;",
        "\tdefault:",
        "\t\tbreak;",
        "}",
      ].join("\n"),
    },
    {
      label: "sout",
      detail: "System.out.println",
      sortText: "10_sout",
      insertText: "System.out.println(${1:value});$0",
    },
    {
      label: "scanner",
      detail: "Scanner input (+ import java.util.Scanner;)",
      sortText: "11_scanner",
      insertText: [
        "Scanner sc = new Scanner(System.in);",
        "${1:int} ${2:x} = sc.next${3:Int}();",
        "$0",
      ].join("\n"),
      additionalTextEdits: ({ monaco, model }) => {
        const importLine = "import java.util.Scanner;"
        if (javaHasImport(model, importLine)) return undefined

        const range = findJavaImportInsertRange(model)
        const text = `${importLine}\n`

        return [
          {
            range,
            text,
            forceMoveMarkers: true,
          },
        ]
      },
    },
  ]
}

function pythonSnippets(): SnippetDef[] {
  return [
    {
      label: "input",
      detail: "read input()",
      sortText: "00_input",
      insertText: "${1:s} = input()$0",
    },
    {
      label: "inputint",
      detail: "read int",
      sortText: "00_inputint",
      filterText: "input read int",
      insertText: "${1:n} = int(input())$0",
    },
    {
      label: "inputlist",
      detail: "read list of ints",
      sortText: "00_inputlist",
      filterText: "input list ints map split",
      insertText: "${1:arr} = list(map(int, input().split()))$0",
    },
    {
      label: "if",
      detail: "if statement",
      sortText: "01_if",
      insertText: ["if ${1:condition}:", "\t$0"].join("\n"),
    },
    {
      label: "ifelse",
      detail: "if/else statement",
      sortText: "02_ifelse",
      filterText: "if else",
      insertText: ["if ${1:condition}:", "\t$2", "else:", "\t$0"].join("\n"),
    },
    {
      label: "for",
      detail: "for loop",
      sortText: "03_for",
      insertText: ["for ${1:i} in range(${2:n}):", "\t$0"].join("\n"),
    },
    {
      label: "while",
      detail: "while loop",
      sortText: "04_while",
      insertText: ["while ${1:condition}:", "\t$0"].join("\n"),
    },
    {
      label: "def",
      detail: "function definition",
      sortText: "00_def",
      insertText: ["def ${1:func}(${2:args}):", "\t$0"].join("\n"),
    },
    {
      label: "main",
      detail: '__name__ == "__main__" guard',
      sortText: "10_main",
      insertText: [
        "def main():",
        "\t$0",
        "",
        'if __name__ == "__main__":',
        "\tmain()",
      ].join("\n"),
    },
    {
      label: "print",
      detail: "print()",
      sortText: "11_print",
      insertText: "print(${1:value})$0",
    },
  ]
}

function javascriptSnippets(): SnippetDef[] {
  return [
    {
      label: "log",
      detail: "console.log",
      sortText: "00_log",
      insertText: "console.log(${1:value});$0",
    },
    {
      label: "if",
      detail: "if statement",
      sortText: "01_if",
      insertText: ["if (${1:condition}) {", "\t$0", "}"].join("\n"),
    },
    {
      label: "ifelse",
      detail: "if/else",
      sortText: "02_ifelse",
      insertText: [
        "if (${1:condition}) {",
        "\t$2",
        "} else {",
        "\t$0",
        "}",
      ].join("\n"),
    },
    {
      label: "for",
      detail: "for loop",
      sortText: "03_for",
      insertText: [
        "for (let ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {",
        "\t$0",
        "}",
      ].join("\n"),
    },
    {
      label: "foreach",
      detail: "for...of",
      sortText: "03_foreach",
      insertText: "for (const ${1:x} of ${2:iter}) {\n\t$0\n}",
    },
    {
      label: "fn",
      detail: "function",
      sortText: "00_fn",
      insertText: ["function ${1:name}(${2:args}) {", "\t$0", "}"].join("\n"),
    },
    {
      label: "arrow",
      detail: "arrow function",
      sortText: "00_arrow",
      insertText: "const ${1:name} = (${2:args}) => {\n\t$0\n};",
    },
  ]
}

/** Registers snippet completion providers once per Monaco instance (languages c, cpp, java, python, javascript, typescript). */
export function configureMonaco(monaco: Monaco) {
  if (configured || !monaco?.languages) return
  configured = true

  registerSnippetProvider(monaco, "c", cSnippets())
  registerSnippetProvider(monaco, "cpp", cppSnippets())
  registerSnippetProvider(monaco, "java", javaSnippets())
  registerSnippetProvider(monaco, "python", pythonSnippets())
  registerSnippetProvider(monaco, "javascript", javascriptSnippets())
  registerSnippetProvider(monaco, "typescript", javascriptSnippets())
}
