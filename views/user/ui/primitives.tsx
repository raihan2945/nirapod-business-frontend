"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ChevronRight, CloudOff, Inbox, Loader2, Minus, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "../lib/format";
import { mediaUrl } from "../lib/project";
import { statusLabel, statusTone, toneClasses, type Tone } from "../lib/status";

//staggered entrance, same rhythm as the app's FadeInDown.delay(60 * i)
export const rise = (i = 0): { className: string; style: CSSProperties } => ({
  className: "animate-np-rise",
  style: { animationDelay: `${i * 60}ms` },
});

/* ---------------------------------- Card --------------------------------- */

export function Card({
  children,
  className,
  padded = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("rounded-[20px] border border-np-border bg-white shadow-np", padded && "p-4 sm:p-5", className)} style={style}>
      {children}
    </div>
  );
}

/* --------------------------------- Button -------------------------------- */

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-np-primary text-white hover:bg-np-primary-dark disabled:bg-np-primary/50",
  secondary: "bg-np-primary-soft text-np-primary-dark hover:bg-[#d6efdf]",
  outline: "border border-np-border bg-white text-np-text hover:bg-np-surface-muted",
  ghost: "text-np-primary-dark hover:bg-np-primary-soft",
  danger: "bg-np-danger-soft text-np-danger hover:bg-[#f7d6d6]",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-[15px] rounded-2xl gap-2",
  lg: "h-13 px-6 text-base rounded-2xl gap-2",
};

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading,
  disabled,
  block,
  href,
  type = "button",
  onClick,
  className,
}: ButtonProps) {
  const cls = cn(
    "inline-flex items-center justify-center font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer select-none",
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size],
    block && "w-full",
    className,
  );
  const content = (
    <>
      {loading ? <Loader2 className="size-[18px] animate-spin" /> : Icon && <Icon className="size-[18px]" />}
      <span className="truncate">{children}</span>
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls}>
      {content}
    </button>
  );
}

/* --------------------------------- Badges -------------------------------- */

export function Badge({ label, tone = "neutral", className }: { label: string; tone?: Tone; className?: string }) {
  const c = toneClasses[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", c.bg, c.fg, className)}>
      <span className={cn("size-1.5 rounded-full", c.dot)} />
      {label}
    </span>
  );
}

//badge for any backend status enum
export function StatusBadge({ status, className }: { status?: string | null; className?: string }) {
  return <Badge label={statusLabel(status)} tone={statusTone(status)} className={className} />;
}

/* --------------------------------- Notice -------------------------------- */

interface NoticeProps {
  tone?: Tone;
  icon: LucideIcon;
  title: string;
  message?: string;
  href?: string;
  onClick?: () => void;
}

//inline banner for account state and warnings
export function Notice({ tone = "info", icon: Icon, title, message, href, onClick }: NoticeProps) {
  const c = toneClasses[tone];
  const interactive = !!(href || onClick);
  const body = (
    <>
      <Icon className="size-[22px] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold">{title}</p>
        {!!message && <p className="mt-0.5 text-[13px] leading-[18px] opacity-90">{message}</p>}
      </div>
      {interactive && <ChevronRight className="size-[18px] shrink-0" />}
    </>
  );
  const cls = cn(
    "flex w-full items-center gap-3 rounded-2xl p-3 text-left",
    c.bg,
    c.fg,
    interactive && "cursor-pointer transition-transform active:scale-[0.99] hover:brightness-[0.98]",
  );
  if (href)
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cls}>
        {body}
      </button>
    );
  return <div className={cls}>{body}</div>;
}

/* ------------------------------ Progress bar ----------------------------- */

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-np-surface-muted", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-np-primary-dark to-np-primary transition-[width] duration-700"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/* ---------------------------- Segmented / chips -------------------------- */

interface Option<T extends string> {
  label: string;
  value: T;
}

export function Segmented<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("flex rounded-2xl bg-np-surface-muted p-1", className)}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(it.value)}
            className={cn(
              "flex-1 cursor-pointer truncate rounded-xl px-3 py-2 text-[13px] font-semibold transition-all",
              active ? "bg-white text-np-text shadow-np" : "text-np-muted hover:text-np-text",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterChips<T extends string>({
  items,
  value,
  onChange,
}: {
  items: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(it.value)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
              active
                ? "border-np-primary-dark bg-np-primary-dark text-white"
                : "border-np-border bg-white text-np-muted hover:border-np-primary/40 hover:text-np-text",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- InfoRow -------------------------------- */

export function InfoRow({ label, value, last }: { label: string; value?: ReactNode; last?: boolean }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-3", !last && "border-b border-np-border")}>
      <span className="text-sm text-np-muted">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium break-words text-np-text">
        {value === undefined || value === null || value === "" ? <span className="text-np-subtle">—</span> : value}
      </span>
    </div>
  );
}

/* --------------------------------- Avatar -------------------------------- */

export function Avatar({ name, photo, size = 44, ring }: { name?: string | null; photo?: string | null; size?: number; ring?: boolean }) {
  const uri = mediaUrl(photo);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-np-primary-soft font-bold text-np-primary-dark",
        ring && "border-2 border-white/70",
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {uri ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={uri} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

/* ---------------------------------- Stepper ------------------------------ */

export function Stepper({ value, onChange, min = 1, max = 9999 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  const btn =
    "flex size-10 cursor-pointer items-center justify-center rounded-xl bg-np-primary-soft text-np-primary-dark transition-colors hover:bg-[#d6efdf] disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Fewer shares">
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label="Number of shares"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Math.floor(Number(e.target.value));
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className="h-10 w-16 rounded-xl border border-np-border bg-white text-center text-lg font-bold text-np-text outline-none focus:border-np-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="More shares">
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/* ------------------------------ Section header --------------------------- */

export function SectionHeader({ title, href, action = "See all" }: { title: string; href?: string; action?: string }) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between">
      <h2 className="text-[17px] font-bold text-np-text">{title}</h2>
      {href && (
        <Link href={href} className="text-[13px] font-semibold text-np-primary-dark hover:underline">
          {action}
        </Link>
      )}
    </div>
  );
}

/* ---------------------------------- States ------------------------------- */

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={cn("animate-pulse rounded-xl bg-np-surface-muted", className)} style={style} />;
}

export function ListSkeleton({ rows = 3, height = 88 }: { rows?: number; height?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="rounded-[20px]" style={{ height }} />
      ))}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <Loader2 className="size-6 animate-spin text-np-primary" />
    </div>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({ icon: Icon = Inbox, title, message, actionLabel, actionHref, onAction, compact }: EmptyStateProps) {
  return (
    <div className={cn("flex animate-np-fade flex-col items-center px-6 text-center", compact ? "py-6" : "py-14")}>
      <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-np-primary-soft">
        <Icon className="size-7 text-np-primary" />
      </div>
      <p className="text-[17px] font-bold text-np-text">{title}</p>
      {!!message && <p className="mt-1 max-w-[300px] text-[13px] leading-[19px] text-np-muted">{message}</p>}
      {actionLabel && (actionHref || onAction) && (
        <Button variant="secondary" size="sm" href={actionHref} onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry, compact }: { message?: string; onRetry?: () => void; compact?: boolean }) {
  return (
    <EmptyState
      compact={compact}
      icon={CloudOff}
      title="Couldn't load this"
      message={message || "Something went wrong."}
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}

export function LoadMore({ hasMore, loading, onMore }: { hasMore: boolean; loading: boolean; onMore: () => void }) {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center pt-4">
      <Button variant="outline" size="sm" loading={loading} onClick={onMore}>
        Load more
      </Button>
    </div>
  );
}
