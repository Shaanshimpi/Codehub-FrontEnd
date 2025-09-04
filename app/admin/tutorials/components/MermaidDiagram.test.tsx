/**
 * MermaidDiagram Integration Test
 * Tests the integration between converter and component with real API data structure
 */
import React from "react"
import type { MermaidDiagramData } from "../utils/mermaidConverter"
import MermaidDiagram from "./MermaidDiagram"

// Test data based on real API structure from guide validation
const sampleSequenceDiagram: MermaidDiagramData = {
  type: "sequence",
  title: "Method Call with Parameters and Return",
  nodes: [
    {
      id: "main",
      label: "main Method",
      type: "participant",
      description: "The entry point of the program.",
    },
    {
      id: "add_method",
      label: "add(int a, int b)",
      type: "participant",
      description: "The method that performs addition.",
    },
  ],
  connections: [
    {
      from: "main",
      to: "add_method",
      label: "Call add(10, 5)",
      type: "sync",
      description: "main calls add, passing 10 and 5 as arguments.",
    },
    {
      from: "add_method",
      to: "add_method",
      label: "Assign result = a + b",
      type: "activation",
      description: "Inside add, the sum is calculated.",
    },
    {
      from: "add_method",
      to: "main",
      label: "Return result (15)",
      type: "return",
      description: "add returns the calculated sum back to main.",
    },
  ],
}

const sampleFlowchartDiagram: MermaidDiagramData = {
  type: "flowchart",
  title: "While Loop: Counting to 5",
  direction: "TD",
  nodes: [
    {
      id: "start",
      label: "Start Program",
      type: "start",
      shape: "stadium",
      description: "Program execution begins.",
    },
    {
      id: "init",
      label: "Initialize count = 1",
      type: "process",
      shape: "rectangle",
      description: "Set up the loop counter.",
    },
    {
      id: "condition",
      label: "count <= 5?",
      type: "decision",
      shape: "diamond",
      description: "Check if loop should continue.",
    },
    {
      id: "print",
      label: "Print count",
      type: "process",
      shape: "rectangle",
      description: "Display current count value.",
    },
    {
      id: "update",
      label: "Increment count",
      type: "process",
      shape: "rectangle",
      description: "Increase count by 1.",
    },
    {
      id: "end_loop",
      label: "Loop Finished",
      type: "end",
      shape: "stadium",
      description: "Program execution ends.",
    },
  ],
  connections: [
    {
      from: "start",
      to: "init",
      label: "Begin",
      type: "arrow",
      description: "Program execution starts.",
    },
    {
      from: "init",
      to: "condition",
      label: "Proceed",
      type: "arrow",
      description: "After initialization, check the loop condition.",
    },
    {
      from: "condition",
      to: "print",
      label: "True",
      type: "arrow",
      condition: "true",
      description: "If count is 5 or less, enter the loop body.",
    },
    {
      from: "print",
      to: "update",
      label: "Execute",
      type: "arrow",
      description: "Print the current value of count.",
    },
    {
      from: "update",
      to: "condition",
      label: "Repeat",
      type: "arrow",
      description: "Update count and re-evaluate the condition.",
    },
    {
      from: "condition",
      to: "end_loop",
      label: "False",
      type: "arrow",
      condition: "false",
      description: "If count is greater than 5, exit the loop.",
    },
  ],
}

// Manual Mermaid code test
const sampleMermaidCode = `sequenceDiagram
    participant Client
    participant Server
    Client->>Server: Request
    Server-->>Client: Response`

// Test Component for integration validation
const MermaidDiagramTest: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="border-b pb-4">
        <h1 className="mb-4 text-2xl font-bold">
          MermaidDiagram Integration Test
        </h1>
        <p className="text-gray-600">
          Testing converter integration with official Mermaid package
        </p>
      </div>

      {/* Test 1: Sequence Diagram from JSON */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">
          Test 1: Sequence Diagram (JSON Data)
        </h2>
        <MermaidDiagram
          diagramData={sampleSequenceDiagram}
          showDebugInfo={true}
          showMermaidEditor={true}
          editable={false}
          className="rounded-lg border"
        />
      </div>

      {/* Test 2: Flowchart from JSON */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">
          Test 2: Flowchart (JSON Data)
        </h2>
        <MermaidDiagram
          diagramData={sampleFlowchartDiagram}
          showDebugInfo={true}
          showMermaidEditor={true}
          editable={false}
          className="rounded-lg border"
        />
      </div>

      {/* Test 3: Manual Mermaid Code */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">
          Test 3: Manual Mermaid Code
        </h2>
        <MermaidDiagram
          diagramData={sampleMermaidCode}
          showDebugInfo={true}
          showMermaidEditor={true}
          editable={true}
          className="rounded-lg border"
          onMermaidChange={(code) => console.log("Code changed:", code)}
          onError={(error) => console.error("Diagram error:", error)}
        />
      </div>

      {/* Test 4: Error Handling */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Test 4: Error Handling</h2>
        <MermaidDiagram
          diagramData="invalid mermaid syntax here"
          showDebugInfo={true}
          showMermaidEditor={true}
          className="rounded-lg border"
          onError={(error) => console.error("Expected error:", error)}
        />
      </div>

      {/* Test 5: Array of Diagrams with Tabs */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">
          Test 5: Array of Diagrams (Multiple Tabs)
        </h2>
        <MermaidDiagram
          diagramData={[
            { ...sampleSequenceDiagram, title: "Valid Input Flow" },
            { ...sampleFlowchartDiagram, title: "Error Handling Flow" },
            {
              ...sampleSequenceDiagram,
              title: "Edge Case Flow",
              nodes: sampleSequenceDiagram.nodes.map((node) => ({
                ...node,
                label: node.label.includes("add")
                  ? "validate(value)"
                  : node.label,
              })),
            },
          ]}
          showDebugInfo={true}
          showMermaidEditor={true}
          editable={false}
          className="rounded-lg border"
          onError={(error) => console.error("Array diagram error:", error)}
        />
      </div>

      {/* Test 6: Dark Theme */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Test 6: Dark Theme</h2>
        <div className="rounded-lg bg-gray-900 p-4">
          <MermaidDiagram
            diagramData={sampleSequenceDiagram}
            theme="dark"
            showDebugInfo={false}
            showMermaidEditor={false}
            className="rounded-lg border border-gray-600"
          />
        </div>
      </div>
    </div>
  )
}

export default MermaidDiagramTest
