"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney, formatMoneyCompact } from "../lib/format";
import { mediaUrl, roiLabel } from "../lib/project";
import type { Project } from "../lib/types";
import { StatusBadge } from "../ui/primitives";

function Cover({ project, className }: { project: Project; className: string }) {
  const cover = mediaUrl(project.coverPhoto);
  return (
    <div className={`relative overflow-hidden bg-np-surface-muted ${className}`}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C6B4B] to-np-primary">
          <BriefcaseBusiness className="absolute bottom-3 right-4 size-11 text-white/35" />
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-[11px] font-semibold tracking-wide text-np-subtle">{label}</p>
      <p className="mt-0.5 truncate text-[15px] font-semibold text-np-text">{value}</p>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/user/projects/${project.id}`}
      className="group flex w-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-np-border bg-white shadow-np transition-transform hover:-translate-y-0.5"
    >
      <div className="relative">
        <Cover project={project} className="h-40" />
        <StatusBadge status={project.status} className="absolute left-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[17px] font-bold text-np-text">{project.title}</h3>
        {!!project.description && <p className="mt-1 line-clamp-2 text-[13px] leading-[18px] text-np-muted">{project.description}</p>}

        <div className="mt-3 flex gap-2 rounded-xl bg-np-surface-muted p-3">
          <Metric label="MIN. INVEST" value={formatMoneyCompact(project.minInvestment)} />
          <Metric label="EXP. ROI" value={roiLabel(project)} />
          <Metric label="DURATION" value={`${project.projectDuration || 0} mo`} />
        </div>

        {/* pins the footer to the bottom so cards in a grid row line up */}
        <div className="flex-1" />
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-np-border pt-3">
          <span className="truncate text-[13px] text-np-muted">Goal {formatMoney(project.investmentGoal)}</span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] font-bold text-np-primary-dark">
            View details
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

//compact card for horizontal carousels
export function ProjectMiniCard({ project, className }: { project: Project; className?: string }) {
  return (
    <Link
      href={`/user/projects/${project.id}`}
      className={cn(
        "group block w-[250px] shrink-0 snap-start overflow-hidden rounded-[20px] border border-np-border bg-white shadow-np transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="relative">
        <Cover project={project} className="h-32" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-np-deeper/85" />
        <p className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-[15px] font-semibold text-white">{project.title}</p>
      </div>
      <div className="flex items-center justify-between gap-2 p-3 text-[13px]">
        <span className="truncate text-np-muted">From {formatMoneyCompact(project.minInvestment)}</span>
        <span className="truncate font-bold text-np-primary-dark">ROI {roiLabel(project)}</span>
      </div>
    </Link>
  );
}
