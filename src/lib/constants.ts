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

export const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB
