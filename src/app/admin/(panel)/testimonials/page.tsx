import type { Metadata } from "next";
import TestimonialForm from "@/components/admin/forms/TestimonialForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Content</p>
        <h1 className="mt-2 font-display text-5xl uppercase text-white">Testimonials</h1>
        <p className="mt-2 text-sm text-zinc-500">The section hides itself automatically when there are none published.</p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase text-white">Add a testimonial</h2>
        <TestimonialForm />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase text-white">Existing ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">No testimonials yet.</p>
        ) : (
          items.map((t) => <TestimonialForm key={t.id} testimonial={t} />)
        )}
      </section>
    </div>
  );
}
