"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import PlaygroundAIAssistant from "@/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/ai/PlaygroundAIAssistant"
import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { executeCode } from "@/app/utils/codeExecution"
import { Editor } from "@monaco-editor/react"
import {
  HelpCircle,
  Minus,
  Play,
  Plus,
  RefreshCcw,
  Terminal,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { configureMonaco } from "../configureMonacoSnippets"
import { STANDALONE_PLAYGROUND_TUTORIAL } from "../standaloneTutorialStub"

function detectInputRequirement(code: string, languageSlug: string): boolean {
  if (!code.trim()) return false

  const inputPatterns: Record<string, RegExp[]> = {
    c: [/scanf\s*\(/, /gets\s*\(/, /getchar\s*\(/],
    "c-programming": [/scanf\s*\(/, /gets\s*\(/, /getchar\s*\(/],
    cpp: [/cin\s*>>/, /scanf\s*\(/, /gets\s*\(/, /getline\s*\(/],
    "c++": [/cin\s*>>/, /scanf\s*\(/, /gets\s*\(/, /getline\s*\(/],
    python: [/input\s*\(/, /sys\.stdin/, /raw_input\s*\(/],
    java: [
      /Scanner/,
      /System\.in/,
      /BufferedReader/,
      /nextInt\s*\(/,
      /nextLine\s*\(/,
      /next\s*\(/,
    ],
    javascript: [/prompt\s*\(/, /readline/, /process\.stdin/],
    typescript: [/prompt\s*\(/, /readline/, /process\.stdin/],
  }

  const patterns = inputPatterns[languageSlug.toLowerCase()] || []
  return patterns.some((pattern) => pattern.test(code))
}

function getInputPlaceholder(languageSlug: string): string {
  const slug = languageSlug.toLowerCase()
  const examples: Record<string, string> = {
    c: `Enter input values here...\n\nFor scanf examples:\n• scanf("%d", &num) → 42\n• scanf("%d %d", &a, &b) → 10 20\n• scanf("%s", str) → Hello\n• Multiple lines:\n5\n10\nJohn`,
    "c-programming": `Enter input values here...\n\nFor scanf examples:\n• scanf("%d", &num) → 42\n• scanf("%d %d", &a, &b) → 10 20\n• scanf("%s", str) → Hello\n• Multiple lines:\n5\n10\nJohn`,
    cpp: `Enter input values here...\n\nFor cin examples:\n• cin >> num → 42\n• cin >> a >> b → 10 20\n• getline(cin, str) → Hello World\n• Multiple lines:\n5\n10\nJohn Doe`,
    "c++": `Enter input values here...\n\nFor cin examples:\n• cin >> num → 42\n• cin >> a >> b → 10 20\n• getline(cin, str) → Hello World\n• Multiple lines:\n5\n10\nJohn Doe`,
    python: `Enter input values here...\n\nFor input() examples:\n• input() → Hello World\n• int(input()) → 42\n• Multiple inputs:\n5\n10\nJohn\nDoe`,
    java: `Enter input values here...\n\nFor Scanner examples:\n• nextInt() → 42\n• next() → Hello\n• nextLine() → Hello World\n• Multiple lines:\n5\n10\nJohn Doe`,
    javascript: `Enter input values here...\n\nFor prompt examples:\n• Single input → Hello World\n• Multiple lines:\nHello\nWorld\n42`,
    typescript: `Enter input values here...\n\nFor prompt examples:\n• Single input → Hello World\n• Multiple lines:\nHello\nWorld\n42`,
  }

  return (
    examples[slug] ||
    `Enter input values here...\n\nFor multiple inputs, separate with spaces or new lines:\n5 10\nHello World\n25`
  )
}

function getMonacoLanguage(slug: string): string {
  const langMap: Record<string, string> = {
    "c-programming": "c",
    c: "c",
    cpp: "cpp",
    "c++": "cpp",
    java: "java",
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    html: "html",
    css: "css",
    json: "json",
    sql: "sql",
    csharp: "csharp",
    "c#": "csharp",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    swift: "swift",
    kotlin: "kotlin",
    scala: "scala",
    nodejs: "javascript",
  }
  return langMap[slug.toLowerCase()] || "plaintext"
}

/** Map CMS / alias slugs to boilerplate keys */
function normalizeBoilerplateKey(slug: string): string {
  const s = slug.toLowerCase()
  const aliases: Record<string, string> = {
    "c-programming": "c",
    "c++": "cpp",
    "c#": "csharp",
    nodejs: "javascript",
    node: "javascript",
  }
  return aliases[s] ?? s
}

/** Default starter code per language when localStorage has no saved snippet */
const LANGUAGE_BOILERPLATE: Record<string, string> = {
  c: `#include <stdio.h>

void main() {
    printf("Hello CodeHub!!\\n");
}
`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello CodeHub!!" << std::endl;
    return 0;
}
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello CodeHub!!");
    }
}
`,
  python: `print("Hello CodeHub!!")
`,
  javascript: `console.log("Hello CodeHub!!");
`,
  typescript: `console.log("Hello CodeHub!!");
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Playground</title>
</head>
<body>
  <p>Hello CodeHub!!</p>
</body>
</html>
`,
  css: `body {
  font-family: system-ui, sans-serif;
  margin: 1rem;
}
`,
  json: `{
  "message": "Hello CodeHub!!"
}
`,
  sql: `SELECT 'Hello CodeHub!!' AS message;
`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello CodeHub!!");
    }
}
`,
  go: `package main

import "fmt"

func main() {
	fmt.Println("Hello CodeHub!!")
}
`,
  rust: `fn main() {
    println!("Hello CodeHub!!");
}
`,
  php: `<?php

echo "Hello CodeHub!!\\n";
`,
  ruby: `puts "Hello CodeHub!!"
`,
  swift: `print("Hello CodeHub!!")
`,
  kotlin: `fun main() {
    println("Hello CodeHub!!")
}
`,
  scala: `object Main extends App {
  println("Hello CodeHub!!")
}
`,
}

function getBoilerplateForLanguage(lang: Language): string {
  const key = normalizeBoilerplateKey(lang.slug)
  const template = LANGUAGE_BOILERPLATE[key]
  if (template) return template
  const monaco = getMonacoLanguage(lang.slug)
  if (monaco === "plaintext") {
    return `${lang.title}\n\n`
  }
  return `// ${lang.title} — start coding here\n\n`
}

const AI_TUTORIAL: Tutorial = STANDALONE_PLAYGROUND_TUTORIAL

interface LearnGlobalPlaygroundProps {
  languages: Language[]
  initialLangSlug?: string | null
}

const LearnGlobalPlayground: React.FC<LearnGlobalPlaygroundProps> = ({
  languages,
  initialLangSlug,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortedLanguages = useMemo(
    () =>
      [...languages].sort((a, b) => {
        const ai = typeof a.index === "number" ? a.index : 0
        const bi = typeof b.index === "number" ? b.index : 0
        if (ai !== bi) return ai - bi
        return String(a.title).localeCompare(String(b.title))
      }),
    [languages]
  )

  const resolveLanguage = useCallback(
    (slug: string | null | undefined): Language | null => {
      if (!slug || !sortedLanguages.length) return null
      const s = slug.toLowerCase()
      return sortedLanguages.find((l) => l.slug.toLowerCase() === s) ?? null
    },
    [sortedLanguages]
  )

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  )
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [input, setInput] = useState("")
  const [showAI, setShowAI] = useState(false)
  /** User opened stdin without pattern match (e.g. languages with stdin but no regex) */
  const [manualStdinOpen, setManualStdinOpen] = useState(false)
  const [outputHeight, setOutputHeight] = useState(160)
  const resizeStateRef = useRef({
    isResizing: false,
    startY: 0,
    startHeight: 160,
  })
  const [editorFontSize, setEditorFontSize] = useState(14)
  const [outputFontSize, setOutputFontSize] = useState(11)
  const runCodeRef = useRef<() => void>(() => {})

  const hydratedLang = useRef(false)

  useEffect(() => {
    if (!sortedLanguages.length) return
    if (hydratedLang.current) return
    hydratedLang.current = true
    const fromProp = initialLangSlug ?? searchParams.get("lang")
    const resolved = resolveLanguage(fromProp) ?? sortedLanguages[0]
    setSelectedLanguage(resolved)
  }, [sortedLanguages, initialLangSlug, searchParams, resolveLanguage])

  const storageKey = useMemo(
    () =>
      selectedLanguage
        ? `playground:global:${selectedLanguage.slug}`
        : "playground:global:pending",
    [selectedLanguage]
  )

  const loadFromStorage = useCallback((lang: Language) => {
    const key = `playground:global:${lang.slug}`
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        const saved = typeof parsed.code === "string" ? parsed.code : ""
        setCode(saved.trim() !== "" ? saved : getBoilerplateForLanguage(lang))
        if (typeof parsed.input === "string") setInput(parsed.input)
        else setInput("")
      } else {
        setCode(getBoilerplateForLanguage(lang))
        setInput("")
      }
    } catch {
      setCode(getBoilerplateForLanguage(lang))
      setInput("")
    }
  }, [])

  const languageSlugRef = useRef<string | null>(null)

  useEffect(() => {
    if (!selectedLanguage) return
    if (languageSlugRef.current === selectedLanguage.slug) return
    languageSlugRef.current = selectedLanguage.slug
    loadFromStorage(selectedLanguage)
  }, [selectedLanguage, loadFromStorage])

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ code, input }))
      } catch {
        /* ignore quota */
      }
    }, 300)
    return () => clearTimeout(id)
  }, [storageKey, code, input])

  const stdinSuggested = useMemo(
    () =>
      selectedLanguage
        ? detectInputRequirement(code, selectedLanguage.slug)
        : false,
    [code, selectedLanguage]
  )

  useEffect(() => {
    setManualStdinOpen(false)
  }, [selectedLanguage?.slug])

  const showInputSection = stdinSuggested || manualStdinOpen

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))

  const adjustEditorFontSize = (delta: number) => {
    setEditorFontSize((size) => clamp(size + delta, 10, 30))
  }

  const adjustOutputFontSize = (delta: number) => {
    setOutputFontSize((size) => clamp(size + delta, 9, 24))
  }

  const resetZoom = () => {
    setEditorFontSize(14)
    setOutputFontSize(11)
  }

  const zoomDisabled = showAI

  const stopResizing = () => {
    if (!resizeStateRef.current.isResizing) return
    resizeStateRef.current.isResizing = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
    document.removeEventListener("touchmove", handleTouchMove)
    document.removeEventListener("touchend", handleTouchEnd)
    document.body.style.cursor = ""
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!resizeStateRef.current.isResizing) return
    const delta = resizeStateRef.current.startY - event.clientY
    setOutputHeight(clamp(resizeStateRef.current.startHeight + delta, 96, 400))
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!resizeStateRef.current.isResizing || event.touches.length === 0) return
    const delta = resizeStateRef.current.startY - event.touches[0].clientY
    setOutputHeight(clamp(resizeStateRef.current.startHeight + delta, 96, 400))
  }

  const handleMouseUp = () => stopResizing()
  const handleTouchEnd = () => stopResizing()

  const handleResizeStart = (clientY: number) => {
    resizeStateRef.current = {
      isResizing: true,
      startY: clientY,
      startHeight: outputHeight,
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
    document.body.style.cursor = "row-resize"
  }

  const onResizeMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    handleResizeStart(event.clientY)
  }

  const onResizeTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 0) return
    handleResizeStart(event.touches[0].clientY)
  }

  useEffect(() => {
    return () => {
      stopResizing()
    }
  }, [])

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: editorFontSize,
      lineHeight: Math.round(editorFontSize * 1.4),
      fontFamily:
        "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
      wordWrap: "on" as const,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderLineHighlight: "gutter" as const,
      selectOnLineNumbers: true,
      lineNumbers: "on" as const,
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      renderWhitespace: "selection" as const,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on" as const,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      parameterHints: { enabled: true },
      hover: { enabled: true },
      contextmenu: true,
      mouseWheelZoom: !zoomDisabled,
      cursorBlinking: "blink" as const,
      cursorSmoothCaretAnimation: "on" as const,
      smoothScrolling: true,
      scrollbar: {
        vertical: "visible" as const,
        horizontal: "visible" as const,
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    }),
    [editorFontSize, zoomDisabled]
  )

  const placeholder = selectedLanguage
    ? `// Write your ${getMonacoLanguage(selectedLanguage.slug)} code here...\n\n`
    : `// Select a language above...\n\n`

  const handleRunCode = useCallback(async () => {
    if (!code.trim() || isRunning || !selectedLanguage) return

    setIsRunning(true)
    setOutput("")

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Execution timeout (30s)")), 30000)
      )

      const result = (await Promise.race([
        executeCode({
          code,
          language: selectedLanguage.slug,
          input,
        }),
        timeoutPromise,
      ])) as Awaited<ReturnType<typeof executeCode>>

      if (result.success) {
        let outputText = result.output || ""

        if (result.executionTime) {
          outputText += `\n\n─────────────────────\nExecution time: ${result.executionTime}ms`
        }

        setOutput(outputText)
      } else {
        let errorText = "❌ Execution Failed\n\n"

        if (result.error) {
          errorText += `Error: ${result.error}\n`
        }

        if (result.stderr) {
          errorText += `\nDetails:\n${result.stderr}`
        }

        if (result.output) {
          errorText += `\n\nOutput:\n${result.output}`
        }

        setOutput(errorText)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"

      if (errorMessage.includes("timeout")) {
        setOutput(
          "⏱️ Execution Timeout\n\nYour code took too long to execute (>30 seconds). Please check for infinite loops or optimize your code."
        )
      } else if (errorMessage.includes("Network")) {
        setOutput(
          `❌ Network Error\n\nFailed to execute code: ${errorMessage}\n\nPlease check your connection and try again.`
        )
      } else {
        setOutput(
          `❌ Error\n\nFailed to execute code: ${errorMessage}\n\nPlease check your code and try again.`
        )
      }
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, selectedLanguage, input])

  useEffect(() => {
    runCodeRef.current = handleRunCode
  }, [handleRunCode])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setIsEditorReady(true)
    configureMonaco(monaco)

    const run = () => runCodeRef.current()
    const insertLineBelow = () => {
      editor.getAction("editor.action.insertLineAfter")?.run()
    }

    // Ctrl/Cmd+Enter: insert line below (VS Code default). Alt+Enter: run.
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      insertLineBelow
    )
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Enter, run)

    editor.focus()
  }

  const syncUrlLang = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", slug)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const onLanguageSelect = (slug: string) => {
    const lang = sortedLanguages.find((l) => l.slug === slug)
    if (!lang) return
    languageSlugRef.current = null
    setSelectedLanguage(lang)
    syncUrlLang(slug)
  }

  if (!sortedLanguages.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-0 pt-16 text-center text-gray-600 dark:text-gray-400">
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          No programming languages available
        </p>
        <p className="mt-2 text-sm">
          Add languages in the CMS to use the code playground.
        </p>
      </div>
    )
  }

  if (!selectedLanguage) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pb-0 pt-16">
        <div className="flex items-center gap-2 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span>Loading playground…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-0 pt-16">
      <div className="flex h-[calc(100svh-4rem)] w-full flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
            <div
              className={`flex min-h-0 min-w-0 flex-col overflow-hidden transition-all duration-300 ${
                showAI
                  ? "hidden w-full lg:flex lg:w-1/2 lg:border-r lg:border-gray-200 lg:dark:border-gray-700"
                  : "w-full lg:w-full"
              }`}
            >
              <div className="toolbar-enter shrink-0 border-b border-slate-200/80 bg-slate-50 px-1.5 py-1.5 dark:border-slate-600 dark:bg-zinc-950 sm:px-2 sm:py-2">
                {/* Single row: run & utilities left-of-center, zoom pinned to the right (smaller hit targets). */}
                <div className="flex min-w-0 flex-row flex-nowrap items-center gap-0.5 sm:gap-1 md:gap-1.5">
                  <div className="flex min-w-0 shrink items-center gap-0.5 sm:gap-1">
                    <label
                      htmlFor="playground-language-toolbar"
                      className="sr-only"
                    >
                      Language
                    </label>
                    <select
                      id="playground-language-toolbar"
                      value={selectedLanguage.slug}
                      onChange={(e) => onLanguageSelect(e.target.value)}
                      className="box-border h-8 min-h-8 min-w-0 max-w-[3.25rem] shrink rounded-md border border-slate-300 bg-white px-1 py-0 text-[9px] font-medium leading-none text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 sm:max-w-[4.5rem] sm:text-[10px] md:max-w-[8rem] md:text-xs lg:max-w-[12rem] lg:px-2 lg:text-sm"
                      aria-label="Programming language"
                      title={selectedLanguage.title}
                    >
                      {sortedLanguages.map((lang) => (
                        <option key={`tb-${String(lang.id)}`} value={lang.slug}>
                          {lang.title}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRunCode()}
                      disabled={!code.trim() || isRunning || !isEditorReady}
                      title={isRunning ? "Running…" : "Run code (Alt+Enter)"}
                      className={`focus-ring inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-white lg:w-auto lg:gap-1.5 lg:px-2.5 xl:px-3 ${
                        !code.trim() || isRunning || !isEditorReady
                          ? "cursor-not-allowed bg-slate-400 opacity-60"
                          : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                      }`}
                    >
                      <Play
                        className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${isRunning ? "animate-spin" : ""}`}
                      />
                      <span className="hidden pl-0.5 text-xs font-semibold lg:inline xl:text-sm">
                        {isRunning ? "Running…" : "Run"}
                      </span>
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                    <button
                      type="button"
                      onClick={() => setManualStdinOpen((open) => !open)}
                      className={`focus-ring relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border lg:w-auto lg:min-w-0 lg:gap-1 lg:px-2 ${
                        showInputSection
                          ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/40"
                          : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900"
                      }`}
                      title="Program input (stdin)"
                      aria-label="Toggle program input"
                    >
                      <Terminal className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      <span className="hidden text-[11px] font-medium lg:inline">
                        In
                      </span>
                      {input.trim() ? (
                        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 lg:right-1 lg:top-1" />
                      ) : null}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAI(!showAI)}
                      className={`focus-ring inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border lg:w-auto lg:gap-1 lg:px-2 ${
                        showAI
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-100"
                          : "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                      }`}
                      aria-label={showAI ? "Close AI help" : "Open AI help"}
                      title="AI help"
                    >
                      <HelpCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      <span className="hidden text-[11px] font-medium lg:inline">
                        AI
                      </span>
                    </button>
                  </div>

                  {!showAI && (
                    <div className="ml-auto flex min-w-0 shrink-0 items-center">
                      <span className="sr-only">Zoom</span>
                      <div
                        className="inline-flex max-w-full shrink-0 items-center gap-0 rounded-md border border-slate-200/90 bg-white p-px shadow-sm dark:border-slate-600 dark:bg-slate-900"
                        role="toolbar"
                        aria-label="Editor and output zoom"
                      >
                        <span className="hidden px-0.5 text-[9px] font-medium uppercase text-slate-400 xl:inline">
                          Ed
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustEditorFontSize(-1)}
                          disabled={!isEditorReady || zoomDisabled}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800 lg:h-7 lg:w-7"
                          aria-label="Zoom out editor"
                        >
                          <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustEditorFontSize(1)}
                          disabled={!isEditorReady || zoomDisabled}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800 lg:h-7 lg:w-7"
                          aria-label="Zoom in editor"
                        >
                          <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
                        </button>
                        <div className="mx-px h-3 w-px shrink-0 bg-slate-200 dark:bg-slate-600 sm:h-3.5 lg:h-4" />
                        <span className="hidden px-0.5 text-[9px] font-medium uppercase text-slate-400 xl:inline">
                          Out
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustOutputFontSize(-1)}
                          disabled={zoomDisabled}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:h-7 lg:w-7"
                          aria-label="Zoom out output"
                        >
                          <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustOutputFontSize(1)}
                          disabled={zoomDisabled}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:h-7 lg:w-7"
                          aria-label="Zoom in output"
                        >
                          <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={resetZoom}
                          disabled={zoomDisabled}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:h-7 lg:w-7"
                          aria-label="Reset zoom"
                        >
                          <RefreshCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {showInputSection && (
                  <div className="input-section-enter mt-1 rounded border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <div className="border-b border-yellow-200 px-2 py-0.5 dark:border-yellow-800">
                      <span className="text-[10px] font-semibold text-yellow-900 dark:text-yellow-100">
                        Stdin
                      </span>
                    </div>
                    <div className="p-1.5">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={2}
                        disabled={isRunning}
                        placeholder={getInputPlaceholder(selectedLanguage.slug)}
                        className="w-full resize-none rounded border border-yellow-300 bg-white px-2 py-1 font-mono text-xs focus:border-yellow-500 focus:outline-none dark:border-yellow-700 dark:bg-gray-800 dark:text-white"
                        aria-label="Program input"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden border-0 dark:border-slate-700">
                <Editor
                  height="100%"
                  language={getMonacoLanguage(selectedLanguage.slug)}
                  value={code || placeholder}
                  onChange={(value) => setCode(value || "")}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={editorOptions}
                  loading={
                    <div className="flex h-full min-h-[200px] items-center justify-center bg-slate-900">
                      <div className="flex items-center gap-2 text-slate-400">
                        <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                        <span className="text-sm">
                          Loading Monaco Editor...
                        </span>
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="shrink-0 border-t border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 px-2 py-0.5 dark:border-slate-700">
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    Output
                  </span>
                  {output && !isRunning && (
                    <button
                      type="button"
                      onClick={() => setOutput("")}
                      className="min-h-[32px] min-w-[44px] rounded px-2 text-[10px] text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 dark:hover:bg-slate-600/50 dark:hover:text-slate-200 sm:min-h-0 sm:min-w-0 sm:text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div
                  className="flex cursor-row-resize justify-center border-t border-transparent px-2"
                  onMouseDown={onResizeMouseDown}
                  onTouchStart={onResizeTouchStart}
                  role="presentation"
                >
                  <div className="my-0.5 h-1 w-8 rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>
                <div
                  className="overflow-y-auto overscroll-contain px-2 pb-1"
                  style={{
                    height: `${outputHeight}px`,
                    maxHeight: "min(400px, 40vh)",
                  }}
                >
                  {isRunning ? (
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <div className="h-2.5 w-2.5 animate-spin rounded-full border border-blue-600 border-t-transparent" />
                      <span className="text-[10px]">Executing…</span>
                    </div>
                  ) : output ? (
                    <pre
                      className="whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-200"
                      style={{
                        fontSize: `${outputFontSize}px`,
                        lineHeight: `${Math.round(outputFontSize * 1.4)}px`,
                      }}
                    >
                      {output}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center py-1">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        —
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showAI && (
              <div
                className={`flex h-full min-h-0 w-full min-w-0 flex-col border-gray-200 dark:border-gray-700 lg:w-1/2 lg:border-l ${
                  showAI ? "block" : "hidden lg:block"
                }`}
              >
                <PlaygroundAIAssistant
                  tutorial={AI_TUTORIAL}
                  lesson={null}
                  language={selectedLanguage}
                  currentCode={code}
                  codeOutput={output}
                  onClose={() => setShowAI(false)}
                />
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900 lg:hidden">
            <button
              type="button"
              onClick={() => setShowAI(!showAI)}
              className="min-h-[44px] w-full rounded-md bg-blue-600 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 sm:min-h-0 sm:py-1.5 sm:text-sm"
            >
              {showAI ? "Switch to code" : "Switch to AI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearnGlobalPlayground
