export function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function truncate(str, n = 100) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export function readingTime(text) {
  const wpm   = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wpm));
}
