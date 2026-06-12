import rateLimit from "express-rate-limit";

const message = (action) => ({
  message: `Too many ${action} requests. Please try again later.`,
});

/** Applied globally to every request */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("API"),
});

/** For auth endpoints - tighter limit */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: message("login"),
});

/** For file processing - prevent abuse */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: message("upload"),
});
