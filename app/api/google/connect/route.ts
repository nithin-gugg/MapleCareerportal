import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { google } from "googleapis";
import { SCOPES } from "@/lib/googleAuth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Force to get refresh token
    scope: SCOPES,
  });

  return NextResponse.redirect(authUrl);
}
