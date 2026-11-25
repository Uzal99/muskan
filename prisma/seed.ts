import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_SETTINGS } from "../src/lib/defaults";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  // Re-running the seed resets the admin password — handy if you get locked out.
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  // Settings: only created once, never overwritten by re-seeding.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, updatedAt, ...settings } = DEFAULT_SETTINGS;
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...settings, email },
  });

  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: [
        { title: "Video Editing", icon: "scissors", sortOrder: 1, description: "Story-first cuts for commercials, brand films, interviews and documentaries — tight pacing and clean transitions." },
        { title: "Color Grading", icon: "palette", sortOrder: 2, description: "Cinematic looks, shot matching and finishing so every scene feels like it belongs to the same world." },
        { title: "Motion Graphics", icon: "sparkles", sortOrder: 3, description: "Titles, lower thirds, logo animations and animated overlays that match your brand." },
        { title: "Sound Design & Mix", icon: "audio", sortOrder: 4, description: "Dialogue cleanup, music edits, sound effects and a balanced final mix." },
        { title: "Social & Short-Form", icon: "zap", sortOrder: 5, description: "Reels, Shorts and TikToks cut for retention, with captions and platform-ready exports." },
        { title: "YouTube Production", icon: "film", sortOrder: 6, description: "Full post-production for creators: cutting, thumbnails-ready frames, pacing and consistent style." },
      ],
    });
  }

  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({
      data: [
        { title: "Neon Nights", slug: "neon-nights", category: "Commercial", client: "Sample Brand", year: 2026, summary: "A 60s brand film with fast rhythm and a bold grade.", description: "Sample project — replace this from Admin → Projects with your own work, thumbnail and video link.", featured: true, sortOrder: 1 },
        { title: "Midnight Run", slug: "midnight-run", category: "Short Film", year: 2025, summary: "Moody narrative short, edited and graded end to end.", description: "Sample project — replace this from Admin → Projects.", sortOrder: 2 },
        { title: "Echoes", slug: "echoes", category: "Music Video", client: "Sample Artist", year: 2025, summary: "Beat-synced edit with layered motion graphics.", description: "Sample project — replace this from Admin → Projects.", sortOrder: 3 },
        { title: "Behind the Craft", slug: "behind-the-craft", category: "Documentary", year: 2024, summary: "Interview-driven mini documentary.", description: "Sample project — replace this from Admin → Projects.", sortOrder: 4 },
      ],
    });
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.create({
      data: {
        name: "Client Name",
        role: "Creative Director, Brand Studio",
        quote: "Sample testimonial — replace or delete this from Admin → Testimonials.",
        sortOrder: 1,
      },
    });
  }

  console.log(`✔ Seed complete. Admin login: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
