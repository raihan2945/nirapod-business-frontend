"use client";

import React, { useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, Modal } from "antd";
import type { TableProps } from "antd";
import Image from "next/image";

//icons
import { MdDelete } from "react-icons/md";

// import { bikeData, carData } from "@/lib/data";
import { RiEditBoxFill } from "react-icons/ri";
import TableSkeleton from "@/components/TableSkeleton";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import BlogForm from "./form/InvestorForm";
import { useDeleteInvestorByIdMutation } from "@/state/features/investors/investorApi";

interface ComponentProps {
  data?: any;
  isLoading?: any;
}

const InvestorView: React.FC<ComponentProps> = ({ data, isLoading }) => {
  // const { hasAccess } = useCheckAccess();

  const [isEdit, setIsEdit] = useState<any>(null);
  const [showAlltoment, setShowAlltoment] = useState<any>(null);

  const { handleResponse } = useAPIResponseHandler();

  const [deleteOne] = useDeleteInvestorByIdMutation();

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
    },
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
      render: (text) => text,
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      render: (text) => text,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
        width={"50%"}
      >
        {/* <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto"> */}
        <BlogForm
          formType="edit"
          info={isEdit}
          modalCancel={() => setIsEdit(false)}
        />
        {/* </div> */}
      </Modal>
    </>
  );
};

export default InvestorView;
