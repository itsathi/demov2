"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProspectConfig, PropertyListing } from "@/lib/types";

const EASE = [0.65, 0, 0.35, 1] as const;

type Step = { id: string; label: string };

export function EnquiryPanel({
  prospect,
  presetListing,
  presetIntent,
  variant = "section",
  onDone,
}: {
  prospect: ProspectConfig;
  presetListing?: PropertyListing;
  presetIntent?: string;
  variant?: "section" | "embedded";
  onDone?: () => void;
}) {
  const actions = useMemo<{ id: string; label: string; reply: string }[]>(() => {
    const raw = (prospect.voice?.assistant?.actions ?? []) as (
      | { id?: string; label?: string; reply?: string }
      | undefined
    )[];
    return raw
      .filter((a): a is { id: string; label: string; reply?: string } => !!a?.id && !!a?.label)
      .map((a) => ({ id: a.id, label: a.label, reply: a.reply ?? "" }));
  }, [prospect.voice?.assistant?.actions]);
  const propertyTypes = useMemo(() => {
    const set = new Set<string>();
    for (const l of prospect.listings ?? []) if (l.propertyType) set.add(l.propertyType);
    return Array.from(set);
  }, [prospect.listings]);

  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<string | null>(presetIntent ?? null);
  const [brief, setBrief] = useState({
    location: presetListing?.location ?? "",
    propertyType: presetListing?.propertyType ?? "",
    budget: presetListing?.priceLabel ?? "",
    message: presetListing ? `I'd like to arrange a viewing of "${presetListing.title}".` : "",
  });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const steps: Step[] = [
    { id: "intent", label: "What you need" },
    { id: "brief", label: "Your brief" },
    { id: "contact", label: "Contact" },
  ];

  const chosen = actions.find((a) => a.id === intent);
  const canAdvance =
    (step === 0 && !!intent) ||
    (step === 1 && brief.message.trim().length > 3) ||
    (step === 2 && contact.name.trim() && contact.email.trim());

  const submit = () => setSubmitted(true);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-card",
        variant === "section" && "shadow-[0_30px_80px_-50px_rgba(10,17,40,0.5)]"
      )}
    >
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]"
          >
            {/* Left rail — context */}
            <div className="relative hidden flex-col justify-between bg-ink p-8 text-white lg:flex">
              <div className="technical-grid-dark absolute inset-0 opacity-25" aria-hidden />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/50">
                  {prospect.voice?.nav?.quoteLabel ?? "Enquire"}
                </p>
                <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight">
                  {chosen ? chosen.label : "Tell us what you're looking for."}
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                  {chosen
                    ? chosen.reply
                    : "Buying, renting, selling or investing — a few details are all it takes to get a qualified response from the team."}
                </p>
              </div>
              <ol className="relative mt-10 space-y-4">
                {steps.map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3 text-sm">
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[12px] font-bold",
                        i < step && "border-transparent bg-white text-ink",
                        i === step && "border-white/70 text-white",
                        i > step && "border-white/25 text-white/40"
                      )}
                    >
                      {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={cn(i === step ? "text-white" : "text-white/50")}>{s.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right rail — the step */}
            <div className="p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between lg:hidden">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                  Step {step + 1} / {steps.length}
                </span>
                <span className="text-xs font-semibold text-ink-muted">{steps[step].label}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {step === 0 && (
                    <fieldset>
                      <legend className="sr-only">What are you looking to do?</legend>
                      <div className="grid gap-3">
                        {(actions.length
                          ? actions.map((a) => ({ id: a.id, label: a.label }))
                          : (prospect.propertyCategories ?? ["Buy", "Rent", "Sell"]).map((c, i) => ({
                              id: `cat-${i}`,
                              label: c,
                            }))
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setIntent(opt.id)}
                            className={cn(
                              "flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors",
                              intent === opt.id
                                ? "border-ink bg-ink text-white"
                                : "border-line bg-paper/40 text-ink hover:border-ink/40"
                            )}
                          >
                            {opt.label}
                            <span
                              className={cn(
                                "grid h-5 w-5 place-items-center rounded-full border",
                                intent === opt.id ? "border-white bg-white text-ink" : "border-ink/25"
                              )}
                            >
                              {intent === opt.id && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {step === 1 && (
                    <div className="grid gap-4">
                      <Field label="Preferred area or community">
                        <input
                          value={brief.location}
                          onChange={(e) => setBrief((b) => ({ ...b, location: e.target.value }))}
                          placeholder="e.g. Dubai Marina, Palm Jumeirah…"
                          className={inputClass}
                        />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Property type">
                          <select
                            value={brief.propertyType}
                            onChange={(e) => setBrief((b) => ({ ...b, propertyType: e.target.value }))}
                            className={inputClass}
                          >
                            <option value="">Any</option>
                            {propertyTypes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Budget">
                          <input
                            value={brief.budget}
                            onChange={(e) => setBrief((b) => ({ ...b, budget: e.target.value }))}
                            placeholder="e.g. AED 2–4M"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                      <Field label="Anything else?">
                        <textarea
                          value={brief.message}
                          onChange={(e) => setBrief((b) => ({ ...b, message: e.target.value }))}
                          rows={4}
                          placeholder="Bedrooms, views, timeline, must-haves…"
                          className={cn(inputClass, "resize-none")}
                        />
                      </Field>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid gap-4">
                      <Field label="Your name">
                        <input
                          value={contact.name}
                          onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                          className={inputClass}
                        />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Email">
                          <input
                            type="email"
                            value={contact.email}
                            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Phone / WhatsApp">
                          <input
                            value={contact.phone}
                            onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                            className={inputClass}
                          />
                        </Field>
                      </div>
                      <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                        {prospect.voice?.formNote ??
                          "This is a concept demonstration — your details are not stored or sent anywhere."}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <span />
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={() => setStep((s) => s + 1)}
                    className="shine inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={submit}
                    className="shine inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send enquiry <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="p-6 sm:p-10"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white">
                <Check className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-ink">
                  {prospect.voice?.assistant?.leadTitle ?? "Enquiry captured"}
                </h3>
                <p className="text-sm text-ink-muted">
                  {contact.name ? `Thanks, ${contact.name.split(" ")[0]}. ` : ""}
                  {prospect.voice?.assistant?.followUp ?? "The team will be in touch shortly."}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-line bg-paper/50 p-5">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                <Sparkles className="h-3.5 w-3.5" /> What happens next
              </p>
              <ol className="mt-4 space-y-3">
                {prospect.automation.map((stepLabel, i) => (
                  <motion.li
                    key={stepLabel}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: EASE }}
                    className="flex items-center gap-3 text-sm text-ink"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink/5 text-[11px] font-bold text-ink">
                      {i + 1}
                    </span>
                    {stepLabel}
                  </motion.li>
                ))}
              </ol>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                onDone?.();
              }}
              className="mt-6 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              Start another enquiry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
