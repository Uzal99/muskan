import Link from "next/link";
import type { ProjectCard } from "@/lib/types";
import { PlayIcon } from "./Icons";

export default function ProjectCardLink({ project: p }: { project: ProjectCard }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-ink-800 transition duration-300 hover:border-brand/60"
    >
      <div className="relative aspect-video overflow-hidden bg-ink-900">
        {p.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.thumb}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,46,0.35),transparent_60%),#0d0d0d]">
            <span className="font-display text-6xl uppercase text-white/15">Cut</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full bg-brand text-white opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
          <PlayIcon className="h-6 w-6" />
        </span>
        {p.featured && (
          <span className="absolute left-3 top-3 rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
          {p.category || "Project"}
          {p.year ? <span className="text-zinc-500">· {p.year}</span> : null}
        </p>
        <h3 className="mt-1 font-display text-3xl uppercase leading-tight text-white">{p.title}</h3>
        {p.summary && <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{p.summary}</p>}
      </div>
    </Link>
  );
}
