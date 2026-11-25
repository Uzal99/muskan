"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { firstError, getBool, getInt, getNullable, getStr } from "@/lib/form";
import { revalidateSite } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required.").max(80),
  role: z.string().max(120).nullable(),
  quote: z.string().min(1, "Quote is required.").max(600, "Quote: 600 characters max."),
  avatar: z.string().url("Enter a full URL starting with https://").nullable(),
  published: z.boolean(),
  sortOrder: z.number().int().min(-9999).max(9999),
});

export async function saveTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = getStr(fd, "id");

  const parsed = schema.safeParse({
    name: getStr(fd, "name"),
    role: getNullable(fd, "role"),
    quote: getStr(fd, "quote"),
    avatar: getNullable(fd, "avatar"),
    published: getBool(fd, "published"),
    sortOrder: getInt(fd, "sortOrder"),
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  if (id) await prisma.testimonial.update({ where: { id }, data: parsed.data });
  else await prisma.testimonial.create({ data: parsed.data });

  revalidateSite();
  return { ok: true, message: id ? "Testimonial saved." : "Testimonial added." };
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = getStr(formData, "id");
  if (id) await prisma.testimonial.deleteMany({ where: { id } });
  revalidateSite();
}
