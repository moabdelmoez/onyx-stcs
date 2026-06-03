"use client";

import { cn } from "@opal/utils";
import { useResolvedBrand } from "@/lib/branding/useResolvedBrand";
import BrandMark from "./BrandMark";

export interface BrandLockupProps {
  size?: number;
  className?: string;
  nameClassName?: string;
}

export default function BrandLockup({
  size = 32,
  className,
  nameClassName,
}: BrandLockupProps) {
  const brand = useResolvedBrand();
  const showMark = brand.logoDisplayStyle !== "name_only";
  const showName = brand.logoDisplayStyle !== "logo_only";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showMark && <BrandMark size={size} />}
      {showName && (
        <span className={cn("font-semibold text-text-05", nameClassName)}>
          {brand.applicationName}
        </span>
      )}
    </div>
  );
}
