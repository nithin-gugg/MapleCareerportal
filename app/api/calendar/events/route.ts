import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserGoogleAuthClient } from "@/lib/googleAuth";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const now = new Date();
    const defaultTimeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const defaultTimeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

    const timeMin = searchParams.get("timeMin") || defaultTimeMin;
    const timeMax = searchParams.get("timeMax") || defaultTimeMax;

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

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });

    const events = (response.data.items || []).map((event) => {
      const isAllDay = !event.start?.dateTime;
      return {
        id: event.id,
        title: event.summary || "(No Title)",
        start: event.start?.dateTime || event.start?.date || new Date().toISOString(),
        end: event.end?.dateTime || event.end?.date || new Date().toISOString(),
        allDay: isAllDay,
        attendees: (event.attendees || []).map((a) => ({
          email: a.email,
          displayName: a.displayName || a.email,
          responseStatus: a.responseStatus,
          self: a.self,
        })),
        meetLink:
          event.hangoutLink ||
          event.conferenceData?.entryPoints?.find(
            (ep) => ep.entryPointType === "video"
          )?.uri ||
          null,
        description: event.description || null,
        location: event.location || null,
        organizer: event.organizer?.email || null,
        status: event.status,
        colorId: event.colorId || null,
      };
    });

    return NextResponse.json(events, {
      headers: { "Cache-Control": "no-store, must-revalidate" },
    });
  } catch (error: any) {
    console.error("Calendar events fetch error:", error?.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}
