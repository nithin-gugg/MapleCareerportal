import { google } from "googleapis";
import { Readable } from "stream";

/**
 * Creates a Google Drive client authenticated via a Service Account.
 *
 * In production, set GOOGLE_SERVICE_ACCOUNT_KEY to the full JSON key string
 * (the entire contents of your service account .json key file, minified).
 *
 * In development, it falls back to the GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY
 * env vars (individual fields from the key file).
 */
function getDriveClient() {
  // Prefer a full JSON key string (production Vercel secret)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: [
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/drive",
        ],
      });
      return google.drive({ version: "v3", auth });
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY JSON:", e);
      throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY environment variable.");
    }
  }

  // Fallback: individual env vars (also works in production if you prefer)
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Vercel stores \n as literal \\n — this replaces them back
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive",
      ],
    });
    return google.drive({ version: "v3", auth });
  }

  throw new Error(
    "Google Drive credentials not configured. " +
      "Set GOOGLE_SERVICE_ACCOUNT_KEY (full JSON) or both GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY."
  );
}

/**
 * Uploads a resume to Google Drive and makes it accessible via a shareable link.
 * @param file The File object from FormData
 * @param fileName The desired name for the file on Google Drive
 * @returns The webViewLink for the uploaded file
 */
export async function uploadResume(file: File, fileName: string): Promise<string> {
  try {
    const drive = getDriveClient();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a readable stream from the buffer
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: file.type || "application/pdf",
        body: stream,
      },
      fields: "id, webViewLink",
      supportsAllDrives: true,
    });

    const fileId = response.data.id;

    if (!fileId) {
      throw new Error("Failed to get file ID from Google Drive after upload.");
    }

    // Set permissions to "anyone with link" as "reader"
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true,
    });

    // Get the updated file details with the webViewLink
    const fileDetails = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink",
      supportsAllDrives: true,
    });

    return fileDetails.data.webViewLink!;
  } catch (error: any) {
    console.error("Google Drive Upload Failed:", error?.message || error);
    throw new Error(`Failed to upload resume to Google Drive: ${error?.message || "unknown error"}`);
  }
}

/**
 * Downloads a file from Google Drive using its fileId.
 * Uses Service Account credentials — no OAuth token required.
 */
export async function downloadResume(fileId: string): Promise<Buffer> {
  try {
    const drive = getDriveClient();

    const response = await drive.files.get(
      { fileId: fileId, alt: "media", supportsAllDrives: true },
      { responseType: "arraybuffer" }
    );

    // Convert the ArrayBuffer directly to a Node Buffer
    const buffer = Buffer.from(response.data as ArrayBuffer);

    if (buffer.length === 0) {
      throw new Error("Downloaded file buffer is empty.");
    }

    return buffer;
  } catch (error: any) {
    console.error("Google Drive Download Failed:", error?.message || error);
    throw new Error(`Failed to download raw resume from Google Drive for AI scanning: ${error?.message || "unknown error"}`);
  }
}
