"use client";

import { useEffect } from "react";
import { buildImgUrl } from "@/app/app/components/files/images/utils";
import { cn } from "@opal/utils";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface FullImageModalProps {
  fileId: string;
  fileName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullImageModal({
  fileId,
  fileName,
  open,
  onOpenChange,
}: FullImageModalProps) {
  // pre-fetch image
  useEffect(() => {
    const img = new Image();
    img.src = buildImgUrl(fileId);
  }, [fileId]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80 z-50 backdrop-blur-xl" />
        <Dialog.Content
          className={cn(
            "fixed inset-0 flex items-center justify-center p-4 z-100",
            "max-w-(--breakpoint-lg) h-fit top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4",
            "focus:outline-hidden"
          )}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>
              {fileName ? `Image preview: ${fileName}` : "Image preview"}
            </Dialog.Title>
            <Dialog.Description>
              Full-size preview of the selected image.
            </Dialog.Description>
          </VisuallyHidden.Root>
          <img
            src={buildImgUrl(fileId)}
            alt="Uploaded image"
            className="max-w-full max-h-full"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
