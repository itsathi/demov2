"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CheckCircle2, Send, Sparkles, X } from "lucide-react";
import { AutomationStream } from "@/components/automation/AutomationStream";
import { useDemo } from "@/components/demo/DemoProvider";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

type Msg = { from: "bot" | "user"; text: string };

export function Chatbot({ prospect }: { prospect: ProspectConfig }) {
  const t = getTemplates(prospect);
  const { chatOpen, openChat, closeChat, automationLabel, automation } = useDemo();
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: t.assistant.greeting },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasAutomation = Boolean(automationLabel);

  const visibleMessages = hasAutomation
    ? messages.filter((m) => m.from === "user" || m.text !== t.assistant.greeting)
    : messages;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatOpen, hasAutomation]);

  const sendDraft = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: `Thanks — noted. For anything urgent, the team is reachable at ${t.assistant.fallbackEmail}.`,
        },
      ]);
    }, 700);
  };

  const pick = (id: string) => {
    const action = t.assistant.actions.find((a) => a.id === id);
    if (!action) return;
    setMessages((m) => [...m, { from: "user", text: action.label }]);
    setTimeout(() => setMessages((m) => [...m, { from: "bot", text: action.reply }]), 650);
  };

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed bottom-5 right-5 z-[70] flex h-[560px] max-h-[calc(100dvh-96px)] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_36px_90px_-24px_rgba(10,17,40,0.5)]"
            role="dialog"
            aria-label={`${t.assistant.name} chat`}
          >
            <header className="flex items-center justify-between bg-ink px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-brand text-white">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink bg-emerald-400" />
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-display text-sm font-bold text-white">
                    {t.assistant.name}
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </p>
                  <p className="text-[11px] text-white/55">Online · replies instantly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="grid h-9 w-9 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close assistant"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-paper px-4 py-5">
              {hasAutomation && (
                <>
                  <AutomationStream labels={automation} className="bg-white" />
                  <div className="flex items-start gap-2.5">
                    <BotAvatar />
                    <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-line">
                      <p className="flex items-center gap-1.5 font-semibold text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" /> {t.assistant.leadTitle}
                      </p>
                      <p className="mt-1.5">
                        {t.assistant.leadBody.replace(
                          "{label}",
                          automationLabel ? automationLabel : ""
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {hasAutomation && (
                <>
                  <div className="flex items-start gap-2.5">
                    <BotAvatar />
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-line">
                      I&apos;ve qualified your enquiry
                      {automationLabel ? ` — ${automationLabel}` : ""}{" "}
                      {t.assistant.routed}
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <BotAvatar />
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-line">
                      {t.assistant.followUp}
                    </div>
                  </div>
                </>
              )}

              {visibleMessages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.from === "user"
                      ? "flex justify-end"
                      : "flex items-start gap-2.5"
                  }
                >
                  {m.from === "bot" && <BotAvatar />}
                  <div
                    className={
                      m.from === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-3 text-sm leading-relaxed text-white shadow-sm"
                        : "max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-line"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {!hasAutomation && (
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                    Suggested
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {t.assistant.actions.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => pick(a.id)}
                        className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-tint"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              className="flex items-center gap-2 border-t border-line bg-white px-3 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                sendDraft();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.assistant.placeholder}
                aria-label="Message the assistant"
                className="h-11 flex-1 rounded-lg border border-line bg-paper px-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand text-white transition-colors hover:bg-brand-strong"
                aria-label="Send message"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && (
        <motion.button
          key="launcher"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          type="button"
          onClick={openChat}
          className="fixed bottom-5 right-5 z-[70] inline-flex h-13 items-center gap-2.5 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-[0_18px_40px_-14px_rgba(10,17,40,0.55)] transition-colors hover:bg-brand"
          aria-label={`Open ${t.assistant.name}`}
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-brand">
            <Bot className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-400" />
          </span>
          AI Assistant
        </motion.button>
      )}
    </>
  );
}

function BotAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
      <Bot className="h-4 w-4" />
    </span>
  );
}