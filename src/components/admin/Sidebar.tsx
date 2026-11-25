"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

const items = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/messages", label: "Messages", badge: true },
  { href: "/admin/account", label: "Account" },
];

export default function Sidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-white/10 bg-ink-900 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
        <Link href="/admin" className="font-display text-2xl uppercase text-white">
          Admin<span className="text-brand">.</span>
        </Link>
        <p className="hidden truncate text-xs text-zinc-500 md:mt-1 md:block">{email}</p>
        <form action={logout} className="md:hidden">
          <button type="submit" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-brand">
            Sign out
          </button>
        </form>
      </div>

      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-brand text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
              {item.badge && unread > 0 && (
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden space-y-2 p-3 md:absolute md:inset-x-0 md:bottom-0 md:block">
        <Link
          href="/"
          target="_blank"
          className="block rounded-lg border border-white/10 px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-300 transition hover:border-brand hover:text-brand"
        >
          View live site ↗
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
