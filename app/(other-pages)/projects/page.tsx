"use client";

import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";
import { generateQueryArray } from "@/utils/query";
import ProjectCard from "@/views/projects/ProjectCard";
import { useState } from "react";

export default function ProjectsPage() {
  const [query, setQuery] = useState({
    status: "ACTIVE",
    sort: "asc"
  });

  const { data } = useGetAllProjectsQuery(generateQueryArray(query));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Investment <span className="text-lime-500">Projects</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our diverse portfolio of Nirapod Business opportunities
              across Condominium Project, Land Sharing, Travel and
              infrastructure sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      {/* <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Filter by:</span>
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-medium hover:bg-cyan-600 transition-colors">
                  All Projects
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Active
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Completed
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Upcoming
                </button>
              </div>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{projects.length}</span> Projects Found
            </div>
          </div>
        </div>
      </section> */}

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {data?.data?.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
