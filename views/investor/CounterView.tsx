import React from "react";
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
import { useGetUserByIdQuery, useGetUserByIdV2Query, useGetUserCountsByIdQuery } from "@/state/features/user/userApi";

const CounterView = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetUserCountsByIdQuery(userId);

    const {
      data: userData,
      isLoading: isFetchLoading,
      isError,
    } = useGetUserByIdV2Query(userId);

    

  return (
    <div>
      <div className="pt-2">
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <DollarSign className="w-7 h-7 text-green-600" />
          Investment Summary
        </h2> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
            <p className="text-sm font-medium text-green-700">Total Balance</p>
            <p className="text-4xl font-bold text-green-800 mt-2">
              ৳{(Number(userData?.data?.balance || 0) + Number(data?.data?.totalInvestedAmount || 0))?.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
            <p className="text-sm font-medium text-blue-700">
              Active Investments
            </p>
            <p className="text-4xl font-bold text-blue-800 mt-2">
              ৳{Number(data?.data?.totalInvestedAmount || 0)?.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-300/70 p-6 rounded-xl border border-purple-200">
            <p className="text-sm font-medium text-gray-700">
              Wallet Balance
            </p>
            <p className="text-4xl font-bold text-gray-900 mt-2 break-all">
              ৳{Number(userData?.data?.balance || 0)?.toLocaleString()}
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
    </div>
  );
};

export default CounterView;
