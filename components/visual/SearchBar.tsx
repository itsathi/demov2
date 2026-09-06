"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search demos by name, description, or location..."
        className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-10 text-sm text-ink shadow-sm transition-all placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        data-cursor="Search"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition-colors hover:text-ink"
          data-cursor="Clear"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}