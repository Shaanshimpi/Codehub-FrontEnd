import React from "react"
import type { Metadata } from "next"
import Header from "../layouts/Header"
import { ErrorBoundary } from "./components/ErrorBoundary"
import "./styles/markdown.css"

export const metadata: Metadata = {
  title: "Vivy AI - Your Programming Assistant | CodeHub",
  description:
    "Chat with Vivy, your AI-powered programming assistant. Get instant help with coding questions, debugging, algorithm explanations, and learning guidance for any programming language.",
  keywords:
    "AI programming assistant, coding help chatbot, Vivy AI, programming questions, code help, debugging assistant, learn programming with AI, AI code tutor",
  openGraph: {
    title: "Vivy AI - Your Programming Assistant",
    description:
      "Chat with AI for instant coding help and programming guidance",
    url: "https://codehubindia.in/Learn/Vivy",
    type: "website",
    siteName: "CodeHub",
    images: [
      {
        url: "https://codehubindia.in/assets/logo-sqr.png",
        width: 1200,
        height: 630,
        alt: "Vivy AI Programming Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivy AI - Your Programming Assistant",
    description: "Chat with AI for instant coding help",
    images: ["https://codehubindia.in/assets/logo-sqr.png"],
  },
  alternates: {
    canonical: "https://codehubindia.in/Learn/Vivy",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function VivyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="vivy-layout">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .vivy-layout footer,
            .vivy-layout ~ footer,
            body > footer {
              display: none !important;
            }
            body {
              overflow: hidden !important;
            }
          `,
          }}
        />

        <div className="fixed inset-0 z-50 overflow-hidden bg-white dark:bg-slate-900">
          {/* Custom Header for /Learn routes */}
          <Header className="header" />

          {/* Page Content - No Footer for Vivy */}
          <main className="absolute inset-0 top-16 flex flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
