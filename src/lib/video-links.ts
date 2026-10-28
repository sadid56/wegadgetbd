const ensureHttps = (url: string) => {
  const value = url.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

export function normalizeVideoInput(url: string) {
  return ensureHttps(url).trim();
}

export function toVideoEmbedUrl(rawUrl: string) {
  const url = normalizeVideoInput(rawUrl);
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace(/^\//, "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host.includes("facebook.com") || host.includes("fb.watch") || host.includes("m.me") || host.includes("messenger.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
    }

    return url;
  } catch {
    return url;
  }
}
