"use client";
import React, { useState } from "react";
import { generateQueryArray } from "@/utils/query";
import ProjectView from "@/views/admin/project/ProjectView";
import ProjectHeader from "@/views/admin/project/HeaderSection";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";

const Projects = () => {
  const [query, setQuery] = useState({
    search: null,
    status: null,
    sort: "asc",
  });

  const { data, isLoading } = useGetAllProjectsQuery(generateQueryArray(query));

  console.log("Projects Data:", data);

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <ProjectHeader changeQuery={changeQuery} query={query} />
      <ProjectView data={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Projects;
