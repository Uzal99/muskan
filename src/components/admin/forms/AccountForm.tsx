"use client";

import { useActionState } from "react";
import { updateAccount } from "@/actions/auth";
import { initialState } from "@/lib/types";
import { Field, Notice, SubmitButton } from "../ui";

export default function AccountForm({ email }: { email: string }) {
  const [state, formAction] = useActionState(updateAccount, initialState);

  return (
    <form action={formAction} className="card max-w-xl space-y-5 p-6">
      <Field label="Login email">
        <input name="email" type="email" required defaultValue={email} autoComplete="username" className="input" />
      </Field>
      <Field label="New password" hint="Leave blank to keep your current password. Minimum 10 characters.">
        <input name="newPassword" type="password" minLength={10} autoComplete="new-password" className="input" />
      </Field>
      <Field label="Current password" hint="Required to confirm any change.">
        <input name="currentPassword" type="password" required autoComplete="current-password" className="input" />
      </Field>
      <Notice state={state} />
      <SubmitButton>Update account</SubmitButton>
    </form>
  );
}
