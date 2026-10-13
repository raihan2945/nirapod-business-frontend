"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

//title block for the five tab roots
export function PageTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pb-4 pt-6 lg:pt-10">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-np-text sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[15px] text-np-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

//sticky header with a back button for screens below a tab
export function ScreenHeader({ title, subtitle, back, right }: { title: string; subtitle?: string; back: string; right?: ReactNode }) {
  const router = useRouter();
  const goBack = () => {
    //only step back inside the portal; a deep link lands on the parent screen
    if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) router.back();
    else router.push(back);
  };

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-2 flex items-center gap-3 bg-np-bg/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 lg:pt-8">
      <button
        type="button"
        onClick={goBack}
        aria-label="Go back"
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-np-border bg-white text-np-text transition-colors hover:bg-np-surface-muted"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-bold text-np-text sm:text-xl">{title}</h1>
        {subtitle && <p className="truncate text-[13px] text-np-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

//round icon button for header right slots
export function HeaderIconButton({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      aria-label={label}
      title={label}
      className="flex size-10.5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-np-border bg-white text-np-text transition-colors hover:bg-np-surface-muted"
    >
      {children}
    </button>
  );
}

//bar pinned to the bottom of task screens (invest, wallet request, ...)
export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-np-border bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-[20px] lg:border lg:px-5 lg:py-4 lg:shadow-np">
      {children}
    </div>
  );
}
