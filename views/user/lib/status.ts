export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

//foreground / soft background class pairs per tone
export const toneClasses: Record<Tone, { fg: string; bg: string; dot: string }> = {
  success: { fg: "text-np-success", bg: "bg-np-success-soft", dot: "bg-np-success" },
  warning: { fg: "text-np-warning", bg: "bg-np-warning-soft", dot: "bg-np-warning" },
  danger: { fg: "text-np-danger", bg: "bg-np-danger-soft", dot: "bg-np-danger" },
  info: { fg: "text-np-info", bg: "bg-np-info-soft", dot: "bg-np-info" },
  neutral: { fg: "text-np-muted", bg: "bg-np-neutral-soft", dot: "bg-np-muted" },
};

//one place that decides how every backend status reads and is coloured
const STATUS_TONE: Record<string, Tone> = {
  APPROVED: "success",
  PAID: "success",
  ACTIVE: "success",
  COMPLETED: "success",
  PENDING: "warning",
  ON_GOING: "info",
  CLOSED: "info",
  INACTIVE: "neutral",
  REJECTED: "danger",
  CANCELLED: "danger",
  EXPIRED: "danger",
};

const STATUS_LABEL: Record<string, string> = {
  APPROVED: "Approved",
  PAID: "Paid",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  PENDING: "Pending",
  ON_GOING: "Ongoing",
  CLOSED: "Closed",
  INACTIVE: "Inactive",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
};

export const statusTone = (status?: string | null): Tone => (status && STATUS_TONE[status]) || "neutral";

export const statusLabel = (status?: string | null): string => (status && STATUS_LABEL[status]) || status || "—";
