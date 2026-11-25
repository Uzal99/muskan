import type { Metadata } from "next";
import AccountForm from "@/components/admin/forms/AccountForm";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await requireAdmin();
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Security</p>
        <h1 className="mt-2 font-display text-5xl uppercase text-white">Account</h1>
        <p className="mt-2 text-sm text-zinc-500">Change your login email or password.</p>
      </header>
      <AccountForm email={session.email} />
    </div>
  );
}
