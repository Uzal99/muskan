import type { SiteSettings } from "@prisma/client";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "YouTube", href: settings.youtube },
    { label: "Vimeo", href: settings.vimeo },
    { label: "LinkedIn", href: settings.linkedin },
    { label: "X", href: settings.twitter },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-white/10">
      <div className="ruler opacity-60" />
      <div className="container-x flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <p className="font-display text-2xl uppercase text-white">
          {settings.siteName}
          <span className="text-brand">.</span>
        </p>

        {socials.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:text-brand"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
