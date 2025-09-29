"use client"

import React, { useState } from "react"
import CodeVariationDisplay from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/CodeVariationDisplay"
import CommentToggle from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/CommentToggle"
import EnhancedTabContainer, {
  TabConfig,
} from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/EnhancedTabContainer"
import {
  extractComments,
  getCodeStats,
  hasInstructionalComments,
  removeComments,
  removeInstructionalComments,
} from "@/app/utils/codeCommentUtils"
import { Code, MessageSquare, Zap } from "lucide-react"

// Sample code for testing
const sampleCodes = {
  javascript: `// [1] Initialize variables for prime checking
let number = 17;
let isPrime = true;

// [2] Check if number is less than 2
if (number < 2) {
    isPrime = false;
} else {
    // [3] Loop through potential divisors
    for (let i = 2; i < number; i++) {
        // Check if number is divisible
        if (number % i === 0) {
            isPrime = false;
            break; // Exit loop early
        }
    }
}

// [4] Display the result
console.log(\`\${number} is \${isPrime ? 'prime' : 'not prime'}\`);`,

  python: `# [1] Initialize variables for prime checking
number = 17
is_prime = True

# [2] Check if number is less than 2
if number < 2:
    is_prime = False
else:
    # [3] Loop through potential divisors
    for i in range(2, number):
        # Check if number is divisible
        if number % i == 0:
            is_prime = False
            break  # Exit loop early

# [4] Display the result
print(f"{number} is {'prime' if is_prime else 'not prime'}")`,

  java: `// [1] Main class for prime checking
public class PrimeChecker {
    public static void main(String[] args) {
        // [2] Initialize variables
        int number = 17;
        boolean isPrime = true;

        // [3] Check if number is less than 2
        if (number < 2) {
            isPrime = false;
        } else {
            // [4] Loop through potential divisors
            for (int i = 2; i < number; i++) {
                // Check if number is divisible
                if (number % i == 0) {
                    isPrime = false;
                    break; // Exit loop early
                }
            }
        }

        // [5] Display the result
        System.out.println(number + " is " + (isPrime ? "prime" : "not prime"));
    }
}`,
}

