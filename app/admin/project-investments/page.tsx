"use client";
import React, { useState } from "react";
import { useGetAllBlogsQuery } from "@/state/features/blogs/blogsApi";
import { generateQueryArray } from "@/utils/query";
import ProjectInvestmentView from "@/views/admin/project/ProjectInvestmentView";
import ProjectInvestmentHeader from "@/views/admin/project/ProjectInvestmentHeader";
import { useGetAllProjectInvestmentsQuery } from "@/state/features/projects/projectInvestmentApi";

const Blogs = () => {
  const [query, setQuery] = useState({
    search: null,
    status: "",
  });

  // console.log("query", query);

  const { data, isLoading } = useGetAllProjectInvestmentsQuery(generateQueryArray(query));

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (     
    <div>
      <ProjectInvestmentHeader changeQuery={changeQuery} query={query} />
      <ProjectInvestmentView data={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Blogs;
