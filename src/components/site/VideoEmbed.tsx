import { embedSrc, type VideoInfo } from "@/lib/video";

export default function VideoEmbed({ video, title }: { video: VideoInfo; title: string }) {
  if (video.provider === "file") {
    return (
      <video
        src={video.url}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full rounded-xl border border-white/10 bg-black"
      />
    );
  }
  const frameClass =
    video.provider === "instagram" || video.provider === "tiktok"
      ? "mx-auto aspect-[9/16] max-h-[80vh] w-full max-w-[420px]"
      : video.provider === "x"
        ? "mx-auto aspect-[4/5] w-full max-w-[550px]"
        : "aspect-video w-full";
  return (
    <iframe
      src={embedSrc(video)}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowFullScreen
      className={`${frameClass} rounded-xl border border-white/10 bg-black`}
    />
  );
}
