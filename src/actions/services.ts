"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SERVICE_ICONS } from "@/lib/constants";
import { firstError, getInt, getStr } from "@/lib/form";
import { revalidateSite } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Title is required.").max(80),
  description: z.string().max(500, "Description: 500 characters max."),
  icon: z.enum(SERVICE_ICONS),
  sortOrder: z.number().int().min(-9999).max(9999),
});

export async function saveService(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = getStr(fd, "id");

  const parsed = schema.safeParse({
    title: getStr(fd, "title"),
    description: getStr(fd, "description"),
    icon: getStr(fd, "icon"),
    sortOrder: getInt(fd, "sortOrder"),
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  if (id) await prisma.service.update({ where: { id }, data: parsed.data });
  else await prisma.service.create({ data: parsed.data });

  revalidateSite();
  return { ok: true, message: id ? "Service saved." : "Service added." };
}

export async function deleteService(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = getStr(formData, "id");
  if (id) await prisma.service.deleteMany({ where: { id } });
  revalidateSite();
}
