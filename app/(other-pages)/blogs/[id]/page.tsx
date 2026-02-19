"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetSingleProjectByIdQuery } from "@/state/features/projects/projectsApi";
import { baseUrl } from "@/utils/baseUrl";
import { Modal } from "antd";
import InvestmentForm from "@/views/projects/form/InvestmentForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../../state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";
import { useGetSingleBlogByIdQuery } from "@/state/features/blogs/blogsApi";

export default function BlogDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [project, setProject] = useState<any>(null);
  const [roles, setRoles] = useState<any>([]);
  const [shariahCompliance, setShariahCompliance] = useState<any>([]);
  const [theBusiness, setTheBusiness] = useState<any>([]);
  const [theContract, setTheContract] = useState<any>([]);
  const [potentialRisks, setPotentialRisks] = useState<any>([]);

  const [isCreate, setIsCreate] = useState<any>(null);

  const { data } = useGetSingleBlogByIdQuery(params.id);

  const userId = useSelector((state: RootState) => state.auth?.id);
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
  const userProfile = useSelector((state: RootState) => state?.user?.data);

  // console.log("blog Data:", data);
  // console.log("Single Project:", project);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project?.images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + project?.images.length) % project?.images?.length
    );
  };

  useEffect(() => {
    setCurrentImageIndex(0);

    setProject(data?.data);
  }, [data]);

  useEffect(() => {
    if (project?.roles) {
      setRoles(JSON.parse(project?.roles || "[]"));
    } else {
      setRoles([]);
    }
    if (project?.theBusiness) {
      setTheBusiness(JSON.parse(project?.theBusiness || "[]"));
    } else {
      setTheBusiness([]);
    }
    if (project?.shariahCompliance) {
      setShariahCompliance(JSON.parse(project?.shariahCompliance || "[]"));
    } else {
      setShariahCompliance([]);
    }
    if (project?.potentialRisks) {
      setPotentialRisks(JSON.parse(project?.potentialRisks || "[]"));
    } else {
      setPotentialRisks([]);
    }
    if (project?.theContract) {
      setTheContract(JSON.parse(project?.theContract || "[]"));
    } else {
      setTheContract([]);
    }
  }, [project]);

  return (
    <>
      <div>
        {/* Breadcrumb */}
        <div className="pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <a href="/" className="hover:text-gray-900">
              Home
            </a>
            <span>/</span>
            <a href="/projects" className="hover:text-gray-900">
              Blogs
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{project?.title}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          {/* //fixed Image */}
          <div className="w-full h-96 relative mb-8">
            <img
              src={`${baseUrl}/uploads/photos/${project?.coverPhoto}`}
              alt={`${project?.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-5xl font-bold mb-4" style={{ whiteSpace: "pre-line", textAlign: "justify" }}>{project?.title}</h1>
          <p className="text-gray-700 text-lg mb-8 text-justify" style={{ whiteSpace: "pre-line", textAlign: "justify" }}>{project?.description}</p>  
          <hr className="my-8" />
          <p className="text-gray-700 text-lg mb-8 text-justify" style={{ whiteSpace: "pre-line", textAlign: "justify" }}>{project?.content}</p>
        </div>
      </div>
    </>
  );
}
