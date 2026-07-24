const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const USER_AGENT = "Mozilla/5.0 (compatible; WayfarersLedger/1.0)";

const OG_IMAGE_PATTERNS = [
  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
];

function extractImageUrl(html, pageUrl) {
  for (const pattern of OG_IMAGE_PATTERNS) {
    const match = html.match(pattern);
    if (match) {
      return new URL(match[1], pageUrl).toString();
    }
  }
  return null;
}

function extensionForContentType(contentType) {
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

/**
 * Fetches the page at pageUrl, looks for a standard "preview image" meta
 * tag (og:image / twitter:image), downloads it to a temp file, and returns
 * that file's path - ready to be treated exactly like a locally-picked
 * photo (vault.importPhoto handles the rest). Returns null if no preview
 * image could be found. Only ever runs when the Wayfarer explicitly asks.
 */
async function fetchPreviewImage(pageUrl) {
  const parsed = new URL(pageUrl);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http:// and https:// links are supported.");
  }

  const pageResponse = await fetch(pageUrl, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!pageResponse.ok) {
    throw new Error(`Could not open that link (${pageResponse.status}).`);
  }
  const html = await pageResponse.text();

  const imageUrl = extractImageUrl(html, pageUrl);
  if (!imageUrl) return null;

  const imageResponse = await fetch(imageUrl, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!imageResponse.ok) {
    throw new Error(`Could not download the preview image (${imageResponse.status}).`);
  }

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  const contentType = imageResponse.headers.get("content-type") || "";
  const tempPath = path.join(
    os.tmpdir(),
    `wl-link-preview-${Date.now()}${extensionForContentType(contentType)}`,
  );
  fs.writeFileSync(tempPath, buffer);

  return tempPath;
}

module.exports = { fetchPreviewImage };
