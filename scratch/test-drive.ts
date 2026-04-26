import dotenv from 'dotenv';
import { uploadResume } from './lib/googleDrive';
import { File } from 'buffer';

dotenv.config();

async function testUpload() {
  console.log("Starting test upload...");
  console.log("Email:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  console.log("Folder ID:", process.env.GOOGLE_DRIVE_FOLDER_ID);
  
  // Create a dummy file
  const content = "This is a test resume content.";
  const blob = new Blob([content], { type: 'text/plain' });
  const file = new File([blob], "test_resume.txt", { type: 'text/plain' }) as any;

  try {
    const link = await uploadResume(file, "Test_Resume_Bot");
    console.log("Success! File available at:", link);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testUpload();
