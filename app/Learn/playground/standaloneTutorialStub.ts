import type { Tutorial } from "@/app/Learn/types/TutorialTypes"

/** Minimal tutorial context for PlaygroundAIAssistant on the standalone playground page */
export const STANDALONE_PLAYGROUND_TUTORIAL: Tutorial = {
  id: "standalone-playground",
  title: "Code Playground",
  slug: "playground",
  index: 0,
  programmingLanguage: "",
  description:
    "Practice and experiment with code in your chosen language. There is no fixed lesson—ask the assistant for help with your code or concepts.",
}
