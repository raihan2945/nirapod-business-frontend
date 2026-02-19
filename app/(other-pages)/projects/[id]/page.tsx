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
import { useRouter } from "next/navigation";

function numberToBanglaTk(value: number) {
  if (value === null || value === undefined) return "";

  // Convert to string
  const [integerPart, decimalPart] = value.toString().split(".");

  // Add Bangladeshi commas (3,2,2...)
  let lastThree = integerPart.slice(-3);
  let rest = integerPart.slice(0, -3);

  if (rest !== "") {
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    lastThree = rest + "," + lastThree;
  }

  // English → Bangla digits
  const engToBn: any = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };

  const toBangla = (str: any) => str.replace(/\d/g, (d: any) => engToBn[d]);

  return decimalPart
    ? `${toBangla(lastThree)}.${toBangla(decimalPart)}`
    : toBangla(lastThree);
}

function englishToBanglaNumber(value: number) {
  if (value === null || value === undefined) return "";

  const engToBn: any = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };

  return value.toString().replace(/\d/g, (digit) => engToBn[digit]);
}

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [project, setProject] = useState<any>(null);
  const [roles, setRoles] = useState<any>([]);
  const [shariahCompliance, setShariahCompliance] = useState<any>([]);
  const [theBusiness, setTheBusiness] = useState<any>([]);
  const [theContract, setTheContract] = useState<any>([]);
  const [potentialRisks, setPotentialRisks] = useState<any>([]);

  const [isCreate, setIsCreate] = useState<any>(null);

  const { data } = useGetSingleProjectByIdQuery(params.id);

  const userId = useSelector((state: RootState) => state.auth?.id);
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);

  const userProfile = useSelector((state: RootState) => state?.user?.data);

  // console.log("userProfile Data:", userProfile);
  // console.log("Single Project:", project);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project?.images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + project?.images.length) % project?.images?.length,
    );
  };

  const handleNavigate = () => {
    router.push("/login/login-user"); // Navigate and add to history
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

  // console.log("theBusiness is : ", theBusiness);

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
              Projects
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{project?.title}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Image Carousel */}
            {/* <div className="lg:col-span-2">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-video">
              <img
                src={`${baseUrl}/uploads/projects/${project?.images?.coverPhoto}`}
                alt={`${project?.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            </div>
          </div> */}

            {/* //fixed Image */}
            <div className="lg:col-span-2">
              <img
                src={`${baseUrl}/uploads/photos/${project?.coverPhoto}`}
                alt={`${project?.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Project Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {project?.title}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Investment Goal:</span>
                  <span className="font-semibold text-gray-900">
                    {numberToBanglaTk(Number(project?.investmentGoal || 0))} ৳
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Min. Investment:</span>
                  <span className="font-semibold text-gray-900">
                    {numberToBanglaTk(Number(project?.minInvestment || 0))} ৳
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Raised:</span>
                  <span className="font-semibold text-gray-900">
                    {numberToBanglaTk(Number(project?.raised || 0))} ৳
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Waiting:</span>
                  <span className="font-semibold text-gray-900">
                    {numberToBanglaTk(Number(project?.waiting || 0))} ৳
                  </span>
                </div>

                {project?.musharakaMarkupReturn ? (
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">
                      Musharakah Markup Return (%):
                    </span>
                    <span className="font-semibold text-gray-900">
                      {project?.musharakaMarkupReturn}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">
                      Murabaha Markup Return (%):
                    </span>
                    <span className="font-semibold text-gray-900">
                      {englishToBanglaNumber(
                        Number(project?.murabahaMarkupReturn || 0),
                      )}
                    </span>
                  </div>
                )}

                {project?.expectedRoi ? (
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">
                      Expected Annualized ROI (%):
                    </span>
                    <span className="font-semibold text-gray-900">
                      {project?.expectedRoi}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">
                      Calculated Annualized ROI (%):
                    </span>
                    <span className="font-semibold text-gray-900">
                      {englishToBanglaNumber(
                        Number(project?.calculatedRoi || 0),
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Repayment:</span>
                  <span className="font-semibold text-gray-900">
                    {englishToBanglaNumber(Number(project?.repayment || 0))}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Project Duration:</span>
                  <span className="font-semibold text-gray-900">
                    {englishToBanglaNumber(
                      Number(project?.projectDuration || 0),
                    )}{" "}
                    মাস
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4">
                  <span className="text-gray-600">Days Left:</span>
                  <span className="font-semibold text-gray-900">
                    {englishToBanglaNumber(Number(project?.daysLeft || 0))} দিন
                  </span>
                </div>
                {userProfile?.role !== "user" && (
                  <p className="text-red-600 font-medium mb-0">
                    Log in as an investor
                  </p>
                )}
                <Button
                  // disabled={userProfile?.role !== "user"}
                  onClick={() => {
                    if (userProfile?.role !== "user") {
                      handleNavigate();
                    } else {
                      setIsCreate(true);
                    }
                  }}
                  className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white mt-6"
                >
                  Invest Now
                </Button>
              </div>
            </div>
          </div>

          {/* Roles Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              Roles of Nirapod Business
            </h3>
            <ul className="space-y-3 text-gray-700">
              {Array.isArray(roles) &&
                roles?.map((item: any, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      {" "}
                      <p
                        style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                      >
                        {item?.description}
                      </p>
                    </span>
                  </li>
                ))}
              {/* <li className="flex gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>
                Halal Investment acts as the representative for investors. In a
                Murabaha project, once the product is sold to the merchant, it
                becomes the merchant's responsibility and obligation to repay
                the full amount.
              </span>
            </li> */}
            </ul>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-8">
            {/* The Business */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                The Business
              </h3>
              <Accordion
                type="single"
                collapsible
                className="bg-white rounded-lg shadow"
              >
                {theBusiness?.map((item: any, index: number) => (
                  <AccordionItem key={index} value={`business-item-${index}`}>
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                      {item?.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 text-gray-700">
                      <p
                        style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                      >
                        {item?.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {/* <AccordionItem value="intro-business">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Introduction to the Business
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the introduction to the business
                  section. Add your actual content here.
                </AccordionContent>
              </AccordionItem> */}
              </Accordion>
            </div>

            {/* The Contract */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                The Contract
              </h3>
              <Accordion
                type="single"
                collapsible
                className="bg-white rounded-lg shadow"
              >
                {theContract?.map((item: any, index: number) => (
                  <AccordionItem key={index} value={`business-item-${index}`}>
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                      {item?.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 text-gray-700">
                      <p
                        style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                      >
                        {item?.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Shariah Compliance */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                Shariah Compliance
              </h3>
              <Accordion
                type="single"
                collapsible
                className="bg-white rounded-lg shadow"
              >
                {shariahCompliance?.map((item: any, index: number) => (
                  <AccordionItem key={index} value={`business-item-${index}`}>
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                      {item?.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 text-gray-700">
                      <p
                        style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                      >
                        {item?.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Potential Risks */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                Potential Risks
              </h3>
              <Accordion
                type="single"
                collapsible
                className="bg-white rounded-lg shadow"
              >
                {potentialRisks?.map((item: any, index: number) => (
                  <AccordionItem key={index} value={`business-item-${index}`}>
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                      {item?.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 text-gray-700">
                      <p
                        style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                      >
                        {item?.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ---- */}

      {/* edit blog form */}
      <Modal
        centered
        open={isCreate}
        onCancel={() => setIsCreate(false)}
        footer={null}
        destroyOnHidden={true}
        width="90vw"
        // width={700}
        styles={{
          body: { padding: 0 },
        }}
        // Optional: add this class for extra control
        className="responsive-ant-modal"
      >
        {/* <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto"> */}
        <InvestmentForm
          formType="create"
          // info={isEdit}
          modalCancel={() => setIsCreate(false)}
          projectId={project?.id}
          userId={userProfile?.id!}
        />
        {/* </div> */}
      </Modal>
    </>
  );
}
