import Link from "next/link";
import type { SiteSettings } from "@prisma/client";
import type { VideoInfo } from "@/lib/video";
import Highlight from "./Highlight";
import ShowreelButton from "./ShowreelButton";
import { ArrowDownIcon } from "./Icons";

export default function Hero({
  settings,
  showreel,
  bgVideo,
}: {
  settings: SiteSettings;
  showreel: VideoInfo | null;
  bgVideo: string | null;
}) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {bgVideo && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50"
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_15%,rgba(225,29,46,0.25),transparent_55%),linear-gradient(to_bottom,rgba(5,5,5,0.25),#050505_95%)]" />

      <div className="container-x pb-28 pt-32">
        {settings.heroEyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-200 backdrop-blur">
            <span className="h-2 w-2 animate-rec rounded-full bg-brand" aria-hidden="true" />
            {settings.heroEyebrow}
          </p>
        )}

        <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.5rem,12vw,9.5rem)] uppercase leading-[0.9] text-white">
          <Highlight text={settings.heroTitle} />
        </h1>

        {settings.heroSubtitle && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">{settings.heroSubtitle}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/#work" className="btn-primary">
            View my work
          </Link>
          {showreel && <ShowreelButton video={showreel} />}
        </div>

        {settings.tagline && (
          <p className="mt-14 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{settings.tagline}</p>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="container-x flex items-center justify-between pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
          <span>00:00:00:00</span>
          <span className="flex items-center gap-2">
            Scroll <ArrowDownIcon className="h-3 w-3" />
          </span>
        </div>
        <div className="ruler opacity-70" />
      </div>
    </section>
  );
}
