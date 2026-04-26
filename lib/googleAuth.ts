import { google } from "googleapis";
import { db } from "./db";

const SYSTEM_TOKENS_KEY = "google_system_tokens";

// Check for required environment variables
const REQUIRED_ENV_VARS = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"];
REQUIRED_ENV_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`MISSING_CONFIG: Environment variable ${varName} is not set.`);
  }
});

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

/**
 * Loads system-level tokens from the database.
 */
export async function loadSavedTokens() {
  try {
    const setting = await db.systemSetting.findUnique({
      where: { key: SYSTEM_TOKENS_KEY },
    });
    if (setting) {
      const tokens = JSON.parse(setting.value);
      oauth2Client.setCredentials(tokens);
    }
  } catch (_error) {
    // Sanitize log: don't print the error object which might contain secrets
    console.error("Failed to load saved Google tokens from database.");
  }
}

/**
 * Saves system-level tokens to the database.
 */
export async function saveTokens(tokens: any) {
  try {
    await db.systemSetting.upsert({
      where: { key: SYSTEM_TOKENS_KEY },
      update: { value: JSON.stringify(tokens) },
      create: { key: SYSTEM_TOKENS_KEY, value: JSON.stringify(tokens) },
    });
  } catch (_error) {
    console.error("Failed to save Google tokens to database.");
  }
}

// Initialize tokens
loadSavedTokens();

oauth2Client.on("tokens", (tokens) => {
  saveTokens(tokens);
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
    } catch (_error) {
      console.error("Failed to update user tokens on refresh in database.");
    }
  });

  return client;
}
