"use client";

import React from "react";
import { Tag, Divider, Empty } from "antd";
import { format, isBefore, startOfDay } from "date-fns";
import {
  User as UserIcon,
  Building,
  Wallet,
  Landmark,
  CalendarClock,
  FileText,
} from "lucide-react";

import { baseUrl } from "@/utils/baseUrl";

const money = (value: any) =>
  `৳${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const showDate = (value: any, pattern = "dd MMM yyyy") =>
  value ? format(new Date(value), pattern) : "—";

const returnStatusColor: Record<string, string> = {
  PAID: "green",
  CANCELLED: "volcano",
  PENDING: "blue",
};

const investmentStatusColor: Record<string, string> = {
  APPROVED: "green",
  REJECTED: "red",
  CANCELLED: "volcano",
  CLOSED: "default",
  PENDING: "blue",
};

//small labelled value used across every section
const Field = ({ label, value }: { label: string; value?: any }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 break-words">
      {value === 0 || value ? value : <span className="text-gray-400">—</span>}
    </p>
  </div>
);

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const ReturnDetailView = ({ info }: { info: any }) => {
  if (!info) return <Empty description="Nothing to show" />;

  const investment = info?.ProjectInvestment;
  const user = investment?.User;
  const project = investment?.Project;

  const overdue =
    info?.status === "PENDING" &&
    info?.date &&
    isBefore(startOfDay(new Date(info.date)), startOfDay(new Date()));

  return (
    <div className="bg-gray-50 p-6 max-h-[85vh] overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Return header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-gray-500">Investment Return</p>
              <h2 className="text-2xl font-bold text-gray-900">
                #{info?.serial}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {overdue && <Tag color="red">OVERDUE</Tag>}
              <Tag color={returnStatusColor[info?.status] || "blue"}>
                {info?.status}
              </Tag>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Due Date" value={showDate(info?.date)} />
            <Field label="Quantity" value={info?.qty} />
            <Field label="Amount" value={money(info?.totalAmount)} />
            <Field label="Recorded" value={showDate(info?.createdAt)} />
          </div>

          {(info?.note || info?.photo) && (
            <>
              <Divider className="my-4" />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Note</p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {info?.note || "—"}
                  </p>
                </div>
                {info?.photo && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Return Proof</p>
                    <a
                      href={`${baseUrl}/uploads/photos/${info.photo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${baseUrl}/uploads/photos/${info.photo}`}
                        alt="return proof"
                        className="max-h-48 rounded-lg border"
                      />
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Investor */}
        <Section
          icon={<UserIcon className="w-5 h-5 text-green-600" />}
          title="Investor"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
              {user?.photo ? (
                <img
                  src={`${baseUrl}/uploads/photos/${user.photo}`}
                  alt={user?.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-7 h-7 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {user?.fullName || "—"}
              </p>
              <p className="text-sm text-gray-500">
                #{user?.serial} · {user?.role}
              </p>
              <div className="flex gap-2 mt-1">
                <Tag color={user?.status === "ACTIVE" ? "green" : "orange"}>
                  {user?.status}
                </Tag>
                {user?.verifyStatus && (
                  <Tag
                    color={
                      user?.verifyStatus === "APPROVED"
                        ? "green"
                        : user?.verifyStatus === "CANCELLED"
                          ? "red"
                          : "blue"
                    }
                  >
                    {user?.verifyStatus}
                  </Tag>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Mobile" value={user?.mobile} />
            <Field label="Email" value={user?.email} />
            <Field label="Wallet Balance" value={money(user?.balance)} />
            <Field label="NID" value={user?.nid} />
            <Field label="Gender" value={user?.gender} />
            <Field label="Blood Group" value={user?.bloodGroup} />
            <Field label="Father's Name" value={user?.fatherName} />
            <Field label="Mother's Name" value={user?.motherName} />
            <Field label="Profession" value={user?.currentProfession} />
            <Field label="Address" value={user?.address} />
            <Field label="Facebook" value={user?.facebook} />
            <Field label="Joined" value={showDate(user?.createAt)} />
          </div>

          <Divider className="my-4" />
          <p className="text-sm font-semibold text-gray-700 mb-3">Nominee</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Name" value={user?.nomineeName} />
            <Field label="Relation" value={user?.nomineeRelation} />
            <Field label="Mobile" value={user?.nomineeMobile} />
          </div>

          <Divider className="my-4" />
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-gray-500" />
            Bank Information
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Account Name" value={user?.bankAccountName} />
            <Field label="Account No" value={user?.bankAccountNo} />
            <Field label="Bank" value={user?.bankName} />
            <Field label="Branch" value={user?.branchName} />
            <Field label="Routing No" value={user?.routingNo} />
          </div>
        </Section>

        {/* Investment */}
        <Section
          icon={<Wallet className="w-5 h-5 text-indigo-600" />}
          title="Project Investment"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <p className="text-sm text-gray-500">
              Investment{" "}
              <span className="font-semibold text-gray-900">
                #{investment?.serial}
              </span>
            </p>
            <div className="flex gap-2">
              <Tag
                color={investmentStatusColor[investment?.status] || "blue"}
              >
                {investment?.status}
              </Tag>
              {investment?.returnStatus && (
                <Tag color="default">{investment.returnStatus}</Tag>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Amount" value={money(investment?.amount)} />
            <Field label="Quantity" value={investment?.qty} />
            <Field label="Unit Amount" value={money(investment?.unitAmount)} />
            <Field label="Payment Method" value={investment?.paymentMethod} />
            <Field
              label="Payment Date"
              value={showDate(investment?.paymentDate)}
            />
            <Field
              label="Invested At"
              value={showDate(investment?.investmentAt)}
            />
            <Field label="Transaction ID" value={investment?.transactionId} />
            <Field
              label="Returns Received"
              value={`${investment?.totalReceived ?? 0} of ${
                investment?.totalReturns ?? 0
              }`}
            />
            <Field
              label="Last Return"
              value={showDate(investment?.lastReturnDate)}
            />
            <Field
              label="Next Return"
              value={showDate(investment?.nextReturnDate)}
            />
          </div>

          {investment?.comments && (
            <>
              <Divider className="my-4" />
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Comments
              </p>
              <p className="text-gray-800 whitespace-pre-wrap">
                {investment.comments}
              </p>
            </>
          )}

          {investment?.proof1 && (
            <>
              <Divider className="my-4" />
              <p className="text-xs text-gray-500 mb-1">Payment Proof</p>
              <a
                href={`${baseUrl}/uploads/photos/${investment.proof1}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${baseUrl}/uploads/photos/${investment.proof1}`}
                  alt="payment proof"
                  className="max-h-48 rounded-lg border"
                />
              </a>
            </>
          )}
        </Section>

        {/* Project */}
        <Section
          icon={<Building className="w-5 h-5 text-amber-600" />}
          title="Project"
        >
          <div className="flex gap-4 mb-4">
            {project?.coverPhoto && (
              <img
                src={`${baseUrl}/uploads/photos/${project.coverPhoto}`}
                alt={project?.title}
                className="w-24 h-24 object-cover rounded-lg border shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-lg font-semibold text-gray-900">
                {project?.title || "—"}
              </p>
              <p className="text-sm text-gray-500">#{project?.serial}</p>
              <p className="text-sm text-gray-600 mt-1">
                {project?.description || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Goal" value={money(project?.investmentGoal)} />
            <Field label="Per Share" value={money(project?.minInvestment)} />
            <Field
              label="Shares"
              value={`${Number(project?.raisedShares || 0)} / ${Number(
                project?.totalShares || 0,
              )}`}
            />
            <Field label="Expected ROI" value={project?.expectedRoi} />
            <Field
              label="Duration"
              value={
                project?.projectDuration
                  ? `${project.projectDuration} months`
                  : undefined
              }
            />
            <Field label="Repayments" value={project?.repayment} />
            <Field label="Status" value={project?.status} />
          </div>
        </Section>

        <div className="flex items-center gap-2 text-xs text-gray-400 justify-center pb-2">
          <CalendarClock className="w-3 h-3" />
          Return recorded {showDate(info?.createdAt, "dd MMM yyyy, HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default ReturnDetailView;
