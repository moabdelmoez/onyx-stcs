"use client";

import React, { useContext } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import Text from "@/refresh-components/texts/Text";
import { resolveBrand } from "@/lib/branding/defaultBrand";

export default function LoginText() {
  const settings = useContext(SettingsContext);
  const brand = resolveBrand(settings?.enterpriseSettings);

  return (
    <div className="w-full flex flex-col ">
      <Text as="p" headingH2 text05>
        Welcome to {brand.applicationName}
      </Text>
      <Text as="p" text03 mainUiMuted>
        Your AI platform for work
      </Text>
    </div>
  );
}
