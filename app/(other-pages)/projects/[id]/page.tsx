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

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [project, setProject] = useState<any>(null);

  // Sample project data - replace with actual data fetching
//   const project = {
//     id: params.id,
//     name: "Green View Agro",
//     coverImage:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-x5HICDBZ0pdggr1q7ZZN3dJEF0Dhc7.png",
//     images: [
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-x5HICDBZ0pdggr1q7ZZN3dJEF0Dhc7.png",
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/modern-apartment-building-EkaX0F3zODpNT33sVZ2qupCNn2aKOt.png",
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/modern-office-building-6PCbo63rgIim4GcjSsaUghiIjq5p7w.png",
//     ],
//     investmentGoal: 2700000,
//     minInvestment: 5000,
//     raised: 2712500,
//     waiting: 93000,
//     murabahMarkup: 18.0,
//     annualizedROI: 18.0,
//     repayment: 6,
//     duration: "12 months",
//     daysLeft: 6,
//   };

  const { data } = useGetSingleProjectByIdQuery(params.id);

  console.log("Single Project Data:", data);
  console.log("Single Project:", project);

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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
          <div className="lg:col-span-2">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-video">
              <img
                // src={project.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${project?.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
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
                  {project?.investmentGoal?.toLocaleString()} BDT
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Min. Investment:</span>
                <span className="font-semibold text-gray-900">
                  {project?.minInvestment?.toLocaleString()} BDT
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Raised:</span>
                <span className="font-semibold text-gray-900">
                  {project?.raised?.toLocaleString()} BDT
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Waiting:</span>
                <span className="font-semibold text-gray-900">
                  {project?.waiting?.toLocaleString()} BDT
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">
                  Murabaha Markup Return (%):
                </span>
                <span className="font-semibold text-gray-900">
                  {project?.murabahMarkup?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">
                  Calculated Annualized ROI (%):
                </span>
                <span className="font-semibold text-gray-900">
                  {project?.annualizedROI?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Repayment:</span>
                <span className="font-semibold text-gray-900">
                  {project?.repayment}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Project Duration:</span>
                <span className="font-semibold text-gray-900">
                  {project?.duration}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4">
                <span className="text-gray-600">Days Left:</span>
                <span className="font-semibold text-gray-900">
                  {project?.daysLeft} Days
                </span>
              </div>

              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-6">
                Invest Now
              </Button>
            </div>
          </div>
        </div>

        {/* Roles Section */}
        {/* <div className="mb-12">
          <h3 className="text-2xl font-bold text-red-600 mb-4">
            Roles of Halal Investment in this Project
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>
                Halal Investment acts as the representative for investors. In a
                Murabaha project, once the product is sold to the merchant, it
                becomes the merchant's responsibility and obligation to repay
                the full amount.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>
                Notably, to protect the interests of investors, each project
                includes multiple guarantees. If, for any reason, the merchant
                fails to make payments, the guarantors are legally bound to
                settle the payment.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>
                Additionally, a backup plan is in place to recover funds in case
                the merchant's business incurs losses. If the merchant still
                does not return the money, Halal Investment's recovery team
                takes action to recover the investor's funds.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>
                However, if after all these processes the merchant completely
                defaults and disappears, according to Shariah principles, the
                investor must bear the loss.
              </span>
            </li>
          </ul>
        </div> */}

        {/* Accordion Sections */}
        <div className="space-y-8">
          {/* The Business */}
          {/* <div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              The Business
            </h3>
            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow"
            >
              <AccordionItem value="intro-business">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Introduction to the Business
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the introduction to the business
                  section. Add your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="intro-owner">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Introduction to the Owner
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the introduction to the owner
                  section. Add your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="value-prop">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Value Proposition
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the value proposition section.
                  Add your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="disclaimer">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Disclaimer
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the disclaimer section. Add your
                  actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sample-deed">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Sample Deed
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the sample deed section. Add your
                  actual content here.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}

          {/* The Contract */}
          {/* <div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              The Contract
            </h3>
            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow"
            >
              <AccordionItem value="duration">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Duration of Investment
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the duration of investment
                  section. Add your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="roi">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Projected ROI (Return of investment)
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the projected ROI section. Add
                  your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="conditions">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Contract Conditions
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the contract conditions section.
                  Add your actual content here.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}

          {/* Shariah Compliance */}
          {/* <div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              Shariah Compliance
            </h3>
            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow"
            >
              <AccordionItem value="underlying">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Underlying Contracts
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the underlying contracts section.
                  Add your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="approval">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Approval from Scholars
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the approval from scholars
                  section. Add your actual content here.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}

          {/* Potential Risks */}
          {/* <div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              Potential Risks
            </h3>
            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow"
            >
              <AccordionItem value="business-assess">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Business Assessment
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the business assessment section.
                  Add your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="possession">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Possession of Assets
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the possession of assets section.
                  Add your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-delay">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Payment Delay
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the payment delay section. Add
                  your actual content here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  Security
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-700">
                  This is a sample content for the security section. Add your
                  actual content here.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}
        </div>
      </div>
    </div>
  );
}
