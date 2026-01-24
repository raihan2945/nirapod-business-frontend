import React, { use } from "react";
import {
  Clock,
  User,
  Building,
  DollarSign,
  Calendar,
  MessageSquare,
  Image,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { Button, message, Popconfirm } from "antd";
import { useUpdateProjectInvestmentByIdMutation } from "@/state/features/projects/projectInvestmentApi";

const InvestmentView = ({
  investment,
  setIsEdit,
}: {
  investment: any;
  setIsEdit?: any;
}) => {
  const { handleResponse } = useAPIResponseHandler();

  const [UpdateInvestment] = useUpdateProjectInvestmentByIdMutation();

  const submitUpdate = async (status: string) => {
    try {
      const updatedData = { status };
      const res = await UpdateInvestment({
        id: investment.id,
        data: updatedData,
      }).unwrap();
      console.log("Update Response:", res);
      handleResponse(res);

      if (res?.statusCode === 200) {
        setIsEdit(null);
      }
    } catch (error) {
      console.error("Failed to update investment status:", error);
      // Optionally, you can add an error notification here
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-gray-900">
                Investment Details
              </h1>
              <span
                className={`px-5 py-2.5 rounded-full font-bold flex items-center gap-2 border`}
              >
                {/* <Clock className="w-4 h-4" /> */}
                {investment?.status}
              </span>
            </div>

            {/* Project Info */}
            {/* Simple Project & Investor Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Project */}
              <div className="rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  Project
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="block">
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium">{investment?.Project?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm">
                      {investment?.Project?.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-gray-500">Goal</p>
                      <p className="font-semibold text-indigo-600">
                        ৳
                        {Number(
                          investment?.Project?.investmentGoal,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Min. Investment</p>
                      <p className="font-semibold text-indigo-600">
                        ৳
                        {Number(
                          investment?.Project?.minInvestment,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investor */}
              <div className="">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Investor
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {investment?.User?.photo ? (
                        <img
                          src={investment?.User?.photo}
                          alt={investment?.User?.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {investment?.User?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {investment?.User?.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium">{investment?.User?.mobile}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-green-600" />
              Investment Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-green-700">
                  Amount Invested
                </p>
                <p className="text-4xl font-bold text-green-800 mt-2">
                  ৳{Number(investment?.amount).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
                <p className="text-sm font-medium text-blue-700">
                  Payment Method
                </p>
                <p className="text-2xl font-bold text-blue-800 mt-2">
                  {investment?.paymentMethod}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl border border-purple-200">
                <p className="text-sm font-medium text-purple-700">
                  Transaction ID
                </p>
                <p className="text-lg font-bold text-purple-800 mt-2 break-all">
                  {investment?.transactionId}
                </p>
              </div>
            </div>

            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-5 rounded-xl text-center">
                <Calendar className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Investment Date</p>
                <p className="font-semibold">{formatDate(investment.investmentAt)}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl text-center">
                <Calendar className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Payment Date</p>
                <p className="font-semibold">{formatDate(investment.paymentDate)}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl text-center">
                <Clock className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="font-semibold text-sm">{formatDateTime(investment.createdAt)}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl text-center">
                <div className="w-5 h-5 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-bold text-yellow-600">{investment.status}</p>
              </div>
            </div> */}
          </div>

          {/* Comments & Proofs */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              Additional Information
            </h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Investor Comments
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 min-h-32">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {investment?.comments || "No comments provided"}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Proof
                </label>
                {investment?.proof1 ? (
                  <img
                    src={`${baseUrl}/uploads/photos/${investment?.proof1}`}
                    alt="Proof 1"
                    className="w-full rounded-lg border"
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center bg-gray-50">
                    <Image className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500">No image uploaded</p>
                  </div>
                )}
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Proof 2</label>
                {investment?.proof2 ? (
                  <img src={investment?.proof2} alt="Proof 2" className="w-full rounded-lg border" />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center bg-gray-50">
                    <Image className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500">No image uploaded</p>
                  </div>
                )}
              </div> */}
            </div>
          </div>

          {/* Action Buttons */}
          {setIsEdit && investment.status === "PENDING" && (
            <div className="flex justify-end gap-4 pb-10">
              <Popconfirm
                title="Delete the Investment"
                description="Are you sure to reject this investment?"
                onConfirm={() => submitUpdate("REJECTED")}
                okText="Yes"
                cancelText="No"
              >
                <button className="cursor-pointer px-8 py-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition flex items-center gap-3 shadow-lg">
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </Popconfirm>
              <Popconfirm
                title="Approve the Investment"
                description="Are you sure to approve this investment?"
                onConfirm={() => submitUpdate("APPROVED")}
                okText="Yes"
                cancelText="No"
              >
                <button className="cursor-pointer px-8 py-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition flex items-center gap-3 shadow-lg">
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
              </Popconfirm>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentView;
