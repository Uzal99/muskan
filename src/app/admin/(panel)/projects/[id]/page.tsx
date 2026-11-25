import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/forms/ProjectForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="space-y-8">
      <header>
        <Link href="/admin/projects" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-brand">
          ← Projects
        </Link>
        <h1 className="mt-3 font-display text-5xl uppercase text-white">Edit project</h1>
      </header>
      <ProjectForm project={project} />
    </div>
  );
}
