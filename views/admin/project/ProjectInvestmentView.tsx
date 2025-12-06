"use client";

import React, { useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, Modal, Divider } from "antd";
import type { TableProps } from "antd";
import Image from "next/image";

//icons
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

// import { bikeData, carData } from "@/lib/data";
import { RiEditBoxFill } from "react-icons/ri";
import TableSkeleton from "@/components/TableSkeleton";
import { generateQueryArray } from "@/utils/query";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
// import useCheckAccess from "@/utils/checkAccess";
import { useDeleteBlogByIdMutation } from "@/state/features/blogs/blogsApi";
import InvestmentView from "./InvestmentView";
// import BlogForm from "./form/BlogForm";

interface ComponentProps {
  data?: any;
  isLoading?: any;
}

const ProjectInvestmentView: React.FC<ComponentProps> = ({ data, isLoading }) => {
  // const { hasAccess } = useCheckAccess();

  const [isEdit, setIsEdit] = useState<any>(null);
  const [showAlltoment, setShowAlltoment] = useState<any>(null);

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
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text) => `#${text}`,
      width: 170,
    },
    {
      title: "Proof",
      dataIndex: "proof1",
      key: "proof1",
      render: (text) => (
        <div className="relative w-20 h-20 p-1 overflow-hidden rounded">
          <Image
            alt="photo"
            src={`${baseUrl}/uploads/photos/${text}`}
            fill
            className="w-full h-auto object-contain"
          />
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => text,
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
      render: (text) => text,
    },
    {
      title: "Transaction Id",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => text,
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: any) => (
        <Space size="middle">
          {/* {hasAccess(["bike_management"]) && ( */}
          <Button
            onClick={() => {
              setIsEdit(record);
            }}
            style={{ border: "none", padding: "5px" }}
          >
            <RiEditBoxFill color="#4d4d4d" size={20} />
          </Button>
          {/* )} */}

          <Popconfirm
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
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton />;

  console.log("Investment Data:", data);

  return (
    <>
      <div className="mt-5 bg-white px-4 py-4 rounded-sm shadow-sm">
        <Table columns={columns} dataSource={data} />
      </div>

      {/* edit blog form */}
      <Modal
        centered
        open={isEdit}
        onCancel={() => setIsEdit(false)}
        footer={null}
        destroyOnHidden={true}
        className="responsive-modal"
        width={"50%"}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
       <div>
       <InvestmentView investment={isEdit}/>
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

export default ProjectInvestmentView;
