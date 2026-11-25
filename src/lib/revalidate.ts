import { revalidatePath } from "next/cache";

/** Call after any admin change so the cached public pages rebuild. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
