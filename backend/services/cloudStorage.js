import { v2 as cloudinary } from "cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image extensions that Cloudinary can handle as "image" resource type
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

/**
 * Upload a local file to Cloudinary.
 * PDFs and all other files are uploaded as "raw" so they are served
 * as downloadable files (not rendered as images).
 * Images are uploaded as "image" to allow transformations.
 */
export async function uploadToCloud(localPath) {
  const ext          = path.extname(localPath).toLowerCase();
  const resource_type = IMAGE_EXTS.has(ext) ? "image" : "raw";

  const result = await cloudinary.uploader.upload(localPath, {
    folder:        "quickfiletools",
    resource_type,           // "raw" for PDFs → /raw/upload/ URL → browser downloads correctly
    tags:          ["temp"],
  });

  return result.secure_url;
}

/** Delete a file from Cloudinary by public_id */
export async function deleteFromCloud(publicId, resource_type = "raw") {
  return cloudinary.uploader.destroy(publicId, { resource_type });
}

/** Delete all files older than 1 hour (run via cron) */
export async function purgeExpiredFiles() {
  const before = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Purge raw files (PDFs, processed outputs)
  const rawRes = await cloudinary.api.resources({
    type:          "upload",
    resource_type: "raw",
    prefix:        "quickfiletools/",
    max_results:   500,
  });
  const oldRaw = rawRes.resources.filter((r) => r.created_at < before);
  await Promise.all(oldRaw.map((r) => deleteFromCloud(r.public_id, "raw")));

  // Purge image files (compressed/converted images)
  const imgRes = await cloudinary.api.resources({
    type:          "upload",
    resource_type: "image",
    prefix:        "quickfiletools/",
    max_results:   500,
  });
  const oldImg = imgRes.resources.filter((r) => r.created_at < before);
  await Promise.all(oldImg.map((r) => deleteFromCloud(r.public_id, "image")));

  console.log(`🧹 Purged ${oldRaw.length + oldImg.length} expired files from Cloudinary`);
}