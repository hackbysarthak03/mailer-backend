import sendNewsletterEmail from "../utils/sendNewsletterEmail.js";

export const sendNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    await sendNewsletterEmail({ email });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};