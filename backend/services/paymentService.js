import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const PLANS = {
  pro_monthly: { amount: 29900, currency: "INR", period: "monthly", name: "Pro Monthly" },
  pro_yearly:  { amount: 249900, currency: "INR", period: "yearly", name: "Pro Yearly"  },
};

/** Create a Razorpay order */
export async function createOrder(planId) {
  const plan  = PLANS[planId];
  if (!plan) throw new Error("Invalid plan");

  const order = await razorpay.orders.create({
    amount:   plan.amount,
    currency: plan.currency,
    notes:    { plan: planId },
  });
  return { order, plan };
}

/** Verify Razorpay payment signature */
export function verifySignature({ orderId, paymentId, signature }) {
  const body   = `${orderId}|${paymentId}`;
  const digest = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return digest === signature;
}
