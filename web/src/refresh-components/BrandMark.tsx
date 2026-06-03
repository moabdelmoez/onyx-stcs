"use client";

import { cn } from "@opal/utils";
import { useResolvedBrand } from "@/lib/branding/useResolvedBrand";

export interface BrandMarkProps {
  size?: number;
  className?: string;
  alt?: string;
  src?: string;
  cropToCircle?: boolean;
}

export default function BrandMark({
  size = 24,
  className,
  alt,
  src,
  cropToCircle = false,
}: BrandMarkProps) {
  const brand = useResolvedBrand();
  const resolvedSrc = src ?? brand.logoSrc;

  return (
    <span
      data-testid="brand-mark"
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden",
        cropToCircle && "rounded-full",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt ?? brand.logoAlt}
        src={resolvedSrc}
        className={cn(
          "h-full w-full object-center",
          cropToCircle ? "object-cover" : "object-contain"
        )}
      />
    </span>
  );
}
