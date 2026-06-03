"use client";

import { useResolvedBrand } from "@/lib/branding/useResolvedBrand";
import Text from "@/refresh-components/texts/Text";

export default function SignupSubtitle() {
  const brand = useResolvedBrand();

  return (
    <Text as="p" text03>
      Get started with {brand.applicationName}
    </Text>
  );
}
