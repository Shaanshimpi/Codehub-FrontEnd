"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useUser } from "../_providers/UserProvider"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormValues = z.infer<typeof formSchema>

export default function AuthForm({
  formType,
}: {
  formType: "login" | "signup"
}) {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { refetchUser } = useUser()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)

    const endpoint =
      formType === "login" ? "/api/payload/login" : "/api/payload/signup"
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      await refetchUser() // Refetch user after successful login/signup
      // No explicit redirect here. The parent page (login/signup) will handle redirection based on user state.
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border-2 border-transparent bg-sky-50 p-8 shadow-lg transition-all duration-300 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/10 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/10">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formType === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {formType === "login"
              ? "Sign in to your account to continue"
              : "Join us and start your coding journey"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-slate-900 dark:text-slate-100">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400 dark:text-slate-500" />
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="border-slate-300 bg-white pl-10 text-slate-900 placeholder-slate-400 transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-slate-900 dark:text-slate-100">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400 dark:text-slate-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="border-slate-300 bg-white pl-10 pr-10 text-slate-900 placeholder-slate-400 transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-slate-400 transition-colors duration-200 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full transform rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                  {formType === "login"
                    ? "Signing In..."
                    : "Creating Account..."}
                </div>
              ) : formType === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="pt-4 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                {formType === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <a
                  href={formType === "login" ? "/signup" : "/login"}
                  className="ml-1 font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {formType === "login" ? "Sign up" : "Sign in"}
                </a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
