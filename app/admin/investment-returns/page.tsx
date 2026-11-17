"use client";
import React, { useState } from "react";
import { generateQueryArray } from "@/utils/query";
import InvestmentReturnHeader from "@/views/admin/project/InvestmentReturn/InvestmentReturnHeader";
import InvestmentReturnView from "@/views/admin/project/InvestmentReturn/InvestmentReturnView";
import { useGetAllProjectInvestmentReturnsQuery } from "@/state/features/projects/investmentReturnApi";

const Blogs = () => {
  //default view: everything still owed (overdue first, then upcoming), nearest due date first
  const [query, setQuery] = useState<any>({
    search: null,
    status: "PENDING",
    days: 0,
    sortBy: "date",
    sort: "asc",
  });

  //currentData (not data) - `data` keeps the previous filter's rows while a new
  //request is in flight or after it fails, so the table would ignore the filter
  const { currentData: data, isFetching: isLoading, error } =
    useGetAllProjectInvestmentReturnsQuery(generateQueryArray(query));

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <InvestmentReturnHeader
        changeQuery={changeQuery}
        query={query}
        rows={data?.data}
        isLoading={isLoading}
      />
      {error && (
        <p className="my-3 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {(error as any)?.status === 401
            ? "Your session has expired. Please log in again."
            : (error as any)?.data?.message || "Failed to load investment returns."}
        </p>
      )}
      <InvestmentReturnView data={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Blogs;
