import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [projects, published, services, testimonials, unread, recent] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.service.count(),
    prisma.testimonial.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Projects", value: projects, sub: `${published} published`, href: "/admin/projects" },
    { label: "Services", value: services, sub: "on the site", href: "/admin/services" },
    { label: "Testimonials", value: testimonials, sub: "total", href: "/admin/testimonials" },
    { label: "Unread messages", value: unread, sub: "from the contact form", href: "/admin/messages" },
  ];

  const quick = [
    { href: "/admin/projects/new", label: "Add a project" },
    { href: "/admin/settings", label: "Edit hero & about text" },
    { href: "/admin/services", label: "Edit services" },
    { href: "/admin/testimonials", label: "Add a testimonial" },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Overview</p>
        <h1 className="mt-2 font-display text-5xl uppercase text-white">Dashboard</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition hover:border-brand/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{s.label}</p>
            <p className="mt-2 font-display text-5xl text-white">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{s.sub}</p>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="font-display text-2xl uppercase text-white">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quick.map((q) => (
            <Link key={q.href} href={q.href} className="btn-ghost btn-sm">
              {q.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase text-white">Latest messages</h2>
          <Link href="/admin/messages" className="text-xs font-semibold uppercase tracking-wider text-brand hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No messages yet. They&apos;ll show up here when someone uses the contact form.</p>
        ) : (
          <ul className="card mt-4 divide-y divide-white/10">
            {recent.map((m) => (
              <li key={m.id} className="flex items-start gap-3 p-4">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-zinc-700" : "bg-brand"}`}
                  aria-label={m.read ? "Read" : "Unread"}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {m.name} <span className="font-normal text-zinc-500">· {m.email}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-zinc-400">{m.subject || m.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
