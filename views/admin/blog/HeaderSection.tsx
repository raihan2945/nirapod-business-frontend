"use client";

import React, { useState } from "react";
import { Select, Input, Button, Modal } from "antd";
import AddBike from "./form/AddBike";
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

const BikeHeadSection: React.FC<ComponentProps> = ({
  query,
  changeQuery,
  clickExport,
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const { hasAccess } = useCheckAccess();

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="my-2 flex gap-4">
          <div>
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
          </div>
          <div>
            <p className="text-sm mb-1 opacity-70">Allotment Status </p>
            <Select
              className="w-100"
              defaultValue="all"
              style={{ width: 120 }}
              //   onChange={handleChange}
              placeholder="Car Type"
              options={[
                { value: "all", label: "All" },
                { value: "available", label: "Available" },
                { value: "assigned", label: "Assigned" },
              ]}
            />
          </div>
          <div>
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
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasAccess(["bike_management"]) && (
            <div>
              <Button
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
                type="primary"
                onClick={() => {
                  setIsAdd(true);
                }}
              >
                <MdAdd size={20} /> Add New
              </Button>
            </div>
          )}

          <Button
            onClick={clickExport}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            Export
            <LiaFileExportSolid />
          </Button>
        </div>
      </div>

      <Modal
        title="Add a new bike"
        centered
        open={isAdd}
        onCancel={() => setIsAdd(false)}
        width={"60%"}
        footer={null}
        destroyOnClose={true}
      >
        {/* ADD BIKE FORM  */}
        <AddBike modalCancel={() => setIsAdd(false)} />
      </Modal>
    </>
  );
};

export default BikeHeadSection;
