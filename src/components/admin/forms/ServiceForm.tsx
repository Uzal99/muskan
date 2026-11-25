"use client";

import type { Service } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
import { deleteService, saveService } from "@/actions/services";
import { SERVICE_ICONS } from "@/lib/constants";
import { initialState } from "@/lib/types";
import DeleteButton from "../DeleteButton";
import { Field, Notice, SubmitButton } from "../ui";

export default function ServiceForm({ service }: { service?: Service }) {
  const [state, formAction] = useActionState(saveService, initialState);
  const [resetKey, setResetKey] = useState(0);

  // After adding a new service, clear the form for the next one.
  useEffect(() => {
    if (state.ok && !service) setResetKey((k) => k + 1);
  }, [state, service]);

  return (
    <div className="card p-5">
      <form key={resetKey} action={formAction} className="space-y-4">
        {service && <input type="hidden" name="id" value={service.id} />}
        <div className="grid gap-4 md:grid-cols-[1fr_10rem_6rem]">
          <Field label="Title *">
            <input name="title" required maxLength={80} defaultValue={service?.title} className="input" />
          </Field>
          <Field label="Icon">
            <select name="icon" defaultValue={service?.icon ?? "film"} className="input">
              {SERVICE_ICONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Order">
            <input name="sortOrder" type="number" defaultValue={service?.sortOrder ?? 0} className="input" />
          </Field>
        </div>
        <Field label="Description">
          <textarea name="description" rows={2} maxLength={500} defaultValue={service?.description} className="input resize-y" />
        </Field>
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton>{service ? "Save" : "Add service"}</SubmitButton>
          <div className="min-w-0 flex-1">
            <Notice state={state} />
          </div>
        </div>
      </form>

      {service && (
        <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
          <DeleteButton action={deleteService} id={service.id} confirmText={`Delete the service "${service.title}"?`} />
        </div>
      )}
    </div>
  );
}
