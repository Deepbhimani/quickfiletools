
import express from "express";
import multer from "multer";
import path from "path";
import os from "os";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { body, validationResult } from "express-validator";
import { getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { uploadLimiter } from "../middleware/rateLimiter.js";
import { processFile }   from "../services/fileProcessor.js";
import { User }          from "../models/User.js";
import { ToolUsage }     from "../models/ToolUsage.js";

const router = express.Router();

// token → { filePath, filename, expires, downloadCount }
const downloadTokens = new Map();

function makeToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, entry] of downloadTokens.entries()) {
    if (entry.expires < now) downloadTokens.delete(token);
  }
}

async function decodeToken(authHeader) {
  if (!authHeader?.startsWith("Bearer ") || !getApps().length) return null;
  try { return await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]); }
  catch { return null; }
}

async function getOrCreateUser(decoded) {
  if (!decoded) return null;
  let user = await User.findOne({ uid: decoded.uid });
  if (!user) {
    user = await User.create({
      uid: decoded.uid, email: decoded.email,
      name: decoded.name || decoded.email?.split("@")[0] || "User",
      photoURL: decoded.picture || null,
      emailVerified: decoded.email_verified || false,
    });
    console.log(`[tools] Auto-created user: ${decoded.email}`);
  }
  return user;
}

// ─── Multer ───────────────────────────────────────────────────────────────────
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 50 * 1024 * 1024, files: 20 },
  fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|pdf/i;
    const ext     = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error(`File type .${ext} not allowed`));
  },
});

// ─── Tools catalog ────────────────────────────────────────────────────────────
const TOOLS_CATALOG = [
  { slug: "image-compressor",     name: "Image Compressor",     category: "image", premium: false },
  { slug: "jpg-to-png",           name: "JPG to PNG",           category: "image", premium: false },
  { slug: "png-to-jpg",           name: "PNG to JPG",           category: "image", premium: false },
  { slug: "image-to-webp",        name: "Image to WebP",        category: "image", premium: false },
  { slug: "image-resizer",        name: "Image Resizer",        category: "image", premium: false },
  { slug: "image-to-pdf",         name: "Image to PDF",         category: "image", premium: false },
  { slug: "pdf-merge",            name: "PDF Merge",            category: "pdf",   premium: false },
  { slug: "pdf-split",            name: "PDF Split",            category: "pdf",   premium: false },
  { slug: "background-remover",   name: "Background Remover",   category: "image", premium: true  },
  { slug: "watermark-remover",    name: "Watermark Remover",    category: "image", premium: true  },
  { slug: "pdf-compress",         name: "PDF Compress",         category: "pdf",   premium: true  },
  { slug: "pdf-to-word",          name: "PDF to Word",          category: "pdf",   premium: true  },
  { slug: "pdf-ocr",              name: "PDF OCR",              category: "pdf",   premium: true  },
  { slug: "esign-pdf",            name: "E-Sign PDF",           category: "pdf",   premium: true  },
  { slug: "pdf-password-remover", name: "PDF Password Remover", category: "pdf",   premium: true  },
];

// ─── Correct file extension per tool ─────────────────────────────────────────
const TOOL_EXT = {
  "image-compressor":     null,    // preserve original ext
  "jpg-to-png":           ".png",
  "png-to-jpg":           ".jpg",
  "image-to-webp":        ".webp",
  "image-resizer":        null,    // preserve original ext
  "image-to-pdf":         ".pdf",
  "pdf-merge":            ".pdf",
  "pdf-split":            ".pdf",
  "background-remover":   ".png",
  "watermark-remover":    ".jpg",
  "pdf-compress":         ".pdf",
  "pdf-to-word":          ".txt",
  "pdf-ocr":              ".txt",
  "esign-pdf":            ".pdf",
  "pdf-password-remover": ".pdf",
};

router.get("/",        (req, res) => res.json({ tools: TOOLS_CATALOG }));
router.get("/catalog", (req, res) => res.json({ tools: TOOLS_CATALOG }));

// ─── Usage ────────────────────────────────────────────────────────────────────
router.get("/usage", async (req, res, next) => {
  try {
    const decoded = await decodeToken(req.headers.authorization);
    if (!decoded) return res.json({ usageCount: 0, usageLimit: 10, plan: "free" });
    const user = await getOrCreateUser(decoded);
    if (user) user.checkAndResetUsage();
    await user?.save();
    res.json({ usageCount: user?.usageCount || 0, usageLimit: user?.usageLimit || 10, resetAt: user?.usageResetAt, plan: user?.plan || "free" });
  } catch (err) { next(err); }
});

