"use client";

import React, { useState } from "react";
import { Select, Input, Button, Modal, Radio, RadioChangeEvent } from "antd";
// import BlogForm from "./form/ProjectForm";
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

const WithdrawHeader: React.FC<ComponentProps> = ({
  query,
  changeQuery,
  clickExport,
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const { hasAccess } = useCheckAccess();

  return (
    <>
      <h1 className="text-xl font-bold mb-6">Projects</h1>

      <div className="flex justify-between items-center">
        <div className="my-2 flex gap-4">
          <div>
            <p className="text-sm mb-1 opacity-70">Status </p>
            <Select
              className="w-100"
              value={query["status"]}
              style={{ width: 120 }}
              onChange={(value) => {
                changeQuery({ key: "status", value: value });
              }}
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
          </div>
          <div>
            <p className="text-sm mb-1 opacity-70">Type </p>
            <Radio.Group
              options={[
                { value: "All", label: "All" },
                { value: "WITHDRAWAL", label: "Withdrawal" },
                { value: "DEPOSIT", label: "Deposit" },
                // { value: "CANCELLED", label: "REJECTED" },
              ]}
              onChange={({ target: { value } }: RadioChangeEvent) =>
                changeQuery({ key: "type", value: value })
              }
              value={query["type"]}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
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

      <Modal
        centered
        open={isAdd}
        onCancel={() => setIsAdd(false)}
        footer={null}
        destroyOnHidden={true}
        className="responsive-modal"
        width={"50%"}
      >
        {/* ADD BIKE FORM  */}
        {/* <BlogForm formType="create" modalCancel={() => setIsAdd(false)} /> */}
      </Modal>
    </>
  );
};

export default WithdrawHeader;
