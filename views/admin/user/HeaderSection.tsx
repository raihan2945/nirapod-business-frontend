"use client";

import React, { useState } from "react";
import { Select, Input, Button, Modal, Radio } from "antd";
import BlogForm from "./form/UserForm";
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

const UserHeader: React.FC<ComponentProps> = ({
  query,
  changeQuery,
  clickExport,
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const { hasAccess } = useCheckAccess();

  return (
    <>
      <h1 className="text-xl font-bold mb-6">Users</h1>

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
          <div>
            <p className="text-sm mb-1 opacity-70">Status </p>
            <Select
              className="w-100"
              defaultValue={""}
              style={{ width: 120 }}
              onChange={(value) => {
                changeQuery({ key: "verifyStatus", value: value });
              }}
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
            />
          </div>

          <div>
            <p className="text-sm mb-1 opacity-70">User Type</p>
            <Radio.Group
              block
              options={[
                { label: "All", value: null },
                { label: "Investors", value: "true" },
              ]}
              onChange={(e) => {
                console.log("Value is : ", e.target.value);
                changeQuery({ key: "isInvestor", value: e.target.value });
              }}
              value={query["isInvestor"]}
              optionType="button"
              buttonStyle="solid"
            />
          </div>

          <div>
            <p className="text-sm mb-1 opacity-70">Search</p>
            <Search
              enterButton
              placeholder="Search"
              value={query["search"]}
              onChange={(e) =>
                changeQuery({ key: "search", value: e.target.value })
              }
              style={{
                width: 200,
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
            type="primary"
            onClick={() => {
              setIsAdd(true);
            }}
          >
            <MdAdd size={20} /> Create New
          </Button>
        </div>
      </div>

      <Modal
        centered
        open={isAdd}
        onCancel={() => setIsAdd(false)}
        footer={null}
        destroyOnHidden={true}
        width={"50%"}
      >
        {/* ADD BIKE FORM  */}
        <BlogForm formType="create" modalCancel={() => setIsAdd(false)} />
      </Modal>
    </>
  );
};

export default UserHeader;
