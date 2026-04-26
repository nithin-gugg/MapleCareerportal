import { google } from "googleapis";
import { getUserGoogleAuthClient } from "./googleAuth";

/**
 * Creates a Google Calendar event for an interview and generates a Google Meet link.
 */
export async function createInterviewEvent({
  userId,
  candidateEmail,
  candidateName,
  jobTitle,
  round,
  startTime,
  interviewerEmails = [],
}: {
  userId: string;
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  round: number;
  startTime: Date;
  interviewerEmails?: string[];
}) {
  try {
    const authClient = await getUserGoogleAuthClient(userId);
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const event = {
      summary: `Maple HRMS Interview: ${candidateName} | ${jobTitle} (Round ${round})`,
      description: `Technical Interview for the ${jobTitle} position at Maple HRMS.`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour default
        timeZone: "UTC",
      },
      attendees: [
        { email: candidateEmail },
        ...interviewerEmails.map((email) => ({ email: email.trim() })),
      ],
      conferenceData: {
        createRequest: {
          requestId: `interview-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    console.log("Calendar Event created:", response.data.id);
    return response.data.hangoutLink || null;
  } catch (error: any) {
    if (error.message === "GOOGLE_NOT_CONNECTED") {
      throw error;
    }
    console.error("Google Calendar Operation Failed.");
    throw new Error("Failed to create Google Calendar event");
  }
}
