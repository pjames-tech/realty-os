"use client";

import { usePathname } from "next/navigation";
import { SloaneWidget } from "@/components/sloane-widget";

export function PublicAssistantLayer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/super-admin")) {
    return null;
  }

  return <SloaneWidget />;
}
