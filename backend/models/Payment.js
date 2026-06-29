import mongoose from "mongoose";

// ─── Payment ──────────────────────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema(
  {
    userId:       { type: String, required: true, index: true }, // Firebase UID
    razorpayOrderId:   { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    amount:       { type: Number, required: true },   // in paise
    currency:     { type: String, default: "INR" },
    plan:         { type: String, required: true },
    status:       { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created" },
    verifiedAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

// ─── Subscription ─────────────────────────────────────────────────────────────
const subscriptionSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true, unique: true, index: true },
    plan:      { type: String, enum: ["free", "pro_monthly", "pro_yearly"], default: "free" },
    status:    { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    autoRenew: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subscriptionSchema.methods.isActive = function () {
  return this.status === "active" && this.expiresAt > new Date();
};

export const Payment      = mongoose.model("Payment", paymentSchema);
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
