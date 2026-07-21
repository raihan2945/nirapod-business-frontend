"use client";

import React, { useMemo, useState } from "react";
import { Table, Tag, Button, Progress, Modal, Tooltip, Empty } from "antd";
import type { TableProps } from "antd";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarClock } from "lucide-react";

import { useGetAllProjectInvestmentReturnsQuery } from "@/state/features/projects/investmentReturnApi";
import { generateQueryArray } from "@/utils/query";
import { baseUrl } from "@/utils/baseUrl";
import TableSkeleton from "@/components/TableSkeleton";
import InvestmentReturnForm from "./InvestmentReturnForm";

const money = (value: any) =>
  `৳${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const statusColor: Record<string, string> = {
  PAID: "green",
  CANCELLED: "volcano",
  PENDING: "blue",
};

const InvestmentReturnsSchedule = ({
  investmentId,
  canEdit,
}: {
  investmentId?: string;
  canEdit?: boolean;
}) => {
  const [markPaid, setMarkPaid] = useState<any>(null);

  const { data, isLoading } = useGetAllProjectInvestmentReturnsQuery(
    generateQueryArray({ investmentId, sortBy: "date", sort: "asc" }),
    { skip: !investmentId },
  );

  const returns = useMemo(() => data?.data || [], [data]);

  const summary = useMemo(() => {
    const paid = returns.filter((r: any) => r?.status === "PAID");
    const total = returns.length;

    const sum = (rows: any[]) =>
      rows.reduce((acc: number, r: any) => acc + Number(r?.totalAmount || 0), 0);

    return {
      paidCount: paid.length,
      total,
      percent: total > 0 ? Math.round((paid.length / total) * 100) : 0,
      paidAmount: sum(paid),
      totalAmount: sum(returns),
    };
  }, [returns]);

  const today = startOfDay(new Date());

  const columns: TableProps<any>["columns"] = [
    {
      title: "#",
      key: "index",
      width: 55,
      render: (_, __, index) => (
        <span className="text-gray-500">{index + 1}</span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (text, record: any) => {
        if (!text) return "—";

        const due = new Date(text);
        const overdue =
          record?.status === "PENDING" && isBefore(startOfDay(due), today);

        return (
          <div className="whitespace-nowrap">
            <span className={overdue ? "text-red-600 font-medium" : ""}>
              {format(due, "dd MMM yyyy")}
            </span>
            {overdue && (
              <Tag color="red" className="ml-2">
                OVERDUE
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      width: 70,
      render: (text) => text ?? "—",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (text) => (
        <span className="whitespace-nowrap font-medium">{money(text)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) => <Tag color={statusColor[text] || "blue"}>{text}</Tag>,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            <span className="line-clamp-1">{text}</span>
          </Tooltip>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Proof",
      dataIndex: "photo",
      key: "photo",
      width: 90,
      render: (text) =>
        text ? (
          <a
            href={`${baseUrl}/uploads/photos/${text}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="proof"
              src={`${baseUrl}/uploads/photos/${text}`}
              className="w-10 h-10 object-cover rounded border"
            />
          </a>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_, record: any) =>
        canEdit && record?.status === "PENDING" ? (
          <Button size="small" onClick={() => setMarkPaid(record)}>
            Mark paid
          </Button>
        ) : null,
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <CalendarClock className="w-6 h-6 text-indigo-600" />
          Repayment Schedule
        </h2>
        {summary.total > 0 && (
          <span className="text-sm text-gray-500">
            {summary.paidCount} of {summary.total} paid
          </span>
        )}
      </div>

      {summary.total === 0 ? (
        <Empty
          description="No returns have been generated for this investment yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <div className="mb-6">
            <Progress
              percent={summary.percent}
              strokeColor={summary.percent >= 100 ? "#31AD5C" : "#1677ff"}
            />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {money(summary.paidAmount)}
              </span>{" "}
              returned of {money(summary.totalAmount)} scheduled
            </p>
          </div>

          <Table
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={returns}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </>
      )}

      {/* confirm paid form */}
      <Modal
        centered
        open={!!markPaid}
        onCancel={() => setMarkPaid(null)}
        footer={null}
        destroyOnHidden={true}
        width={480}
        styles={{ body: { padding: 0 } }}
      >
        <InvestmentReturnForm
          info={markPaid}
          formType="edit"
          modalCancel={() => setMarkPaid(null)}
        />
      </Modal>
    </div>
  );
};

export default InvestmentReturnsSchedule;
