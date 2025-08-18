import transporter from "../config/mailer";

const sendVerificationEmail = async (
  email: string,
  otp: string,
  password?: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Please verify your email address",
    // text: `Your Otp is : ${otp}`,

    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #333333;">Email Verification</h2>
      <p style="font-size: 16px; color: #555555;">Hello,</p>
      <p style="font-size: 16px; color: #555555;">Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #f2f2f2; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #333; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      ${
        password
          ? `<div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 5px solid #4a90e2; border-radius: 8px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;">Your temporary password is:</p>
          <div style="font-size: 20px; font-weight: bold; letter-spacing: 1px; color: #4a4a4a; background-color: #ffffff; padding: 12px 20px; border: 1px solid #ddd; border-radius: 5px; display: inline-block;">
          ${password}
          </div>
          <p style="font-size: 14px; color: #777; margin-top: 10px;">Please change this password after logging in.</p>
          </div>
`
          : ""
      }
      <p style="font-size: 14px; color: #999999;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      <p style="font-size: 16px; color: #555555;">Best regards,<br/>The Team</p>
    </div>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendReminderEmail = async (
  email: string,
  componenetName: string,
  dueDate: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reminder Notification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #333333;">Reminder Notification</h2>
        <p style="font-size: 16px; color: #555555;">Hello,</p>
        <p style="font-size: 16px; color: #555555;">This is a friendly reminder for the following:</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 5px solid #4a90e2; border-radius: 8px;">
          <p style="font-size: 16px; color: #333;">${componenetName}</p>
          <p style="font-size: 14px; color: #777;">Due Date: ${dueDate}</p>
        </div>
        <p style="font-size: 16px; color: #555555;">Best regards,<br/>The Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
};

const sendApprovalEmail = async (
  email: string,
  componentName: string,
  dueDate: string,
  status: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Approval Notification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #333333;">Approval Notification</h2>
        <p style="font-size: 16px; color: #555555;">Hello,</p>
        <p style="font-size: 16px; color: #555555;">Your request for the following component has been processed:</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 5px solid #4a90e2; border-radius: 8px;">
          <p style="font-size: 16px; color: #333;">Component Name: ${componentName}</p>
          <p style="font-size: 14px; color: #777;">Due Date: ${dueDate}</p>
          <p style="font-size: 14px; color: #777;">Status: ${status}</p>
        </div>
        <p style="font-size: 16px; color: #555555;">Best regards,<br/>The Team</p>
      </div>
    `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

const sendRejectedEmail = async (email: string, componentName: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Request Rejected",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #333333;">Request Rejected</h2>
        <p style="font-size: 16px; color: #555555;">Hello,</p>
        <p style="font-size: 16px; color: #555555;">We regret to inform you that your request for the following component has been rejected:</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 5px solid #e74c3c; border-radius: 8px;">
          <p style="font-size: 16px; color: #333;">Component Name: ${componentName}</p>
          <p style="font-size: 14px; color: #e74c3c;">Reason: Your request did not meet the necessary criteria.</p>
        </div>
        <p style="font-size: 16px; color: #555555;">If you have any questions or need further assistance, please contact us.</p>
        <p style="font-size: 16px; color: #555555;">Best regards,<br/>The Team</p>
      </div>
    `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Rejection email sent:", info.response);
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
};

const sendPasswordEmail = async (email: string, password: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome! Your Account Password",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #333333;">Welcome to CNER Lab!</h2>
      <p style="font-size: 16px; color: #555555;">Hello,</p>
      <p style="font-size: 16px; color: #555555;">Your account has been successfully created. Your login credentials are:</p>
      <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 5px solid #4a90e2; border-radius: 8px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;">Your password is:</p>
        <div style="font-size: 20px; font-weight: bold; letter-spacing: 1px; color: #4a4a4a; background-color: #ffffff; padding: 12px 20px; border: 1px solid #ddd; border-radius: 5px; display: inline-block;">
        ${password}
        </div>
        <p style="font-size: 14px; color: #777; margin-top: 10px;">Please change this password after logging in for security purposes.</p>
      </div>
      <p style="font-size: 16px; color: #555555;">You can now login to your account and start exploring our components.</p>
      <p style="font-size: 16px; color: #555555;">Best regards,<br/>The CNER Lab Team</p>
    </div>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password email sent:", info.response);
  } catch (error) {
    console.error("Error sending password email:", error);
  }
};

export {
  sendVerificationEmail,
  sendPasswordEmail,
  sendReminderEmail,
  sendApprovalEmail,
  sendRejectedEmail,
};
