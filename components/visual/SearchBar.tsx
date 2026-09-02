"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import type { ProspectConfig } from "@/lib/types";

interface SearchBarProps {
  prospects: ProspectConfig[];
  onFilter: (filtered: ProspectConfig[]) => void;
}

export function SearchBar({ prospects, onFilter }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    onFilter(
      !value.trim()
        ? prospects
        : prospects.filter((p) => {
            const q = value.toLowerCase();
            return (
              p.displayName.toLowerCase().includes(q) ||
              p.hero.subline.toLowerCase().includes(q) ||
              p.location.toLowerCase().includes(q)
            );
          })
    );
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search demos by name, description, or location..."
        className="w-full rounded-xl border border-line bg-white py-3 pl-11 pr-10 text-sm text-ink shadow-sm transition-all placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
      {query && (
        <button
          onClick={() => handleChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
