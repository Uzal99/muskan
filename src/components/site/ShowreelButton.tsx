"use client";

import { useEffect, useState } from "react";
import { embedSrc, type VideoInfo } from "@/lib/video";
import { CloseIcon, PlayIcon } from "./Icons";

export default function ShowreelButton({ video }: { video: VideoInfo }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-ghost">
        <PlayIcon className="h-4 w-4" /> Watch showreel
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Close showreel"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {video.provider === "file" ? (
              <video src={video.url} controls autoPlay playsInline className="aspect-video w-full rounded-xl bg-black" />
            ) : (
              <iframe
                src={embedSrc(video, true)}
                title="Showreel"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full rounded-xl bg-black"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
