"use client";

import type { Testimonial } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
import { deleteTestimonial, saveTestimonial } from "@/actions/testimonials";
import { initialState } from "@/lib/types";
import DeleteButton from "../DeleteButton";
import ImageUpload from "../ImageUpload";
import { Checkbox, Field, Notice, SubmitButton } from "../ui";

export default function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const [state, formAction] = useActionState(saveTestimonial, initialState);
  const [resetKey, setResetKey] = useState(0);

  // After adding a new testimonial, remount the form (also clears the avatar uploader).
  useEffect(() => {
    if (state.ok && !testimonial) setResetKey((k) => k + 1);
  }, [state, testimonial]);

  return (
    <div className="card p-5">
      <form key={resetKey} action={formAction} className="space-y-4">
        {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_6rem]">
          <Field label="Name *">
            <input name="name" required maxLength={80} defaultValue={testimonial?.name} className="input" />
          </Field>
          <Field label="Role / company">
            <input name="role" maxLength={120} defaultValue={testimonial?.role ?? ""} className="input" />
          </Field>
          <Field label="Order">
            <input name="sortOrder" type="number" defaultValue={testimonial?.sortOrder ?? 0} className="input" />
          </Field>
        </div>
        <Field label="Quote *">
          <textarea name="quote" required rows={3} maxLength={600} defaultValue={testimonial?.quote} className="input resize-y" />
        </Field>
        <ImageUpload name="avatar" label="Photo (optional)" defaultValue={testimonial?.avatar} shape="square" />
        <Checkbox name="published" label="Published" defaultChecked={testimonial?.published ?? true} />
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton>{testimonial ? "Save" : "Add testimonial"}</SubmitButton>
          <div className="min-w-0 flex-1">
            <Notice state={state} />
          </div>
        </div>
      </form>

      {testimonial && (
        <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
          <DeleteButton
            action={deleteTestimonial}
            id={testimonial.id}
            confirmText={`Delete the testimonial from "${testimonial.name}"?`}
          />
        </div>
      )}
    </div>
  );
}
