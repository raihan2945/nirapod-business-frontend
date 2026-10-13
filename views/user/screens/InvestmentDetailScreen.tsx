"use client";

import Link from "next/link";
import { useState } from "react";
import { BriefcaseBusiness, CalendarX, ChevronRight, Expand, type LucideIcon, CircleCheck, Clock, Info, CircleX } from "lucide-react";
import { useGetSingleProjectInvestmentByIdQuery } from "@/state/features/projects/projectInvestmentApi";
import { useGetAllProjectInvestmentReturnsQuery } from "@/state/features/projects/investmentReturnApi";
import { useGetSingleProjectByIdQuery } from "@/state/features/projects/projectsApi";
import { formatDate, formatDateTime, formatMoney, percent, toNumber } from "../lib/format";
import { errorMessage, toQuery } from "../lib/hooks";
import { mediaUrl } from "../lib/project";
import type { Tone } from "../lib/status";
import type { Investment, InvestmentReturn, ListResponse, Project } from "../lib/types";
import { ReturnItem } from "../components/finance";
import { Card, EmptyState, ErrorState, InfoRow, Notice, ProgressBar, Skeleton, Spinner, StatusBadge, rise } from "../ui/primitives";
import { Sheet } from "../ui/overlay";
import { ScreenHeader } from "../shell/ScreenHeader";

const STATUS_NOTE: Record<string, { tone: Tone; icon: LucideIcon; title: string; message: string }> = {
  PENDING: { tone: "warning", icon: Clock, title: "Awaiting approval", message: "Our team is verifying your payment. Your return schedule is created once it's approved." },
  APPROVED: { tone: "success", icon: CircleCheck, title: "Active investment", message: "Your capital is at work. Payouts arrive on the dates below." },
  CLOSED: { tone: "info", icon: Info, title: "Completed", message: "All payouts are done and your capital was returned to your wallet." },
  REJECTED: { tone: "danger", icon: CircleX, title: "Rejected", message: "This investment couldn't be verified. Contact support if you believe this is a mistake." },
  CANCELLED: { tone: "danger", icon: CircleX, title: "Cancelled", message: "This investment was cancelled and the amount refunded to your wallet." },
};

export default function InvestmentDetailScreen({ id }: { id: string }) {
  const [proofOpen, setProofOpen] = useState(false);

  const inv = useGetSingleProjectInvestmentByIdQuery(id);
  const investment = (inv.data as { data?: Investment } | undefined)?.data;
  const projectQ = useGetSingleProjectByIdQuery(investment?.projectId, { skip: !investment?.projectId });
  const project = (projectQ.data as { data?: Project } | undefined)?.data;
  //scoping to one investment returns its whole schedule, not just 7 days
  const schedule = useGetAllProjectInvestmentReturnsQuery(toQuery({ investmentId: id, allDates: true, size: 100, sortBy: "date", sort: "asc" }));

  if (inv.isLoading) {
    return (
      <>
        <ScreenHeader title="Investment" back="/user/portfolio" />
        <Spinner />
      </>
    );
  }
  if (inv.isError || !investment) {
    return (
      <>
        <ScreenHeader title="Investment" back="/user/portfolio" />
        <ErrorState message={errorMessage(inv.error, "Investment not found")} onRetry={inv.refetch} />
      </>
    );
  }

  const returns = (schedule.data as ListResponse<InvestmentReturn> | undefined)?.data ?? [];
  const paid = returns.filter((r) => r.status === "PAID");
  const received = paid.reduce((s, r) => s + toNumber(r.totalAmount), 0);
  const expected = returns.filter((r) => r.status !== "CANCELLED").reduce((s, r) => s + toNumber(r.totalAmount), 0);
  const note = STATUS_NOTE[investment.status];
  const proof = mediaUrl(investment.proof1);
  const wallet = investment.paymentMethod === "WALLET";

  return (
    <>
      <ScreenHeader title={`Investment #${investment.serial}`} back="/user/portfolio" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          {/* summary */}
          <Card {...rise(0)} className="animate-np-rise">
            <Link href={project ? `/user/projects/${project.id}` : "#"} className="-m-2 flex items-center gap-3 rounded-2xl p-2 hover:bg-np-surface-muted/70">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-np-primary-soft text-np-primary-dark">
                <BriefcaseBusiness className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                {project ? <p className="line-clamp-2 font-semibold">{project.title}</p> : <Skeleton className="h-4 w-40" />}
                <p className="mt-0.5 text-[13px] text-np-muted">
                  {investment.qty ?? 1} share(s) · {formatDate(investment.investmentAt)}
                </p>
              </div>
              <ChevronRight className="size-[18px] text-np-subtle" />
            </Link>

            <div className="flex flex-col items-center gap-1.5 py-6">
              <p className="text-[13px] text-np-muted">Amount invested</p>
              <p className="text-[30px] font-extrabold tracking-tight sm:text-4xl">{formatMoney(investment.amount)}</p>
              <StatusBadge status={investment.status} />
            </div>

            {returns.length > 0 && (
              <div className="space-y-2 border-t border-np-border pt-4">
                <div className="flex justify-between gap-3 text-[13px]">
                  <span className="text-np-muted">Returns received</span>
                  <span className="text-right font-bold">
                    {formatMoney(received)} / {formatMoney(expected)}
                  </span>
                </div>
                <ProgressBar value={percent(received, expected)} />
                <p className="text-[13px] text-np-subtle">
                  {paid.length} of {returns.length} payouts completed
                </p>
              </div>
            )}
          </Card>

          {note && (
            <div {...rise(1)}>
              <Notice tone={note.tone} icon={note.icon} title={note.title} message={note.message} />
            </div>
          )}

          {/* payment */}
          <Card {...rise(2)} className="animate-np-rise">
            <h3 className="mb-1 text-[17px] font-bold">Payment</h3>
            <InfoRow label="Method" value={wallet ? "Wallet" : investment.paymentMethod} />
            <InfoRow label="Payment date" value={investment.paymentDate ? formatDate(investment.paymentDate) : undefined} />
            <InfoRow label="Reference" value={investment.transactionId && !wallet ? investment.transactionId : undefined} />
            <InfoRow label="Submitted" value={formatDateTime(investment.createdAt)} last={!investment.comments} />
            {!!investment.comments && <InfoRow label="Remarks" value={investment.comments} last />}
            {proof && (
              <button
                type="button"
                onClick={() => setProofOpen(true)}
                aria-label="View payment proof"
                className="relative mt-3 block h-44 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-np-surface-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proof} alt="" className="size-full object-cover" />
                <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-np-deeper/70 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
                  <Expand className="size-3.5" />
                  PAYMENT PROOF
                </span>
              </button>
            )}
          </Card>
        </div>

        {/* schedule */}
        <Card {...rise(3)} className="animate-np-rise">
          <h3 className="text-[17px] font-bold">Return schedule</h3>
          {schedule.isLoading ? (
            <Skeleton className="mt-3 h-14" />
          ) : returns.length ? (
            <div className="divide-y divide-np-border">
              {returns.map((r, i) => (
                <ReturnItem key={r.id} item={r} index={i} compact link={false} />
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              icon={CalendarX}
              title="No schedule yet"
              message={investment.status === "PENDING" ? "Payout dates appear once this investment is approved." : "There are no payouts for this investment."}
            />
          )}
        </Card>
      </div>

      <Sheet open={proofOpen} onClose={() => setProofOpen(false)} title="Payment proof" size="lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {proof && <img src={proof} alt="Payment proof" className="max-h-[70vh] w-full rounded-2xl object-contain" />}
      </Sheet>
    </>
  );
}
