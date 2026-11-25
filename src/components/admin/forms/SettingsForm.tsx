"use client";

import type { SiteSettings } from "@prisma/client";
import { useActionState } from "react";
import { saveSettings } from "@/actions/settings";
import { initialState } from "@/lib/types";
import ImageUpload from "../ImageUpload";
import { Field, Notice, Section, SubmitButton } from "../ui";

export default function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(saveSettings, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <Section title="Brand" description="Shown in the navigation bar, footer and browser tab.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Your name / brand *">
            <input name="siteName" required maxLength={60} defaultValue={s.siteName} className="input" />
          </Field>
          <Field label="Tagline" hint="e.g. Video Editor & Colorist">
            <input name="tagline" maxLength={120} defaultValue={s.tagline} className="input" />
          </Field>
        </div>
      </Section>

      <Section title="Hero" description="The first screen visitors see.">
        <Field label="Status badge" hint="Small pill above the title. Leave empty to hide it.">
          <input name="heroEyebrow" maxLength={80} defaultValue={s.heroEyebrow} className="input" />
        </Field>
        <Field label="Headline *" hint="Wrap words in *stars* to make them red — e.g. I cut stories that *hit.*">
          <input name="heroTitle" required maxLength={120} defaultValue={s.heroTitle} className="input" />
        </Field>
        <Field label="Sub-headline">
          <textarea name="heroSubtitle" rows={3} maxLength={400} defaultValue={s.heroSubtitle} className="input resize-y" />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Showreel link" hint="YouTube, Vimeo or direct .mp4 link. Adds a “Watch showreel” button.">
            <input name="showreelUrl" type="url" defaultValue={s.showreelUrl ?? ""} placeholder="https://youtu.be/…" className="input" />
          </Field>
          <Field label="Background loop (optional)" hint="Direct .mp4/.webm link, muted and looping behind the headline.">
            <input name="heroVideoUrl" type="url" defaultValue={s.heroVideoUrl ?? ""} placeholder="https://…/loop.mp4" className="input" />
          </Field>
        </div>
      </Section>

      <Section title="About" description="Your story, photo, stats and software.">
        <Field label="Section title">
          <input name="aboutTitle" maxLength={120} defaultValue={s.aboutTitle} className="input" />
        </Field>
        <Field label="Bio" hint="Blank lines become paragraph breaks.">
          <textarea name="aboutBody" rows={8} maxLength={5000} defaultValue={s.aboutBody} className="input resize-y" />
        </Field>
        <ImageUpload name="aboutImage" label="Portrait photo" defaultValue={s.aboutImage} shape="tall" hint="Portrait orientation (4:5) looks best." />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Years experience">
            <input name="yearsExperience" type="number" min={0} max={100000} defaultValue={s.yearsExperience} className="input" />
          </Field>
          <Field label="Projects delivered">
            <input name="projectsDelivered" type="number" min={0} max={100000} defaultValue={s.projectsDelivered} className="input" />
          </Field>
          <Field label="Happy clients">
            <input name="happyClients" type="number" min={0} max={100000} defaultValue={s.happyClients} className="input" />
          </Field>
        </div>
        <Field label="Software & tools" hint="Comma or line separated. Also scrolls in the red banner under the hero.">
          <textarea name="tools" rows={3} defaultValue={s.tools.join(", ")} className="input resize-y" />
        </Field>
      </Section>

      <Section title="Contact" description="Shown next to the contact form. Form submissions arrive in the Messages tab.">
        <Field label="Section title">
          <input name="contactTitle" maxLength={120} defaultValue={s.contactTitle} className="input" />
        </Field>
        <Field label="Intro text">
          <textarea name="contactSubtitle" rows={3} maxLength={400} defaultValue={s.contactSubtitle} className="input resize-y" />
        </Field>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Public email">
            <input name="email" type="email" defaultValue={s.email ?? ""} className="input" />
          </Field>
          <Field label="Phone">
            <input name="phone" maxLength={40} defaultValue={s.phone ?? ""} className="input" />
          </Field>
          <Field label="Location">
            <input name="location" maxLength={80} defaultValue={s.location ?? ""} className="input" />
          </Field>
        </div>
      </Section>

      <Section title="Social links" description="Only links you fill in appear in the footer.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Instagram">
            <input name="instagram" type="url" defaultValue={s.instagram ?? ""} placeholder="https://instagram.com/…" className="input" />
          </Field>
          <Field label="YouTube">
            <input name="youtube" type="url" defaultValue={s.youtube ?? ""} placeholder="https://youtube.com/@…" className="input" />
          </Field>
          <Field label="Vimeo">
            <input name="vimeo" type="url" defaultValue={s.vimeo ?? ""} placeholder="https://vimeo.com/…" className="input" />
          </Field>
          <Field label="LinkedIn">
            <input name="linkedin" type="url" defaultValue={s.linkedin ?? ""} placeholder="https://linkedin.com/in/…" className="input" />
          </Field>
          <Field label="X / Twitter">
            <input name="twitter" type="url" defaultValue={s.twitter ?? ""} placeholder="https://x.com/…" className="input" />
          </Field>
        </div>
      </Section>

      <Section title="SEO & sharing" description="How the site appears in Google and when shared on social media.">
        <Field label="Page title" hint="Up to 70 characters.">
          <input name="seoTitle" maxLength={70} defaultValue={s.seoTitle} className="input" />
        </Field>
        <Field label="Description" hint="Up to 200 characters.">
          <textarea name="seoDescription" rows={2} maxLength={200} defaultValue={s.seoDescription} className="input resize-y" />
        </Field>
        <ImageUpload name="ogImage" label="Social share image" defaultValue={s.ogImage} hint="1200×630 works best." />
      </Section>

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-4 border-t border-white/10 bg-ink-950/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <SubmitButton>Save all settings</SubmitButton>
        <div className="min-w-0 flex-1">
          <Notice state={state} />
        </div>
      </div>
    </form>
  );
}
