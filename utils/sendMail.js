// Import modules
import nodemailer from "nodemailer";
import mailgen from "mailgen";

// Create transporter function
const createTransport = () => {
  if (
    !process.env.MAIL_HOST ||
    !process.env.MAIL_PORT ||
    !process.env.MAIL_USER ||
    !process.env.MAIL_PASSWORD
  ) {
    throw new Error("Email configuration environment variables are missing");
  }

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

// Generate Email Content
const generateEmailContent = ({ name, intro, outro }) => {
  return {
    body: {
      name: name,
      intro: intro || "Welcome to our platform! We are glad to have you.",
      outro: outro || "Thankyou for choosing us.",
    },
  };
};

// Create HTML Email Body
const generateHtmlEmailContent = (emailContent) => {
  const mailGenerator = new mailgen({
    theme: "default",
    product: {
      name: "NGO",
      link: "https://yourapp.com",
    },
  });
  return mailGenerator.generate(emailContent);
};

// function to send email
const sendMail = async ({ recipientEmail, subject, name, intro, outro }) => {
  try {
    console.log("Sending email to:", recipientEmail); // Debug log
    console.log("Sending email from:", process.env.MAIL_USER);

    if (!recipientEmail) {
      throw new Error("No recipient email provided");
    }

    // Generate HTML email content
    const emailContent = generateEmailContent({ name, intro, outro });
    const emailBody = generateHtmlEmailContent(emailContent);

    const transport = createTransport();

    const message = {
      from: process.env.MAIL_USER,
      to: recipientEmail,
      subject: subject || "Notification From NGO",
      html: emailBody,
    };

    // Send email
    await transport.sendMail(message);

    return { success: true, message: "Email Sent Successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message || "Error sending OTP email");
  }
};

export default sendMail;
