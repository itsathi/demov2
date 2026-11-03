"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import type { PropertyListing, ProspectConfig } from "@/lib/types";

const EASE = [0.65, 0, 0.35, 1] as const;

export function PrivateViewingModal({
  isOpen,
  onClose,
  prospect,
  presetListing,
}: {
  isOpen: boolean;
  onClose: () => void;
  prospect: ProspectConfig;
  presetListing?: PropertyListing;
}) {
  const listings = prospect.listings ?? [];
  const [selectedListingId, setSelectedListingId] = useState<string>(
    presetListing?.id || listings[0]?.id || ""
  );

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

  const selectedListing =
    listings.find((l) => l.id === selectedListingId) || presetListing || listings[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredWindow, setPreferredWindow] = useState("golden-hour");
  const [attendees, setAttendees] = useState("2");
  const [discretionNote, setDiscretionNote] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredChannel, setPreferredChannel] = useState<"whatsapp" | "phone" | "email">("whatsapp");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canAdvanceStep2 = Boolean(preferredDate);
  const canAdvanceStep3 = Boolean(fullName.trim() && email.trim());

  const handleComplete = () => {
    setIsSubmitted(true);
  };

  const resetForm = () => {
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
          className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#141413] text-[#F7F4EE] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Request Private Viewing"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#B7A17A]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B7A17A]">
                Private Viewing Protocol · {prospect.displayName}
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
                {/* Step indicators */}
                <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
                  {[
                    { num: 1, label: "Residence" },
                    { num: 2, label: "Schedule" },
                    { num: 3, label: "Private Details" },
                    { num: 4, label: "Confirmation" },
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
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Step 1: Property Selection */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        Select Residence for Private Viewing
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        All viewings are accompanied by a senior private broker and conducted with absolute discretion.
                      </p>
                    </div>

                    {selectedListing && (
                      <div className="group relative flex flex-col gap-5 overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
                        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
                          {selectedListing.images[0] && (
                            <Image
                              src={selectedListing.images[0]}
                              alt={selectedListing.title}
                              fill
                              className="object-cover"
                            />
                          )}
                          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#B7A17A] backdrop-blur">
                            {selectedListing.architecturalStyle || selectedListing.propertyType}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B7A17A]">
                            {selectedListing.location} · {selectedListing.community}
                          </p>
                          <h4 className="mt-1 font-serif text-xl font-medium text-white">
                            {selectedListing.title}
                          </h4>
                          <p className="mt-1 font-serif text-lg font-semibold text-[#D8D0C4]">
                            {selectedListing.priceLabel}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/60">
                            {selectedListing.bedrooms && (
                              <span>{selectedListing.bedrooms} Bedrooms</span>
                            )}
                            {selectedListing.bathrooms && (
                              <span>{selectedListing.bathrooms} Bathrooms</span>
                            )}
                            {selectedListing.areaLabel && (
                              <span>{selectedListing.areaLabel}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {listings.length > 1 && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Change Selected Residence
                        </label>
                        <select
                          value={selectedListingId}
                          onChange={(e) => setSelectedListingId(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white focus:border-[#B7A17A] focus:outline-none"
                        >
                          {listings.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.title} — {l.priceLabel} ({l.location})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B7A17A] px-7 text-sm font-semibold text-[#111110] transition-colors hover:bg-white"
                      >
                        Continue to Schedule <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Schedule & Logistics */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        Preferred Viewing Timing
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        Select your preferred date and ambient lighting window to experience the residence at its finest.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Preferred Date
                        </label>
                        <div className="relative mt-2">
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#B7A17A] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Number of Attendees
                        </label>
                        <select
                          value={attendees}
                          onChange={(e) => setAttendees(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white focus:border-[#B7A17A] focus:outline-none"
                        >
                          <option value="1">1 Person (Private Solo Viewing)</option>
                          <option value="2">2 Persons (Couple / Advisor)</option>
                          <option value="3">3–4 Persons (Family / Entourage)</option>
                          <option value="5+">5+ Persons (Private Delegation)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                        Lighting & Time Window
                      </label>
                      <div className="mt-2 grid gap-3 sm:grid-cols-3">
                        {[
                          {
                            id: "morning",
                            title: "Morning Light",
                            time: "10:00 – 12:00",
                            desc: "Crisp natural daylight and quiet ambient conditions.",
                          },
                          {
                            id: "afternoon",
                            title: "Afternoon Sun",
                            time: "14:00 – 16:00",
                            desc: "Full interior brightness and spatial volume study.",
                          },
                          {
                            id: "golden-hour",
                            title: "Golden Hour Sunset",
                            time: "17:00 – 18:30",
                            desc: "Dramatic twilight reflection and sunset terrace aspect.",
                          },
                        ].map((win) => (
                          <button
                            key={win.id}
                            type="button"
                            onClick={() => setPreferredWindow(win.id)}
                            className={`rounded-xl border p-4 text-left transition-all ${
                              preferredWindow === win.id
                                ? "border-[#B7A17A] bg-[#B7A17A]/10 text-white"
                                : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20"
                            }`}
                          >
                            <p className="font-serif text-base font-semibold text-white">{win.title}</p>
                            <p className="text-xs font-semibold text-[#B7A17A]">{win.time}</p>
                            <p className="mt-2 text-xs leading-relaxed text-white/50">{win.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                        Confidentiality & Discretion Requests (Optional)
                      </label>
                      <input
                        type="text"
                        value={discretionNote}
                        onChange={(e) => setDiscretionNote(e.target.value)}
                        placeholder="e.g. Non-disclosure required, chauffeur arrival at rear gate, virtual walkthrough first…"
                        className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                      />
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
                        Guest Details <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Guest Details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        Guest & Representation Details
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        Your contact information is strictly confidential and used solely to coordinate accompanied access.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Lord Alistair Campbell / Dr. Elena Rostova"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                            Email Address *
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
                            Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+971 50 123 4567 / +44 7911 123456"
                            className="mt-2 w-full rounded-lg border border-white/15 bg-[#1C1C1A] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#B7A17A] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                          Preferred Confidential Contact Channel
                        </label>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                          {[
                            { id: "whatsapp", label: "WhatsApp" },
                            { id: "phone", label: "Direct Call" },
                            { id: "email", label: "Private Email" },
                          ].map((ch) => (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => setPreferredChannel(ch.id as "whatsapp" | "phone" | "email")}
                              className={`rounded-lg border py-2.5 text-center text-xs font-semibold transition-all ${
                                preferredChannel === ch.id
                                  ? "border-[#B7A17A] bg-[#B7A17A]/15 text-white"
                                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20"
                              }`}
                            >
                              {ch.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="button"
                        disabled={!canAdvanceStep3}
                        onClick={() => setStep(4)}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B7A17A] px-7 text-sm font-semibold text-[#111110] transition-colors hover:bg-white disabled:opacity-40"
                      >
                        Review Request <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Confirm */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        Confirm Viewing Appointment
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        Please review your private viewing parameters prior to transmission to the senior brokerage desk.
                      </p>
                    </div>

                    <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="border-b border-white/10 pb-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B7A17A]">
                          Requested Residence
                        </p>
                        <p className="mt-1 font-serif text-lg font-semibold text-white">
                          {selectedListing?.title}
                        </p>
                        <p className="text-sm text-white/60">
                          {selectedListing?.location} · {selectedListing?.priceLabel}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                            Requested Date & Window
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-white">
                            {preferredDate || "Earliest availability"} (
                            {preferredWindow === "morning"
                              ? "Morning Light"
                              : preferredWindow === "afternoon"
                              ? "Afternoon Sun"
                              : "Golden Hour Sunset"}
                            )
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                            Attendees
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-white">{attendees} Guests</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                            Guest
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-white">{fullName}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                            Channel
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-white">
                            {preferredChannel.toUpperCase()} · {phone || email}
                          </p>
                        </div>
                      </div>

                      {discretionNote && (
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                            Discretion Notes
                          </p>
                          <p className="mt-0.5 text-xs italic text-white/70">&ldquo;{discretionNote}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-[#B7A17A]/25 bg-[#B7A17A]/10 p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#B7A17A]" />
                        <p className="text-xs leading-relaxed text-[#F7F4EE]/80">
                          <strong>Demonstration Concept:</strong> This is a client-facing demonstration of the Athinem Creatives luxury brokerage platform. Submitting this request simulates the real-time advisor notification and calendar hold.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" /> Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={handleComplete}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B7A17A] px-8 text-sm font-semibold text-[#111110] transition-colors hover:bg-white"
                      >
                        Confirm Private Viewing Request <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Success / Confirmation State */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center sm:py-12"
              >
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#B7A17A]/40 bg-[#B7A17A]/15 text-[#B7A17A]">
                  <Check className="h-8 w-8" />
                </span>

                <h3 className="mt-6 font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl">
                  Viewing Request Dispatched
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-white/70">
                  Thank you, <strong className="text-white">{fullName}</strong>. Your accompanied private viewing request for{" "}
                  <strong className="text-white">{selectedListing?.title}</strong> has been assigned to our senior brokerage advisory desk.
                </p>

                <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-white/[0.04] p-5 text-left text-xs leading-relaxed text-white/65">
                  <p className="font-bold uppercase tracking-wider text-[#B7A17A]">What happens next:</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#B7A17A]">1.</span> Availability of the property is re-verified with the owner or estate management.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B7A17A]">2.</span> A dedicated broker contacts you via {preferredChannel.toUpperCase()} within 2 business hours.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B7A17A]">3.</span> A private calendar invite and arrival logistics guide are transmitted.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#111110]"
                  >
                    Return to Collection
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
