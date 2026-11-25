"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { firstError, getNullable, getStr } from "@/lib/form";
import type { ActionState } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email address.").max(200),
  subject: z.string().max(150).nullable(),
  body: z
    .string()
    .min(10, "Please write at least a couple of sentences.")
    .max(5000, "Message is too long (5000 characters max)."),
});

/** Public contact form → stored in the database, visible in Admin → Messages. */
export async function sendMessage(_prev: ActionState, fd: FormData): Promise<ActionState> {
  // Honeypot: real visitors never see or fill this field.
  if (getStr(fd, "website")) return { ok: true, message: "Thanks! Your message has been sent." };

  const parsed = schema.safeParse({
    name: getStr(fd, "name"),
    email: getStr(fd, "email").toLowerCase(),
    subject: getNullable(fd, "subject"),
    body: getStr(fd, "body"),
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  try {
    // Lightweight flood protection that works on serverless (no in-memory state).
    const now = Date.now();
    const [fromSameEmail, overall] = await Promise.all([
      prisma.message.count({
        where: { email: parsed.data.email, createdAt: { gte: new Date(now - 10 * 60 * 1000) } },
      }),
      prisma.message.count({ where: { createdAt: { gte: new Date(now - 60 * 1000) } } }),
    ]);
    if (fromSameEmail >= 3 || overall >= 20) {
      return { ok: false, error: "Too many messages right now — please try again in a few minutes." };
    }

    await prisma.message.create({ data: parsed.data });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Thanks! Your message has been sent. I'll get back to you soon." };
  } catch (e) {
    console.error("[contact] failed to save message:", e);
    return { ok: false, error: "Something went wrong. Please try again or email me directly." };
  }
}
