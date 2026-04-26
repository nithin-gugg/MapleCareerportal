"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uploadResume } from "@/lib/googleDrive";
import { scoreResumeViaMlService, getResumeMatchFromGemini } from "@/lib/aiMatching";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import { getSession } from "@/lib/auth";

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  jobId: z.string().min(1, "Job ID is required"),
});

export async function submitApplicationAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const jobId = formData.get("jobId") as string;
  const resumeFile = formData.get("resume") as File;

  if (!resumeFile || resumeFile.size === 0) {
    return { success: false, error: "Resume file is required" };
  }

  // Validate fields
  const validationResult = applicationSchema.safeParse({ name, email, phone, jobId });
  
  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0].message;
    return { success: false, error: errorMessage };
  }

  const validated = validationResult.data;

  try {
    // 1. Fetch Job for Analysis & Email
    const job = await db.job.findUnique({
      where: { id: validated.jobId },
      select: { description: true, title: true }
    });

    if (!job) {
      return { success: false, error: "Job position not found" };
    }

    // 2. Upload to Google Drive (No AI scoring here)
    const timestamp = new Date().getTime();
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${sanitizedName}_Resume_${timestamp}`;
    
    const resumeLink = await uploadResume(resumeFile, fileName);

    // 3. Create database record immediately
    const application = await db.application.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        resumeLink: resumeLink,
        score: null, // Scored manually later
        matchingSkills: [],
        jobId: validated.jobId,
        status: "PENDING",
        stage: "APPLIED",
      },
    });

    // 5. Send Notification
    await sendEmail({
      to: validated.email,
      ...emailTemplates.applicationReceived(validated.name, job.title)
    });

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    console.error("Submission error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to submit application" 
    };
  }
}

import { createInterviewEvent } from "@/lib/googleCalendar";

// ... (existing applicationSchema and submitApplicationAction)

export async function scheduleInterviewAction(
  applicationId: string,
  data: {
    round: number;
    startTime: string;
    interviewerEmails: string[];
  }
) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Unauthorized");
    }

    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) throw new Error("Application not found");

    // 1. Create Google Calendar Event
    const meetLink = await createInterviewEvent({
      userId: session.id as string,
      candidateEmail: application.email,
      candidateName: application.name,
      jobTitle: application.job.title,
      round: data.round,
      startTime: new Date(data.startTime),
      interviewerEmails: data.interviewerEmails,
    });

    // 2. Create Interview record and Update Stage
    const stage = data.round === 1 ? "INTERVIEW1" : "INTERVIEW2";
    
    await db.$transaction([
      db.interview.create({
        data: {
          applicationId,
          round: data.round,
          date: new Date(data.startTime),
          meetLink,
          attendees: data.interviewerEmails,
          status: "SCHEDULED",
        },
      }),
      db.application.update({
        where: { id: applicationId },
        data: { stage: stage as any },
      }),
    ]);

    revalidatePath("/admin");
    revalidatePath(`/admin/applications/${applicationId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Scheduling error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to schedule interview" 
    };
  }
}

export async function sendInterviewInviteAction(interviewId: string) {
  try {
    const interview = await db.interview.findUnique({
      where: { id: interviewId },
      include: { application: { include: { job: true } } },
    });

    if (!interview || !interview.meetLink) {
      throw new Error("Interview or Meet link not found");
    }

    const { application } = interview;

    // Send the email
    await sendEmail({
      to: application.email,
      ...emailTemplates.interviewInvite(
        application.name,
        application.job.title,
        interview.round
      ),
      // We'll update the template to technically support the link, 
      // but for now I'll just append it to the HTML
      html: emailTemplates.interviewInvite(
        application.name,
        application.job.title,
        interview.round
      ).html + `
        <div style="margin-top: 20px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
          <p style="margin: 0 0 15px 0; font-weight: bold; color: #475569;">Your Interview Link:</p>
          <a href="${interview.meetLink}" style="display: inline-block; padding: 12px 24px; background: #00DC82; color: #000; text-decoration: none; font-weight: 900; text-transform: uppercase; border-radius: 4px;">Join Google Meet</a>
          <p style="margin-top: 15px; font-size: 12px; color: #64748b;">Link: ${interview.meetLink}</p>
        </div>
      `
    });

    // Update inviteSent flag
    await db.interview.update({
      where: { id: interviewId },
      data: { inviteSent: true },
    });

    revalidatePath(`/admin/applications/${application.id}`);
    return { success: true };
  } catch (error) {
    console.error("Invite sending error:", error);
    return { success: false, error: "Failed to send invitation email" };
  }
}

