"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { firstError, getBool, getInt, getNullable, getStr } from "@/lib/form";
import { revalidateSite } from "@/lib/revalidate";
import { slugify } from "@/lib/utils";
import { parseVideoUrl } from "@/lib/video";
import type { ActionState } from "@/lib/types";

const urlMsg = "Enter a full URL starting with https://";

const schema = z.object({
  title: z.string().min(1, "Title is required.").max(120),
  slug: z.string().min(1, "Could not build a URL slug — add letters or numbers to the title.").max(120),
  category: z.string().max(40),
  client: z.string().max(80).nullable(),
  year: z
    .number({ invalid_type_error: "Year must be a number." })
    .int()
    .min(1990, "Year looks wrong.")
    .max(2100, "Year looks wrong.")
    .nullable(),
  summary: z.string().max(200, "Short summary: 200 characters max."),
  description: z.string().max(8000),
  thumbnail: z.string().url(urlMsg).nullable(),
  videoUrl: z.string().url(urlMsg).nullable(),
  sortOrder: z.number().int().min(-9999).max(9999),
  featured: z.boolean(),
  published: z.boolean(),
});

export async function saveProject(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = getStr(fd, "id");
  const yearRaw = getStr(fd, "year");

  const parsed = schema.safeParse({
    title: getStr(fd, "title"),
    slug: slugify(getStr(fd, "slug") || getStr(fd, "title")),
    category: getStr(fd, "category"),
    client: getNullable(fd, "client"),
    year: yearRaw ? Number(yearRaw) : null,
    summary: getStr(fd, "summary"),
    description: getStr(fd, "description"),
    thumbnail: getNullable(fd, "thumbnail"),
    videoUrl: getNullable(fd, "videoUrl"),
    sortOrder: getInt(fd, "sortOrder"),
    featured: getBool(fd, "featured"),
    published: getBool(fd, "published"),
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = parsed.data;

  if (data.videoUrl && !parseVideoUrl(data.videoUrl)) {
    return { ok: false, error: "Video must be a YouTube, Vimeo or direct .mp4/.webm link." };
  }

  const clash = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (clash && clash.id !== id) {
    return { ok: false, error: `The URL slug "${data.slug}" is already used by another project.` };
  }

  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }

  revalidateSite();
  if (!id) redirect("/admin/projects");
  return { ok: true, message: "Project saved." };
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = getStr(formData, "id");
  if (id) await prisma.project.deleteMany({ where: { id } });
  revalidateSite();
  redirect("/admin/projects");
}
