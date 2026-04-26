import { google } from "googleapis";
import { Readable } from "stream";
import { oauth2Client } from "./googleAuth";

const drive = google.drive({ version: "v3", auth: oauth2Client });

/**
 * Uploads a resume to Google Drive and makes it publicly accessible via a link.
 * @param file The File object from FormData
 * @param fileName The desired name for the file on Google Drive
 * @returns The public webViewLink for the uploaded file
 */
export async function uploadResume(file: File, fileName: string): Promise<string> {
  try {
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
        mimeType: file.type,
        body: stream,
      },
      fields: "id, webViewLink",
      supportsAllDrives: true,
    });

    const fileId = response.data.id;

    if (!fileId) {
      throw new Error("Failed to get file ID from Google Drive");
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
  } catch (error) {
    console.error("Google Drive Upload Error:", error);
    throw new Error("Failed to upload resume to Google Drive");
  }
}

/**
 * Downloads a file from Google Drive using its fileId
 */
export async function downloadResume(fileId: string): Promise<Buffer> {
  try {
    const response = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "arraybuffer" }
    );

    // Convert the ArrayBuffer directly to a Node Buffer
    const buffer = Buffer.from(response.data as ArrayBuffer);
    
    if (buffer.length === 0) {
      throw new Error("Downloaded file buffer is empty.");
    }
    
    return buffer;
  } catch (error) {
    console.error("Google Drive Download Error:", error);
    throw new Error("Failed to download raw resume from Google Drive for AI scanning.");
  }
}
