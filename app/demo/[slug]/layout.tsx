import { notFound } from "next/navigation";
import { getProspect, getTemplates } from "@/lib/prospect";
import { DemoProvider } from "@/components/demo/DemoProvider";
import { FxStage } from "@/components/fx/FxStage";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/chatbot/Chatbot";

export default async function ProspectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect) notFound();
  const t = getTemplates(prospect);

  return (
    <div
      style={
        {
          "--brand": prospect.branding.primaryColor,
          "--brand-strong": prospect.branding.secondaryColor,
          "--accent": prospect.branding.accentColor || "#0ea5e9",
          "--brand-tint": prospect.branding.tintColor || "#eaf2ff",
        } as React.CSSProperties
      }
    >
      <DemoProvider automation={prospect.automation}>
        <FxStage brandLine={t.brand.line1} brandLine2={t.brand.line2}>
          <Navbar prospect={prospect} />
          <main>{children}</main>
          <Footer prospect={prospect} />
          <Chatbot prospect={prospect} />
        </FxStage>
      </DemoProvider>
    </div>
  );
}