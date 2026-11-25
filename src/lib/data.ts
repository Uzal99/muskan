import { cache } from "react";
import type { Project, SiteSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { parseVideoUrl } from "@/lib/video";
import type { ProjectCard } from "@/lib/types";

// Public read helpers. They never throw: if the database is unreachable
// (e.g. first deploy, paused Supabase project) the site still renders.

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return row ?? DEFAULT_SETTINGS;
  } catch (e) {
    console.error("[data] getSettings failed:", e);
    return DEFAULT_SETTINGS;
  }
});

export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  try {
    return await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (e) {
    console.error("[data] getPublishedProjects failed:", e);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    return await prisma.project.findFirst({ where: { slug, published: true } });
  } catch (e) {
    console.error("[data] getProjectBySlug failed:", e);
    return null;
  }
});

export const getServices = cache(async () => {
  try {
    return await prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
  } catch (e) {
    console.error("[data] getServices failed:", e);
    return [];
  }
});

export const getTestimonials = cache(async () => {
  try {
    return await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch (e) {
    console.error("[data] getTestimonials failed:", e);
    return [];
  }
});

export function projectThumb(p: Pick<Project, "thumbnail" | "videoUrl">): string | null {
  return p.thumbnail || parseVideoUrl(p.videoUrl)?.thumbnail || null;
}

export function toCard(p: Project): ProjectCard {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    summary: p.summary,
    thumb: projectThumb(p),
    featured: p.featured,
    year: p.year,
  };
}
