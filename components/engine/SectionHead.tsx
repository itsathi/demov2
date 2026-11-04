import { Reveal } from "./Reveal";

export function SectionHead({
  eyebrow,
  title,
  body,
  align = "left",
  light,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Reveal>
        <p
          className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] ${
            light ? "text-white/55" : "text-[var(--ink-muted)]"
          } ${align === "center" ? "justify-center" : ""}`}
        >
          <span className="inline-block h-[1px] w-8 bg-[var(--accent)]" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={70}>
        <h2
          className={`mt-5 text-[clamp(2rem,4.2vw,3.8rem)] leading-[0.98] tracking-[-0.035em] ${
            light ? "text-white" : "text-[var(--ink)]"
          }`}
          style={{ fontFamily: "var(--demo-display)" }}
        >
          {title}
        </h2>
      </Reveal>
      {body ? (
        <Reveal delay={130}>
          <p
            className={`mt-5 max-w-2xl text-[15px] leading-relaxed ${
              light ? "text-white/65" : "text-[var(--ink-muted)]"
            } ${align === "center" ? "mx-auto" : ""}`}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
