import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { generateQueryArray } from "@/utils/query";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";

//how many projects the landing page previews before linking to the full list
const PREVIEW_COUNT = 8;

const ProjectSection = () => {
  const [query] = useState({
    status: "ACTIVE",
    sort: "desc",
  });

  const { data, isLoading } = useGetAllProjectsQuery(generateQueryArray(query));

  const projects = data?.data || [];
  const preview = projects.slice(0, PREVIEW_COUNT);

  return (
    <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Running investment projects
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Open for funding right now. Every project is reviewed for Shariah
            compliance before it is listed.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl border border-gray-100 bg-white"
              />
            ))}
          </div>
        ) : preview.length === 0 ? (
          <p className="mt-14 text-center text-gray-500">
            No projects are open for investment at the moment. Please check back
            soon.
          </p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
            {preview.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {projects.length > PREVIEW_COUNT && (
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-800 transition hover:border-[#31AD5C] hover:text-[#31AD5C]"
            >
              View all {projects.length} projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
