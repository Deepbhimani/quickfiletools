import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ── Safe lazy init: only runs when env vars are present ──────────────────────
function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️  Firebase Admin env vars not set — auth middleware disabled");
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Handle both escaped newlines (env file) and real newlines
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

/** Verifies Firebase ID token. Attaches decoded token to req.user */
export async function authenticate(req, res, next) {
  const app = getAdminApp();
  if (!app) {
    return res.status(503).json({ message: "Auth service not configured — set Firebase env vars" });
  }

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = header.split("Bearer ")[1];
    req.user    = await getAuth(app).verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

/** Requires a specific role stored in Firestore */
export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const app  = getAdminApp();
      if (!app) return res.status(503).json({ message: "Auth service not configured" });

      const snap = await getFirestore(app).doc(`users/${req.user.uid}`).get();
      const role = snap.data()?.role || "user";

      if (!roles.includes(role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      req.userProfile = snap.data();
      next();
    } catch (err) {
      next(err);
    }
  };
}

// Named export for other files that import `admin`
export const admin = { getAdminApp, getAuth, getFirestore };
