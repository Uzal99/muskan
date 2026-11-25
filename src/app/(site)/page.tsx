import About from "@/components/site/About";
import ContactSection from "@/components/site/ContactSection";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Services from "@/components/site/Services";
import Testimonials from "@/components/site/Testimonials";
import WorkSection from "@/components/site/WorkSection";
import { getPublishedProjects, getServices, getSettings, getTestimonials, toCard } from "@/lib/data";
import { parseVideoUrl } from "@/lib/video";

// Cached for 5 minutes; admin edits trigger an immediate revalidation.
export const revalidate = 300;

export default async function HomePage() {
  const [settings, projects, services, testimonials] = await Promise.all([
    getSettings(),
    getPublishedProjects(),
    getServices(),
    getTestimonials(),
  ]);

  const showreel = parseVideoUrl(settings.showreelUrl);
  const bg = parseVideoUrl(settings.heroVideoUrl);
  const bgVideo = bg?.provider === "file" ? bg.url : null;

  return (
    <>
      <Hero settings={settings} showreel={showreel} bgVideo={bgVideo} />
      <Marquee items={settings.tools} />
      <WorkSection projects={projects.map(toCard)} />
      <Services services={services} />
      <About settings={settings} />
      <Testimonials items={testimonials} />
      <ContactSection settings={settings} />
    </>
  );
}
