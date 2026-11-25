"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage } from "@/actions/contact";
import { initialState } from "@/lib/types";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(sendMessage, initialState);

  if (state.ok) {
    return (
      <div role="status" className="card p-10 text-center">
        <p className="font-display text-4xl uppercase text-white">Message sent</p>
        <p className="mt-3 text-sm text-zinc-400">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card space-y-5 p-6 sm:p-8">
      {/* Honeypot — hidden from people, tempting for bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" className="input" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className="input"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="label">Subject (optional)</span>
        <input name="subject" maxLength={150} className="input" placeholder="Music video, brand film, YouTube channel…" />
      </label>
      <label className="block">
        <span className="label">Project details</span>
        <textarea
          name="body"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="input resize-y"
          placeholder="What are you making, when is it due, and what's the budget?"
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}
