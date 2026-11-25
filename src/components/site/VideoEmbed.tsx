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
  return (
    <iframe
      src={embedSrc(video)}
      title={title}
      loading="lazy"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="aspect-video w-full rounded-xl border border-white/10 bg-black"
    />
  );
}
