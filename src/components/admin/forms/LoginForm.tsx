"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { initialState } from "@/lib/types";
import { Field, Notice, SubmitButton } from "../ui";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Email">
        <input name="email" type="email" required autoComplete="username" autoFocus className="input" />
      </Field>
      <Field label="Password">
        <input name="password" type="password" required autoComplete="current-password" className="input" />
      </Field>
      <Notice state={state} />
      <SubmitButton pendingText="Signing in…" className="btn-primary w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