// ─── Download route ───────────────────────────────────────────────────────────
// ?token=xxx            → normal download (streams file, deletes token + file after)
// ?token=xxx&preview=1  → preview fetch (streams file, keeps token + file alive)
router.get("/download", async (req, res, next) => {
  try {
    cleanExpiredTokens();

    const { token, preview } = req.query;
    const isPreview = preview === "1";

    if (!token) return res.status(400).json({ message: "token is required" });

    const entry = downloadTokens.get(token);
    if (!entry)                    return res.status(404).json({ message: "Download link expired or not found" });
    if (entry.expires < Date.now()) {
      downloadTokens.delete(token);
      return res.status(410).json({ message: "Download link has expired" });
    }

    const { filePath, filename } = entry;

    try { await fs.access(filePath); }
    catch {
      downloadTokens.delete(token);
      return res.status(404).json({ message: "File no longer available" });
    }

    const stat = await fs.stat(filePath);
    console.log(`[download] ${isPreview ? "PREVIEW" : "DOWNLOAD"}: ${filename} (${stat.size} bytes)`);

    // For preview: serve inline so browser can render it; keep token alive
    // For download: serve as attachment; clean up token + file after
    res.setHeader("Content-Type",   isPreview ? "image/png" : "application/octet-stream");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Cache-Control",  "no-store");

    if (!isPreview) {
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    }

    const stream = createReadStream(filePath);
    stream.pipe(res);

    stream.on("end", () => {
      if (!isPreview) {
        // Only delete token + temp file on real download
        downloadTokens.delete(token);
        fs.unlink(filePath).catch(() => {});
        console.log(`[download] Cleaned up: ${filePath}`);
      }
    });

    stream.on("error", (err) => {
      console.error(`[download] Stream error: ${err.message}`);
      next(err);
    });

  } catch (err) {
    console.error("[download] Error:", err.message);
    next(err);
  }
});

// ─── Process route ────────────────────────────────────────────────────────────
router.post(
  "/process",
  uploadLimiter,
  upload.array("files", 20),
  [body("tool").notEmpty().withMessage("tool is required")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { tool, options } = req.body;
      const filePaths = (req.files || []).map((f) => f.path);
      if (!filePaths.length) return res.status(400).json({ message: "No files uploaded" });

      let userDoc = null;
      const decoded = await decodeToken(req.headers.authorization);
      if (decoded) {
        userDoc = await getOrCreateUser(decoded);
        if (userDoc) {
          userDoc.checkAndResetUsage();
          if (!userDoc.canUse()) {
            return res.status(429).json({ message: "Daily limit reached. Upgrade to Pro for unlimited use." });
          }
        }
      }

      const start  = Date.now();
      const result = await processFile({ tool, filePaths, options: JSON.parse(options || "{}") });

      await ToolUsage.create({ userId: userDoc?.uid || null, tool, duration: Date.now() - start, success: true, ip: req.ip });
      if (userDoc) { userDoc.usageCount += 1; await userDoc.save(); }

      // Issue download tokens — 15 min TTL (longer for AI tools that take time)
      const isAiTool = tool === "background-remover" || tool === "watermark-remover";
      const expires  = Date.now() + (isAiTool ? 30 : 10) * 60 * 1000;

      const downloadUrls = result.localPaths.map((filePath, i) => {
        const token   = makeToken();
        const fileExt = TOOL_EXT[tool] ?? path.extname(filePath) ?? ".bin";
        const filename = `${tool}_result_${i + 1}${fileExt}`;
        downloadTokens.set(token, { filePath, filename, expires });
        return `/api/tools/download?token=${token}`;
      });

      console.log(`[process] Tool: ${tool}, outputs: ${result.localPaths.length}`);
      res.json({ success: true, ...result, downloadUrls });
    } catch (err) { next(err); }
  }
);

// ─── Single tool info ─────────────────────────────────────────────────────────
router.get("/:slug", (req, res) => {
  const tool = TOOLS_CATALOG.find((t) => t.slug === req.params.slug);
  if (!tool) return res.status(404).json({ message: "Tool not found" });
  res.json(tool);
});

export default router;