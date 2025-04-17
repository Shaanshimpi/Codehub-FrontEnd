"use client"

import { useState } from "react"
// adjust if needed
import ChatBot from "../Exercise/[slug]/ChatBot"
import ExerciseContent from "../Exercise/[slug]/ExerciseContent"

const AddExercisePage = () => {
  const [questionInput, setQuestionInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [exerciseData, setExerciseData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setExerciseData(null)

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AI_CHATBOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            {
              role: "user",
              content: `Generate a structured programming exercise related to : ${questionInput}. Include fields: Title, Code, Hints, ExplanationEnglish, ExplanationHindi, ExplanationMarathi. if language is not mentioned create in c language. keep the code simple, if not mentioned don't use unnecessary logic like functions, external input`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "exercise_schema",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  Title: {
                    type: "string",
                    description:
                      "detailed question description about exercise to code, the whole question sentences in about at least 20 to 40 words.",
                  },
                  Code: {
                    type: "string",
                    description:
                      "full working code with comments in front of important statements",
                  },
                  language: {
                    type: "string",
                    description:
                      "one word response of what programming language are we coding in choose one from this array:[c, cpp, html, css, javascript, java, sql, python]",
                  },
                  Hints: {
                    type: "string",
                    description:
                      "hints for beginner in the relevant topic, explain every line in detail if it is beginner code, but if not beginner explain important parts. explain in list of 10 to 15 hints with bold and italic where necessary",
                  },
                  Explanation: {
                    type: "string",
                    description:
                      "return a markdown of Explanation. if the question is beginner explain each line in detail. if not beginner explain just logical and important parts in detail. explain in list of 10 to 15 hints with bold and italic where necessary",
                  },
                  ExplanationHindi: {
                    type: "string",
                    description: `return a markdown translation of the English explanation into Hindi, but use English script only. 
          Avoid pure Hindi. Keep technical terms like "if", "loop", "array", "modulus" etc. in English.
          Use Hindi sentence flow in English script, e.g.:
          
          "User se number input liya jaata hai. Then 'if condition' check karta hai ki number 2 aur 3 dono se divisible hai ya nahi. Agar divisible hai to message print hota hai."
          
          Do not over-translate technical content.`,
                  },
                  ExplanationMarathi: {
                    type: "string",
                    description: `return a markdown translation of the English explanation into Marathi, but use English script only. 
          Avoid pure Marathi. Keep technical terms like "if", "loop", "array", "modulus" etc. in English.
          Use Marathi sentence flow in English script, e.g.:
          
          "Program user kadun input gheto. 'if condition' check karte ki number 2 ani 3 ne divisible aahe ka. Donhi condition true astil tar message print hoto."
          
          Do not translate technical words like aaple/pudhe/karuya.`,
                  },
                },
                required: [
                  "Title",
                  "Code",
                  "Hints",
                  `language`,
                  "Explanation",
                  "ExplanationHindi",
                  "ExplanationMarathi",
                ],
                additionalProperties: false,
              },
            },
          },
        }),
      })

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content

      const parsed = JSON.parse(content)
      // console.log(parsed)
      setExerciseData(parsed)
    } catch (err) {
      console.error("Error generating exercise:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0F172A] px-[5vw] py-14 text-white lg:px-[20vw]">
      <h1 className="mb-6 text-3xl font-bold">Ask your own Exercise</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full rounded-md bg-[#1E293B] p-4 text-white placeholder:text-gray-400"
          placeholder="Describe your question..."
          rows={5}
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700 ${loading ? `opacity-50` : `opacity-100`}`}
        >
          {loading ? "Generating..." : "Generate Exercise"}
        </button>
      </form>

      {exerciseData && (
        <div className="mt-10">
          <ExerciseContent
            post={{
              Title: exerciseData.Title,
              Hints: exerciseData.Hints,
              Description: exerciseData.Explanation,
              DescriptionHindi: exerciseData.ExplanationHindi,
              DescriptionMarathi: exerciseData.ExplanationMarathi,
              VideoLink: null, // if you want to support video later
            }}
            codeString={exerciseData.Code}
            language={exerciseData.language}
          />
          <ChatBot
            question={exerciseData?.Title || "No question available"}
            code={exerciseData?.Code}
          />
        </div>
      )}
    </div>
  )
}

export default AddExercisePage
