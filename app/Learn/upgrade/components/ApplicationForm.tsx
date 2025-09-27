"use client"

import React, { useState } from "react"
import { Loader2, User } from "lucide-react"

interface ApplicationUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  goldApplicationData?: {
    phone?: string
    linkedin?: string
    experience?: string
    goals?: string
    referralSource?: string
  }
}

interface ApplicationFormProps {
  user: ApplicationUser
  onSubmit: (formData: any) => Promise<void>
  loading?: boolean
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  user,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.goldApplicationData?.phone || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Complete Your Application
        </h2>
        <p className="text-lg text-slate-300">
          Just your name and phone number to get started with Gold membership!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="rounded-lg bg-slate-700 p-6">
          <div className="mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              Contact Information
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`w-full rounded-lg border bg-slate-600 p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.firstName ? "border-red-500" : "border-slate-500"
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`w-full rounded-lg border bg-slate-600 p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.lastName ? "border-red-500" : "border-slate-500"
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full rounded-lg border bg-slate-600 p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  errors.phone ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-400"
              />
              <p className="mt-1 text-xs text-slate-500">
                Email cannot be changed
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 text-center">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full transform rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-lg font-bold text-black transition-all duration-200 hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting Application...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>🚀</span>
                Submit Gold Application
                <span>✨</span>
              </div>
            )}
          </button>

          <p className="mt-4 text-sm text-slate-400">
            * Required fields. Our representative will contact you using this
            information.
          </p>
        </div>
      </form>
    </div>
  )
}

export default ApplicationForm
