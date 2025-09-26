import express from "express";
import { sendContactForm } from "../controllers/emailContactController.js";
import { sendNewsletter } from "../controllers/emailNewletter.js";

const router = express.Router();

router.post("/contact-send", sendContactForm);
router.post("/newsletter-send", sendNewsletter);

export default router;
