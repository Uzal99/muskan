import type { Testimonial } from "@prisma/client";
import { initials } from "@/lib/utils";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-ink-900 py-24 sm:py-32">
      <div className="container-x">
        <p className="eyebrow">Kind words</p>
        <h2 className="section-title mt-3">
          Clients <span className="text-brand">say</span>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="card flex flex-col p-8">
              <span className="font-display text-7xl leading-none text-brand" aria-hidden="true">
                “
              </span>
              <blockquote className="-mt-2 flex-1 text-base leading-relaxed text-zinc-300">{t.quote}</blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt="" loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                    {initials(t.name)}
                  </span>
                )}
                <span>
                  <span className="block text-sm font-semibold text-white">{t.name}</span>
                  {t.role && <span className="block text-xs text-zinc-500">{t.role}</span>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
