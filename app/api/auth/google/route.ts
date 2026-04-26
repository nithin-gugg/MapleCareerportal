import { NextResponse } from "next/server";
import { oauth2Client, SCOPES } from "@/lib/googleAuth";

export async function GET() {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force to get refresh token
  });

  return NextResponse.redirect(url);
}
