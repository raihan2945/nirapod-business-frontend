"use client";

import React, { useState } from "react";
import { Select, Input, Button, Modal, Radio, RadioChangeEvent } from "antd";
// import BlogForm from "./form/BlogForm";
import useCheckAccess from "@/utils/checkAccess";

const { Search } = Input;

//Icons
import { MdAdd } from "react-icons/md";
import { LiaFileExportSolid } from "react-icons/lia";

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
  const { hasAccess } = useCheckAccess();

  return (
    <>
      <h1 className="text-xl font-bold mb-6">Project Investments</h1>

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
            <p className="text-sm mb-1 opacity-70">Status </p>
            <Radio.Group
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "PENDING" },
                { value: "APPROVED", label: "APPROVED" },
                { value: "REJECTED", label: "REJECTED" },
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

export default ProjectInvestmentHeader;
