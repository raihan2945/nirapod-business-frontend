import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";
import { generateQueryArray } from "@/utils/query";
import React from "react";
import ProjectCard from "../projects/ProjectCard";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { baseUrl } from "@/utils/baseUrl";
import { Button } from "antd";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500";
    case "Completed":
      return "bg-blue-500";
    case "Upcoming":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

type componentProps = {
  createInvestment: any;
};

const BankInfoView = ({ createInvestment }: componentProps) => {
  const { data } = useGetAllProjectsQuery(generateQueryArray({}));

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
        {data?.data?.map((project: any) => (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
            {/* Image */}
            {/* <div className="relative h-20 sm:h-20 overflow-hidden">
              <Image
                src={`${baseUrl}/uploads/photos/${project?.coverPhoto}`}
                //   src={project.image || "/images/blogs/blog2.jpg"}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4">
                <span
                  className={`${getStatusColor(
                    project.status,
                  )} text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg`}
                >
                  {project.status}
                </span>
              </div>
            </div> */}

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
                {project.title}
              </h3>

              {/* Stats */}
              <div className="mt-2 space-y-2.5 mb-4 rounded-lg">
                {project?.bankInfo && (
                  <>
                    <p
                      className="text-lg"
                      style={{ whiteSpace: "pre-line" }}
                      dangerouslySetInnerHTML={{ __html: project?.bankInfo }}
                    ></p>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-auto">
                <Link
                  style={{ color: "green" }}
                  href={`/projects/${project.id}`}
                  className="flex cursor-pointer items-center gap-1.5 text-green-500 bg-green-600 hover:bg-green-700 font-semibold text-xs sm:text-sm group/link px-3 py-1.5 rounded transition-all"
                >
                  <span>View Project</span>
                  <TrendingUp className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={()=>createInvestment(project)}
                  className="flex cursor-pointer items-center gap-1.5 text-white bg-green-600 hover:bg-green-700 font-semibold text-xs sm:text-sm group/link px-3 py-1.5 rounded transition-all"
                >
                  <span>Make Investment</span>
                  {/* <TrendingUp className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" /> */}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankInfoView;
