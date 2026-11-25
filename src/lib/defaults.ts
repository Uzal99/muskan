import type { SiteSettings } from "@prisma/client";

/**
 * Starter content. Used by the seed script to create the first settings row
 * and as a fallback when the database can't be reached. Everything here is
 * editable from /admin/settings afterwards.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  siteName: "ALEX MORGAN",
  tagline: "Video Editor & Colorist",
  heroEyebrow: "Available for new projects",
  heroTitle: "I cut stories that *hit.*",
  heroSubtitle:
    "Commercials, music videos, documentaries and social content — edited with rhythm, polished in colour and sound, delivered on time.",
  heroVideoUrl: null,
  showreelUrl: null,
  aboutTitle: "Every frame earns its place.",
  aboutBody:
    "I'm a video editor with a passion for pacing, story and detail. From the first rough cut to the final grade and mix, I shape footage into something people feel.\n\nReplace this text from the admin panel with your own story, background and the kind of projects you love working on.",
  aboutImage: null,
  tools: [
    "Premiere Pro",
    "After Effects",
    "DaVinci Resolve",
    "Final Cut Pro",
    "Photoshop",
    "Audition",
  ],
  yearsExperience: 6,
  projectsDelivered: 250,
  happyClients: 80,
  contactTitle: "Let's make something great.",
  contactSubtitle:
    "Tell me about your project, timeline and budget. I usually reply within 24 hours.",
  email: null,
  phone: null,
  location: null,
  instagram: null,
  youtube: null,
  vimeo: null,
  linkedin: null,
  twitter: null,
  seoTitle: "Alex Morgan — Video Editor & Colorist",
  seoDescription:
    "Portfolio of Alex Morgan, a professional video editor and colorist. Commercials, music videos, documentaries and social content.",
  ogImage: null,
  updatedAt: new Date(0),
};
