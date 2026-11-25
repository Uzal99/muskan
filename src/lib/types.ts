export type ActionState = { ok: boolean; message?: string; error?: string };

export const initialState: ActionState = { ok: false };

/** Lightweight project shape passed from server → client components. */
export type ProjectCard = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  thumb: string | null;
  featured: boolean;
  year: number | null;
};
