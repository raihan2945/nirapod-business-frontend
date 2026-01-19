import Image from "next/image";
import Link from "next/link";
import { Users, TrendingUp, Target } from "lucide-react";
import { baseUrl } from "@/utils/baseUrl";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  status: string;
  funded: string;
  target: string;
  raised: string;
  investors: number;
}

interface ProjectCardProps {
  project: Project;
}

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

export default function ProjectCard({ project }: { project: any }) {
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

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
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
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
          {project.title}
        </h3>
        {/* <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p> */}

        {/* Progress Bar */}
        {/* <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Funding Progress</span>
            <span className="text-xs sm:text-sm font-bold text-cyan-600">{project.funded}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2.5 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: project.funded }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div> */}

        {/* Stats */}
        <div className="mt-2 space-y-2.5 mb-4 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              {/* <Target className="h-3.5 w-3.5" /> */}
              Goal:
            </span>
            <span className="font-semibold text-gray-900">
              {numberToBanglaTk(Number(project?.investmentGoal || 0))} ৳
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              {/* <TrendingUp className="h-3.5 w-3.5" /> */}
              Raised:
            </span>
            <span className="font-semibold text-green-600">
              {numberToBanglaTk(Number(project?.raised || 0))} ৳
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              {/* <TrendingUp className="h-3.5 w-3.5" /> */}
              Waiting:
            </span>
            <span className="font-semibold text-green-600">
              {" "}
              {numberToBanglaTk(Number(project?.waiting || 0))} ৳
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              {/* <TrendingUp className="h-3.5 w-3.5" /> */}
              Repayment:
            </span>
            <span className="font-semibold text-green-600">
              {englishToBanglaNumber(Number(project?.repayment || 0))}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              {/* <TrendingUp className="h-3.5 w-3.5" /> */}
              Duration:
            </span>
            <span className="font-semibold text-green-600">
              {englishToBanglaNumber(Number(project?.projectDuration || 0))} মাস
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              {/* <TrendingUp className="h-3.5 w-3.5" /> */}
              Min. Investment:
            </span>
            <span className="font-semibold text-green-600">
              {numberToBanglaTk(Number(project?.minInvestment || 0))} ৳
            </span>
          </div>
          {project?.musharakaMarkupReturn ? (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1.5 flex-2">
                Musharakah Markup Return (%):
              </span>
              <span className="font-semibold text-green-600 flex-1 text-end">
                {project?.musharakaMarkupReturn}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                Murabaha Markup Return (%):
              </span>
              <span className="font-semibold text-green-600">
                {englishToBanglaNumber(
                  Number(project?.murabahaMarkupReturn || 0),
                )}
              </span>
            </div>
          )}
          {project?.expectedRoi ? (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                Expected Annualized ROI (%):
              </span>
              <span className="font-semibold text-green-600">
                {project?.expectedRoi}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                Calculated Annualized ROI (%):
              </span>
              <span className="font-semibold text-green-600">
                {englishToBanglaNumber(Number(project?.calculatedRoi || 0))}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              {/* <TrendingUp className="h-3.5 w-3.5" /> */}
              Days Left:
            </span>
            <span className="font-semibold text-green-600">
              {englishToBanglaNumber(Number(project?.daysLeft || 0))} দিন
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-1.5 text-gray-600">
            {/* <Users className="h-4 w-4" /> */}
            {/* <span className="text-xs sm:text-sm font-medium">{project.investors}</span> */}
          </div>
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 font-semibold text-xs sm:text-sm group/link px-3 py-1.5 rounded-lg hover:bg-cyan-50 transition-all"
          >
            <span>View Details</span>
            <TrendingUp className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
