import type { ZodError } from "zod";

export function getStr(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function getNullable(fd: FormData, key: string): string | null {
  const s = getStr(fd, key);
  return s ? s : null;
}

export function getInt(fd: FormData, key: string, fallback = 0): number {
  const n = parseInt(getStr(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function getBool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true";
}

export function firstError(err: ZodError): string {
  return err.issues[0]?.message ?? "Please check the form and try again.";
}
