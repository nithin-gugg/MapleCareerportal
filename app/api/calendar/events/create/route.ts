import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserGoogleAuthClient } from "@/lib/googleAuth";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, start, end, attendees = [], description = "" } = body;

    if (!title || !start || !end) {
      return NextResponse.json(
        { error: "title, start, and end are required" },
        { status: 400 }
      );
    }

    let authClient;
    try {
      authClient = await getUserGoogleAuthClient(session.id as string);
    } catch (error: any) {
      if (error.message === "GOOGLE_NOT_CONNECTED") {
        return NextResponse.json({ error: "GOOGLE_NOT_CONNECTED" }, { status: 403 });
      }
      throw error;
    }

    const calendar = google.calendar({ version: "v3", auth: authClient });

    const event = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: title,
        description,
        start: { dateTime: new Date(start).toISOString(), timeZone: "UTC" },
        end: { dateTime: new Date(end).toISOString(), timeZone: "UTC" },
        attendees: (attendees as string[])
          .filter((e) => e.trim())
          .map((email) => ({ email: email.trim() })),
        conferenceData: {
          createRequest: {
            requestId: `maple-hrms-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    return NextResponse.json({
      id: event.data.id,
      title: event.data.summary,
      start: event.data.start?.dateTime,
      end: event.data.end?.dateTime,
      meetLink: event.data.hangoutLink || null,
    });
  } catch (error: any) {
    console.error("Calendar event create error:", error?.message);
    return NextResponse.json(
      { error: error.message || "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
