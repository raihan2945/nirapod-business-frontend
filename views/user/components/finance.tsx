"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, BriefcaseBusiness, ChevronRight, Eye, EyeOff, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysUntil, formatDate, formatDateTime, formatMoney, relativeDay } from "../lib/format";
import { mediaUrl } from "../lib/project";
import { statusLabel, toneClasses, type Tone } from "../lib/status";
import type { Investment, InvestmentReturn, WalletTransaction } from "../lib/types";
import { InfoRow, Skeleton, StatusBadge } from "../ui/primitives";
import { Sheet } from "../ui/overlay";

/* ------------------------------ Quick action ----------------------------- */

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  href: string;
  //light variant for use on dark gradients
  onDark?: boolean;
}

export function QuickAction({ icon: Icon, label, href, onDark }: QuickActionProps) {
  return (
    <Link href={href} className="group flex min-w-0 flex-1 flex-col items-center gap-2 px-0.5">
      <span
        className={cn(
          "flex size-13 items-center justify-center rounded-2xl transition-transform group-hover:-translate-y-0.5 group-active:scale-95",
          onDark ? "bg-white/15 text-white group-hover:bg-white/20" : "bg-np-primary-soft text-np-primary-dark",
        )}
      >
        <Icon className="size-[22px]" />
      </span>
      <span className={cn("w-full truncate text-center text-[13px] font-semibold", onDark ? "text-white" : "text-np-text")}>{label}</span>
    </Link>
  );
}

/* ------------------------------ Balance card ----------------------------- */

const MASK = "৳ • • • • •";

//hero card: total = wallet + money currently working in projects
export function BalanceCard({ wallet, invested, loading, footer }: { wallet: number; invested: number; loading?: boolean; footer?: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const show = (v: number) => (hidden ? MASK : formatMoney(v));

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-np-deep via-np-mid to-np-primary p-5 text-white sm:p-6">
      {/* decorative rings */}
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-60 rounded-full border-[28px] border-white/[0.06]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 right-10 size-36 rounded-full border-[28px] border-white/[0.06]" />

      <div className="relative flex items-center justify-between">
        <span className="text-[13px] font-medium text-white/75">Total balance</span>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          aria-label={hidden ? "Show balance" : "Hide balance"}
          className="-m-2 cursor-pointer rounded-full p-2 text-white/80 hover:bg-white/10"
        >
          {hidden ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>

      {loading ? (
        <Skeleton className="relative mt-2 h-9 w-48 bg-white/20" />
      ) : (
        <p key={String(hidden)} className="relative mt-1 animate-np-fade truncate text-[30px] font-extrabold tracking-tight sm:text-4xl">
          {show(wallet + invested)}
        </p>
      )}

      <div className="relative mt-4 flex rounded-2xl bg-white/10 p-3">
        {[
          { icon: Wallet, label: "WALLET", value: wallet },
          { icon: TrendingUp, label: "INVESTED", value: invested },
        ].map((s, i) => (
          <div key={s.label} className={cn("min-w-0 flex-1", i > 0 && "ml-3 border-l border-white/15 pl-3")}>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/70">
              <s.icon className="size-3.5" />
              {s.label}
            </span>
            <p className="mt-1 truncate text-[17px] font-bold">{loading ? "—" : show(s.value)}</p>
          </div>
        ))}
      </div>

      {footer && <div className="relative">{footer}</div>}
    </div>
  );
}

/* -------------------------------- Stat tile ------------------------------ */

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  tone?: Tone;
  href?: string;
  onClick?: () => void;
  highlight?: boolean;
}

export function StatTile({ icon: Icon, label, value, tone = "success", href, onClick, highlight }: StatTileProps) {
  const c = toneClasses[tone];
  const body = (
    <>
      <div className="mb-2 flex items-start justify-between">
        <span className={cn("flex size-9 items-center justify-center rounded-xl", c.bg, c.fg)}>
          <Icon className="size-[18px]" />
        </span>
        {highlight && <span className={cn("size-2 animate-pulse rounded-full", c.dot)} />}
      </div>
      <p className="truncate text-xl font-bold text-np-text">{value}</p>
      <p className="mt-0.5 line-clamp-2 text-[13px] text-np-muted">{label}</p>
    </>
  );
  const cls = "block min-w-0 rounded-[20px] border border-np-border bg-white p-4 text-left shadow-np";
  const hover = "cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.97]";
  if (href)
    return (
      <Link href={href} className={cn(cls, hover)}>
        {body}
      </Link>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cn(cls, hover)}>
        {body}
      </button>
    );
  return <div className={cls}>{body}</div>;
}

/* ----------------------------- Investment card --------------------------- */

export function InvestmentCard({ investment }: { investment: Investment }) {
  const qty = investment.qty ?? 1;
  return (
    <Link
      href={`/user/portfolio/${investment.id}`}
      className="flex gap-3 rounded-[20px] border border-np-border bg-white p-4 shadow-np transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-np-primary-soft text-np-primary-dark">
        <BriefcaseBusiness className="size-5" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-np-text">{investment.Project?.title ?? "Project investment"}</p>
          <p className="max-w-[55%] shrink-0 truncate text-[15px] font-semibold text-np-text">{formatMoney(investment.amount)}</p>
        </div>
        <p className="truncate text-[13px] text-np-subtle">
          #{investment.serial} · {qty} share{qty === 1 ? "" : "s"} · {investment.paymentMethod === "WALLET" ? "Wallet" : investment.paymentMethod} ·{" "}
          {formatDate(investment.createdAt)}
        </p>
        <StatusBadge status={investment.status} className="mt-1" />
      </div>
    </Link>
  );
}

