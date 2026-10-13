"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChartPie, Hourglass, Layers, TrendingUp } from "lucide-react";
import { useGetAllProjectInvestmentsQuery } from "@/state/features/projects/projectInvestmentApi";
import { formatMoneyCompact } from "../lib/format";
import { listOf, toQuery, useCounts, usePageSize } from "../lib/hooks";
import type { Investment, InvestmentStatus } from "../lib/types";
import { InvestmentCard, StatTile } from "../components/finance";
import { EmptyState, ErrorState, FilterChips, ListSkeleton, LoadMore, rise } from "../ui/primitives";
import { HeaderIconButton, PageTitle } from "../shell/ScreenHeader";

type Filter = InvestmentStatus | "ALL";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "APPROVED" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "CLOSED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const isFilter = (v?: string): v is Filter => !!v && FILTERS.some((f) => f.value === v);

export default function PortfolioScreen({ status }: { status?: string }) {
  const [filter, setFilter] = useState<Filter>(isFilter(status) ? status : "ALL");
  const { counts } = useCounts();
  const page = usePageSize();
  const { reset } = page;

  //links such as the "awaiting approval" banner can preset the filter;
  //adjusting state during render avoids an extra effect pass
  const [linkedStatus, setLinkedStatus] = useState(status);
  if (status !== linkedStatus) {
    setLinkedStatus(status);
    if (isFilter(status)) setFilter(status);
  }

  useEffect(reset, [filter, reset]);

  //non-admins are scoped to their own investments by the server
  const q = useGetAllProjectInvestmentsQuery(toQuery({ status: filter, size: page.size }));
  const list = listOf<Investment>(q, page.size);

  return (
    <div>
      <PageTitle
        title="Portfolio"
        subtitle="Your investments and their status"
        right={
          <HeaderIconButton href="/user/returns" label="Return schedule">
            <CalendarDays className="size-5" />
          </HeaderIconButton>
        }
      />

      <div {...rise(0)} className="grid animate-np-rise grid-cols-3 gap-2 sm:gap-3">
        <StatTile icon={TrendingUp} label="Active capital" value={formatMoneyCompact(counts?.totalInvestedAmount)} />
        <StatTile icon={Layers} tone="info" label="Projects" value={counts?.totalProjects ?? "—"} />
        <StatTile
          icon={Hourglass}
          tone="warning"
          label="Pending"
          value={counts?.totalPendingInvestments ?? "—"}
          highlight={!!counts?.totalPendingInvestments}
          onClick={() => setFilter("PENDING")}
        />
      </div>

      <div className="py-4">
        <FilterChips items={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {list.loading ? (
        <ListSkeleton rows={4} height={110} />
      ) : list.isError ? (
        <ErrorState onRetry={list.refetch} />
      ) : list.items.length ? (
        <>
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {list.items.map((inv, i) => (
              <div key={inv.id} {...rise(Math.min(i, 8))}>
                <InvestmentCard investment={inv} />
              </div>
            ))}
          </div>
          <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onMore={page.more} />
        </>
      ) : (
        <EmptyState
          icon={ChartPie}
          title={filter === "ALL" ? "No investments yet" : "Nothing in this list"}
          message={filter === "ALL" ? "Pick a project and start earning halal returns." : "Try a different filter."}
          actionLabel={filter === "ALL" ? "Browse projects" : undefined}
          actionHref={filter === "ALL" ? "/user/projects" : undefined}
        />
      )}
    </div>
  );
}
