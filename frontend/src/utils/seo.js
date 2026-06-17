export function buildMeta({ title, description, url, image }) {
  return {
    title:       `${title} — QuickFileTools`,
    description: description || "Free online file tools — compress, convert, merge and more.",
    canonical:   url ? `https://quickfiletools.xyz${url}` : "https://quickfiletools.xyz",
    og: {
      title, description,
      image: image || "https://quickfiletools.xyz/og-image.png",
      url,
    },
  };
}