"use client";

import type { Project } from "@prisma/client";
import { useActionState } from "react";
import { saveProject } from "@/actions/projects";
import { initialState } from "@/lib/types";
import ImageUpload from "../ImageUpload";
import { Checkbox, Field, Notice, Section, SubmitButton } from "../ui";

export default function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction] = useActionState(saveProject, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}

      <Section title="Details">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title *">
            <input name="title" required maxLength={120} defaultValue={project?.title} className="input" />
          </Field>
          <Field label="URL slug" hint="Leave blank to generate from the title. Appears as /work/your-slug.">
            <input name="slug" maxLength={120} defaultValue={project?.slug} className="input" />
          </Field>
          <Field label="Category" hint="Used for the filter buttons, e.g. Commercial, Music Video, Documentary.">
            <input name="category" maxLength={40} defaultValue={project?.category} className="input" />
          </Field>
          <Field label="Client">
            <input name="client" maxLength={80} defaultValue={project?.client ?? ""} className="input" />
          </Field>
          <Field label="Year">
            <input name="year" type="number" min={1990} max={2100} defaultValue={project?.year ?? ""} className="input" />
          </Field>
          <Field label="Display order" hint="Lower numbers appear first.">
            <input name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} className="input" />
          </Field>
        </div>
        <Field label="Short summary" hint="One line shown on the project card (200 characters max).">
          <input name="summary" maxLength={200} defaultValue={project?.summary} className="input" />
        </Field>
        <Field label="Full description" hint="Shown on the project page. Blank lines become paragraph breaks.">
          <textarea name="description" rows={7} maxLength={8000} defaultValue={project?.description} className="input resize-y" />
        </Field>
      </Section>

      <Section title="Media">
        <Field label="Video link" hint="YouTube, Vimeo, Instagram, TikTok, Facebook, X, or direct .mp4/.webm links embed here. Other HTTPS links open on their platform. YouTube links also provide the thumbnail automatically.">
          <input name="videoUrl" type="url" defaultValue={project?.videoUrl ?? ""} placeholder="https://youtu.be/…" className="input" />
        </Field>
        <ImageUpload
          name="thumbnail"
          label="Thumbnail"
          defaultValue={project?.thumbnail}
          hint="16:9 works best. Required for Vimeo / .mp4 videos; optional for YouTube."
        />
      </Section>

      <Section title="Visibility">
        <div className="flex flex-wrap gap-8">
          <Checkbox name="published" label="Published (visible on the site)" defaultChecked={project?.published ?? true} />
          <Checkbox name="featured" label="Featured badge" defaultChecked={project?.featured ?? false} />
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton>{project ? "Save project" : "Create project"}</SubmitButton>
        <div className="min-w-0 flex-1">
          <Notice state={state} />
        </div>
      </div>
    </form>
  );
}
