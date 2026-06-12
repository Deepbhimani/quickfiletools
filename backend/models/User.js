import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid:          { type: String, required: true, unique: true, index: true }, // Firebase UID
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:         { type: String, required: true, trim: true },
    photoURL:     { type: String, default: null },
    role:         { type: String, enum: ["user", "premium", "admin"], default: "user", index: true },
    plan:         { type: String, enum: ["free", "pro_monthly", "pro_yearly"], default: "free" },
    planExpiresAt:{ type: Date,   default: null },

    // Usage tracking
    usageCount:   { type: Number, default: 0 },
    usageLimit:   { type: Number, default: 10 },   // 10/day for free, unlimited for premium
    usageResetAt: { type: Date,   default: () => new Date(Date.now() + 86_400_000) },

    // Flags
    isActive:     { type: Boolean, default: true },
    emailVerified:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-reset daily usage
userSchema.methods.checkAndResetUsage = function () {
  if (new Date() > this.usageResetAt) {
    this.usageCount  = 0;
    this.usageResetAt = new Date(Date.now() + 86_400_000);
  }
};

userSchema.methods.canUse = function () {
  this.checkAndResetUsage();
  if (this.role === "premium" || this.role === "admin") return true;
  return this.usageCount < this.usageLimit;
};

export const User = mongoose.model("User", userSchema);
