"use client";

import { useState } from "react";
import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";

const inputClass =
  "w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-muted)]/60 focus:border-[var(--brand)]";

export function Contact({ config }: { config: DemoConfig }) {
  const { content } = config;
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-28">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--ink-muted)]">
              <span className="inline-block h-[1px] w-8 bg-[var(--accent)]" aria-hidden />
              Enquiries
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h2
              className="mt-5 text-[clamp(2.2rem,4.6vw,4rem)] leading-[0.98] tracking-[-0.04em]"
              style={{ fontFamily: "var(--demo-display)" }}
            >
              Tell us what you need.
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--ink-muted)]">
              Share the requirement and the {content.shortName} team can respond with the right next
              step. No obligation.
            </p>
          </Reveal>

          <Reveal delay={190}>
            <dl className="mt-10 space-y-5 border-t border-[var(--line)] pt-7">
              {content.contact.phone ? (
                <div>
                  <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Phone
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${content.contact.phone.replace(/[^+\d]/g, "")}`}
                      className="link-underline text-base font-medium tabular-nums"
                    >
                      {content.contact.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {content.contact.email ? (
                <div>
                  <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${content.contact.email}`}
                      className="link-underline break-all text-base font-medium"
                    >
                      {content.contact.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {content.contact.address ? (
                <div>
                  <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Address
                  </dt>
                  <dd className="mt-1 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
                    {content.contact.address}
                  </dd>
                </div>
              ) : null}
              {!content.contact.phone && !content.contact.email && !content.contact.address ? (
                <p className="text-[13px] leading-relaxed text-[var(--ink-muted)]">
                  Public contact details are being confirmed. Use the form to register interest.
                </p>
              ) : null}
            </dl>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-8 max-w-md text-[10px] leading-relaxed text-[var(--ink-muted)]">
              {content.note}
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div
            className="border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8"
            style={{ borderRadius: "var(--radius)" }}
          >
            {sent ? (
              <div className="flex min-h-[420px] flex-col items-start justify-center">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: "var(--brand-tint)", color: "var(--brand-strong)" }}
                  aria-hidden
                >
                  ✓
                </span>
                <h3
                  className="mt-6 text-3xl tracking-[-0.03em]"
                  style={{ fontFamily: "var(--demo-display)" }}
                >
                  Enquiry captured.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
                  This is a demonstration form. Your details were not sent anywhere and no live inbox
                  was contacted.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-7 inline-flex items-center gap-2 rounded-[var(--radius)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0d0d0d]"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Back to form
                </button>
              </div>
            ) : (
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                      Name
                    </span>
                    <input required name="name" autoComplete="name" className={inputClass} placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                      Phone
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                      Interested in
                    </span>
                    <select name="service" className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Select a service
                      </option>
                      {content.services.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                      <option value="General enquiry">General enquiry</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    Requirement
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us a little about what you need."
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-3 rounded-[var(--radius)] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0d0d0d] transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {content.hero.primaryCta}
                  <span aria-hidden>↗</span>
                </button>
                <p className="text-center text-[9px] leading-relaxed text-[var(--ink-muted)]">
                  Demo form. Submissions are not delivered to the company.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
