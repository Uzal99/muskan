export type VideoInfo = {
  provider: "youtube" | "vimeo" | "file";
  url: string;
  embedUrl: string;
  thumbnail: string | null;
};

/**
 * Understands YouTube, Vimeo and direct video-file links
 * (.mp4 / .webm / .mov / .m4v). Returns null for anything else.
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
  if (autoplay) u.searchParams.set("autoplay", "1");
  return u.toString();
}
