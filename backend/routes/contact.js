import express from "express";
import { body, validationResult } from "express-validator";
import { authLimiter } from "../middleware/rateLimiter.js";
import { sendContactReply } from "../services/emailService.js";

const router = express.Router();

router.post("/",
  authLimiter,
  [body("name").trim().notEmpty(), body("email").isEmail(), body("message").trim().isLength({ min: 10 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { name, email, message } = req.body;

      // Forward to support inbox
      await sendContactReply(email, name, message);

      // Also email the support team
      await sendContactReply(process.env.EMAIL_USER, `[Contact Form] ${name}`, `From: ${email}\n\n${message}`).catch(() => {});

      res.json({ message: "Message received. We'll be in touch within 24 hours." });
    } catch (err) { next(err); }
  }
);

export default router;
