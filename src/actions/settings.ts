"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { firstError, getInt, getNullable, getStr } from "@/lib/form";
import { revalidateSite } from "@/lib/revalidate";
import { parseVideoUrl } from "@/lib/video";
import type { ActionState } from "@/lib/types";

const urlMsg = "Enter a full URL starting with https://";
const url = z.string().url(urlMsg).nullable();
const count = z.number().int().min(0).max(100000);

const schema = z.object({
  siteName: z.string().min(1, "Site name is required.").max(60),
  tagline: z.string().max(120),
  heroEyebrow: z.string().max(80),
  heroTitle: z.string().min(1, "Hero title is required.").max(120),
  heroSubtitle: z.string().max(400),
  heroVideoUrl: url,
  showreelUrl: url,
  aboutTitle: z.string().max(120),
  aboutBody: z.string().max(5000),
  aboutImage: url,
  tools: z.array(z.string().max(40)).max(24, "Use 24 tools or fewer."),
  yearsExperience: count,
  projectsDelivered: count,
  happyClients: count,
  contactTitle: z.string().max(120),
  contactSubtitle: z.string().max(400),
  email: z.string().email("Enter a valid contact email.").nullable(),
  phone: z.string().max(40).nullable(),
  location: z.string().max(80).nullable(),
  instagram: url,
  youtube: url,
  vimeo: url,
  linkedin: url,
  twitter: url,
  seoTitle: z.string().max(70, "SEO title: 70 characters max."),
  seoDescription: z.string().max(200, "SEO description: 200 characters max."),
  ogImage: url,
});

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();

  const tools = Array.from(
    new Set(
      getStr(fd, "tools")
        .split(/[,\n]/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  );

  const parsed = schema.safeParse({
    siteName: getStr(fd, "siteName"),
    tagline: getStr(fd, "tagline"),
    heroEyebrow: getStr(fd, "heroEyebrow"),
    heroTitle: getStr(fd, "heroTitle"),
    heroSubtitle: getStr(fd, "heroSubtitle"),
    heroVideoUrl: getNullable(fd, "heroVideoUrl"),
    showreelUrl: getNullable(fd, "showreelUrl"),
    aboutTitle: getStr(fd, "aboutTitle"),
    aboutBody: getStr(fd, "aboutBody"),
    aboutImage: getNullable(fd, "aboutImage"),
    tools,
    yearsExperience: getInt(fd, "yearsExperience"),
    projectsDelivered: getInt(fd, "projectsDelivered"),
    happyClients: getInt(fd, "happyClients"),
    contactTitle: getStr(fd, "contactTitle"),
    contactSubtitle: getStr(fd, "contactSubtitle"),
    email: getNullable(fd, "email"),
    phone: getNullable(fd, "phone"),
    location: getNullable(fd, "location"),
    instagram: getNullable(fd, "instagram"),
    youtube: getNullable(fd, "youtube"),
    vimeo: getNullable(fd, "vimeo"),
    linkedin: getNullable(fd, "linkedin"),
    twitter: getNullable(fd, "twitter"),
    seoTitle: getStr(fd, "seoTitle"),
    seoDescription: getStr(fd, "seoDescription"),
    ogImage: getNullable(fd, "ogImage"),
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = parsed.data;

  if (data.showreelUrl && !parseVideoUrl(data.showreelUrl)) {
    return { ok: false, error: "Showreel must be a YouTube, Vimeo or direct .mp4/.webm link." };
  }
  if (data.heroVideoUrl && parseVideoUrl(data.heroVideoUrl)?.provider !== "file") {
    return { ok: false, error: "Hero background video must be a direct .mp4 or .webm file link." };
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidateSite();
  return { ok: true, message: "Settings saved. The live site updates within seconds." };
}
