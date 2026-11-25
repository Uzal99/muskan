import type { Metadata } from "next";
import SettingsForm from "@/components/admin/forms/SettingsForm";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Content</p>
        <h1 className="mt-2 font-display text-5xl uppercase text-white">Site settings</h1>
        <p className="mt-2 text-sm text-zinc-500">Everything on the home page that isn&apos;t a project, service or testimonial.</p>
      </header>
      <SettingsForm settings={settings} />
    </div>
  );
}
