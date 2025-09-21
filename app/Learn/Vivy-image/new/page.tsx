"use client"

import React, { useState } from "react"
import {
  ArrowLeft,
  Download,
  ImageIcon,
  Lightbulb,
  Loader2,
  Palette,
  X,
} from "lucide-react"
import Link from "next/link"

export default function NewImageGeneration() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate image")
      }

      const data = await response.json()
      if (data.images && data.images.length > 0) {
        setGeneratedImage(data.images[0].url)
      } else {
        throw new Error("No image generated")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 py-20 text-white dark:from-slate-800 dark:to-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-left">
            <Link
              href="/Learn/Vivy"
              className="inline-flex items-center text-sky-100 transition-colors hover:text-white dark:text-sky-200 dark:hover:text-gray-50"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Vivy Chat
            </Link>
          </div>
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                <ImageIcon className="h-12 w-12 text-sky-200" />
              </div>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-sky-100 to-white bg-clip-text text-5xl font-bold text-transparent dark:from-sky-200 dark:to-slate-100 md:text-6xl">
              Vivy Image Studio
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-sky-100 dark:text-slate-300 md:text-2xl">
              Transform your imagination into stunning visuals with AI-powered
              image generation
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center">
                  <Palette className="mr-2 h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Create Your Image
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="prompt"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Describe your vision
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="A majestic dragon soaring through a cloudy sunset sky, digital art style..."
                      className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      disabled={isGenerating}
                    />
                  </div>

                  <button
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-5 w-5" />
                        Generate Image
                      </>
                    )}
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 rounded-lg border border-red-700 bg-red-900/50 p-4">
                    <p className="flex items-center text-red-300">
                      <X className="mr-2 h-4 w-4" />
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {/* Tips Section */}
              <div className="rounded-lg border border-blue-700/30 bg-blue-900/20 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-blue-300">
                    Pro Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-blue-400" />
                    Be specific with details: lighting, colors, mood, and style
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-blue-400" />
                    Add artistic styles: &quot;digital art&quot;,
                    &quot;photorealistic&quot;, &quot;watercolor&quot;
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-blue-400" />
                    Include composition terms: &quot;close-up&quot;, &quot;wide
                    angle&quot;, &quot;aerial view&quot;
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-blue-400" />
                    Specify atmosphere: &quot;mystical&quot;,
                    &quot;serene&quot;, &quot;dramatic&quot;,
                    &quot;vibrant&quot;
                  </li>
                </ul>
              </div>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              {generatedImage ? (
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center text-lg font-medium text-white">
                      <ImageIcon className="mr-2 h-5 w-5 text-green-400" />
                      Your Creation
                    </h3>
                    <button
                      onClick={() => setGeneratedImage(null)}
                      className="p-2 text-slate-400 transition-colors hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-lg bg-slate-700">
                      <img
                        src={generatedImage}
                        alt="Generated artwork"
                        className="h-auto w-full rounded-lg shadow-2xl"
                      />
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = generatedImage
                          link.download = `vivy-creation-${Date.now()}.png`
                          link.click()
                        }}
                        className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-600 bg-slate-800/30 p-12 text-center">
                  <ImageIcon className="mx-auto mb-4 h-16 w-16 text-slate-500" />
                  <h3 className="mb-2 text-lg font-medium text-slate-400">
                    Your masterpiece will appear here
                  </h3>
                  <p className="text-slate-500">
                    Enter a detailed prompt and click generate to create
                    stunning AI art
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
