export const SERVICE_ICONS = [
  "film",
  "scissors",
  "wand",
  "audio",
  "palette",
  "sparkles",
  "camera",
  "zap",
] as const;

export type ServiceIconName = (typeof SERVICE_ICONS)[number];

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
