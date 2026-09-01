"use client";

export function RotatingBadge({
  text,
  children,
  className,
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const id = `rb-${text.replace(/[^a-zA-Z]+/g, "").slice(0, 6)}-${Math.round(0)}`;
  return (
    <div className={`relative grid place-items-center ${className ?? ""}`}>
      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full">
        <defs>
          <path id={id} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-current text-[9.5px] font-semibold uppercase tracking-[0.28em]">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}