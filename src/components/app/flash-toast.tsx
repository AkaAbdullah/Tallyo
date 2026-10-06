"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/** Shows a one-off success toast passed through the URL after a redirect, then cleans the URL. */
export function FlashToast({ message }: { message?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!message) return;
    toast.success(message);
    router.replace(pathname, { scroll: false });
  }, [message, pathname, router]);
  return null;
}
