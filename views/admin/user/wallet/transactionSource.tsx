"use client";

import React from "react";
import { Tag } from "antd";
import { ArrowDownLeft, ArrowUpRight, Banknote, Wallet } from "lucide-react";

/**
 * A wallet transaction is investment-linked when it carries an investmentId.
 *   WITHDRAWAL + investment -> the wallet paid INTO an investment
 *   DEPOSIT    + investment -> an investment paid BACK to the wallet
 *                              (project closed, all returns paid, or cancelled)
 * Without an investmentId it is a plain top-up or cash-out.
 */
export const getTransactionSource = (record: any) => {
  //key off investmentId only - it is a plain column, always returned.
  //ProjectInvestment is an optional relation used just for the project name.
  const linked = !!record?.investmentId;
  const isDeposit = record?.type === "DEPOSIT";

  if (linked) {
    return isDeposit
      ? {
          key: "FROM_INVESTMENT",
          label: "From investment",
          color: "green",
          icon: <ArrowDownLeft className="w-3 h-3" />,
        }
      : {
          key: "TO_INVESTMENT",
          label: "To investment",
          color: "geekblue",
          icon: <ArrowUpRight className="w-3 h-3" />,
        };
  }

  return isDeposit
    ? {
        key: "TOP_UP",
        label: "Wallet top-up",
        color: "default",
        icon: <Wallet className="w-3 h-3" />,
      }
    : {
        key: "CASH_OUT",
        label: "Cash out",
        color: "default",
        icon: <Banknote className="w-3 h-3" />,
      };
};

export const SourceTag = ({ record }: { record: any }) => {
  const source = getTransactionSource(record);

  return (
    <Tag color={source.color} className="whitespace-nowrap">
      <span className="inline-flex items-center gap-1">
        {source.icon}
        {source.label}
      </span>
    </Tag>
  );
};

export default SourceTag;
