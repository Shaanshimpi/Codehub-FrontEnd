import { runCodeOnServer } from "./codeRunnerUtils"

export const test = async () => {
  const result = await runCodeOnServer("python", 'print("Hello from test")', "")
  console.log(result)
}