export default function TestCommentsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [showComments, setShowComments] = useState(true)
  const [testResults, setTestResults] = useState<any>({})

  const currentCode = sampleCodes[selectedLanguage as keyof typeof sampleCodes]

  // Run utility function tests
  const runTests = () => {
    const results: any = {}

    Object.entries(sampleCodes).forEach(([lang, code]) => {
      results[lang] = {
        original: code,
        withoutComments: removeComments(code, lang),
        withoutInstructional: removeInstructionalComments(code, lang),
        extractedComments: extractComments(code, lang),
        hasInstructional: hasInstructionalComments(code, lang),
        stats: getCodeStats(code, lang),
      }
    })

    setTestResults(results)
  }

  // Enhanced tab configuration
  const testTabs: TabConfig[] = [
    {
      id: "utilities",
      label: "Utility Functions",
      icon: <Zap className="h-4 w-4" />,
      content: (
        <div className="space-y-6 p-6">
          <div className="mb-6 flex gap-4">
            <button
              onClick={runTests}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Run All Tests
            </button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-6">
              {Object.entries(testResults).map(
                ([lang, results]: [string, any]) => (
                  <div
                    key={lang}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-4"
                  >
                    <h3 className="mb-4 text-lg font-semibold capitalize text-white">
                      {lang}
                    </h3>

                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-blue-400">
                          Statistics
                        </h4>
                        <div className="space-y-1 text-slate-300">
                          <p>Total Lines: {results.stats.totalLines}</p>
                          <p>Code Lines: {results.stats.codeLines}</p>
                          <p>Comment Lines: {results.stats.commentLines}</p>
                          <p>
                            Has Instructional:{" "}
                            {results.hasInstructional ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 font-medium text-green-400">
                          Extracted Comments
                        </h4>
                        <div className="space-y-1 text-slate-300">
                          {results.extractedComments
                            .slice(0, 3)
                            .map((comment: string, index: number) => (
                              <p key={index} className="truncate">
                                • {comment}
                              </p>
                            ))}
                          {results.extractedComments.length > 3 && (
                            <p className="text-slate-500">
                              ... and {results.extractedComments.length - 3}{" "}
                              more
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "toggle",
      label: "Comment Toggle",
      icon: <MessageSquare className="h-4 w-4" />,
      content: (
        <div className="space-y-6 p-6">
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Toggle Variants
            </h3>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-slate-300">Switch Variant (Default):</p>
                <CommentToggle
                  showComments={showComments}
                  onToggle={setShowComments}
                  variant="switch"
                  size="md"
                />
              </div>

              <div>
                <p className="mb-2 text-slate-300">Button Variant:</p>
                <CommentToggle
                  showComments={showComments}
                  onToggle={setShowComments}
                  variant="buttons"
                  size="md"
                />
              </div>

              <div>
                <p className="mb-2 text-slate-300">Small Size:</p>
                <CommentToggle
                  showComments={showComments}
                  onToggle={setShowComments}
                  variant="switch"
                  size="sm"
                />
              </div>

              <div>
                <p className="mb-2 text-slate-300">Large Size:</p>
                <CommentToggle
                  showComments={showComments}
                  onToggle={setShowComments}
                  variant="switch"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "code",
      label: "Code Display",
      icon: <Code className="h-4 w-4" />,
      content: (
        <div className="space-y-6 p-6">
          <div className="mb-4 flex gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>

          <CodeVariationDisplay
            code={currentCode}
            language={selectedLanguage}
            title={`${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Prime Checker`}
            showToggle={true}
            defaultShowComments={true}
            variant="instructional"
          />
        </div>
      ),
    },
  ]

  // Sub-tabs for code display
  const subTabs = {
    code: [
      {
        id: "instructional",
        label: "Instructional Mode",
        content: (
          <div className="p-4">
            <CodeVariationDisplay
              code={currentCode}
              language={selectedLanguage}
              title="With Instructional Comments"
              variant="instructional"
              defaultShowComments={true}
            />
          </div>
        ),
      },
      {
        id: "full",
        label: "Full Cleaning",
        content: (
          <div className="p-4">
            <CodeVariationDisplay
              code={currentCode}
              language={selectedLanguage}
              title="Full Comment Removal"
              variant="full"
              defaultShowComments={false}
            />
          </div>
        ),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-white">
            Comment System Testing - Phase 1
          </h1>
          <p className="text-slate-300">
            Test all Phase 1 components: comment utilities, toggles, enhanced
            tabs, and code display.
          </p>
        </div>

        <EnhancedTabContainer
          tabs={testTabs}
          subTabs={subTabs}
          variant="default"
          size="md"
          className="rounded-lg border border-slate-700 bg-slate-800"
          contentClassName="min-h-[500px]"
        />

        {/* Quick Test Section */}
        <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Quick Function Tests
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div className="rounded bg-slate-700 p-3">
              <h4 className="mb-2 font-medium text-blue-400">
                Has Comments Check
              </h4>
              <p className="text-slate-300">
                JavaScript:{" "}
                {hasInstructionalComments(sampleCodes.javascript, "javascript")
                  ? "✅ Yes"
                  : "❌ No"}
              </p>
              <p className="text-slate-300">
                Python:{" "}
                {hasInstructionalComments(sampleCodes.python, "python")
                  ? "✅ Yes"
                  : "❌ No"}
              </p>
              <p className="text-slate-300">
                Java:{" "}
                {hasInstructionalComments(sampleCodes.java, "java")
                  ? "✅ Yes"
                  : "❌ No"}
              </p>
            </div>

            <div className="rounded bg-slate-700 p-3">
              <h4 className="mb-2 font-medium text-green-400">Comment Count</h4>
              <p className="text-slate-300">
                JS:{" "}
                {extractComments(sampleCodes.javascript, "javascript").length}{" "}
                comments
              </p>
              <p className="text-slate-300">
                Python: {extractComments(sampleCodes.python, "python").length}{" "}
                comments
              </p>
              <p className="text-slate-300">
                Java: {extractComments(sampleCodes.java, "java").length}{" "}
                comments
              </p>
            </div>

            <div className="rounded bg-slate-700 p-3">
              <h4 className="mb-2 font-medium text-yellow-400">
                Line Reduction
              </h4>
              <p className="text-slate-300">
                JS: {sampleCodes.javascript.split("\n").length} →{" "}
                {
                  removeComments(sampleCodes.javascript, "javascript")
                    .split("\n")
                    .filter((l) => l.trim()).length
                }{" "}
                lines
              </p>
              <p className="text-slate-300">
                Python: {sampleCodes.python.split("\n").length} →{" "}
                {
                  removeComments(sampleCodes.python, "python")
                    .split("\n")
                    .filter((l) => l.trim()).length
                }{" "}
                lines
              </p>
              <p className="text-slate-300">
                Java: {sampleCodes.java.split("\n").length} →{" "}
                {
                  removeComments(sampleCodes.java, "java")
                    .split("\n")
                    .filter((l) => l.trim()).length
                }{" "}
                lines
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
