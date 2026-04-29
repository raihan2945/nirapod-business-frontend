"use client";
import { useGetAllProjectInvestmentReturnsQuery } from "@/state/features/projects/investmentReturnApi";
import { generateQueryArray } from "@/utils/query";
import CounterView from "@/views/admin/dashboard/CounterView";
import InvestmentReturnView from "@/views/admin/project/InvestmentReturn/InvestmentReturnView";
import Link from "next/link";
import React, { useState } from "react";

const Dashboard = () => {
  const [query, setQuery] = useState<any>({
    search: null,
    status: "",
    days: 3,
  });

  const { data, isLoading } = useGetAllProjectInvestmentReturnsQuery(
    generateQueryArray(query),
  );

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <CounterView />
      <div className="mt-4">
        <div className="flex gap-2 items-end ">
          <h1 className="text-xl font-bold text-gray-600">
            Upcoming Returns In Next 3 Days
          </h1>
          <Link className="text-md font-semibold" href={"/admin/investment-returns"}>View Details</Link>
        </div>
        <InvestmentReturnView data={data?.data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
