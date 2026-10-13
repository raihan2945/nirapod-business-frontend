"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, BriefcaseBusiness, CircleArrowUp, CirclePlus, Receipt, Wallet } from "lucide-react";
import { useGetAllWalletTransactionsQuery } from "@/state/features/wallet/walletTransactionApi";
import { formatMoney, toNumber } from "../lib/format";
import { listOf, toQuery, useMe, usePageSize } from "../lib/hooks";
import type { ListResponse, WalletTransaction, WalletTransactionType } from "../lib/types";
import { QuickAction, TransactionItem, TransactionSheet } from "../components/finance";
import { Card, EmptyState, ErrorState, ListSkeleton, LoadMore, Segmented, Skeleton, rise } from "../ui/primitives";
import { PageTitle } from "../shell/ScreenHeader";

type Filter = WalletTransactionType | "ALL";

export default function WalletScreen() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selected, setSelected] = useState<WalletTransaction | null>(null);
  const { user, isLoading: meLoading } = useMe();
  const page = usePageSize();
  const { reset } = page;

  useEffect(reset, [filter, reset]);

  const q = useGetAllWalletTransactionsQuery(toQuery({ type: filter, size: page.size }));
  const list = listOf<WalletTransaction>(q, page.size);

  //pending requests don't move the balance yet - surface them separately
  const pendingQ = useGetAllWalletTransactionsQuery(toQuery({ status: "PENDING", size: 100 }));
  const pending = (pendingQ.data as ListResponse<WalletTransaction> | undefined)?.data ?? [];
  const pendingIn = pending.filter((t) => t.type === "DEPOSIT").reduce((s, t) => s + toNumber(t.amount), 0);
  const pendingOut = pending.filter((t) => t.type === "WITHDRAWAL").reduce((s, t) => s + toNumber(t.amount), 0);

  return (
    <div>
      <PageTitle title="Wallet" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
        <div {...rise(0)} className="relative animate-np-rise overflow-hidden rounded-[28px] bg-gradient-to-br from-[#123F31] to-[#1C6B4B] p-5 text-white sm:p-6 lg:sticky lg:top-8">
          <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full border-[28px] border-white/[0.05]" />
          <div className="relative flex items-center justify-between">
            <span className="text-[13px] font-medium text-white/75">Available balance</span>
            <Wallet className="size-5 text-white/60" />
          </div>
          {meLoading ? (
            <Skeleton className="relative mt-2 h-9 w-44 bg-white/20" />
          ) : (
            <p className="relative mt-1 truncate text-[30px] font-extrabold tracking-tight sm:text-4xl">{formatMoney(user?.balance)}</p>
          )}
          {(pendingIn > 0 || pendingOut > 0) && (
            <div className="relative mt-2 flex flex-wrap gap-2">
              {pendingIn > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                  <ArrowDown className="size-3" />
                  {formatMoney(pendingIn)} incoming
                </span>
              )}
              {pendingOut > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                  <ArrowUp className="size-3" />
                  {formatMoney(pendingOut)} processing
                </span>
              )}
            </div>
          )}
          <div className="relative mt-5 flex">
            <QuickAction onDark icon={CirclePlus} label="Add money" href="/user/wallet/request?type=DEPOSIT" />
            <QuickAction onDark icon={CircleArrowUp} label="Withdraw" href="/user/wallet/request?type=WITHDRAWAL" />
            <QuickAction onDark icon={BriefcaseBusiness} label="Invest" href="/user/invest" />
          </div>
        </div>

        <div>
          <Segmented
            className="mb-4"
            items={[
              { label: "All", value: "ALL" },
              { label: "Money in", value: "DEPOSIT" },
              { label: "Money out", value: "WITHDRAWAL" },
            ]}
            value={filter}
            onChange={setFilter}
          />

          {list.loading ? (
            <ListSkeleton rows={5} height={64} />
          ) : list.isError ? (
            <ErrorState onRetry={list.refetch} />
          ) : list.items.length ? (
            <>
              <Card padded={false} className="animate-np-fade divide-y divide-np-border px-4 sm:px-5">
                {list.items.map((t) => (
                  <TransactionItem key={t.id} item={t} onSelect={setSelected} />
                ))}
              </Card>
              <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onMore={page.more} />
            </>
          ) : (
            <EmptyState icon={Receipt} title="No transactions yet" message="Add money to your wallet to invest instantly in any open project." />
          )}
        </div>
      </div>

      <TransactionSheet transaction={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
