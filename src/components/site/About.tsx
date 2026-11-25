import type { SiteSettings } from "@prisma/client";

export default function About({ settings }: { settings: SiteSettings }) {
  const stats = [
    { value: settings.yearsExperience, label: "Years experience" },
    { value: settings.projectsDelivered, label: "Projects delivered" },
    { value: settings.happyClients, label: "Happy clients" },
  ];

  return (
    <section id="about" className="scroll-mt-16 py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <div className="absolute -bottom-4 -right-4 h-full w-full rounded-xl border-2 border-brand" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-800">
            {settings.aboutImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.aboutImage} alt={settings.siteName} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,46,0.3),transparent_60%),#0d0d0d]">
                <span className="font-display text-7xl uppercase text-white/15">{settings.siteName.slice(0, 2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow">About me</p>
          <h2 className="section-title mt-3">{settings.aboutTitle}</h2>
          <div className="mt-8 space-y-4 whitespace-pre-line text-base leading-relaxed text-zinc-400">
            {settings.aboutBody}
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-white/10 py-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-5xl text-white sm:text-6xl">
                  {s.value}
                  <span className="text-brand">+</span>
                </dd>
                <dt className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</dt>
              </div>
            ))}
          </dl>

          {settings.tools.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {settings.tools.map((t) => (
                <li key={t} className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-zinc-300">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
