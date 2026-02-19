import React from "react";
import UserForm from "./form/UserForm";
import { Tabs } from "antd";
import ProfileView from "./profileView";

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
  isAdmin?: boolean;
}

const UserView = ({ formType, info, modalCancel, isAdmin }: ComponentProps) => {
  return (
    <div>
      <Tabs
        type="card"
        items={[
          {
            label: `Info`,
            key: "1",
            children: <ProfileView user={info} />,
          },
          {
            label: `Edit`,
            key: "2",
            children: (
              <UserForm
                formType="edit"
                info={info}
                modalCancel={modalCancel}
                isAdmin={isAdmin}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default UserView;
