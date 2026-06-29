// ═══════════════════════════════════════════════════════════════════════════════
// ── PRO VERSION — ENTIRE FILE COMMENTED OUT ───────────────────────────────────
// Payments are disabled for the free version of QuickFileTools.
// To re-enable: uncomment everything below and register the route in server.js
// ═══════════════════════════════════════════════════════════════════════════════

/*
import express from "express";
import crypto from "crypto";
import { authenticate } from "../middleware/auth.js";
import { createOrder, verifySignature, PLANS } from "../services/paymentService.js";
import { Payment, Subscription } from "../models/Payment.js";
import { User } from "../models/User.js";
import { sendPaymentSuccessEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/create-order", authenticate, async (req, res, next) => {
  try {
    const { planId } = req.body;
    const { order, plan } = await createOrder(planId);
    await Payment.create({ userId: req.user.uid, razorpayOrderId: order.id, amount: order.amount, plan: planId, status: "created" });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, plan });
  } catch (err) { next(err); }
});

router.post("/verify", authenticate, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const valid = verifySignature({ orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature });
    if (!valid) return res.status(400).json({ message: "Payment verification failed" });
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, status: "paid", verifiedAt: new Date() },
      { new: true }
    );
    const plan = PLANS[payment.plan];
    const expiresAt = new Date();
    if (plan.period === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
    else expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    await Subscription.findOneAndUpdate(
      { userId: req.user.uid },
      { plan: payment.plan, status: "active", startedAt: new Date(), expiresAt, paymentId: payment._id },
      { upsert: true, new: true }
    );
    await User.findOneAndUpdate(
      { uid: req.user.uid },
      { role: "premium", plan: payment.plan, planExpiresAt: expiresAt, usageLimit: 99999 }
    );
    await sendPaymentSuccessEmail(req.user.email, plan.name, expiresAt);
    res.json({ success: true, expiresAt });
  } catch (err) { next(err); }
});

router.get("/history", authenticate, async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.uid }).sort({ createdAt: -1 }).limit(20);
    res.json(payments);
  } catch (err) { next(err); }
});

router.post("/cancel", authenticate, async (req, res, next) => {
  try {
    await Subscription.findOneAndUpdate({ userId: req.user.uid }, { autoRenew: false, status: "cancelled" });
    res.json({ message: "Subscription cancelled. Access continues until expiry." });
  } catch (err) { next(err); }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const digest = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET).update(req.body).digest("hex");
  if (digest !== signature) return res.status(400).send("Invalid signature");
  const event = JSON.parse(req.body);
  if (event.event === "payment.failed") {
    await Payment.findOneAndUpdate({ razorpayOrderId: event.payload.payment.entity.order_id }, { status: "failed" });
  }
  res.json({ received: true });
});

export default router;
*/

// Temporary stub so server.js import doesn't break
import express from "express";
const router = express.Router();
router.all("*", (req, res) => res.status(404).json({ message: "Payments are not available in the free version." }));
export default router;