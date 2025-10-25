"use client";
import React, { useState } from "react";
import { generateQueryArray } from "@/utils/query";
import InvestorView from "@/views/admin/investors/InvestorView";
import InvestorHeader from "@/views/admin/investors/HeaderSection";
import { useGetAllInvestorsQuery } from "@/state/features/investors/investorApi";

const InvestorRequests = () => {
  const [query, setQuery] = useState({
    search: null,
    status: null,
  });

  const { data, isLoading } = useGetAllInvestorsQuery(generateQueryArray(query));

  console.log("Investor Requests Data:", data);

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <InvestorHeader changeQuery={changeQuery} query={query} />
      <InvestorView data={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default InvestorRequests;
