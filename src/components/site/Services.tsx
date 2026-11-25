import type { Service } from "@prisma/client";
import { ServiceIcon } from "./Icons";

export default function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-16 border-t border-white/10 bg-ink-900 py-24 sm:py-32">
      <div className="container-x">
        <p className="eyebrow">What I do</p>
        <h2 className="section-title mt-3">
          Services<span className="text-brand">.</span>
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article key={s.id} className="group bg-ink-900 p-8 transition duration-300 hover:bg-ink-800">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </span>
                <span className="font-display text-3xl text-white/10">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 font-display text-3xl uppercase text-white">{s.title}</h3>
              {s.description && <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
