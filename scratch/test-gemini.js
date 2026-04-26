const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY missing");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  console.log("--- GEMINI AI TEST ---");
  
  const prompt = `
    Compare the resume against the job. Return JSON: { "score": number, "matchingSkills": string[] }
    JOB: Senior React Developer
    RESUME: Experienced frontend engineer with 5 years in React, TypeScript, and Next.js.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("✅ Success! AI Output:");
    console.log(response.text());
  } catch (error) {
    console.error("❌ FAILED:", error.message);
  }
}

testGemini();
