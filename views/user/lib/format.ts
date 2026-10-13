import type { Money } from "./types";

//same helpers as the mobile app, so both clients print numbers and dates alike

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const toNumber = (value: Money | null | undefined): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

//South Asian grouping (12,34,567) - what investors in Bangladesh expect to read
export const groupDigits = (value: number): string => {
  const negative = value < 0;
  const [int, dec] = Math.abs(value).toFixed(2).split(".");
  let last3 = int.slice(-3);
  const rest = int.slice(0, -3);
  if (rest) last3 = `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
  const decimals = dec === "00" ? "" : `.${dec}`;
  return `${negative ? "-" : ""}${last3}${decimals}`;
};

export const formatMoney = (value: Money | null | undefined): string => `৳${groupDigits(toNumber(value))}`;

//compact form for tight spaces: ৳1.2L, ৳3.4Cr
export const formatMoneyCompact = (value: Money | null | undefined): string => {
  const n = toNumber(value);
  const abs = Math.abs(n);
  if (abs >= 1e7) return `৳${(n / 1e7).toFixed(abs >= 1e8 ? 0 : 1)}Cr`;
  if (abs >= 1e5) return `৳${(n / 1e5).toFixed(abs >= 1e6 ? 0 : 1)}L`;
  if (abs >= 1e3) return `৳${(n / 1e3).toFixed(abs >= 1e4 ? 0 : 1)}K`;
  return formatMoney(n);
};

const toDate = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDate = (value?: string | Date | null): string => {
  const d = toDate(value);
  if (!d) return "—";
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateTime = (value?: string | Date | null): string => {
  const d = toDate(value);
  if (!d) return "—";
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(d)}, ${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
};

//YYYY-MM-DD in local time - the format the API's z.coerce.date() expects
export const toIsoDay = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

//whole days from today until a UTC `date` column (negative = overdue)
export const daysUntil = (value?: string | null): number | null => {
  const d = toDate(value);
  if (!d) return null;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.round((target - today) / 86_400_000);
};

export const relativeDay = (value?: string | null): string => {
  const days = daysUntil(value);
  if (days === null) return "";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return days > 0 ? `In ${days} days` : `${-days} days ago`;
};

export const isPast = (value?: string | null): boolean => {
  const days = daysUntil(value);
  return days !== null && days < 0;
};

export const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const initials = (name?: string | null): string =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

export const percent = (part: number, whole: number): number =>
  whole > 0 ? Math.min(100, Math.max(0, (part / whole) * 100)) : 0;
