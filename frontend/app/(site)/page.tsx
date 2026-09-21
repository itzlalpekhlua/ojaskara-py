import { apiGet } from "@/lib/api";
import type { MediaFeature, Project, SiteSettings, Testimonial } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { MediaCoverage } from "@/components/home/MediaCoverage";
import { WhyChooseOjaskaraa } from "@/components/home/WhyChooseOjaskaraa";
import { TestimonialsTeaser } from "@/components/home/TestimonialsTeaser";
import { FinalCta } from "@/components/home/FinalCta";

export default async function HomePage() {
  const [allProjects, settings, allTestimonials, allMediaFeatures] = await Promise.all([
    apiGet<Project[]>("/api/projects"),
    apiGet<SiteSettings>("/api/settings"),
    apiGet<Testimonial[]>("/api/testimonials"),
    apiGet<MediaFeature[]>("/api/media-features"),
  ]);

  const firstProject = allProjects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order)[0];

  const testimonials = allTestimonials
    .filter((t) => t.published && t.kind !== "photo")
    .sort((a, b) => a.order - b.order);

  const mediaFeatures = allMediaFeatures
    .filter((m) => m.published)
    .sort((a, b) => a.order - b.order);

  const heroImage = firstProject?.featuredImage ?? "";

  return (
    <>
      <Hero heroImage={heroImage} heroVideoUrl={settings?.heroVideoUrl} />
      <About
        title={settings?.introTitle}
        body={settings?.introBody}
        yearsInBusiness={13}
        projectsCompleted={200}
      />
      <WhyChooseUs />
      <MediaCoverage features={mediaFeatures} />
      <WhyChooseOjaskaraa />
      <TestimonialsTeaser testimonials={testimonials} />

      <FinalCta title={settings?.finalCtaTitle ?? null} body={settings?.finalCtaBody ?? null} phone={settings?.phone} />
    </>
  );
}
