"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageProps } from "next/image";

type BrandImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallback?: string;
  onError?: ImageProps["onError"];
  /** Called whenever the real asset fails and a fallback takes over (or would). */
  onFallback?: (event: unknown) => void;
};

export function BrandImage({ src, fallback, alt, onError, onFallback, ...rest }: BrandImageProps) {
  const [current, setCurrent] = useState(src);

  return (
    <Image
      {...rest}
      alt={alt}
      src={current}
      data-real-asset={src}
      data-fallback={fallback}
      onError={(event) => {
        const alreadyFallingBack = current === fallback;
        if (fallback && !alreadyFallingBack) {
          setCurrent(fallback);
        } else if (!alreadyFallingBack) {
          // Real asset failed and no fallback is available — surface the event.
        }
        onFallback?.(event);
        onError?.(event);
      }}
    />
  );
}