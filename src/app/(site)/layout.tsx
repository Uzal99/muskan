import type { Metadata } from "next";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import { getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seoTitle || `${s.siteName} — ${s.tagline}`;
  return {
    title: { default: title, template: `%s | ${s.siteName}` },
    description: s.seoDescription,
    openGraph: {
      title,
      description: s.seoDescription,
      type: "website",
      siteName: s.siteName,
      images: s.ogImage ? [{ url: s.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: s.seoDescription,
      images: s.ogImage ? [s.ogImage] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar siteName={settings.siteName} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
