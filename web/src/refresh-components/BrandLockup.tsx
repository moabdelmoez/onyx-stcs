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

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <BrandMark size={size} />
      <span className={cn("font-semibold text-text-05", nameClassName)}>
        {brand.applicationName}
      </span>
    </div>
  );
}
