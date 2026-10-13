"use client";

import { useMemo, useState } from "react";
import { Banknote, Building2, ChevronDown, Clock, Lock, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetSingleProjectByIdQuery } from "@/state/features/projects/projectsApi";
import { formatDate, formatMoney, isPast } from "../lib/format";
import { errorMessage } from "../lib/hooks";
import { htmlToText, investBlockReason, markupLabel, mediaUrl, parseSections, roiLabel } from "../lib/project";
import type { Project, ProjectSection } from "../lib/types";
import { Button, Card, ErrorState, InfoRow, Notice, Spinner, StatusBadge, rise } from "../ui/primitives";
import { ScreenHeader, StickyFooter } from "../shell/ScreenHeader";

function Highlight({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-np-border bg-white p-3 shadow-np sm:p-4">
      <Icon className="size-[18px] text-np-primary" />
      <p className="mt-1.5 truncate text-[17px] font-bold">{value}</p>
      <p className="line-clamp-2 text-[13px] text-np-muted">{label}</p>
    </div>
  );
}

function Accordion({ items }: { items: ProjectSection[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-np-border">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left text-[15px] font-semibold"
          >
            {item.title || `Point ${i + 1}`}
            <ChevronDown className={cn("size-[18px] shrink-0 text-np-subtle transition-transform", open === i && "rotate-180")} />
          </button>
          {open === i && !!item.description && (
            <p className="animate-np-fade whitespace-pre-line pb-3 text-sm leading-6 text-np-muted">{htmlToText(item.description)}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProjectDetailScreen({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = useGetSingleProjectByIdQuery(id);
  const project = (data as { data?: Project } | undefined)?.data;

  const sections = useMemo(
    () =>
      project
        ? [
            { title: "Roles of Nirapad Business", items: parseSections(project.roles) },
            { title: "The Business", items: parseSections(project.theBusiness) },
            { title: "The Contract", items: parseSections(project.theContract) },
            { title: "Shariah Compliance", items: parseSections(project.shariahCompliance) },
            { title: "Potential Risks", items: parseSections(project.potentialRisks) },
          ].filter((s) => s.items.length > 0)
        : [],
    [project],
  );

  if (isLoading) {
    return (
      <>
        <ScreenHeader title="Project" back="/user/projects" />
        <Spinner />
      </>
    );
  }
  if (isError || !project) {
    return (
      <>
        <ScreenHeader title="Project" back="/user/projects" />
        <ErrorState message={errorMessage(error, "Project not found")} onRetry={refetch} />
      </>
    );
  }

  const blocked = investBlockReason(project);
  const markup = markupLabel(project);
  const cover = mediaUrl(project.coverPhoto);
  const bankInfo = htmlToText(project.bankInfo);

  return (
    <>
      <ScreenHeader title={project.title} back="/user/projects" />

      {/* cover */}
      <div className="relative h-56 overflow-hidden rounded-[28px] bg-np-deep sm:h-72">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#123F31] to-np-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-np-deeper/30 via-transparent to-np-deeper/70" />
      </div>

      <div className="grid gap-4 pt-5 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="space-y-4">
          <div {...rise(0)} className="animate-np-rise space-y-2">
            <StatusBadge status={project.status} />
            <h2 className="text-2xl font-extrabold tracking-tight">{project.title}</h2>
            {!!project.description && <p className="leading-6 text-np-muted">{project.description}</p>}
          </div>

          <div {...rise(1)} className="grid animate-np-rise grid-cols-3 gap-3">
            <Highlight icon={Banknote} label="Per share" value={formatMoney(project.minInvestment)} />
            <Highlight icon={TrendingUp} label="Expected ROI" value={roiLabel(project)} />
            <Highlight icon={Clock} label="Duration" value={`${project.projectDuration || 0} mo`} />
          </div>

          {sections.map((section) => (
            <Card key={section.title}>
              <h3 className="mb-1 text-[17px] font-bold">{section.title}</h3>
              <Accordion items={section.items} />
            </Card>
          ))}
        </div>

        {/* terms + invest - a sticky side panel on desktop */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <Card {...rise(3)} className="animate-np-rise">
            <h3 className="mb-1 text-[17px] font-bold">Key terms</h3>
            <InfoRow label="Investment goal" value={formatMoney(project.investmentGoal)} />
            <InfoRow label="Minimum investment" value={formatMoney(project.minInvestment)} />
            <InfoRow label={markup.label} value={markup.value} />
            <InfoRow label="Return per share, each payout" value={formatMoney(project.temporaryReturnAmount)} />
            <InfoRow label="Number of repayments" value={String(project.repayment || 0)} />
            <InfoRow label="Project duration" value={`${project.projectDuration || 0} months`} />
            <InfoRow
              label="Closing date"
              last
              value={<span className={project.closedDate && isPast(project.closedDate) ? "text-np-danger" : undefined}>{formatDate(project.closedDate)}</span>}
            />
          </Card>

          {!!bankInfo && (
            <Card>
              <div className="flex items-center gap-2">
                <Building2 className="size-[18px] text-np-primary-dark" />
                <h3 className="text-[17px] font-bold">Payment details</h3>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-np-muted">{bankInfo}</p>
            </Card>
          )}

          <StickyFooter>
            {blocked ? (
              <Notice tone="neutral" icon={Lock} title={blocked} />
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] text-np-muted">From</p>
                  <p className="truncate text-xl font-bold">{formatMoney(project.minInvestment)}</p>
                </div>
                <Button href={`/user/invest?projectId=${project.id}`} icon={Zap} size="lg">
                  Invest now
                </Button>
              </div>
            )}
          </StickyFooter>
        </div>
      </div>
    </>
  );
}
