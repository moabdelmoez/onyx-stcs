"use client";

import {
  DEFAULT_LOGO_SIZE_PX,
  NEXT_PUBLIC_DO_NOT_USE_TOGGLE_OFF_DANSWER_POWERED,
} from "@/lib/constants";
import Text from "@/refresh-components/texts/Text";
import Truncated from "@/refresh-components/texts/Truncated";
import BrandMark from "@/refresh-components/BrandMark";
import { useResolvedBrand } from "@/lib/branding/useResolvedBrand";

export interface LogoProps {
  folded?: boolean;
  size?: number;
  className?: string;
}

export default function Logo({ folded, size, className }: LogoProps) {
  const resolvedSize = size ?? DEFAULT_LOGO_SIZE_PX;
  const brand = useResolvedBrand();

  const logo = (
    <BrandMark
      size={resolvedSize}
      className={className}
      cropToCircle={brand.isCustomLogo}
    />
  );

  const renderNameAndPoweredBy = (opts: {
    includeLogo: boolean;
    includeName: boolean;
  }) => {
    return (
      <div className="flex min-w-0 gap-2">
        {opts.includeLogo && logo}
        {!folded && (
          /* H3 text is 4px larger (28px) than the Logo icon (24px), so negative margin hack. */
          <div className="flex flex-1 flex-col -mt-0.5">
            {opts.includeName && (
              <Truncated headingH3>{brand.applicationName}</Truncated>
            )}
            {!NEXT_PUBLIC_DO_NOT_USE_TOGGLE_OFF_DANSWER_POWERED &&
              !brand.shouldHidePoweredBy && (
                <Text
                  secondaryBody
                  text03
                  className={"line-clamp-1 truncate"}
                  nowrap
                >
                  Powered by Onyx
                </Text>
              )}
          </div>
        )}
      </div>
    );
  };

  // Handle "logo_only" display style
  if (brand.logoDisplayStyle === "logo_only") {
    return renderNameAndPoweredBy({ includeLogo: true, includeName: false });
  }

  // Handle "name_only" display style
  if (brand.logoDisplayStyle === "name_only") {
    return renderNameAndPoweredBy({ includeLogo: false, includeName: true });
  }

  // Handle "logo_and_name" or default behavior
  return renderNameAndPoweredBy({ includeLogo: true, includeName: true });
}
