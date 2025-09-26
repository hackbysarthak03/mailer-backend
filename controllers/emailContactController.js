import sendEmail from "../utils/sendContactEmail.js";

export const sendContactForm = async (req, res) => {
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

    await sendEmail({ firstname, lastname, email, phone, message });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};