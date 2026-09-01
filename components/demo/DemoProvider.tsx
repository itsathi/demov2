"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type DemoContextValue = {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  runAutomation: (label?: string) => void;
  automationLabel?: string;
  automation: string[];
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({
  children,
  automation,
}: {
  children: React.ReactNode;
  automation: string[];
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [automationLabel, setAutomationLabel] = useState<string | undefined>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  const runAutomation = useCallback(
    (label?: string) => {
      if (timer.current) clearTimeout(timer.current);
      setAutomationLabel(label);
      // Success state stays for ~5s, then the assistant opens with the automation trail.
      timer.current = setTimeout(() => {
        setChatOpen(true);
      }, 5000);
    },
    []
  );

  const value = useMemo(
    () => ({
      chatOpen,
      openChat,
      closeChat,
      runAutomation,
      automationLabel,
      automation,
    }),
    [chatOpen, openChat, closeChat, runAutomation, automationLabel, automation]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}