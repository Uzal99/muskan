import type { Metadata } from "next";
import Link from "next/link";
import { deleteProject } from "@/actions/projects";
import DeleteButton from "@/components/admin/DeleteButton";
import { projectThumb } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="mt-2 font-display text-5xl uppercase text-white">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="btn-primary btn-sm">
          + New project
        </Link>
      </header>

      {projects.length === 0 ? (
        <p className="text-sm text-zinc-500">No projects yet. Add your first one.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => {
            const thumb = projectThumb(p);
            return (
              <li key={p.id} className="card flex flex-wrap items-center gap-4 p-4">
                <div className="h-16 w-28 shrink-0 overflow-hidden rounded-md bg-ink-900">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] uppercase tracking-wider text-zinc-600">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{p.title}</p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {[p.category, p.year, `order ${p.sortOrder}`].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        p.published ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                    {p.featured && (
                      <span className="rounded bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p.published && (
                    <Link href={`/work/${p.slug}`} target="_blank" className="btn-ghost btn-sm">
                      View
                    </Link>
                  )}
                  <Link href={`/admin/projects/${p.id}`} className="btn-primary btn-sm">
                    Edit
                  </Link>
                  <DeleteButton action={deleteProject} id={p.id} confirmText={`Delete "${p.title}"? This cannot be undone.`} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
