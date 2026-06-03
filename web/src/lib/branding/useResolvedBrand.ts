"use client";

import { useMemo } from "react";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { resolveBrand, type ResolvedBrand } from "./defaultBrand";

export function useResolvedBrand(): ResolvedBrand {
  const settings = useSettingsContext();
  const cacheBuster = useMemo(() => Date.now(), [settings.enterpriseSettings]);

  return useMemo(
    () => resolveBrand(settings.enterpriseSettings, cacheBuster),
    [settings.enterpriseSettings, cacheBuster]
  );
}
