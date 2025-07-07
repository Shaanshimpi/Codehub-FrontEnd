import React from "react"

const IntroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-20 text-white dark:from-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 bg-gradient-to-r from-sky-100 to-white bg-clip-text text-5xl font-bold text-transparent dark:from-sky-200 dark:to-slate-100 md:text-6xl">
          Learn Programming
        </h1>
        <p className="mb-8 text-xl leading-relaxed text-sky-100 dark:text-slate-300 md:text-2xl">
          Embark on your coding journey and discover the world of programming
          languages
        </p>
        <div className="mx-auto max-w-3xl space-y-6 text-left">
          <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-4 text-2xl font-semibold text-sky-100 dark:text-slate-200">
              What is Programming?
            </h2>
            <p className="text-lg leading-relaxed text-sky-50 dark:text-slate-300">
              {`Programming is the art and science of creating instructions for computers to solve problems, 
              automate tasks, and build amazing applications. It's like learning a new language that allows 
              you to communicate with machines and bring your ideas to life.`}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-3 text-xl font-semibold text-sky-100 dark:text-slate-200">
                Why Learn Programming?
              </h3>
              <ul className="space-y-2 text-sky-50 dark:text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2 text-sky-200 dark:text-slate-400">
                    •
                  </span>
                  Solve real-world problems creatively
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-sky-200 dark:text-slate-400">
                    •
                  </span>
                  Build websites, apps, and software
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-sky-200 dark:text-slate-400">
                    •
                  </span>
                  High demand in job market
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-sky-200 dark:text-slate-400">
                    •
                  </span>
                  Develop logical thinking skills
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-3 text-xl font-semibold text-sky-100 dark:text-slate-200">
                Getting Started
              </h3>
              <p className="leading-relaxed text-sky-50 dark:text-slate-300">
                Choose a programming language that aligns with your goals. Each
                language has its strengths and is suited for different types of
                projects. Explore the languages below to find your perfect
                match!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntroSection
