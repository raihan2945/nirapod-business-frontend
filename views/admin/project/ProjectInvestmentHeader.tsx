"use client";

import React, { useState } from "react";
import { Select, Input, Button, Modal, Radio, RadioChangeEvent } from "antd";
// import BlogForm from "./form/BlogForm";
import useCheckAccess from "@/utils/checkAccess";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { useClearInvestmentsByStatusMutation } from "@/state/features/projects/projectInvestmentApi";

const { Search } = Input;

//Icons
import { MdAdd } from "react-icons/md";
import { LiaFileExportSolid } from "react-icons/lia";
import { Trash2, Archive } from "lucide-react";

interface ComponentProps {
  changeQuery?: any;
  query?: any;
  clickExport?: any;
}

const ProjectInvestmentHeader: React.FC<ComponentProps> = ({
  query,
  changeQuery,
  clickExport,
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [confirmClear, setConfirmClear] = useState<
    "REJECTED" | "CANCELLED" | null
  >(null);
  const { hasAccess } = useCheckAccess();

  const { handleResponse } = useAPIResponseHandler();
  const [clearByStatus, { isLoading: isClearing }] =
    useClearInvestmentsByStatusMutation();

  const submitClear = async () => {
    if (!confirmClear) return;
    const res = await clearByStatus({ status: confirmClear });
    const handled = handleResponse(res);
    if (handled?.code === 200) setConfirmClear(null);
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-6">Project Investments</h1>

      <div className="flex justify-between items-center">
        <div className="my-2 flex items-end gap-3">
          {/* hard delete - solid red to signal it is permanent */}
          <Button
            danger
            type="primary"
            icon={<Trash2 size={16} />}
            onClick={() => setConfirmClear("REJECTED")}
          >
            Delete Rejected
          </Button>
          {/* soft archive - muted amber outline, clearly less destructive */}
          <Button
            icon={<Archive size={16} />}
            onClick={() => setConfirmClear("CANCELLED")}
            style={{ borderColor: "#d97706", color: "#b45309" }}
          >
            Archive Cancelled
          </Button>
        </div>
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
            <p className="text-sm mb-1 opacity-70">Status </p>
            <Radio.Group
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "PENDING" },
                { value: "APPROVED", label: "APPROVED" },
                { value: "REJECTED", label: "REJECTED" },
                { value: "CANCELLED", label: "CANCELLED" },
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

      {/* clear confirmation - behaviour differs by status */}
      <Modal
        centered
        title={
          confirmClear === "REJECTED"
            ? "Permanently delete all rejected investments?"
            : "Archive all cancelled investments?"
        }
        open={!!confirmClear}
        onCancel={() => setConfirmClear(null)}
        onOk={submitClear}
        okText={
          confirmClear === "REJECTED" ? "Delete permanently" : "Archive them"
        }
        okButtonProps={{ danger: confirmClear === "REJECTED", loading: isClearing }}
        cancelText="Keep them"
        destroyOnHidden={true}
        width={480}
      >
        {confirmClear === "REJECTED" ? (
          <>
            <p className="text-sm text-gray-700">
              This <strong className="text-red-600">permanently deletes</strong>{" "}
              every rejected investment and its returns from the database.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li className="text-red-600">This cannot be undone.</li>
              <li>Wallet transactions are preserved (kept in the ledger).</li>
            </ul>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700">
              This archives every cancelled investment and its returns, hiding
              them everywhere.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Nothing is deleted — records are only hidden.</li>
              <li>Wallet transactions are kept in full.</li>
            </ul>
          </>
        )}
      </Modal>

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

export default ProjectInvestmentHeader;
