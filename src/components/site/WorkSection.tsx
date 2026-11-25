"use client";

import { useMemo, useState } from "react";
import type { ProjectCard } from "@/lib/types";
import ProjectCardLink from "./ProjectCardLink";

export default function WorkSection({ projects }: { projects: ProjectCard[] }) {
  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
    [projects],
  );
  const [active, setActive] = useState("All");

  const visible = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="work" className="scroll-mt-16 py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="section-title mt-3">
              The <span className="text-brand">reel</span>
            </h2>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
              {["All", ...categories].map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={active === c}
                  onClick={() => setActive(c)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                    active === c
                      ? "border-brand bg-brand text-white"
                      : "border-white/15 text-zinc-400 hover:border-brand hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="mt-16 text-zinc-500">No projects yet — add some from the admin panel.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProjectCardLink key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
