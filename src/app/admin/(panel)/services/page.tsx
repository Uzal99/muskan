import type { Metadata } from "next";
import ServiceForm from "@/components/admin/forms/ServiceForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Content</p>
        <h1 className="mt-2 font-display text-5xl uppercase text-white">Services</h1>
        <p className="mt-2 text-sm text-zinc-500">The “What I do” cards on the home page.</p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase text-white">Add a service</h2>
        <ServiceForm />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase text-white">Existing ({services.length})</h2>
        {services.length === 0 ? (
          <p className="text-sm text-zinc-500">No services yet.</p>
        ) : (
          services.map((s) => <ServiceForm key={s.id} service={s} />)
        )}
      </section>
    </div>
  );
}
