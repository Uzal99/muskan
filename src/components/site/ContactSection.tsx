import type { SiteSettings } from "@prisma/client";
import ContactForm from "./ContactForm";

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const details = [
    settings.email && { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, "")}` },
    settings.location && { label: "Based in", value: settings.location, href: null },
  ].filter(Boolean) as { label: string; value: string; href: string | null }[];

  return (
    <section id="contact" className="scroll-mt-16 py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h2 className="section-title mt-3">{settings.contactTitle}</h2>
          {settings.contactSubtitle && (
            <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">{settings.contactSubtitle}</p>
          )}

          {details.length > 0 && (
            <dl className="mt-10 space-y-5">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">{d.label}</dt>
                  <dd className="mt-1 text-lg text-white">
                    {d.href ? (
                      <a href={d.href} className="transition hover:text-brand">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
