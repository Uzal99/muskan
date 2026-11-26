export type VideoInfo = {
  provider: "youtube" | "vimeo" | "file" | "instagram" | "tiktok" | "facebook" | "x";
  url: string;
  embedUrl: string;
  thumbnail: string | null;
};

export function isHttpsUrl(raw?: string | null): raw is string {
  if (!raw) return false;
  try {
    return new URL(raw).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Understands common video links from YouTube, Vimeo, Instagram, TikTok,
 * Facebook and X, plus direct video files (.mp4 / .webm / .mov / .m4v).
 * Returns null for links that cannot be embedded safely.
 */
export function parseVideoUrl(raw?: string | null): VideoInfo | null {
  if (!raw) return null;
  const input = raw.trim();
  if (!input) return null;

  let u: URL;
  try {
    u = new URL(input);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "").toLowerCase();

  // ── YouTube ──
  let ytId: string | null = null;
  if (host === "youtu.be") {
    ytId = u.pathname.split("/")[1] || null;
  } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") ytId = u.searchParams.get("v");
    else {
      const [, kind, id] = u.pathname.split("/");
      if (kind && ["embed", "shorts", "live", "v"].includes(kind)) ytId = id || null;
    }
  }
  if (ytId && /^[\w-]{6,20}$/.test(ytId)) {
    return {
      provider: "youtube",
      url: input,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`,
      thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
    };
  }

  // ── Instagram posts and reels ──
  if (host === "instagram.com" || host === "m.instagram.com") {
    const match = u.pathname.match(/^\/(p|reel|tv)\/([a-z0-9_-]+)\/?$/i);
    if (match) {
      return {
        provider: "instagram",
        url: input,
        embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed/`,
        thumbnail: null,
      };
    }
  }

  // ── TikTok videos ──
  if (host === "tiktok.com" || host === "m.tiktok.com") {
    const match = u.pathname.match(/^\/@[^/]+\/video\/(\d+)\/?$/i);
    if (match) {
      const embed = new URL(`https://www.tiktok.com/player/v1/${match[1]}`);
      embed.searchParams.set("music_info", "1");
      embed.searchParams.set("description", "1");
      return { provider: "tiktok", url: input, embedUrl: embed.toString(), thumbnail: null };
    }
  }

  // ── Facebook videos, reels and watch links ──
  if (
    host === "facebook.com" ||
    host.endsWith(".facebook.com") ||
    host === "fb.watch"
  ) {
    const isVideoPath =
      /^\/watch\/?$/i.test(u.pathname) ||
      /\/(videos?|reel|posts|share\/v)\//i.test(u.pathname);
    if (isVideoPath || host === "fb.watch") {
      const embed = new URL("https://www.facebook.com/plugins/video.php");
      embed.searchParams.set("href", input);
      embed.searchParams.set("show_text", "false");
      embed.searchParams.set("width", "640");
      return { provider: "facebook", url: input, embedUrl: embed.toString(), thumbnail: null };
    }
  }

  // ── X / Twitter video posts ──
  if (host === "x.com" || host.endsWith(".x.com") || host === "twitter.com" || host.endsWith(".twitter.com")) {
    const match = u.pathname.match(/\/status\/(\d+)\/?$/i);
    if (match) {
      const embed = new URL("https://platform.twitter.com/embed/Tweet.html");
      embed.searchParams.set("id", match[1]);
      embed.searchParams.set("theme", "dark");
      embed.searchParams.set("dnt", "true");
      return { provider: "x", url: input, embedUrl: embed.toString(), thumbnail: null };
    }
  }

  // ── Vimeo ──
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = u.pathname.split("/").filter(Boolean);
    const idIndex = parts.findIndex((p) => /^\d+$/.test(p));
    if (idIndex !== -1) {
      const id = parts[idIndex];
      const hash = parts[idIndex + 1] && /^[a-z0-9]+$/i.test(parts[idIndex + 1])
        ? parts[idIndex + 1]
        : u.searchParams.get("h");
      const embed = new URL(`https://player.vimeo.com/video/${id}`);
      if (hash) embed.searchParams.set("h", hash);
      embed.searchParams.set("dnt", "1");
      return { provider: "vimeo", url: input, embedUrl: embed.toString(), thumbnail: null };
    }
  }

  // ── Direct file ──
  if (/\.(mp4|webm|mov|m4v)$/i.test(u.pathname)) {
    return { provider: "file", url: input, embedUrl: input, thumbnail: null };
  }

  return null;
}

export function embedSrc(video: VideoInfo, autoplay = false): string {
  if (video.provider === "file") return video.embedUrl;
  const u = new URL(video.embedUrl);
  if (autoplay && (video.provider === "youtube" || video.provider === "vimeo")) {
    u.searchParams.set("autoplay", "1");
  }
  return u.toString();
}
