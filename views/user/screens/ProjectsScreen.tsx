"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Search } from "lucide-react";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";
import { listOf, toQuery, usePageSize } from "../lib/hooks";
import type { Project, ProjectStatus } from "../lib/types";
import { ProjectCard } from "../components/ProjectCard";
import { EmptyState, ErrorState, FilterChips, LoadMore, Skeleton, rise } from "../ui/primitives";
import { PageTitle } from "../shell/ScreenHeader";

type Filter = ProjectStatus | "ALL";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "Open", value: "ACTIVE" },
  { label: "Closed", value: "CLOSED" },
  { label: "All", value: "ALL" },
];

export default function ProjectsScreen() {
  const [filter, setFilter] = useState<Filter>("ACTIVE");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const page = usePageSize();
  const { reset } = page;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(reset, [filter, debounced, reset]);

  const q = useGetAllProjectsQuery(toQuery({ status: filter, search: debounced, size: page.size }));
  const list = listOf<Project>(q, page.size);

  return (
    <div>
      <PageTitle title="Projects" subtitle="Shariah-compliant businesses looking for capital" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-np-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="h-12 w-full rounded-2xl border border-np-border bg-white pl-11 pr-4 text-[15px] outline-none transition-colors placeholder:text-np-subtle focus:border-np-primary focus:ring-4 focus:ring-np-primary/15"
          />
        </label>
        <FilterChips items={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <div className="mt-5">
        {list.loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[340px] rounded-[20px]" />
            ))}
          </div>
        ) : list.isError ? (
          <ErrorState onRetry={list.refetch} />
        ) : list.items.length ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {list.items.map((p, i) => (
                <div key={p.id} {...rise(Math.min(i, 8))} className="flex min-w-0 animate-np-rise">
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
            <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onMore={page.more} />
          </>
        ) : (
          <EmptyState
            icon={BriefcaseBusiness}
            title={debounced ? "No matching projects" : "No projects here yet"}
            message={debounced ? "Try a different name." : "New opportunities are added regularly - check back soon."}
          />
        )}
      </div>
    </div>
  );
}
