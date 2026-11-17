"use client";

import React, { useMemo, useState } from "react";
import { Alert, Button, Input, Modal, Tooltip } from "antd";
import { format, addDays } from "date-fns";
import { MdDoneAll } from "react-icons/md";
import { generateQueryArray } from "@/utils/query";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { useBulkPayProjectInvestmentReturnsMutation } from "@/state/features/projects/investmentReturnApi";

//the list filters that decide which returns are shown. Bulk pay sends exactly
//these, so the backend pays the same rows the admin sees (status is forced to
//PENDING server-side).
const FILTER_KEYS = [
  "projectId",
  "fromDate",
  "toDate",
  "allDates",
  "days",
  "userId",
  "investmentId",
];

interface ComponentProps {
  query: any;
  rows?: any[]; //rows currently loaded for these filters
  isLoading?: boolean;
}

const money = (n: number) =>
  `৳${Math.round(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const fmt = (d: string | Date) => format(new Date(d), "dd MMM yyyy");

const BulkPayButton: React.FC<ComponentProps> = ({
  query,
  rows,
  isLoading,
}) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const { handleResponse } = useAPIResponseHandler();
  const [bulkPay, { isLoading: isPaying }] =
    useBulkPayProjectInvestmentReturnsMutation();

  const summary = useMemo(() => {
    const pending = (rows || []).filter((r) => r?.status === "PENDING");
    const total = pending.reduce((s, r) => s + Number(r?.totalAmount || 0), 0);
    const investors = new Set(pending.map((r) => r?.ProjectInvestment?.userId));

    //an investment closes (and its principal is refunded) when this batch
    //pays every return it still has pending
    const selectedPerInvestment = new Map<string, number>();
    pending.forEach((r) =>
      selectedPerInvestment.set(
        r.InvestmentId,
        (selectedPerInvestment.get(r.InvestmentId) || 0) + 1,
      ),
    );
    let closing = 0;
    let principal = 0;
    selectedPerInvestment.forEach((count, investmentId) => {
      const sample = pending.find((r) => r.InvestmentId === investmentId);
      const stillPending = (sample?.returnStatuses || []).filter(
        (s: string) => s === "PENDING",
      ).length;
      if (stillPending > 0 && count >= stillPending) {
        closing++;
        principal += Number(sample?.ProjectInvestment?.amount || 0);
      }
    });

    return { count: pending.length, total, investors: investors.size, closing, principal };
  }, [rows]);

  //human-readable description of the active filters for the dialog
  const filterLabel = useMemo(() => {
    let dates: string;
    if (query?.allDates) dates = "All due dates";
    else if (query?.fromDate || query?.toDate)
      dates = `${fmt(query.fromDate || query.toDate)} – ${fmt(query.toDate || query.fromDate)}`;
    else dates = `${fmt(new Date())} – ${fmt(addDays(new Date(), 7))}`;

    const project = query?.projectId
      ? rows?.find((r) => r?.ProjectInvestment?.projectId === query.projectId)
          ?.ProjectInvestment?.Project
      : null;

    return {
      dates,
      project: query?.projectId
        ? project
          ? `${project.title} (#${project.serial})`
          : "Selected project"
        : "All projects",
    };
  }, [query, rows]);

  const statusBlocks =
    query?.status && query.status !== "PENDING" && query.status !== "all";
  const disabled = isLoading || statusBlocks || summary.count === 0;

  const tooltip = isLoading
    ? "Loading returns…"
    : statusBlocks
      ? "Switch the status filter to Pending or All to pay returns"
      : summary.count === 0
        ? "No pending returns match these filters"
        : `Mark ${summary.count} pending return${summary.count === 1 ? "" : "s"} as paid`;

  const close = () => {
    if (isPaying) return;
    setOpen(false);
    setNote("");
  };

  const submit = async () => {
    const filters: Record<string, any> = {};
    generateQueryArray(query).forEach((q: any) => {
      if (FILTER_KEYS.includes(q.title)) filters[q.title] = q.value;
    });

    const res: any = await bulkPay({
      data: {
        ...filters,
        expectedCount: summary.count,
        expectedTotal: Math.round(summary.total),
        ...(note.trim() ? { note: note.trim() } : {}),
      },
    });

    const result = handleResponse(res);
    //close only on success; on error the message is shown and the admin can retry
    if (result?.code === 200) {
      setOpen(false);
      setNote("");
    }
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <Button
          type="primary"
          disabled={disabled}
          onClick={() => setOpen(true)}
          icon={<MdDoneAll size={18} />}
          style={{ display: "flex", alignItems: "center" }}
        >
          Bulk paid{summary.count > 0 && !statusBlocks ? ` (${summary.count})` : ""}
        </Button>
      </Tooltip>

      <Modal
        centered
        open={open}
        onCancel={close}
        title="Mark returns as paid?"
        okText={`Mark ${summary.count} as paid`}
        okButtonProps={{ loading: isPaying }}
        cancelButtonProps={{ disabled: isPaying }}
        onOk={submit}
        maskClosable={!isPaying}
        closable={!isPaying}
        destroyOnHidden
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-500">Pending returns</p>
              <p className="text-lg font-semibold">{summary.count}</p>
            </div>
            <div className="rounded-md bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-500">Total to credit</p>
              <p className="text-lg font-semibold">{money(summary.total)}</p>
            </div>
          </div>

          <dl className="grid grid-cols-[110px_1fr] gap-y-1 text-sm">
            <dt className="text-gray-500">Project</dt>
            <dd>{filterLabel.project}</dd>
            <dt className="text-gray-500">Due date</dt>
            <dd>{filterLabel.dates}</dd>
            <dt className="text-gray-500">Investors</dt>
            <dd>{summary.investors}</dd>
          </dl>

          {summary.closing > 0 && (
            <Alert
              type="info"
              showIcon
              message={`${summary.closing} investment${summary.closing === 1 ? "" : "s"} will close`}
              description={`This pays their last pending return, so ${money(summary.principal)} of principal will also be refunded to investor wallets.`}
            />
          )}

          <div>
            <p className="mb-1 text-sm text-gray-600">Note (optional)</p>
            <Input.TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Added to every return, e.g. a payment reference"
              maxLength={500}
              rows={2}
              disabled={isPaying}
            />
          </div>

          <Alert
            type="warning"
            showIcon
            message="Each investor's wallet is credited right away. Paid returns cannot be changed back."
          />
        </div>
      </Modal>
    </>
  );
};

export default BulkPayButton;
