"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AutomationStream } from "@/components/automation/AutomationStream";
import { Magnetic } from "@/components/motion/Magnetic";
import { useDemo } from "@/components/demo/DemoProvider";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig, Service } from "@/lib/types";

type FormState = { name: string; company: string; email: string; phone: string; service: string; message: string };
type Errors = Partial<Record<keyof FormState, string>>;

const empty: FormState = { name: "", company: "", email: "", phone: "", service: "", message: "" };

export function EnquiryForm({ prospect }: { prospect: ProspectConfig }) {
  const [data, setData] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<"form" | "submitting" | "success">("form");
  const { runAutomation } = useDemo();
  const t = getTemplates(prospect);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const validate = (): Errors => {
    const next: Errors = {};
    if (!data.name.trim()) next.name = "Please enter your name";
    if (!data.email.trim()) next.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "That email doesn't look right";
    if (!data.phone.trim()) next.phone = "Please enter a phone number";
    if (!data.service) next.service = "Pick the product area";
    return next;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPhase("submitting");
    const service = prospect.services.find((s) => s.slug === data.service);
    const label = service ? service.name : data.service;
    setTimeout(() => {
      setPhase("success");
      runAutomation(label);
    }, 1400);
  };

  const inputCls = (hasError?: string) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 transition-colors focus:border-brand focus:outline-none ${
      hasError ? "border-red-400" : "border-line"
    }`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_90px_-40px_rgba(10,17,40,0.4)]">
      {phase === "success" && (
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-accent to-brand" aria-hidden />
      )}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={onSubmit}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-ink">
                    Name <span className="text-brand">*</span>
                  </label>
                  <input id="name" autoComplete="name" className={inputCls(errors.name)} placeholder="You" value={data.name} onChange={set("name")} />
                  {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-xs font-bold text-ink">
                    Company
                  </label>
                  <input id="company" autoComplete="organization" className={inputCls()} placeholder="Company name" value={data.company} onChange={set("company")} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-ink">
                    Email <span className="text-brand">*</span>
                  </label>
                  <input id="email" type="email" autoComplete="email" className={inputCls(errors.email)} placeholder="you@company.com" value={data.email} onChange={set("email")} />
                  {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-ink">
                    Phone <span className="text-brand">*</span>
                  </label>
                  <input id="phone" type="tel" autoComplete="tel" className={inputCls(errors.phone)} placeholder="+971 …" value={data.phone} onChange={set("phone")} />
                  {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="service" className="mb-1.5 block text-xs font-bold text-ink">
                    Product or service <span className="text-brand">*</span>
                  </label>
                  <select id="service" className={inputCls(errors.service)} value={data.service} onChange={set("service")}>
                    <option value="" disabled>
                      Select your area of interest
                    </option>
                    {prospect.services.map((s: Service) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.service && <p className="mt-1 text-xs font-medium text-red-500">{errors.service}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-1.5 block text-xs font-bold text-ink">
                    Message
                  </label>
                  <textarea id="message" rows={3} className={`${inputCls()} resize-none`} placeholder="Cooling load, application, required capacity, target delivery…" value={data.message} onChange={set("message")} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-[11px] leading-relaxed text-ink-muted">
                  Demo only — nothing you enter is sent or stored.
                </p>
                <Magnetic strength={0.25}>
                  <button
                    type="submit"
                    className="shine inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white shadow-xl shadow-ink/20 transition-colors hover:bg-brand disabled:opacity-70"
                    data-cursor="Send"
                  >
                    Submit enquiry <ArrowRight className="h-4 w-4" />
                  </button>
                </Magnetic>
              </div>
            </motion.form>
          )}

          {phase === "submitting" && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3 py-16 text-sm font-semibold text-ink-muted"
            >
              <Loader2 className="h-5 w-5 animate-spin text-brand" />
              Routing your enquiry…
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-ink">
                    Thanks — we&apos;ve received your enquiry.
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    Watch what happens next for {prospect.displayName}…
                  </p>
                </div>
              </div>
              <AutomationStream labels={prospect.automation} note={data.service ? prospect.services.find((s) => s.slug === data.service)?.name : undefined} className="mt-7" />
              <p className="mt-6 rounded-lg bg-brand-tint px-4 py-3 text-xs leading-relaxed text-brand-strong">
                {t.formNote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}