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
} from "antd";
import { format } from "date-fns";
import { baseUrl } from "@/utils/baseUrl";
import { RiEditBoxFill } from "react-icons/ri";
import { BanknoteArrowDown, BriefcaseBusiness, Wallet } from "lucide-react";
import { useGetAllWalletTransactionsQuery } from "@/state/features/wallet/walletTransactionApi";
import { cn } from "@/lib/utils";

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
  });

  const [isCreate, setIsCreate] = useState<any>(null);

  const { data, isLoading } = useGetAllWalletTransactionsQuery(
    generateQueryArray({}),
  );

  // console.log("data", data);

  const [isEdit, setIsEdit] = useState<any>(null);
  const [openTransaction, setOpenTransaction] = useState<any>();

  interface DataType {
    id: string;
  }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Id",
      dataIndex: "serial",
      key: "serial",
      render: (text) => `#${text}`,
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
            // className="w-full h-auto object-contain"
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
      render: (text) => <Tag color="blue">{text}</Tag>,
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

  console.log("Transaction Data:", data);

  return (
    <div>
      {/* <div className="flex justify-end gap-2 pb-3 flex-wrap">
        {!isAdmin && (
          <Button
            onClick={() => setIsCreate(true)}
            type="primary"
            style={{ backgroundColor: "#31AD5C" }}
            icon={<BriefcaseBusiness className="size-5" />}
          >
            Make Investment
          </Button>
        )}
        {!isAdmin && (
          <Button
            onClick={() => setOpenTransaction("DEPOSIT")}
            type="primary"
            style={{ backgroundColor: "black" }}
            icon={<Wallet className="size-5" />}
          >
            Add Money
          </Button>
        )}
        {!isAdmin && (
          <Button
            icon={<BanknoteArrowDown className="size-5" />}
            onClick={() => setOpenTransaction("WITHDRAWAL")}
            type="default"
          >
            Withdraw
          </Button>
        )}
      </div> */}

      <Table
        size="small"
        columns={columns}
        dataSource={data?.data}
        scroll={{ x: "max-content" }}
      />

      {/* Deposit/withdraw to wallet */}
      <Modal
        centered
        open={openTransaction}
        onCancel={() => setOpenTransaction(null)}
        footer={null}
        destroyOnHidden={true}
        width="90vw"
        // width={700}
        styles={{
          body: { padding: 0 },
        }}
        // Optional: add this class for extra control
        className="responsive-ant-modal"
      >
        {/* <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto"> */}
        {/* <WalletTransactionForm
          formType="create"
          modalCancel={() =>  setOpenTransaction(null)}
          userId={userId}
          projectId={isCreate?.id || ""}
          type={openTransaction}
        /> */}
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
