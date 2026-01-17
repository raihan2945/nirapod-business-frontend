import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import { generateQueryArray } from "@/utils/query";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";

const ProjectSection = () => {
  const [query, setQuery] = useState({
    status: null,
    sort: "asc",
  });

  const { data } = useGetAllProjectsQuery(generateQueryArray(query));

  return (
    <section className="pt-8 sm:pt-16 lg:pt-20 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2 className="text-3xl text-center sm:text-4xl lg:text-5xl font-bold text-gray-800">
            Running Investment Projects
          </h2>
        </div>
        <section className="py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {data?.data?.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProjectSection;