export async function updateApplicationStatusAction(
  id: string,
  data: {
    status?: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "OFFERED";
    stage?: "APPLIED" | "ASSESSMENT" | "INTERVIEW1" | "INTERVIEW2" | "OFFER";
  }
) {
  try {
    const updated = await db.application.update({
      where: { id },
      data,
      include: { job: true },
    });

    // Email Notifications Logic
    if (data.status === "REJECTED") {
      await sendEmail({
        to: updated.email,
        ...emailTemplates.rejection(updated.name, updated.job.title)
      });
    } else if (data.status === "OFFERED") {
      await sendEmail({
        to: updated.email,
        ...emailTemplates.offer(updated.name, updated.job.title)
      });
    } else if (data.stage === "ASSESSMENT") {
      await sendEmail({
        to: updated.email,
        ...emailTemplates.assessmentInvite(updated.name, updated.job.title)
      });
    }
    // We removed INTERVIEW1/2 automated emails from here as they are now manual

    revalidatePath("/admin");
    revalidatePath(`/admin/applications/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update application" };
  }
}

export async function runAiAnalysisAction(applicationId: string) {
  try {
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application || !application.resumeLink) {
      throw new Error("Application or Resume Link not found.");
    }

    // Extract Google Drive File ID from webViewLink
    // Example: https://drive.google.com/file/d/1X2Y3Z.../view
    const match = application.resumeLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match || !match[1]) {
      throw new Error("Invalid Google Drive URL format. Cannot extract File ID.");
    }
    const fileId = match[1];

    // Download the raw PDF Buffer from Google Drive
    const { downloadResume } = await import("@/lib/googleDrive");
    const resumeBuffer = await downloadResume(fileId);

    const jobDescription = `${application.job.title}: ${application.job.description}`;
    let score = 0;
    let matchingSkills: string[] = [];

    // ── Strategy 1: FastAPI ML Service (preferred) ────────────────────────────
    // Try the dedicated Python ML service for accurate sentence-transformer scoring.
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    let usedFastApi = false;

    try {
      const { scoreResumeViaUrlMlService } = await import("@/lib/aiMatching");
      const mlResult = await scoreResumeViaUrlMlService(application.resumeLink, jobDescription);
      score = mlResult.score;
      matchingSkills = mlResult.matchingSkills;
      usedFastApi = true;
      console.log(`[AI Analysis] FastAPI score: ${score}`);
    } catch (mlError: any) {
      console.warn(`[AI Analysis] FastAPI unavailable (${mlError.message}). Falling back to Gemini.`);
    }

    // ── Strategy 2: Gemini Fallback (when FastAPI is not running) ─────────────
    if (!usedFastApi) {
      // For Gemini, we need to extract text first. 
      // Since pdf-parse doesn't work in Next.js, we use a simple API route approach.
      // We'll call our own /api/extract-resume-text to handle it server-side.
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const extractRes = await fetch(`${baseUrl}/api/extract-resume-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: application.resumeLink }),
      });

      if (extractRes.ok) {
        const { text } = await extractRes.json();
        const geminiResult = await getResumeMatchFromGemini(text, jobDescription);
        score = geminiResult.score;
        matchingSkills = geminiResult.matchingSkills;
        console.log(`[AI Analysis] Gemini fallback score: ${score}`);
      } else {
        throw new Error("Both ML service and Gemini fallback failed. Please start the FastAPI service.");
      }
    }

    // Save results to database
    await db.application.update({
      where: { id: applicationId },
      data: {
        score,
        matchingSkills,
      },
    });

    revalidatePath(`/admin/applications/${applicationId}`);
    return { success: true, score };
  } catch (error: any) {
    console.error("Manual AI Analysis Error:", error);
    return { success: false, error: error.message || "Failed to analyze resume." };
  }
}
