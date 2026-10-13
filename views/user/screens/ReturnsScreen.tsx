"use client";

import { useEffect, useState } from "react";
import { CalendarX } from "lucide-react";
import { useGetAllProjectInvestmentReturnsQuery } from "@/state/features/projects/investmentReturnApi";
import { listOf, toQuery, usePageSize } from "../lib/hooks";
import type { InvestmentReturn } from "../lib/types";
import { ReturnItem } from "../components/finance";
import { Card, EmptyState, ErrorState, ListSkeleton, LoadMore, Segmented } from "../ui/primitives";
import { ScreenHeader } from "../shell/ScreenHeader";

type View = "upcoming" | "all" | "paid";

//the API's default window is "next 7 days"; the other tabs widen it
const QUERY: Record<View, Record<string, unknown>> = {
  upcoming: { status: "PENDING", sortBy: "date", sort: "asc" },
  all: { allDates: true, sortBy: "date", sort: "asc" },
  paid: { allDates: true, status: "PAID", sortBy: "date", sort: "desc" },
};

const EMPTY: Record<View, { title: string; message: string }> = {
  upcoming: { title: "Nothing due this week", message: "Check the All tab for later payout dates." },
  all: { title: "No returns scheduled", message: "Returns are scheduled when an investment is approved." },
  paid: { title: "No payouts received yet", message: "Returns are scheduled when an investment is approved." },
};

export default function ReturnsScreen() {
  const [view, setView] = useState<View>("upcoming");
  const page = usePageSize();
  const { reset } = page;

  useEffect(reset, [view, reset]);

  const q = useGetAllProjectInvestmentReturnsQuery(toQuery({ ...QUERY[view], size: page.size }));
  const list = listOf<InvestmentReturn>(q, page.size);

  return (
    <>
      <ScreenHeader title="Return schedule" subtitle="Payouts from your investments" back="/user/portfolio" />

      <Segmented
        className="mb-4 max-w-md"
        items={[
          { label: "Next 7 days", value: "upcoming" },
          { label: "All", value: "all" },
          { label: "Received", value: "paid" },
        ]}
        value={view}
        onChange={setView}
      />

      {list.loading ? (
        <ListSkeleton rows={4} height={72} />
      ) : list.isError ? (
        <ErrorState onRetry={list.refetch} />
      ) : list.items.length ? (
        <>
          <Card padded={false} className="animate-np-fade divide-y divide-np-border px-4 sm:px-5">
            {list.items.map((r) => (
              <ReturnItem key={r.id} item={r} />
            ))}
          </Card>
          <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onMore={page.more} />
        </>
      ) : (
        <EmptyState icon={CalendarX} {...EMPTY[view]} />
      )}
    </>
  );
}
