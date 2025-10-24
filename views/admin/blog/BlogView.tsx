"use client";

import React, { useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, Modal } from "antd";
import type { TableProps } from "antd";
import Image from "next/image";

//icons
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

// import { bikeData, carData } from "@/lib/data";
import { RiEditBoxFill } from "react-icons/ri";
import AddBike from "./form/BlogForm";
import TableSkeleton from "@/components/TableSkeleton";
import { generateQueryArray } from "@/utils/query";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import useCheckAccess from "@/utils/checkAccess";
import { useDeleteBlogByIdMutation } from "@/state/features/blogs/blogsApi";

interface ComponentProps {
  bikeData?: any;
  isLoading?: any;
}

const BlogView: React.FC<ComponentProps> = ({ bikeData, isLoading }) => {
  const { hasAccess } = useCheckAccess();

  const [isEdit, setIsEdit] = useState<any>(null);
  const [showAlltoment, setShowAlltoment] = useState<any>(null);

  // const { handleResponse } = useAPIResponseHandler();

  const [deleteOne] = useDeleteBlogByIdMutation();

  interface DataType {
    id: string;
    brand: string;
    photo: string;
    chasis_number: string;
    status: boolean;
  }

  const submitDelete = async (id: any) => {
    const res = deleteOne(id);

    // handleResponse(res);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text) => `#${text}`,
    },
    {
      title: "Cover Photo",
      dataIndex: "coverPhoto",
      key: "coverPhoto",
      render: (text) => (
        <div className="relative w-20 h-20 p-1 overflow-hidden rounded-full">
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
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
          {hasAccess(["bike_management"]) && (
            <Button
              onClick={() => {
                setIsEdit(record);
              }}
              style={{ border: "none", padding: "5px" }}
            >
              <RiEditBoxFill color="#4d4d4d" size={20} />
            </Button>
          )}

          <Button
            onClick={() => setShowAlltoment(true)}
            style={{ border: "none", padding: "5px" }}
          >
            <HiMiniClipboardDocumentList color="#4d4d4d" size={20} />
          </Button>
          {hasAccess(["bike_management"]) && (
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
          )}
        </Space>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <>
      <div className="mt-5 bg-white px-4 py-4 rounded-sm shadow-sm">
        <Table columns={columns} dataSource={bikeData} />
      </div>

      {/* edit blog form */}
      {/* <Modal
        title="Update a new bike"
        centered
        open={isEdit}
        onCancel={() => setIsEdit(false)}
        width={"60%"}
        footer={null}
        destroyOnHidden={true}
      >
        <AddBike
          formType="edit"
          info={isEdit}
          modalCancel={() => setIsEdit(false)}
        />
      </Modal> */}
    </>
  );
};

export default BlogView;
