// Test script to debug generate-tutorial API
const fetch = require("node-fetch");

async function testGenerateTutorial() {
  try {
    console.log("🚀 Testing generate-tutorial API...");

    const response = await fetch(
      "http://localhost:3000/api/generate-tutorial",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: "Variables in Python",
          language: "python",
          difficulty: 1,
          numLessons: 3,
          selectedModel: "openai/gpt-4o-mini",
        }),
      },
    );

    const data = await response.json();

    console.log("✅ Response received");
    console.log("📊 Response keys:", Object.keys(data));

    if (data.reference) {
      console.log("✅ Reference field exists");
      console.log("📖 Reference keys:", Object.keys(data.reference));
    } else {
      console.log("❌ Reference field missing");
    }

    // Save full response for inspection
    require("fs").writeFileSync(
      "api-response.json",
      JSON.stringify(data, null, 2),
    );
    console.log("💾 Full response saved to api-response.json");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testGenerateTutorial();
