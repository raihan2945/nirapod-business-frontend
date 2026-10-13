"use client";

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import { useGetUserByIdQuery, useGetUserCountsByIdQuery } from "@/state/features/user/userApi";
import { generateQueryArray } from "@/utils/query";
import type { ListResponse, User, UserCounts } from "./types";

export const PAGE_SIZE = 10;

export const useAuthId = () => useSelector((s: RootState) => s.auth?.id);

//the signed-in user, resolved from the token (includes the wallet balance)
export function useMe() {
  const id = useAuthId();
  const q = useGetUserByIdQuery(id, { skip: !id });
  return { ...q, user: (q.data as { data?: User } | undefined)?.data };
}

export function useCounts() {
  const id = useAuthId();
  const q = useGetUserCountsByIdQuery(id, { skip: !id });
  return { ...q, counts: (q.data as { data?: UserCounts } | undefined)?.data };
}

//every list query goes through the legacy query-array helper
export const toQuery = (params: Record<string, unknown>) => generateQueryArray(params);

//"Load more" grows the page size instead of paging, so one query holds the
//whole visible list. reset() whenever a filter changes.
export function usePageSize() {
  const [size, setSize] = useState(PAGE_SIZE);
  //stable so screens can list reset() as an effect dependency
  const more = useCallback(() => setSize((s) => s + PAGE_SIZE), []);
  const reset = useCallback(() => setSize(PAGE_SIZE), []);
  return { size, more, reset };
}

interface ListQuery {
  data?: unknown;
  currentData?: unknown;
  isFetching: boolean;
  isError: boolean;
  error?: unknown;
  refetch: () => unknown;
}

//While "load more" fetches, keep showing the shorter list (data); after a
//filter change show a skeleton instead of the previous filter's rows.
export function listOf<T>(q: ListQuery, size: number) {
  const res = (q.currentData ?? (size > PAGE_SIZE ? q.data : undefined)) as ListResponse<T> | undefined;
  const items = res?.data ?? [];
  const total = res?.pagination?.total_items;
  return {
    items,
    loading: !res && (q.isFetching || !q.isError),
    loadingMore: !!res && q.isFetching,
    hasMore: total != null ? items.length < total : items.length >= size,
    isError: q.isError && !res,
    error: q.error,
    refetch: q.refetch,
  };
}

//pull a readable message out of an RTK Query error
export const errorMessage = (err: unknown, fallback = "Something went wrong"): string => {
  const e = err as { status?: unknown; data?: { message?: string; errors?: { message?: string }[] } } | undefined;
  if (!e) return fallback;
  if (e.status === "FETCH_ERROR") return "Can't reach the server. Check your connection.";
  return e.data?.errors?.[0]?.message || e.data?.message || fallback;
};
