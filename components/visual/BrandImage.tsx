"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageProps } from "next/image";

type BrandImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallback?: string;
  onError?: ImageProps["onError"];
};

export function BrandImage({ src, fallback, onError, ...rest }: BrandImageProps) {
  const [current, setCurrent] = useState(src);

  return (
    <Image
      {...rest}
      src={current}
      onError={(event) => {
        if (fallback && current !== fallback) setCurrent(fallback);
        onError?.(event);
      }}
    />
  );
}