"use client";
import React, { useState } from "react";
import { generateQueryArray } from "@/utils/query";
import InvestmentReturnHeader from "@/views/admin/project/InvestmentReturn/InvestmentReturnHeader";
import InvestmentReturnView from "@/views/admin/project/InvestmentReturn/InvestmentReturnView";
import { useGetAllProjectInvestmentReturnsQuery } from "@/state/features/projects/investmentReturnApi";

const Blogs = () => {
  const [query, setQuery] = useState<any>({
    search: null,
    status: "PENDING",
    days: 1,
  });

  console.log("query", query);

  const { data, isLoading } = useGetAllProjectInvestmentReturnsQuery(
    generateQueryArray(query),
  );

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <InvestmentReturnHeader changeQuery={changeQuery} query={query} />
      <InvestmentReturnView data={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Blogs;
