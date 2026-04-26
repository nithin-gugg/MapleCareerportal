import { NextRequest, NextResponse } from "next/server";
import { oauth2Client, saveTokens } from "@/lib/googleAuth";
import { google } from "googleapis";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(`Error from Google: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse("Authorization code is missing", { status: 400 });
  }

  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tokens } = await oauth2Client.getToken(code);
    
    // Set for legacy system client and save to file
    oauth2Client.setCredentials(tokens);
    saveTokens(tokens);

    // Fetch user email using Google OAuth2 API
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    
    let googleEmail = null;
    try {
      const userInfo = await oauth2.userinfo.get();
      googleEmail = userInfo.data.email || null;
    } catch (e) {
      console.warn("Could not fetch user email:", e);
    }

    // Save tokens and email to the current admin's DB record
    await db.user.update({
      where: { id: session.id as string },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || null,
        googleEmail: googleEmail,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    // Redirect to the admin settings page upon success
    return NextResponse.redirect(new URL("/admin/settings", request.url));
  } catch (err: any) {
    console.error("Error exchanging code for tokens", err);
    return new NextResponse(`Failed to authenticate with Google: ${err.message}`, { status: 500 });
  }
}
