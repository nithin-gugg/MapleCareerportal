import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: pdf-parse has been removed from Next.js completely.
// PDF parsing now happens in the Python FastAPI backend (pdfminer).
// See ml-service/app/services/pdf_service.py
// See WHY_THIS_ARCHITECTURE.py for the full explanation.

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Sends a raw PDF buffer to the FastAPI ML backend for scoring.
 * This is the recommended approach — keeps Next.js free of pdf-parse.
 *
 * @param pdfBuffer - Raw PDF bytes from Google Drive
 * @param jobDescription - Full text of the job description
 * @returns score (0-100), matchingSkills array
 */
export async function scoreResumeViaMlService(
  pdfBuffer: Buffer,
  jobDescription: string
): Promise<{ score: number; matchingSkills: string[] }> {
  // Create a FormData blob to send the PDF as a file upload
  const formData = new FormData();
  formData.append(
    "resume_file",
    new Blob([pdfBuffer as unknown as BlobPart], { type: "application/pdf" }),
    "resume.pdf"
  );
  formData.append("jd_text", jobDescription);

  const response = await fetch(`${ML_SERVICE_URL}/api/v1/score`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.detail || `ML service returned HTTP ${response.status}`
    );
  }

  const data = await response.json();

  return {
    score: data.score ?? 0,
    matchingSkills: data.metadata?.matched_keywords ?? [],
  };
}

/**
 * Sends a public URL (e.g. Google Drive) to the FastAPI ML backend for scoring.
 * This is FASTER because FastAPI caches the downloaded file.
 *
 * @param resumeUrl - Public PDF URL
 * @param jobDescription - Full text of the job description
 * @returns score (0-100), matchingSkills array
 */
export async function scoreResumeViaUrlMlService(
  resumeUrl: string,
  jobDescription: string
): Promise<{ score: number; matchingSkills: string[] }> {
  const formData = new FormData();
  formData.append("resume_url", resumeUrl);
  formData.append("jd_text", jobDescription);

  const response = await fetch(`${ML_SERVICE_URL}/api/v1/score`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.detail || `ML service returned HTTP ${response.status}`
    );
  }

  const data = await response.json();

  return {
    score: data.score ?? 0,
    matchingSkills: data.metadata?.matched_keywords ?? [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini-based fallback (used only if ML service is unavailable).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Uses Google Gemini as a fallback when FastAPI is not running.
 * Gemini receives raw resume text directly.
 */
export async function getResumeMatchFromGemini(
  resumeText: string,
  jobDescription: string
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
    You are an expert recruitment AI. Compare the candidate's resume text against the job description. 
    Analyze technical skills, experience, and qualifications.

    JOB DESCRIPTION:
    ${jobDescription}

    RESUME TEXT:
    ${resumeText}

    Respond ONLY with a JSON object in this exact format:
    {
      "score": <number between 0 and 100>,
      "matchingSkills": <array of strings>,
      "analysis": <string>
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleanText = text
    .replace(/```(?:json)?/g, "")
    .replace(/```/g, "")
    .trim();
  const data = JSON.parse(cleanText);

  return {
    score: data.score ?? 0,
    matchingSkills: data.matchingSkills ?? [],
    analysis: data.analysis ?? "No analysis provided.",
  };
}
