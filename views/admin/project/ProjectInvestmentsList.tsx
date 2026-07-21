"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Radio,
  RadioChangeEvent,
  Image,
  Input,
  Alert,
} from "antd";
import type { TableProps } from "antd";
import { format } from "date-fns";
import { RiEditBoxFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";

import {
  useGetAllProjectInvestmentsQuery,
  useCancelProjectInvestmentByIdMutation,
} from "@/state/features/projects/projectInvestmentApi";
import { generateQueryArray } from "@/utils/query";
import { baseUrl } from "@/utils/baseUrl";
import TableSkeleton from "@/components/TableSkeleton";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import InvestmentView from "./InvestmentView";
import InvestmentInfo from "../user/InvestmentInfo";

interface ComponentProps {
  project?: any;
}

const formatDate = (value: any, pattern = "dd-MM-yyyy") =>
  value ? format(new Date(value), pattern) : "-";

const ProjectInvestmentsList: React.FC<ComponentProps> = ({ project }) => {
  const projectId = project?.id;

  const [status, setStatus] = useState<string>("");
  const [isEdit, setIsEdit] = useState<any>(null);
  const [viewUserInvestment, setViewUserInvestment] = useState<any>(null);
  const [isCancel, setIsCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState<string>("");

  const { handleResponse } = useAPIResponseHandler();
  const [cancelInvestment, { isLoading: isCancelling }] =
    useCancelProjectInvestmentByIdMutation();

  const submitCancel = async () => {
    const res = await cancelInvestment({
      id: isCancel?.id,
      reason: cancelReason || undefined,
    });

    const handled = handleResponse(res);

    if (handled?.code === 200) {
      setIsCancel(null);
      setCancelReason("");
    }
  };

  // Fetch every investment of this project once; the status filter below is
  // applied client-side so the summary stays stable while filtering.
  const { data, isLoading } = useGetAllProjectInvestmentsQuery(
    generateQueryArray({ projectId }),
    { skip: !projectId },
  );

  const investments = useMemo(() => data?.data || [], [data]);

  const summary = useMemo(() => {
    const approved = investments.filter((i: any) => i?.status === "APPROVED");
    const pending = investments.filter((i: any) => i?.status === "PENDING");

    const sum = (rows: any[], key: string) =>
      rows.reduce((acc: number, row: any) => acc + Number(row?.[key] || 0), 0);

    return {
      approvedAmount: sum(approved, "amount"),
      approvedShares: sum(approved, "qty"),
      pendingAmount: sum(pending, "amount"),
      pendingCount: pending.length,
      totalInvestments: investments.length,
      totalInvestors: new Set(investments.map((i: any) => i?.userId)).size,
    };
  }, [investments]);

  const filtered = useMemo(
    () =>
      status
        ? investments.filter((i: any) => i?.status === status)
        : investments,
    [investments, status],
  );

  interface DataType {
    id: string;
  }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "SL",
      dataIndex: "serial",
      key: "serial",
      render: (text) => `#${text}`,
      width: 80,
    },
    {
      title: "Investor",
      dataIndex: "userId",
      key: "userId",
      render: (_, record: any) => (
        <Button
          size="small"
          style={{ cursor: "pointer" }}
          onClick={() => setViewUserInvestment(record?.userId)}
        >
          {record?.User?.fullName || `#${record?.User?.serial}`}
        </Button>
      ),
    },
    {
      title: "Proof",
      dataIndex: "proof1",
      key: "proof1",
      render: (text) =>
        text ? (
          <Image
            alt="proof"
            src={`${baseUrl}/uploads/photos/${text}`}
            style={{ width: "50px" }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      render: (text) => (
        <Tag color="blue" className="m-0">
          {text}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `৳${Number(text || 0).toLocaleString()}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text) => text,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => formatDate(text),
    },
    {
      title: "Transaction Id",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={
            text === "APPROVED"
              ? "green"
              : text === "REJECTED"
                ? "red"
                : text === "CANCELLED"
                  ? "volcano"
                  : text === "CLOSED"
                    ? "default"
                    : "blue"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text, "yyyy/MM/dd"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: any) => {
        const notCancellable =
          record?.status === "CANCELLED" || record?.status === "CLOSED";

        return (
          <Space size="middle">
            <Button
              onClick={() => setIsEdit(record)}
              style={{ border: "none", padding: "5px" }}
            >
              <RiEditBoxFill color="#4d4d4d" size={20} />
            </Button>

            <Button
              title={
                notCancellable
                  ? `A ${record?.status?.toLowerCase()} investment cannot be cancelled`
                  : "Cancel this investment"
              }
              disabled={notCancellable}
              onClick={() => {
                setCancelReason("");
                setIsCancel(record);
              }}
              style={{ border: "none", padding: "5px" }}
            >
              <MdCancel color={notCancellable ? "#bfbfbf" : "red"} size={20} />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{project?.title}</h1>
      <p className="text-sm opacity-70 mb-4">Investments for this project</p>

      {/* summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
          <p className="text-sm font-medium text-green-700">Approved Amount</p>
          <p className="text-2xl font-bold text-green-800 mt-1 break-all">
            ৳{summary.approvedAmount.toLocaleString()}
          </p>
          <p className="text-xs text-green-700/70 mt-1">
            {summary.approvedShares.toLocaleString()} of{" "}
            {Number(project?.totalShares || 0).toLocaleString()} shares
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-amber-700">Pending Amount</p>
          <p className="text-2xl font-bold text-amber-800 mt-1 break-all">
            ৳{summary.pendingAmount.toLocaleString()}
          </p>
          <p className="text-xs text-amber-700/70 mt-1">
            {summary.pendingCount} awaiting approval
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200">
          <p className="text-sm font-medium text-blue-700">Investors</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">
            {summary.totalInvestors}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-4 rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Investments</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.totalInvestments}
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-3">
        <Radio.Group
          options={[
            { value: "", label: "All" },
            { value: "PENDING", label: "PENDING" },
            { value: "APPROVED", label: "APPROVED" },
            { value: "REJECTED", label: "REJECTED" },
            { value: "CANCELLED", label: "CANCELLED" },
          ]}
          onChange={({ target: { value } }: RadioChangeEvent) =>
            setStatus(value)
          }
          value={status}
          optionType="button"
          buttonStyle="solid"
        />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          scroll={{ x: "max-content" }}
        />
      )}

      {/* edit investment */}
      <Modal
        centered
        open={isEdit}
        onCancel={() => setIsEdit(null)}
        footer={null}
        destroyOnHidden={true}
        className="responsive-ant-modal"
        width="90vw"
        styles={{ body: { padding: 0 } }}
      >
        <InvestmentView investment={isEdit} setIsEdit={setIsEdit} />
      </Modal>

      {/* cancel confirmation */}
      <Modal
        centered
        title="Cancel this investment?"
        open={!!isCancel}
        onCancel={() => setIsCancel(null)}
        okText="Cancel investment"
        okButtonProps={{ danger: true, loading: isCancelling }}
        cancelText="Keep it"
        onOk={submitCancel}
        destroyOnHidden={true}
        width={520}
      >
        <Alert
          type="warning"
          showIcon
          className="mb-4"
          message="This cannot be undone"
          description={
            <ul className="list-disc pl-4 text-sm">
              <li>The investment is marked CANCELLED.</li>
              <li>All of its investment returns are cancelled.</li>
              <li>
                ৳{Number(isCancel?.amount || 0).toLocaleString()} is refunded to
                the investor&apos;s wallet as a deposit.
              </li>
              {isCancel?.status === "APPROVED" && (
                <li>
                  {isCancel?.qty} share(s) are released back to the project.
                </li>
              )}
            </ul>
          }
        />

        <p className="text-sm mb-1 opacity-70">Reason (optional)</p>
        <Input.TextArea
          rows={3}
          value={cancelReason}
          placeholder="Why is this investment being cancelled?"
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </Modal>

      {/* investor drill-down */}
      <Modal
        centered
        open={viewUserInvestment}
        onCancel={() => setViewUserInvestment(null)}
        footer={null}
        destroyOnHidden={true}
        width={"60%"}
      >
        <InvestmentInfo userId={viewUserInvestment} />
      </Modal>
    </div>
  );
};

export default ProjectInvestmentsList;
