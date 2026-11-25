"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { firstError, getStr } from "@/lib/form";
import type { ActionState } from "@/lib/types";

// Compared against when the email doesn't exist, so response time doesn't
// reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      email: z.string().email("Enter a valid email address."),
      password: z.string().min(1, "Enter your password."),
    })
    .safeParse({ email: getStr(formData, "email"), password: String(formData.get("password") ?? "") });

  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  const valid = await bcrypt.compare(parsed.data.password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) {
    await new Promise((r) => setTimeout(r, 600)); // slow down brute force
    return { ok: false, error: "Invalid email or password." };
  }

  await createSession(admin);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function updateAccount(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();

  const email = getStr(formData, "email").toLowerCase();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  const parsed = z
    .object({
      email: z.string().email("Enter a valid email address."),
      currentPassword: z.string().min(1, "Enter your current password to confirm changes."),
      newPassword: z.string().refine((v) => v === "" || v.length >= 10, "New password must be at least 10 characters."),
    })
    .safeParse({ email, currentPassword, newPassword });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin) return { ok: false, error: "Account not found. Please sign in again." };

  if (!(await bcrypt.compare(currentPassword, admin.passwordHash))) {
    return { ok: false, error: "Current password is incorrect." };
  }

  if (email !== admin.email) {
    const taken = await prisma.admin.findUnique({ where: { email } });
    if (taken) return { ok: false, error: "That email is already in use." };
  }

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: {
      email,
      ...(newPassword ? { passwordHash: await bcrypt.hash(newPassword, 12) } : {}),
    },
  });
  await createSession(updated);

  return { ok: true, message: "Account updated." };
}
