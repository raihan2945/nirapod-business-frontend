"use client";

import React, { useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, Modal, Divider } from "antd";
import type { TableProps } from "antd";
import Image from "next/image";

//icons
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";

import { RiEditBoxFill } from "react-icons/ri";
import TableSkeleton from "@/components/TableSkeleton";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { useDeleteBlogByIdMutation } from "@/state/features/blogs/blogsApi";
import InvestmentReturnForm from "./InvestmentReturnForm";
import ReturnDetailView from "./ReturnDetailView";
import { format, isBefore, startOfDay, isSameDay, addDays } from "date-fns";

interface ComponentProps {
  data?: any;
  isLoading?: any;
}

const InvestmentReturnView: React.FC<ComponentProps> = ({
  data,
  isLoading,
}) => {
  // const { hasAccess } = useCheckAccess();

  const [isEdit, setIsEdit] = useState<any>(null);
  const [isView, setIsView] = useState<any>(null);

  const { handleResponse } = useAPIResponseHandler();

  const [deleteOne] = useDeleteBlogByIdMutation();

  interface DataType {
    id: string;
    brand: string;
    photo: string;
    chasis_number: string;
    status: boolean;
  }

  const submitDelete = async (id: any) => {
    const res = await deleteOne(id);

    handleResponse(res);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "SL",
      dataIndex: "serial",
      key: "serial",
      render: (text) => `#${text}`,
      width: 80,
    },
    {
      title: "Due Date",
      dataIndex: "date",
      key: "date",
      width: 165,
      render: (text, record: any) => {
        if (!text) return <span className="text-gray-400">—</span>;

        const due = startOfDay(new Date(text));
        const today = startOfDay(new Date());
        const unpaid = record?.status === "PENDING";
        const overdue = unpaid && isBefore(due, today);
        const dueToday = unpaid && isSameDay(due, today);

        return (
          <div className="whitespace-nowrap">
            <span className={overdue ? "text-red-600 font-medium" : ""}>
              {format(new Date(text), "dd MMM yyyy")}
            </span>
            {overdue && (
              <Tag color="red" className="ml-2">
                OVERDUE
              </Tag>
            )}
            {dueToday && (
              <Tag color="gold" className="ml-2">
                TODAY
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "End Due Date",
      dataIndex: "date",
      key: "endDate",
      width: 140,
      //end of the 7-day pay-by window: due date + 7 days
      render: (text) =>
        text ? (
          <span className="whitespace-nowrap text-gray-700">
            {format(addDays(new Date(text), 7), "dd MMM yyyy")}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Investor",
      dataIndex: "userId",
      key: "userId",
      render: (text, data: any) => (
        <div className="min-w-0">
          <p className="truncate">{data?.ProjectInvestment?.User?.fullName}</p>
          <Tag color="blue" className="mt-1">
            #{data?.ProjectInvestment?.User?.serial}
          </Tag>
        </div>
      ),
    },
    {
      title: "Project ID(SL)",
      dataIndex: "projectSerial",
      key: "projectSerial",
      render: (text, data: any) => {
        return data?.ProjectInvestment?.Project?.serial;
      },
    },
    {
      title: "Project Title",
      dataIndex: "projectTitle",
      key: "projectTitle",
      render: (text, data: any) => {
        return data?.ProjectInvestment?.Project?.title;
      },
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      width: 70,
      render: (text) => text,
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (text) => (
        <span className="whitespace-nowrap font-medium">
          ৳
          {Number(text || 0).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    },

    {
      title: "Return Proof",
      dataIndex: "photo",
      key: "photo",
      render: (text) =>
        text ? (
          <div className="relative w-20 h-20 p-1 overflow-hidden rounded">
            <Image
              alt="photo"
              src={`${baseUrl}/uploads/photos/${text}`}
              fill
              className="w-full h-auto object-contain"
            />
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Return Note",
      dataIndex: "note",
      key: "note",
      render: (text) => text || <span className="text-gray-400">—</span>,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={
            text === "PAID"
              ? "green"
              : text === "CANCELLED"
                ? "volcano"
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
      render: (text)=>{
       return text && format(text, "dd-MM-yyyy")
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: any) => (
        <Space size="middle">
          <Button
            title="View full details"
            onClick={() => {
              setIsView(record);
            }}
            style={{ border: "none", padding: "5px" }}
          >
            <FaEye color="#1677ff" size={18} />
          </Button>

          {/* {hasAccess(["bike_management"]) && ( */}
          <Button
            title="Confirm paid"
            onClick={() => {
              setIsEdit(record);
            }}
            style={{ border: "none", padding: "5px" }}
          >
            <RiEditBoxFill color="#4d4d4d" size={20} />
          </Button>
          {/* )} */}

          {/* <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => submitDelete(record?.id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button style={{ border: "none", padding: "5px" }}>
              <MdDelete color="red" size={20} />
            </Button>
          </Popconfirm> */}
        </Space>
      ),
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
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* full return / investor / investment detail */}
      <Modal
        centered
        open={!!isView}
        onCancel={() => setIsView(null)}
        footer={null}
        destroyOnHidden={true}
        width="90vw"
        style={{ maxWidth: 1100 }}
        styles={{ body: { padding: 0 } }}
      >
        <ReturnDetailView info={isView} />
      </Modal>

      {/* edit blog form */}
      <Modal
        centered
        open={isEdit}
        onCancel={() => setIsEdit(false)}
        footer={null}
        destroyOnHidden={true}
        className="responsive-modal"
        width={"25%"}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div>
          <InvestmentReturnForm
            info={isEdit}
            formType="edit"
            modalCancel={() => setIsEdit(false)}
          />
        </div>
      </Modal>

      <style jsx global>{`
        /* ✅ Responsive modal sizing */
        .responsive-modal .ant-modal {
          width: 95% !important;
          max-width: 900px;
          top: 2%;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .responsive-modal .ant-modal {
            width: 100% !important;
            max-width: 95%;
            margin: 0 8px;
            top: 0;
          }
          .responsive-modal .ant-modal-content {
            border-radius: 0;
            height: 100vh;
            overflow-y: auto;
          }
        }

        @media (min-width: 769px) {
          .responsive-modal .ant-modal {
            max-width: 700px;
          }
        }
      `}</style>
    </>
  );
};

export default InvestmentReturnView;
