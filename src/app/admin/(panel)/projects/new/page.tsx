import type { Metadata } from "next";
import Link from "next/link";
import ProjectForm from "@/components/admin/forms/ProjectForm";

export const metadata: Metadata = { title: "New project" };

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <header>
        <Link href="/admin/projects" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-brand">
          ← Projects
        </Link>
        <h1 className="mt-3 font-display text-5xl uppercase text-white">New project</h1>
      </header>
      <ProjectForm />
    </div>
  );
}
