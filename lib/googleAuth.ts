import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { db } from "./db";

const TOKEN_PATH = path.join(process.cwd(), ".google-tokens.json");

// System-level OAuth client (Legacy - used for Google Drive)
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email"
];

export function loadSavedTokens() {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
      oauth2Client.setCredentials(tokens);
    }
  } catch (error) {
    console.error("Error loading saved Google tokens:", error);
  }
}

export function saveTokens(tokens: any) {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error("Error saving Google tokens:", error);
  }
}

// Automatically load tokens for the system client
loadSavedTokens();

oauth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    saveTokens(tokens);
  } else {
    try {
      if (fs.existsSync(TOKEN_PATH)) {
        const existingTokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
        saveTokens({ ...existingTokens, ...tokens });
      } else {
        saveTokens(tokens);
      }
    } catch (e) {
       console.error("Error updating tokens on refresh:", e);
    }
  }
});

// User-level OAuth Client logic (For Calendar)
export async function getUserGoogleAuthClient(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || !user.googleAccessToken) {
    throw new Error("GOOGLE_NOT_CONNECTED");
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.tokenExpiry ? user.tokenExpiry.getTime() : null,
  });

  // Listen for automatic token refreshes and update the DB
  client.on("tokens", async (tokens) => {
    try {
      await db.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
          ...(tokens.refresh_token && { googleRefreshToken: tokens.refresh_token }),
          ...(tokens.expiry_date && { tokenExpiry: new Date(tokens.expiry_date) }),
        },
      });
    } catch (error) {
      console.error("Failed to update user tokens on refresh:", error);
    }
  });

  return client;
}
