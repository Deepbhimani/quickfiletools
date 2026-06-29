import { User } from "../models/User.js";

export async function premiumOnly(req, res, next) {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user || (user.role !== "premium" && user.role !== "admin")) {
      return res.status(403).json({ message: "Pro subscription required", upgrade: true });
    }
    req.userDoc = user;
    next();
  } catch (err) { next(err); }
}
