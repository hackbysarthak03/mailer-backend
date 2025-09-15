import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ quiet: true });
const app = express();

app.use(express.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.send("Mail server is running 🚀");
});

// POST route for contact form
app.post("/send", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, message } = req.body;

    // Validation
    if (!firstname || !lastname || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.TO_EMAIL, // sales@svayambhuorganics.com
    pass: process.env.HOSTINGER_PASS, // mailbox password from Hostinger
  },
  tls: {
    rejectUnauthorized: false, // helps bypass SSL issues temporarily
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Server is ready to take messages:", success);
  }
});

    // Mail options
const mailOptions = {
  from: `"Svayambhu Organics Website" <${process.env.TO_EMAIL}>`,
  to: process.env.TO_EMAIL,  // receive in Hostinger mailbox
  replyTo: email, // sender’s email
  subject: `Message received on Website - ${firstname}`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><b>Name:</b> ${firstname} ${lastname}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Message:</b> ${message}</p>
  `,
};

    // Send mail
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
