"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CalendarX,
  CircleArrowUp,
  CirclePlus,
  Clock,
  Hourglass,
  Layers,
  Banknote,
  Newspaper,
} from "lucide-react";
import { useGetAllProjectInvestmentReturnsQuery } from "@/state/features/projects/investmentReturnApi";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";
import { formatMoney, greeting, toNumber } from "../lib/format";
import { toQuery, useCounts, useMe } from "../lib/hooks";
import type { InvestmentReturn, ListResponse, Project } from "../lib/types";
import { BalanceCard, QuickAction, ReturnItem, StatTile } from "../components/finance";
import { ProjectMiniCard } from "../components/ProjectCard";
import { cn } from "@/lib/utils";
import { Avatar, Button, Card, EmptyState, Notice, SectionHeader, Skeleton, rise } from "../ui/primitives";

//desktop shows the open projects as two full grid rows (2 columns on xl,
//where the column is narrower, 3 elsewhere); phones keep the whole carousel
const desktopVisibility = (i: number) => (i >= 6 ? "lg:hidden" : i >= 4 ? "xl:hidden 2xl:block" : undefined);

export default function HomeScreen() {
  const { user, isLoading: meLoading } = useMe();
  const { counts, isLoading: countsLoading } = useCounts();
  //without a date filter the API returns the next 7 days
  const upcoming = useGetAllProjectInvestmentReturnsQuery(toQuery({ status: "PENDING", size: 50, sortBy: "date", sort: "asc" }));
  const projects = useGetAllProjectsQuery(toQuery({ status: "ACTIVE", size: 8 }));

  const upcomingItems = (upcoming.data as ListResponse<InvestmentReturn> | undefined)?.data ?? [];
  const projectItems = (projects.data as ListResponse<Project> | undefined)?.data ?? [];

  const wallet = toNumber(user?.balance);
  const invested = toNumber(counts?.totalInvestedAmount);
  const pending = counts?.totalPendingInvestments ?? 0;
  const upcomingTotal = upcomingItems.reduce((sum, r) => sum + toNumber(r.totalAmount), 0);

  return (
    <div className="pt-6 lg:pt-10">
      {/* greeting */}
      <div {...rise(0)} className="flex animate-np-rise items-center gap-3 pb-4">
        <Link href="/user/profile" className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={user?.fullName} photo={user?.photo} size={46} />
          <div className="min-w-0">
            <p className="text-[13px] text-np-muted">{greeting()},</p>
            <p className="truncate text-[17px] font-bold">{user?.fullName}</p>
          </div>
        </Link>
        <Link
          href="/blogs"
          aria-label="Insights"
          title="Insights"
          className="flex size-10.5 shrink-0 items-center justify-center rounded-full border border-np-border bg-white transition-colors hover:bg-np-surface-muted lg:hidden"
        >
          <Newspaper className="size-5" />
        </Link>
        {/* the sidebar handles navigation on desktop, so surface the main actions here */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" icon={Newspaper} href="/blogs">
            Insights
          </Button>
          <Button size="sm" icon={BriefcaseBusiness} href="/user/projects">
            Browse projects
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* balance + actions */}
        <div {...rise(1)}>
          <BalanceCard
            wallet={wallet}
            invested={invested}
            loading={meLoading || countsLoading}
            footer={
              <div className="mt-4 flex">
                <QuickAction onDark icon={CirclePlus} label="Add money" href="/user/wallet/request?type=DEPOSIT" />
                <QuickAction onDark icon={CircleArrowUp} label="Withdraw" href="/user/wallet/request?type=WITHDRAWAL" />
                <QuickAction onDark icon={BriefcaseBusiness} label="Invest" href="/user/invest" />
                <QuickAction onDark icon={CalendarDays} label="Returns" href="/user/returns" />
              </div>
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          {/* account notices */}
          {user?.verifyStatus === "PENDING" && (
            <div {...rise(2)}>
              <Notice tone="warning" icon={Clock} title="Verification in progress" message="Our team is reviewing your KYC details. You can still browse and invest." />
            </div>
          )}
          {pending > 0 && (
            <div {...rise(2)}>
              <Notice
                tone="info"
                icon={Hourglass}
                title={`${pending} investment${pending > 1 ? "s" : ""} awaiting approval`}
                message="We'll confirm once your payment is verified."
                href="/user/portfolio?status=PENDING"
              />
            </div>
          )}

          {/* stats */}
          <div {...rise(3)} className="grid flex-1 animate-np-rise grid-cols-2 gap-3">
            <StatTile icon={Layers} label="Projects invested" value={counts?.totalProjects ?? "—"} href="/user/portfolio" />
            <StatTile icon={Banknote} tone="info" label="Due in next 7 days" value={upcoming.isLoading ? "—" : formatMoney(upcomingTotal)} href="/user/returns" />
          </div>
        </div>
      </div>

      {/* phones stack returns above projects; from xl the projects take the wide
          column and returns sit beside them, lined up with the cards above */}
      <div className="xl:grid xl:grid-cols-[1.35fr_1fr] xl:grid-rows-[auto_1fr] xl:gap-x-4">
        {/* upcoming payouts */}
        <div {...rise(4)} className="animate-np-rise xl:col-start-2 xl:row-start-1">
          <SectionHeader title="Upcoming returns" href="/user/returns" />
          <Card padded={false} className="px-4 sm:px-5">
            {upcoming.isLoading ? (
              <div className="py-4">
                <Skeleton className="h-14" />
              </div>
            ) : upcomingItems.length ? (
              <div className="divide-y divide-np-border">
                {upcomingItems.slice(0, 5).map((r) => (
                  <ReturnItem key={r.id} item={r} />
                ))}
              </div>
            ) : (
              <EmptyState compact icon={CalendarX} title="Nothing due this week" message="Payouts scheduled in the next 7 days will show up here." />
            )}
          </Card>
        </div>

        {/* open projects */}
        <div {...rise(5)} className="min-w-0 animate-np-rise xl:col-start-1 xl:row-span-2 xl:row-start-1">
          <SectionHeader title="Open for investment" href="/user/projects" />
          {projects.isLoading ? (
            <div className="flex gap-3 overflow-hidden lg:grid lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-52 w-[250px] shrink-0 rounded-[20px] lg:w-auto" />
              ))}
            </div>
          ) : projectItems.length ? (
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-2 2xl:grid-cols-3">
              {projectItems.map((p, i) => (
                <ProjectMiniCard key={p.id} project={p} className={cn("lg:w-auto", desktopVisibility(i))} />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState compact icon={BriefcaseBusiness} title="No open projects right now" message="New opportunities are added regularly." />
            </Card>
          )}
        </div>

        {/* nudge to the return schedule when nothing is due soon */}
        {!upcoming.isLoading && !upcomingItems.length && invested > 0 && (
          <div className="mt-4 xl:col-start-2 xl:row-start-2 xl:self-start">
            <Notice tone="success" icon={CalendarClock} title="See your full payout calendar" message="Every scheduled return across your investments." href="/user/returns" />
          </div>
        )}
      </div>
    </div>
  );
}
