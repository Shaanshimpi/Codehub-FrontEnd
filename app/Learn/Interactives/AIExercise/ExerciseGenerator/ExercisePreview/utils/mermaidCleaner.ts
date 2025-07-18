// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExercisePreview/utils/mermaidCleaner.ts

export const cleanMermaidDiagram = (diagram: string): string => {
  if (!diagram) return ""

  // Remove semicolons at the end of lines (common issue with AI-generated diagrams)
  let cleanedDiagram = diagram.replace(/;(\s*$)/gm, "")

  // Remove any trailing semicolons before line breaks
  cleanedDiagram = cleanedDiagram.replace(/;\s*\n/g, "\n")

  // Ensure proper spacing around arrows
  cleanedDiagram = cleanedDiagram.replace(/\s*-->\s*/g, " --> ")
  cleanedDiagram = cleanedDiagram.replace(/\s*--\s*/g, " -- ")

  // Fix any double spaces
  cleanedDiagram = cleanedDiagram.replace(/\s+/g, " ")

  // Trim each line
  cleanedDiagram = cleanedDiagram
    .split("\n")
    .map((line) => line.trim())
    .join("\n")

  return cleanedDiagram
}

// Validate if diagram has basic required structure
export const validateMermaidDiagram = (diagram: string): boolean => {
  if (!diagram) return false

  // Check if it starts with a valid diagram type
  const validStarters = [
    "graph",
    "flowchart",
    "sequenceDiagram",
    "classDiagram",
    "stateDiagram",
    "gantt",
    "pie",
  ]
  const firstLine = diagram.trim().split("\n")[0].toLowerCase()

  return validStarters.some((starter) => firstLine.startsWith(starter))
}
