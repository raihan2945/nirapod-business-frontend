"use client";

import React, { useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, Modal, Badge } from "antd";
import type { TableProps } from "antd";
import Image from "next/image";

//icons
import { MdDelete } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { RiGalleryView2 } from "react-icons/ri";

import TableSkeleton from "@/components/TableSkeleton";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
// import useCheckAccess from "@/utils/checkAccess";
import UserForm from "./form/UserForm";
import { useDeleteUserByIdMutation } from "@/state/features/user/userApi";
import { format } from "date-fns";
import InvestmentInfo from "./InvestmentInfo";
import UserView from "./UserView";

interface ComponentProps {
  data?: any;
  isLoading?: any;
}

const UserListView: React.FC<ComponentProps> = ({ data, isLoading }) => {
  // const { hasAccess } = useCheckAccess();

  const [isEdit, setIsEdit] = useState<any>(null);
  const [viewInvestment, setViewInvestment] = useState<any>(null);
  const [showAlltoment, setShowAlltoment] = useState<any>(null);

  const { handleResponse } = useAPIResponseHandler();

  const [deleteOne] = useDeleteUserByIdMutation();

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
      dataIndex: "serial",
      key: "serial",
      render: (text) => `#${text}`,
    },

    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => text,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => text,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => text,
    },
    {
      title: "status",
      dataIndex: "verifyStatus",
      key: "verifyStatus",
      render: (text) => <Tag color={text=="APPROVED" ? "blue" :"" }>{text}</Tag>,
    },
    {
      title: "Investments",
      dataIndex: "verifyStatus",
      key: "verifyStatus",
      render: (text, data: any) => {
        return (
          <Tag
            color={
              Number(data?._count?.ProjectInvestment) > 0 ? "#09b531" : "green"
            }
          >
            {data?._count?.ProjectInvestment}
          </Tag>
        );
      },
    },
    {
      title: "createAt",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => format(text, "dd-MM-yyyy"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: any) => (
        <Space size="middle">
          {/* {hasAccess(["bike_management"]) && ( */}
          <Button
            onClick={() => {
              setViewInvestment(record?.id);
            }}
            style={{ border: "none", padding: "5px" }}
          >
            <RiGalleryView2 color="#4d4d4d" size={20} />
          </Button>
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
        <UserView
          formType="edit"
          info={isEdit}
          modalCancel={() => setIsEdit(false)}
          isAdmin={true}
        />
        {/* </div> */}
      </Modal>
      <Modal
        centered
        open={viewInvestment}
        onCancel={() => setViewInvestment(null)}
        footer={null}
        destroyOnHidden={true}
        width={"60%"}
      >
        {/* <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto"> */}
        <InvestmentInfo
          // formType="edit"
          userId={viewInvestment}
          // modalCancel={() => setIsEdit(false)}
        />
        {/* </div> */}
      </Modal>
    </>
  );
};

export default UserListView;
