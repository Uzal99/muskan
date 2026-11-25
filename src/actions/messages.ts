"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getStr } from "@/lib/form";

export async function setMessageRead(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = getStr(formData, "id");
  const read = getStr(formData, "read") === "1";
  if (id) await prisma.message.updateMany({ where: { id }, data: { read } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = getStr(formData, "id");
  if (id) await prisma.message.deleteMany({ where: { id } });
  revalidatePath("/admin", "layout");
}
