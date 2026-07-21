"use client";

import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Modal,
  Progress,
  Tooltip,
} from "antd";
import type { TableProps } from "antd";
import Image from "next/image";

//icons
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdLock } from "react-icons/md";

import { RiEditBoxFill } from "react-icons/ri";
import TableSkeleton from "@/components/TableSkeleton";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
// import useCheckAccess from "@/utils/checkAccess";
import ProjectForm from "./form/ProjectForm";
import { useCloseProjectByIdMutation } from "@/state/features/projects/projectsApi";
import { format } from "date-fns";
import ProjectInvestmentsList from "./ProjectInvestmentsList";

interface ComponentProps {
  data?: any;
  isLoading?: any;
}

const money = (value: any) =>
  `৳${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const statusColor: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "orange",
  CLOSED: "default",
};

const ProjectView: React.FC<ComponentProps> = ({ data, isLoading }) => {
  // const { hasAccess } = useCheckAccess();

  const [isEdit, setIsEdit] = useState<any>(null);
  const [viewInvestments, setViewInvestments] = useState<any>(null);

  const { handleResponse } = useAPIResponseHandler();

  const [closeOne] = useCloseProjectByIdMutation();

  interface DataType {
    id: string;
  }

  const submitClose = async (id: any) => {
    const res = await closeOne({ id: id, data: {} });

    handleResponse(res);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "SL",
      dataIndex: "serial",
      key: "serial",
      width: 70,
      render: (text) => <span className="text-gray-500">#{text}</span>,
    },
    {
      title: "Project",
      dataIndex: "title",
      key: "title",
      width: 320,
      render: (text, record: any) => (
        <div className="flex gap-3 items-center">
          <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
            {record?.coverPhoto ? (
              <Image
                alt={text}
                src={`${baseUrl}/uploads/photos/${record.coverPhoto}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-[10px] text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{text}</p>
            <Tooltip title={record?.description}>
              <p className="text-xs text-gray-500 line-clamp-2">
                {record?.description || "—"}
              </p>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: "Funding",
      dataIndex: "raisedShares",
      key: "funding",
      width: 230,
      sorter: (a: any, b: any) =>
        Number(a?.raisedShares || 0) - Number(b?.raisedShares || 0),
      render: (_, record: any) => {
        const total = Number(record?.totalShares || 0);
        const raisedShares = Number(record?.raisedShares || 0);
        const percent = total > 0 ? Math.round((raisedShares / total) * 100) : 0;
        const raisedAmount = raisedShares * Number(record?.minInvestment || 0);

        return (
          <div className="min-w-[190px]">
            <Progress
              percent={percent}
              size="small"
              status={record?.status === "CLOSED" ? "normal" : "active"}
              strokeColor={percent >= 100 ? "#31AD5C" : "#1677ff"}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {raisedShares.toLocaleString()} / {total.toLocaleString()} shares
              </span>
              <span className="font-medium text-gray-700">
                {money(raisedAmount)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Goal {money(record?.investmentGoal)}
            </p>
          </div>
        );
      },
    },
    {
      title: "Per Share",
      dataIndex: "minInvestment",
      key: "minInvestment",
      width: 120,
      render: (text) => (
        <span className="whitespace-nowrap">{money(text)}</span>
      ),
    },
    {
      title: "Terms",
      key: "terms",
      width: 150,
      render: (_, record: any) => (
        <div className="text-xs text-gray-600 leading-5">
          <div>
            {Number(record?.projectDuration || 0)} months ·{" "}
            {Number(record?.repayment || 0)} repayments
          </div>
          {record?.expectedRoi && (
            <div className="text-gray-500">ROI {record.expectedRoi}</div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (text) => (
        <Tag color={statusColor[text] || "blue"}>{text}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: (a: any, b: any) =>
        new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime(),
      render: (text) => (
        <span className="whitespace-nowrap text-gray-600">
          {text ? format(new Date(text), "dd MMM yyyy") : "—"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      fixed: "right",
      render: (_, record: any) => {
        const isClosed = record?.status === "CLOSED";

        return (
          <Space size={4}>
            <Tooltip title="Edit project">
              <Button
                onClick={() => setIsEdit(record)}
                style={{ border: "none", padding: "5px" }}
              >
                <RiEditBoxFill color="#4d4d4d" size={20} />
              </Button>
            </Tooltip>

            <Tooltip title="View investments">
              <Button
                onClick={() => setViewInvestments(record)}
                style={{ border: "none", padding: "5px" }}
              >
                <HiMiniClipboardDocumentList color="#31AD5C" size={20} />
              </Button>
            </Tooltip>

            <Tooltip title={isClosed ? "Already closed" : "Close project"}>
              <Popconfirm
                title="Close the project"
                description="Are you sure to close this project?"
                onConfirm={() => submitClose(record?.id)}
                okText="Yes"
                cancelText="No"
                disabled={isClosed}
              >
                <Button
                  disabled={isClosed}
                  style={{ border: "none", padding: "5px" }}
                >
                  <MdLock color={isClosed ? "#bfbfbf" : "#d97706"} size={20} />
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <>
      <div className="mt-5 bg-white px-4 py-4 rounded-sm shadow-sm">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          size="middle"
          scroll={{ x: "max-content" }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} projects`,
          }}
        />
      </div>

      {/* edit project form */}
      <Modal
        centered
        open={isEdit}
        onCancel={() => setIsEdit(false)}
        footer={null}
        destroyOnHidden={true}
        className="responsive-modal"
        width={"50%"}
      >
        <ProjectForm
          formType="edit"
          info={isEdit}
          modalCancel={() => setIsEdit(false)}
        />
      </Modal>

      {/* project-wise investment list */}
      <Modal
        centered
        open={viewInvestments}
        onCancel={() => setViewInvestments(null)}
        footer={null}
        destroyOnHidden={true}
        width="90vw"
        styles={{ body: { padding: 0 } }}
      >
        <ProjectInvestmentsList project={viewInvestments} />
      </Modal>
    </>
  );
};

export default ProjectView;
