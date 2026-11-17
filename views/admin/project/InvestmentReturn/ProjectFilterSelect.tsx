"use client";

import React, { useMemo } from "react";
import { Avatar, Select, Tag } from "antd";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";
import { baseUrl } from "@/utils/baseUrl";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

interface ProjectFilterSelectProps {
  value?: string;
  onChange: (projectId: string | undefined) => void;
}

const statusColor: Record<string, string> = {
  ACTIVE: "#22c55e",
  INACTIVE: "#f59e0b",
  CLOSED: "#9ca3af",
};

const ProjectThumb: React.FC<{ project: any; size: number }> = ({
  project,
  size,
}) => (
  <Avatar
    shape="square"
    size={size}
    src={
      project?.coverPhoto
        ? `${baseUrl}/uploads/photos/${project.coverPhoto}`
        : undefined
    }
    style={{
      flexShrink: 0,
      borderRadius: 8,
      background: "linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)",
      fontWeight: 600,
    }}
  >
    {project?.title?.trim()?.charAt(0) || "P"}
  </Avatar>
);

//searchable project picker with cover thumbnails, used to scope the returns list
const ProjectFilterSelect: React.FC<ProjectFilterSelectProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading } = useGetAllProjectsQuery([]);

  const projects: any[] = useMemo(() => data?.data || [], [data]);

  const options = useMemo(
    () =>
      projects.map((p) => ({
        value: p.id,
        label: p.title,
        project: p,
        //searchable text: title + serial
        search: `${p.title ?? ""} #${p.serial ?? ""}`.toLowerCase(),
      })),
    [projects],
  );

  return (
    <Select
      value={value}
      onChange={(v) => onChange(v)}
      allowClear
      showSearch
      loading={isLoading}
      placeholder={
        <span className="flex items-center gap-2 text-gray-500">
          <HiOutlineSquares2X2 size={16} /> All projects
        </span>
      }
      style={{ width: 380 }}
      popupMatchSelectWidth={440}
      listHeight={360}
      options={options}
      filterOption={(input, option: any) =>
        option?.search?.includes(input.trim().toLowerCase())
      }
      notFoundContent={
        <div className="py-4 text-center text-sm text-gray-400">
          No project found
        </div>
      }
      //compact chip for the selected project
      labelRender={({ value: v }) => {
        const p = projects.find((x) => x.id === v);
        if (!p) return null;
        return (
          <span className="flex items-center gap-2 min-w-0">
            <ProjectThumb project={p} size={20} />
            <span className="truncate">{p.title}</span>
            <span className="text-xs text-gray-400 shrink-0">#{p.serial}</span>
          </span>
        );
      }}
      optionRender={(option: any) => {
        const p = option.data.project;
        return (
          <div className="flex items-center gap-3 py-1">
            <ProjectThumb project={p} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-800 leading-5">
                {p.title}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: statusColor[p.status] || "#f59e0b" }}
                  />
                  {String(p.status || "").toLowerCase()}
                </span>
                {Number(p.repayment) > 0 && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{p.repayment} returns</span>
                  </>
                )}
                {Number(p.projectDuration) > 0 && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{p.projectDuration} months</span>
                  </>
                )}
              </div>
            </div>
            <Tag color="blue" className="!mr-0 shrink-0">
              #{p.serial}
            </Tag>
          </div>
        );
      }}
    />
  );
};

export default ProjectFilterSelect;
