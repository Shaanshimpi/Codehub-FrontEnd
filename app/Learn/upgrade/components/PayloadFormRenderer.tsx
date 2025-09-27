"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface FormField {
  id: string
  name: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

interface PayloadForm {
  id: string
  title: string
  fields: FormField[]
  submitButtonLabel?: string
  confirmationType?: string
  confirmationMessage?: string
}

interface PayloadFormRendererProps {
  formId: string | number
  onSubmit?: (data: any) => void
}

const PayloadFormRenderer: React.FC<PayloadFormRendererProps> = ({
  formId,
  onSubmit,
}) => {
  const [form, setForm] = useState<PayloadForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Fetch form data from Payload
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true)
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

        const response = await fetch(
          `${baseUrl}/api/payload/forms/${formId}?depth=2`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch form: ${response.status}`)
        }

        const data = await response.json()
        setForm(data)

        // Initialize form data with empty values
        const initialData: Record<string, any> = {}
        data.fields?.forEach((field: FormField) => {
          initialData[field.name] = ""
        })
        setFormData(initialData)
      } catch (err) {
        console.error("Error fetching form:", err)
        setError(err instanceof Error ? err.message : "Failed to load form")
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [formId])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003"

      const submissionPayload = {
        form: formId,
        submissionData: Object.keys(formData).map((fieldName) => ({
          field: fieldName,
          value: formData[fieldName],
        })),
      }

      console.log(
        "Submitting form data:",
        JSON.stringify(submissionPayload, null, 2)
      )

      const response = await fetch(`${baseUrl}/api/payload/form-submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionPayload),
      })

      console.log("Form submission response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Form submission error:", response.status, errorText)
        throw new Error(
          `Failed to submit form: ${response.status} - ${errorText}`
        )
      }

      let result
      try {
        result = await response.json()
        console.log("Form submission successful:", result)
      } catch (jsonError) {
        console.error("Failed to parse response JSON:", jsonError)
        // If JSON parsing fails but response was ok, still consider it successful
        console.log(
          "Response was successful but couldn't parse JSON, proceeding anyway"
        )
      }

      setSubmitSuccess(true)
      if (onSubmit) {
        onSubmit(formData)
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const baseClasses =
      "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"

    switch (field.type) {
      case "text":
      case "email":
        return (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClasses}
          />
        )

      case "textarea":
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseClasses} min-h-[120px] resize-y`}
            rows={4}
          />
        )

      case "select":
        return (
          <select
            name={field.name}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case "checkbox":
        return (
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-yellow-400 focus:ring-2 focus:ring-yellow-400"
            />
            <span className="text-slate-300">{field.label}</span>
          </label>
        )

      default:
        return (
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClasses}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 p-8">
        <div className="text-center text-slate-400">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin" />
          <p>Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-500 bg-slate-700 p-8">
        <div className="text-center text-red-400">
          <div className="mb-4 text-6xl">⚠️</div>
          <h3 className="mb-2 text-xl font-semibold">Error Loading Form</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-slate-700 p-8">
        <div className="text-center text-green-400">
          <div className="mb-4 text-6xl">✅</div>
          <h3 className="mb-2 text-xl font-semibold">Application Submitted!</h3>
          <p className="text-sm">
            {typeof form?.confirmationMessage === "string"
              ? form.confirmationMessage
              : "Thank you for applying for Gold membership. We'll review your application and get back to you soon!"}
          </p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 p-8">
        <div className="text-center text-slate-400">
          <div className="mb-4 text-6xl">📝</div>
          <h3 className="mb-2 text-xl font-semibold">Form Not Found</h3>
          <p className="text-sm">Unable to load the application form</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-slate-700 p-8">
      <div className="mb-6">
        <h3 className="mb-2 text-2xl font-bold text-white">{form.title}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields?.map((field) => (
          <div key={field.id}>
            {field.type !== "checkbox" && (
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {field.label}
                {field.required && <span className="ml-1 text-red-400">*</span>}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 font-semibold text-black transition-all duration-200 hover:from-yellow-500 hover:to-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            form.submitButtonLabel || "Submit Application"
          )}
        </button>
      </form>
    </div>
  )
}

export default PayloadFormRenderer
