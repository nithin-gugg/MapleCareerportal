/**
 * Professional email templates for the candidate lifecycle.
 */
export const emailTemplates = {
  applicationReceived: (name: string, jobTitle: string) => ({
    subject: `We've received your application for ${jobTitle} - Maple HRMS`,
    html: `
      <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-top: 4px solid #00DC82;">
        <h1 style="font-style: italic; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">Maple HRMS</h1>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position.</p>
        <p>Our recruitment team has received your application and resume. We are currently utilizing our AI-screening process to review your qualifications against the job requirements.</p>
        <p>We will be in touch shortly regarding the next steps in our hiring process.</p>
        <br />
        <p style="color: #666; font-size: 12px;">Best regards,<br />The Talent Acquisition Team</p>
      </div>
    `,
    text: `Hello ${name},\n\nThank you for applying for the ${jobTitle} position at Maple HRMS. We've received your application and will be in touch shortly.\n\nBest regards,\nThe Talent Acquisition Team`,
  }),

  rejection: (name: string, jobTitle: string) => ({
    subject: `Update regarding your application for ${jobTitle}`,
    html: `
      <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-top: 4px solid #ef4444;">
        <h1 style="font-style: italic; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">Maple HRMS</h1>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for the time and effort you put into applying for the <strong>${jobTitle}</strong> role.</p>
        <p>After a careful review of your profile and qualifications, our team has decided to move forward with other candidates who more closely match our current needs.</p>
        <p>We appreciate your interest in Maple HRMS and wish you the best of luck in your career search.</p>
        <br />
        <p style="color: #666; font-size: 12px;">Best regards,<br />The Talent Acquisition Team</p>
      </div>
    `,
    text: `Hello ${name},\n\nThank you for your interest in the ${jobTitle} role. After review, we've decided to move forward with other candidates. We wish you the best in your search.\n\nBest regards,\nThe Talent Acquisition Team`,
  }),

  assessmentInvite: (name: string, jobTitle: string) => ({
    subject: `Invitation: Technical Assessment for ${jobTitle}`,
    html: `
      <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-top: 4px solid #eab308;">
        <h1 style="font-style: italic; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">Maple HRMS</h1>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Congratulations! Your profile has advanced to the next stage for the <strong>${jobTitle}</strong> position.</p>
        <p>We would like to invite you to complete a technical assessment to further evaluate your skills. You will receive a separate link for the assessment portal shortly.</p>
        <p>Please complete the assessment within the next 48 hours.</p>
        <br />
        <p style="color: #666; font-size: 12px;">Best regards,<br />The Talent Acquisition Team</p>
      </div>
    `,
    text: `Hello ${name},\n\nCongratulations! You've advanced to the assessment stage for ${jobTitle}. You will receive an assessment link shortly.\n\nBest regards,\nThe Talent Acquisition Team`,
  }),

  interviewInvite: (name: string, jobTitle: string, round: number) => ({
    subject: `Interview Invitation: ${jobTitle} (Round ${round})`,
    html: `
      <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-top: 4px solid #f97316;">
        <h1 style="font-style: italic; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">Maple HRMS</h1>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We are impressed with your background and would like to invite you for the <strong>Round ${round} Interview</strong> for the <strong>${jobTitle}</strong> position.</p>
        <p>Our recruitment coordinator will be in touch shortly to schedule a time that works for you.</p>
        <br />
        <p style="color: #666; font-size: 12px;">Best regards,<br />The Talent Acquisition Team</p>
      </div>
    `,
    text: `Hello ${name},\n\nWe would like to invite you for Round ${round} Interview for ${jobTitle}. We'll contact you soon to schedule.\n\nBest regards,\nThe Talent Acquisition Team`,
  }),

  offer: (name: string, jobTitle: string) => ({
    subject: `Congratulations! Offer from Maple HRMS for ${jobTitle}`,
    html: `
      <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-top: 4px solid #a855f7;">
        <h1 style="font-style: italic; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">Maple HRMS</h1>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We are thrilled to offer you the position of <strong>${jobTitle}</strong> at Maple HRMS!</p>
        <p>Our team was very impressed with your skills and we believe you would be a fantastic addition to our company.</p>
        <p>You will receive the full offer letter package and benefit details in a follow-up email shortly.</p>
        <br />
        <p style="color: #666; font-size: 12px;">Congratulations,<br />The Maple HRMS Recruitment Team</p>
      </div>
    `,
    text: `Hello ${name},\n\nCongratulations! We are thrilled to offer you the ${jobTitle} position at Maple HRMS. Stay tuned for the full offer package.\n\nBest regards,\nThe Maple HRMS Team`,
  }),
};