/* ------------------------------- Return item ----------------------------- */

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

//one scheduled payout: a calendar tile, what it's for, and how much
export function ReturnItem({ item, index, compact, link = true }: { item: InvestmentReturn; index?: number; compact?: boolean; link?: boolean }) {
  const d = new Date(item.date);
  const days = daysUntil(item.date);
  const overdue = item.status === "PENDING" && days !== null && days < 0;
  const soon = item.status === "PENDING" && days !== null && days >= 0 && days <= 7;

  const body = (
    <>
      <span
        className={cn(
          "flex h-14 w-13 shrink-0 flex-col items-center justify-center rounded-xl",
          item.status === "PAID" ? "bg-np-surface-muted" : overdue ? "bg-np-danger-soft" : "bg-np-primary-soft",
        )}
      >
        <span className={cn("text-[11px] font-semibold tracking-wide", overdue ? "text-np-danger" : "text-np-primary-dark")}>{MONTHS[d.getUTCMonth()]}</span>
        <span className={cn("text-xl font-bold leading-6", overdue ? "text-np-danger" : "text-np-text")}>{d.getUTCDate()}</span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-np-text">
          {compact ? `Payout ${index != null ? index + 1 : ""}`.trim() : item.ProjectInvestment?.Project?.title ?? "Investment return"}
        </p>
        <p className={cn("mt-0.5 text-[13px]", overdue ? "text-np-danger" : soon ? "text-np-warning" : "text-np-subtle")}>
          {item.status === "PENDING" ? (overdue ? `Overdue · ${relativeDay(item.date)}` : relativeDay(item.date)) : `${item.qty ?? 1} share(s)`}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[15px] font-semibold text-np-text">{formatMoney(item.totalAmount ?? 0)}</span>
        <StatusBadge status={item.status} />
      </div>
    </>
  );

  const cls = "flex items-center gap-3 py-3";
  return link ? (
    <Link href={`/user/portfolio/${item.InvestmentId}`} className={cn(cls, "-mx-2 rounded-xl px-2 transition-colors hover:bg-np-surface-muted/70")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/* ---------------------------- Wallet transaction ------------------------- */

//explains where money came from / went, including investment-driven entries
const describe = (t: WalletTransaction): string => {
  const project = t.ProjectInvestment?.Project?.title;
  if (t.type === "DEPOSIT") {
    if (t.investmentId) return project ? `Payout · ${project}` : "Investment payout";
    return "Added money";
  }
  if (t.investmentId) return project ? `Invested · ${project}` : "Investment";
  return "Withdrawal";
};

export function TransactionItem({ item, onSelect }: { item: WalletTransaction; onSelect: (t: WalletTransaction) => void }) {
  const incoming = item.type === "DEPOSIT";
  const settled = item.status === "APPROVED";
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-np-surface-muted/70"
    >
      <span className={cn("flex size-10.5 shrink-0 items-center justify-center rounded-xl", incoming ? "bg-np-success-soft text-np-success" : "bg-np-danger-soft text-np-danger")}>
        {incoming ? <ArrowDown className="size-[18px]" /> : <ArrowUp className="size-[18px]" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-np-text">{describe(item)}</p>
        <p className="mt-0.5 truncate text-[13px] text-np-subtle">
          {item.paymentMethod} · {formatDateTime(item.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className={cn("text-[15px] font-semibold", !settled ? "text-np-muted" : incoming ? "text-np-success" : "text-np-text")}>
          {incoming ? "+" : "−"}
          {formatMoney(item.amount)}
        </span>
        {!settled && <StatusBadge status={item.status} />}
      </div>
      <ChevronRight className="hidden size-4 shrink-0 text-np-subtle sm:block" />
    </button>
  );
}

export function TransactionSheet({ transaction: t, onClose }: { transaction: WalletTransaction | null; onClose: () => void }) {
  const proof = mediaUrl(t?.proof1);
  return (
    <Sheet open={!!t} onClose={onClose} title={t ? `${statusLabel(t.type)} #${t.serial}` : ""}>
      {t && (
        <div>
          <div className="flex flex-col items-center gap-2 pb-4 pt-2">
            <p className={cn("text-[30px] font-extrabold tracking-tight", t.type === "DEPOSIT" ? "text-np-success" : "text-np-text")}>
              {t.type === "DEPOSIT" ? "+" : "−"}
              {formatMoney(t.amount)}
            </p>
            <StatusBadge status={t.status} />
          </div>
          {!!t.ProjectInvestment?.Project && <InfoRow label="Project" value={t.ProjectInvestment.Project.title} />}
          <InfoRow label="Method" value={t.paymentMethod} />
          <InfoRow label="Payment date" value={t.paymentDate ? formatDate(t.paymentDate) : undefined} />
          <InfoRow label="Reference" value={t.transactionId ?? undefined} />
          <InfoRow label="Requested" value={formatDateTime(t.createdAt)} last={!t.comments} />
          {!!t.comments && <InfoRow label="Note" value={t.comments} last />}
          {proof && (
            <a href={proof} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-2xl bg-np-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={proof} alt="Payment proof" className="h-52 w-full object-cover" />
            </a>
          )}
        </div>
      )}
    </Sheet>
  );
}
