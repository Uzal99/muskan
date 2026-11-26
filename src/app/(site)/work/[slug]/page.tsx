import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCardLink from "@/components/site/ProjectCardLink";
import VideoEmbed from "@/components/site/VideoEmbed";
import { getProjectBySlug, getPublishedProjects, projectThumb, toCard } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { isHttpsUrl, parseVideoUrl } from "@/lib/video";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const rows = await prisma.project.findMany({ where: { published: true }, select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return []; // DB not reachable at build time — pages are generated on first request instead.
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const image = projectThumb(project);
  return {
    title: project.title,
    description: project.summary || undefined,
    openGraph: {
      title: project.title,
      description: project.summary || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const video = parseVideoUrl(project.videoUrl);
  const thumb = projectThumb(project);
  const others = (await getPublishedProjects()).filter((p) => p.id !== project.id).slice(0, 3);

  const meta = [
    project.client && { label: "Client", value: project.client },
    project.year && { label: "Year", value: String(project.year) },
    project.category && { label: "Category", value: project.category },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="pb-24 pt-28 sm:pt-32">
      <div className="container-x">
        <Link href="/#work" className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 transition hover:text-brand">
          ← All work
        </Link>

        <header className="mt-8">
          {project.category && <p className="eyebrow">{project.category}</p>}
          <h1 className="mt-3 font-display text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.92] text-white">
            {project.title}
          </h1>
          {project.summary && <p className="mt-5 max-w-2xl text-lg text-zinc-400">{project.summary}</p>}
        </header>

        <div className="mt-10">
          {video ? (
            <VideoEmbed video={video} title={project.title} />
          ) : isHttpsUrl(project.videoUrl) ? (
            <div className="grid aspect-video w-full place-items-center rounded-xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,46,0.3),transparent_60%),#0d0d0d]">
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Watch video on social media ↗
              </a>
            </div>
          ) : thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={project.title} className="aspect-video w-full rounded-xl border border-white/10 object-cover" />
          ) : (
            <div className="grid aspect-video w-full place-items-center rounded-xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,46,0.3),transparent_60%),#0d0d0d]">
              <span className="font-display text-7xl uppercase text-white/15">Cut</span>
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {project.description ? (
              <div className="whitespace-pre-line text-base leading-relaxed text-zinc-300">{project.description}</div>
            ) : null}
          </div>

          {meta.length > 0 && (
            <dl className="space-y-5 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">{m.label}</dt>
                  <dd className="mt-1 text-white">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {others.length > 0 && (
          <section className="mt-24 border-t border-white/10 pt-16">
            <h2 className="font-display text-4xl uppercase text-white">
              More <span className="text-brand">work</span>
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <ProjectCardLink key={p.id} project={toCard(p)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
