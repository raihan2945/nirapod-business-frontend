"use client";

import React, { useState, useTransition } from "react";
import { useGetAllProjectInvestmentsQuery } from "@/state/features/projects/projectInvestmentApi";
import { generateQueryArray } from "@/utils/query";
import {
  Table,
  TableProps,
  Tag,
  Space,
  Button,
  Popconfirm,
  Modal,
  Divider,
  Tabs,
  Image,
  Popover,
} from "antd";
import { format } from "date-fns";
import { baseUrl } from "@/utils/baseUrl";
import { RiEditBoxFill } from "react-icons/ri";
import {
  BanknoteArrowDown,
  BriefcaseBusiness,
  CircleCheck,
  CircleCheckBig,
  CircleX,
  Wallet,
} from "lucide-react";
import {
  useGetAllWalletTransactionsQuery,
  useUpdateWalletTransactionMutation,
} from "@/state/features/wallet/walletTransactionApi";
import { cn } from "@/lib/utils";
import WithdrawHeader from "@/views/admin/withdrawal/HeaderSection";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import WalletTransactionForm from "@/views/admin/user/wallet/WalletTransactionForm";

const WithDrawals = ({
  userId,
  isAdmin,
  showBankInfo,
}: {
  userId: string;
  isAdmin?: boolean;
  showBankInfo?: boolean;
}) => {
  const [query, setQuery] = useState({
    userId: userId,
    type: "All",
    status: "All",
  });

  const [isCreate, setIsCreate] = useState<any>(null);

  const { data, isLoading } = useGetAllWalletTransactionsQuery(
    generateQueryArray(query),
  );

  const [UpdateTransaction, { isLoading: isUpdating }] =
    useUpdateWalletTransactionMutation();

  const { handleResponse } = useAPIResponseHandler();

  // console.log("data", data);

  const [isEdit, setIsEdit] = useState<any>(null);
  const [openTransaction, setOpenTransaction] = useState<any>();

  interface DataType {
    id: string;
  }

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (data: { id: string; status: string }) => {
    try {
      const formData = new FormData();
      formData.append("status", data?.status);

      const res = await UpdateTransaction({ id: data.id, data: formData });

      console.log("Response is : ", res);

      handleResponse(res);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Failed to create blog.");
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Id",
      dataIndex: "serial",
      key: "serial",
      render: (text) => `#${text}`,
    },
    {
      title: "User Id",
      dataIndex: "serial",
      key: "serial",
      render: (text, record: any) => (
        <Tag>{record?.User?.serial || record?.userId}</Tag>
      ),
    },
    {
      title: "Proof",
      dataIndex: "proof1",
      key: "proof1",
      render: (text) => (
        <div className="">
          <Image
            alt="Image"
            src={`${baseUrl}/uploads/photos/${text}`}
            style={{ width: "50px" }}
          />
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, data: any) => (
        <Tag>
          <p
            className={cn(
              "font-bold",
              text == "DEPOSIT" ? "text-green-600" : "text-amber-600",
            )}
          >
            {text}
          </p>
        </Tag>
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
      title: "Transaction Id",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => text,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <p
          className={cn(
            "font-bold",
            text == "APPROVED"
              ? "text-green-600"
              : text == "REJECTED"
                ? "text-red-500"
                : "text-yellow-500",
          )}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => format(new Date(text), "dd-MM-yyyy"),
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => format(new Date(text), "dd-MM-yyyy"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: any) =>
        record?.status == "PENDING" && (
          <Space size="middle">
            {/* {hasAccess(["bike_management"]) && ( */}
            <Popconfirm
              title="Reject the deposit"
              description="Are you sure to reject this deposit?"
              okText="Yes"
              cancelText="No"
              placement="left"
              onConfirm={() => {
                onSubmit({ id: record?.id, status: "REJECTED" });
              }}
            >
              <Button style={{ border: "none", padding: "5px" }} size="small">
                <CircleX className="text-red-500" />
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Approve the deposit"
              description="Are you sure to approve this deposit?"
              okText="Yes"
              cancelText="No"
              placement="left"
              onConfirm={() => {
                record?.type == "WITHDRAWAL"
                  ? setIsEdit(record)
                  : onSubmit({ id: record?.id, status: "APPROVED" });
              }}
            >
              <Button style={{ border: "none", padding: "5px" }} size="small">
                <CircleCheck className="text-green-500" />
              </Button>
            </Popconfirm>

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

  return (
    <div>
      <div className="mb-2">
        <WithdrawHeader query={query} changeQuery={changeQuery} />
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={data?.data}
        scroll={{ x: "max-content" }}
      />

      {/* Deposit/withdraw to wallet */}
      <Modal
        centered
        open={isEdit}
        onCancel={() => setIsEdit(null)}
        footer={null}
        destroyOnHidden={true}
        width="90vw"
        // width={700}
        styles={{
          body: { padding: 0 },
        }}
        className="responsive-ant-modal"
      >
        {/* <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto"> */}
        <WalletTransactionForm
          formType="edit"
          modalCancel={() => setIsEdit(null)}
          userId={userId}
          projectId={isCreate?.id || ""}
          type={openTransaction}
          info={isEdit}
          title="Approve withdrawal"
        />
        {/* </div> */}
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
    </div>
  );
};

export default WithDrawals;
