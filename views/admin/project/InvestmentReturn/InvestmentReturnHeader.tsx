"use client";

import React, { useState } from "react";
import {
  Select,
  Input,
  Button,
  Modal,
  Radio,
  RadioChangeEvent,
  DatePicker,
  Segmented,
} from "antd";
import dayjs from "dayjs";
// import BlogForm from "./form/BlogForm";
import useCheckAccess from "@/utils/checkAccess";

const { Search } = Input;
const { RangePicker } = DatePicker;

//Icons
import { MdAdd } from "react-icons/md";
import { LiaFileExportSolid } from "react-icons/lia";

interface ComponentProps {
  changeQuery?: any;
  query?: any;
  clickExport?: any;
}

type DateMode = "7days" | "single" | "range" | "all";

const InvestmentReturnHeader: React.FC<ComponentProps> = ({
  query,
  changeQuery,
  clickExport,
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [dateMode, setDateMode] = useState<DateMode>("7days");
  const [fromDay, setFromDay] = useState<any>(null); //picked start date (single mode)
  const { hasAccess } = useCheckAccess();

  //clear every date param, then apply the ones the chosen mode needs
  const resetDateParams = () => {
    changeQuery({ key: "fromDate", value: null });
    changeQuery({ key: "toDate", value: null });
    changeQuery({ key: "allDates", value: null });
    changeQuery({ key: "days", value: null });
  };

  const onModeChange = (mode: DateMode) => {
    setDateMode(mode);
    setFromDay(null);
    resetDateParams();
    //  7days  -> no params, backend defaults to today..+7
    //  all    -> allDates flag removes the window
    //  single / range -> wait for the picker to supply dates
    if (mode === "all") changeQuery({ key: "allDates", value: true });
  };

  //picking one start date spans a 7-day window: [date, date + 7 days]
  const onSingleDate = (d: any) => {
    setFromDay(d || null);
    if (!d) {
      changeQuery({ key: "fromDate", value: null });
      changeQuery({ key: "toDate", value: null });
      return;
    }
    changeQuery({ key: "fromDate", value: d.format("YYYY-MM-DD") });
    changeQuery({ key: "toDate", value: d.add(7, "day").format("YYYY-MM-DD") });
  };

  const onRange = (range: any) => {
    changeQuery({ key: "fromDate", value: range?.[0]?.format("YYYY-MM-DD") || null });
    changeQuery({ key: "toDate", value: range?.[1]?.format("YYYY-MM-DD") || null });
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-6">Investment Returns</h1>

      <div className="flex justify-between items-center">
        <div className="my-2 flex gap-4">
          {/* <div>
            <p className="text-sm mb-1 opacity-70">Bike Type </p>
            <Select
              value={query["bike_type"]}
              style={{ width: 120 }}
              onChange={(e) => changeQuery({ key: "bike_type" })}
              placeholder="Bike Type"
              options={[
                { value: "all", label: "All" },
                { value: "individual", label: "Individual" },
                { value: "Special", label: "Special" },
              ]}
            />
          </div> */}
          {/* <div>
            <p className="text-sm mb-1 opacity-70">Search</p>
            <Search
              enterButton
              placeholder="Search"
              onChange={(e) =>
                changeQuery({ key: "search", value: e.target.value })
              }
              style={{
                width: 200,
              }}
            />
          </div> */}
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm mb-1 opacity-70">Due date </p>
            <div className="flex items-center gap-2">
              <Segmented
                value={dateMode}
                onChange={(v) => onModeChange(v as DateMode)}
                options={[
                  { label: "Next 7 days", value: "7days" },
                  { label: "From date +7", value: "single" },
                  { label: "Range", value: "range" },
                  { label: "All", value: "all" },
                ]}
              />
              {dateMode === "single" && (
                <div className="flex items-center gap-2">
                  <DatePicker
                    value={fromDay}
                    onChange={onSingleDate}
                    format="DD MMM YYYY"
                    placeholder="From date"
                  />
                  {fromDay && (
                    <span className="whitespace-nowrap text-sm text-gray-500">
                      → {fromDay.add(7, "day").format("DD MMM YYYY")}
                    </span>
                  )}
                </div>
              )}
              {dateMode === "range" && (
                <RangePicker
                  defaultValue={[dayjs(), dayjs().add(7, "day")]}
                  onChange={onRange}
                  format="DD MMM YYYY"
                />
              )}
            </div>
          </div>
          <div>
            <p className="text-sm mb-1 opacity-70">Status </p>
            <Radio.Group
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "PAID", label: "Paid" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
              onChange={({ target: { value } }: RadioChangeEvent) =>
                changeQuery({ key: "status", value: value })
              }
              value={query["status"]}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          {/* <Button
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
            type="primary"
            onClick={() => {
              setIsAdd(true);
            }}
          >
            <MdAdd size={20} /> Create New
          </Button> */}
        </div>
      </div>

      {/* <Modal
        centered
        open={isAdd}
        onCancel={() => setIsAdd(false)}
        footer={null}
        destroyOnHidden={true}
        className="responsive-modal"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <BlogForm formType="create" modalCancel={() => setIsAdd(false)} />
      </Modal> */}

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

export default InvestmentReturnHeader;
