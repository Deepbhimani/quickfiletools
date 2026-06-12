import express from "express";
import { body, validationResult } from "express-validator";
import { authenticate, requireRole } from "../middleware/auth.js";
import { Blog } from "../models/ToolUsage.js";

const router = express.Router();

// GET /api/blog
router.get("/", async (req, res, next) => {
  try {
    const { tag, page = 1, limit = 10, status = "published" } = req.query;
    const filter = { status };
    if (tag) filter.tags = tag;

    const [posts, total] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).select("-content"),
      Blog.countDocuments(filter),
    ]);
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/blog/search
router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ posts: [] });
    const posts = await Blog.find({
      status: "published",
      $or: [{ title: { $regex: q, $options: "i" } }, { tags: { $regex: q, $options: "i" } }],
    }).limit(10).select("-content");
    res.json({ posts });
  } catch (err) { next(err); }
});

// GET /api/blog/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) { next(err); }
});

// POST /api/blog — admin only
router.post("/", authenticate, requireRole("admin"),
  [body("title").trim().notEmpty(), body("slug").trim().notEmpty(), body("content").notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const post = await Blog.create({ ...req.body, author: req.user.uid,
        publishedAt: req.body.status === "published" ? new Date() : null });
      res.status(201).json(post);
    } catch (err) { next(err); }
  }
);

// PUT /api/blog/:id — admin only
router.put("/:id", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    if (req.body.status === "published") req.body.publishedAt = new Date();
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) { next(err); }
});

// DELETE /api/blog/:id — admin only
router.delete("/:id", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) { next(err); }
});

export default router;
