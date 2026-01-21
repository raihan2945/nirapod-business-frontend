import React, { useState } from "react";
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
} from "antd";
import Image from "next/image";
import { baseUrl } from "@/utils/baseUrl";
import { RiEditBoxFill } from "react-icons/ri";
import InvestmentView from "../admin/project/InvestmentView";
import { format } from "date-fns";

const InvestorInvestments = ({ userId }: { userId: string }) => {
  const [query, setQuery] = useState({
    userId: userId,
  });

  const { data, isLoading } = useGetAllProjectInvestmentsQuery(
    generateQueryArray(query),
  );

  console.log("data", data);

  const [isEdit, setIsEdit] = useState<any>(null);

  interface DataType {
    id: string;
    brand: string;
    photo: string;
    chasis_number: string;
    status: boolean;
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
        <div className="relative w-20 h-20 p-1 overflow-hidden rounded">
          <Image
            alt="N/A"
            src={`${baseUrl}/uploads/photos/${text}`}
            fill
            className="w-full h-auto object-contain"
          />
        </div>
      ),
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "serial",
      render: (text, data: any) => data?.Project?.title,
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
        <Tag color={text ? "success" : "error"}>
          {text ? "Active" : "Inactive"}
        </Tag>
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

  console.log("Investor Investments Data:", data);

  return (
    <div>
      <Table size="small" columns={columns} dataSource={data?.data} />

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
          <InvestmentView investment={isEdit} />
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
    </div>
  );
};

export default InvestorInvestments;
