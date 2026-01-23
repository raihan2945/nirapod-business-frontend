"use client";

import React, { useState } from "react";
import { Select, Input, Button, Modal, Radio } from "antd";
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

const InvestmentHeader: React.FC<ComponentProps> = ({
  query,
  changeQuery,
  clickExport,
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const { hasAccess } = useCheckAccess();

  return (
    <>
      <div className="flex justify-between items-center">
        <div></div>
        <div className="my-2 flex gap-4 justify-end">
          <div>
            <p className="text-sm mb-1 opacity-70">Bike Type </p>
            <Select
              // value={query["bike_type"]}
              style={{ width: 120 }}
              // onChange={(e) => changeQuery({ key: "bike_type" })}
              placeholder="Bike Type"
              options={[
                { value: "all", label: "All" },
                { value: "individual", label: "Individual" },
                { value: "Special", label: "Special" },
              ]}
            />
          </div>
        </div>
        <div className="my-2 flex gap-4 justify-end">
          <div>
            <p className="text-sm mb-1 opacity-70">Bike Type </p>

            <Radio.Group
              options={[
                { value: "all", label: "All" },
                { value: "APPROVED", label: "APPROVED" },
                { value: "REJECTED", label: "REJECTED" },
              ]}
              onChange={(e) => changeQuery({ key: "search", value: e.target.value })}
              value={query["status"]}
              optionType="button"
              buttonStyle="solid"
            />
            
          </div>
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
        {/* <AddBike modalCancel={() => setIsAdd(false)} /> */}
      </Modal>
    </>
  );
};

export default InvestmentHeader;
