import cron from "node-cron";
import { purgeExpiredFiles } from "../services/cloudStorage.js";
import { User } from "../models/User.js";
import { Subscription } from "../models/Payment.js";

// Purge expired Cloudinary files every hour
cron.schedule("0 * * * *", async () => {
  try { await purgeExpiredFiles(); }
  catch (err) { console.error("Cron purge error:", err.message); }
});

// Downgrade expired Pro subscriptions daily at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const expired = await Subscription.find({ status: "active", expiresAt: { $lt: new Date() } });
    for (const sub of expired) {
      await sub.updateOne({ status: "expired" });
      await User.findOneAndUpdate({ uid: sub.userId }, { role: "user", plan: "free", usageLimit: 10 });
    }
    console.log("Downgraded " + expired.length + " expired subscriptions");
  } catch (err) { console.error("Cron subscription error:", err.message); }
});

console.log("Cron jobs registered");
