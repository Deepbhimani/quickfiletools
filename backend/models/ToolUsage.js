import mongoose from "mongoose";

// ─── Tool Usage ───────────────────────────────────────────────────────────────
const toolUsageSchema = new mongoose.Schema(
  {
    userId:      { type: String, index: true, default: null }, // null = anonymous
    tool:        { type: String, required: true, index: true },
    inputSize:   { type: Number, default: 0 },    // bytes
    outputSize:  { type: Number, default: 0 },
    duration:    { type: Number, default: 0 },    // ms
    success:     { type: Boolean, default: true },
    errorMessage:{ type: String, default: null },
    ip:          { type: String, default: null },
  },
  { timestamps: true }
);

toolUsageSchema.index({ tool: 1, createdAt: -1 });
toolUsageSchema.index({ userId: 1, createdAt: -1 });

// ─── Blog Post ────────────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt:      { type: String, required: true, maxlength: 300 },
    content:      { type: String, required: true },    // rich HTML or Markdown
    coverImage:   { type: String, default: null },
    author:       { type: String, required: true },    // Firebase UID of admin
    tags:         [{ type: String, lowercase: true }],
    status:       { type: String, enum: ["draft", "published"], default: "draft", index: true },
    views:        { type: Number, default: 0 },
    readTime:     { type: Number, default: 3 },        // minutes
    seoTitle:     { type: String, default: null },
    seoDesc:      { type: String, default: null },
    publishedAt:  { type: Date, default: null },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });

export const ToolUsage = mongoose.model("ToolUsage", toolUsageSchema);
export const Blog      = mongoose.model("Blog", blogSchema);
