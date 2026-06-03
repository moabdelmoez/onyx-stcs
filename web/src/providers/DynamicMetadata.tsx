"use client";

import { useEffect, useMemo } from "react";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { resolveBrand } from "@/lib/branding/defaultBrand";

export default function DynamicMetadata() {
  const { enterpriseSettings } = useSettingsContext();

  // Cache-buster so the favicon re-fetches after an admin uploads a new logo.
  const cacheBuster = useMemo(
    () => Date.now(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enterpriseSettings]
  );

  const brand = useMemo(
    () => resolveBrand(enterpriseSettings, cacheBuster),
    [enterpriseSettings, cacheBuster]
  );

  useEffect(() => {
    if (document.title !== brand.applicationName) {
      document.title = brand.applicationName;
    }
  }, [brand.applicationName]);

  return <link rel="icon" href={brand.faviconSrc} />;
}
