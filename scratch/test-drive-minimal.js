const dotenv = require('dotenv');
const path = require('path');
const { google } = require('googleapis');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

async function testUpload() {
  console.log("--- GOOGLE DRIVE DIAGNOSTIC ---");
  console.log("Email:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  
  try {
    console.log("Attempting to get folder details...");
    const response = await drive.files.get({
      fileId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      fields: 'id, name, permissions',
      supportsAllDrives: true,
    });
    console.log("✅ Success! Folder Name:", response.data.name);
  } catch (error) {
    console.error("\n❌ FAILED:");
    console.error("Status Code:", error.code);
    console.error("Error Message:", error.message);
    
    if (error.code === 403 || error.message.includes("unregistered callers")) {
      console.log("\nPossible Causes:");
      console.log("1. Google Drive API is NOT ENABLED in Google Cloud Console.");
      console.log("2. The Service Account does not have access to the folder (Share the folder with the email above).");
      console.log("3. The credentials in .env are still not being parsed correctly.");
    }
  }
}

testUpload();
