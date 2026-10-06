"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav-links";

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu />
      </Button>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col gap-4 bg-background p-4 shadow-xl">
            <Button variant="ghost" size="icon" aria-label="Close menu" className="self-end" onClick={() => setOpen(false)}>
              <X />
            </Button>
            {children}
            <NavLinks onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
