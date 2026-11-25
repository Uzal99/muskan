import type { Metadata } from "next";
import LoginForm from "@/components/admin/forms/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_50%_0%,rgba(225,29,46,0.18),transparent_60%)] px-5">
      <div className="card w-full max-w-sm p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-5xl uppercase text-white">
          Sign in<span className="text-brand">.</span>
        </h1>
        <p className="mb-8 mt-2 text-sm text-zinc-500">Manage your portfolio content.</p>
        <LoginForm />
      </div>
    </main>
  );
}
