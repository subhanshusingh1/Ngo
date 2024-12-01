import asyncHandler from "express-async-handler";
import Form from "../models/Form.js";
import sendMail from "../utils/sendMail.js";

// @Desc Submit Form
// @Route Post /api/v1/form
const submitForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // validate Input
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All Fields are Required" });
  }

  // save form data
  const form = await Form.create({
    name,
    email,
    subject,
    message,
  });

  // response
  if (form) {
    // Send Mail to Owner
    try {
      const ownerEmail = "devanshrajput79@gmail.com";
      const mailResponse = await sendMail({
        recipientEmail: email,
        subject: subject || "New Form Submission",
        name: name,
        intro: `You have Recieved a new message from ${name} ${email}`,
        outro: `Message: ${message}`,
      });

      // send response
      res.status(201).json({
        success: true,
        data: form,
        message: "Form Submitted Successfully and notification email sent",
        mailStatus: mailResponse
      });
    } catch (error) {
      console.log("Error Sending email:" + error.message);
      res.status(201).json({
        success: true,
        data: form,
        message: "Form submitted successfully but failed to send notification",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "Failed to Submit Form",
    });
  }
});

export default submitForm;
