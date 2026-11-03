"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Shield, ArrowRight, ArrowLeft, Building2, TrendingUp, Sparkles } from "lucide-react";
import type { ProspectConfig } from "@/lib/types";

const EASE = [0.65, 0, 0.35, 1] as const;

export function SellerValuationModal({
  isOpen,
  onClose,
  prospect,
}: {
  isOpen: boolean;
  onClose: () => void;
  prospect: ProspectConfig;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Villa");
  const [estimatedSqft, setEstimatedSqft] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [expectedValue, setExpectedValue] = useState("");
  const [timeframe, setTimeframe] = useState("1-3 months");
  const [representationType, setRepresentationType] = useState("off-market");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredMethod, setPreferredMethod] = useState("call");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const canAdvanceStep1 = location.trim().length > 2;
  const canAdvanceStep2 = name.trim().length > 1 && email.trim().length > 3;

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setStep(1);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#111110]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#141413] text-[#F7F4EE] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Discuss Selling Your Property"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#B7A17A]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B7A17A]">
                Private Seller Representation · {prospect.displayName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            {!isSubmitted ? (
              <div>
                {/* Stepper */}
                <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
                  {[
                    { num: 1, label: "Your Property" },
                    { num: 2, label: "Owner Contact" },
                    { num: 3, label: "Valuation Guidance" },
                  ].map((s) => (
                    <div
                      key={s.num}
                      className={`flex items-center gap-2 text-xs font-semibold ${
                        step === s.num
                          ? "text-[#B7A17A]"
                          : step > s.num
                          ? "text-white"
                          : "text-white/35"
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                          step === s.num
                            ? "border border-[#B7A17A] bg-[#B7A17A]/15 text-[#B7A17A]"
                            : step > s.num
                            ? "bg-white text-[#111110]"
                            : "border border-white/15 text-white/35"
                        }`}
                      >
                        {step > s.num ? <Check className="h-3 w-3" /> : s.num}
                      </span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Step 1: Property Details */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        Discuss Selling Your Property
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        Whether considering an open curated campaign or a completely confidential off-market placement, our partners provide frank valuation guidance.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Property Location / Enclave *
                        </label>
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Palm Jumeirah, Emirates Hills, Sydney Harbour…"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Property Classification
                        </label>
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white focus:border-[#B7A17A] focus:outline-none"
                        >
                          <option value="Villa">Private Villa / Detached Home</option>
                          <option value="Penthouse">Sky Penthouse</option>
                          <option value="Estate">Waterfront / Country Estate</option>
                          <option value="Townhouse">Architectural Townhouse</option>
                          <option value="Apartment">Prime Tower Apartment</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Estimated Area (Sq Ft, Optional)
                        </label>
                        <input
                          type="text"
                          value={estimatedSqft}
                          onChange={(e) => setEstimatedSqft(e.target.value)}
                          placeholder="e.g. 6,500 sq ft"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Approximate Value Expectation (Optional)
                        </label>
                        <input
                          type="text"
                          value={expectedValue}
                          onChange={(e) => setExpectedValue(e.target.value)}
                          placeholder="e.g. AED 15M–20M / Seeking Appraisal"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Sale Timeframe
                        </label>
                        <select
                          value={timeframe}
                          onChange={(e) => setTimeframe(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white focus:border-[#B7A17A] focus:outline-none"
                        >
                          <option value="immediate">Immediate (within 30 days)</option>
                          <option value="1-3 months">1 to 3 months</option>
                          <option value="3-6 months">3 to 6 months</option>
                          <option value="exploring">Confidential Valuation & Exploration Only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Marketing Preference
                        </label>
                        <select
                          value={representationType}
                          onChange={(e) => setRepresentationType(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white focus:border-[#B7A17A] focus:outline-none"
                        >
                          <option value="off-market">Private Off-Market (Strict Discretion)</option>
                          <option value="editorial">Curated Editorial Campaign (Public Showcase)</option>
                          <option value="hybrid">Targeted VIP Direct Outreach</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                        Architectural Highlights & Notable Details
                      </label>
                      <textarea
                        rows={2}
                        value={keyFeatures}
                        onChange={(e) => setKeyFeatures(e.target.value)}
                        placeholder="e.g. Architect-designed by Studio K, private 25m mooring, south-facing travertine terrace, wine cellar…"
                        className="mt-2 w-full resize-none rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-2.5 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end pt-4">
                      <button
                        type="button"
                        disabled={!canAdvanceStep1}
                        onClick={() => setStep(2)}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B7A17A] px-7 text-sm font-semibold text-[#111110] transition-colors hover:bg-white disabled:opacity-40"
                      >
                        Owner Information <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Owner Contact */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        Owner Representation Information
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        All owner conversations are protected under professional brokerage confidentiality.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Your Name / Entity Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Sebastian Sterling / Sterling Family Trust"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                            Confidential Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@domain.com"
                            className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                            Private Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+971 50 000 0000"
                            className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Preferred Consultation Format
                        </label>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                          {[
                            { id: "call", label: "Confidential Phone Call" },
                            { id: "coffee", label: "Private Meeting" },
                            { id: "written", label: "Written Valuation Report" },
                          ].map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPreferredMethod(m.id)}
                              className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition-all ${
                                preferredMethod === m.id
                                  ? "border-[#B7A17A] bg-[#B7A17A]/15 text-white"
                                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20"
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="button"
                        disabled={!canAdvanceStep2}
                        onClick={() => setStep(3)}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B7A17A] px-7 text-sm font-semibold text-[#111110] transition-colors hover:bg-white disabled:opacity-40"
                      >
                        Review Valuation Request <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Summary */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        Valuation & Representation Review
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        Confirm your intake brief below. A senior partner will prepare a preliminary market comparable dossier.
                      </p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm">
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span className="text-white/50">Location</span>
                        <span className="font-medium text-white">{location}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span className="text-white/50">Property Type</span>
                        <span className="font-medium text-white">{propertyType}</span>
                      </div>
                      {estimatedSqft && (
                        <div className="flex justify-between border-b border-white/10 pb-3">
                          <span className="text-white/50">Estimated Area</span>
                          <span className="font-medium text-white">{estimatedSqft}</span>
                        </div>
                      )}
                      {expectedValue && (
                        <div className="flex justify-between border-b border-white/10 pb-3">
                          <span className="text-white/50">Price Target</span>
                          <span className="font-medium text-white">{expectedValue}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span className="text-white/50">Representation Mode</span>
                        <span className="font-medium text-white capitalize">{representationType.replace("-", " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Owner Contact</span>
                        <span className="font-medium text-white">{name} ({email})</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#B7A17A]/25 bg-[#B7A17A]/10 p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#B7A17A]" />
                        <p className="text-xs leading-relaxed text-[#F7F4EE]/80">
                          <strong>Indicative Valuation Concept:</strong> This is a demonstration of our seller intake architecture. Accurate real estate market valuations require a physical property inspection and analysis of verified Land Department / Registry transactions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B7A17A] px-8 text-sm font-semibold text-[#111110] transition-colors hover:bg-white"
                      >
                        Submit Valuation Request <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Confirmation / Summary State */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center sm:py-12"
              >
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#B7A17A]/40 bg-[#B7A17A]/15 text-[#B7A17A]">
                  <Check className="h-8 w-8" />
                </span>

                <h3 className="mt-6 font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl">
                  Seller Consultation Initiated
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-white/70">
                  Thank you, <strong className="text-white">{name}</strong>. Your confidential valuation brief for your property in{" "}
                  <strong className="text-white">{location}</strong> has been routed to our senior brokerage leadership.
                </p>

                <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-white/[0.04] p-5 text-left text-xs leading-relaxed text-white/65">
                  <p className="font-bold uppercase tracking-wider text-[#B7A17A]">Advisory Protocol:</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#B7A17A]">1.</span> Comparable transaction data is compiled from verified registry archives.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B7A17A]">2.</span> A dedicated private client partner will reach out via your preferred method ({preferredMethod}).
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B7A17A]">3.</span> An indicative valuation range and bespoke marketing strategy will be presented confidentially.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#111110]"
                  >
                    Return to Overview
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
