"use client";

import { useContext, useMemo } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import { resolveBrand, type ResolvedBrand } from "./defaultBrand";

export function useResolvedBrand(): ResolvedBrand {
  const settings = useContext(SettingsContext);
  const enterpriseSettings = settings?.enterpriseSettings;
  const cacheBuster = useMemo(() => Date.now(), [enterpriseSettings]);

  return useMemo(
    () => resolveBrand(enterpriseSettings, cacheBuster),
    [enterpriseSettings, cacheBuster]
  );
}
