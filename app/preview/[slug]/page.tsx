import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDemo } from "@/lib/engine/registry";
import { DemoPage } from "@/components/engine/DemoPage";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo || !demo.company.eligibility.eligible) return { title: "Demo not found" };

  const { content, company } = demo;
  return {
    title: `${content.brandName} — Concept Website`,
    description: content.hero.subline,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${content.brandName} — Concept Website`,
      description: content.hero.subline,
      images: content.hero.image ? [{ url: content.hero.image }] : undefined,
    },
    other: {
      "demo-id": company.identity.demoId,
      "demo-batch": company.identity.batchId,
      "demo-template": `${company.templateId}@${company.templateVersion}`,
    },
  };
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo || !demo.company.eligibility.eligible) notFound();

  return <DemoPage config={demo} />;
}
