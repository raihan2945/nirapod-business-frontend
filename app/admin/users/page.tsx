"use client";
import React, { useState } from "react";
import { generateQueryArray } from "@/utils/query";
import UserView from "@/views/admin/user/UserView";
import UserHeader from "@/views/admin/user/HeaderSection";
import { useGetAllUsersQuery } from "@/state/features/user/userApi";

const Users = () => {
  const [query, setQuery] = useState({
    search: null,
    status: null,
  });

  const { data, isLoading } = useGetAllUsersQuery(generateQueryArray(query));

  console.log("Users Data:", data);

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <UserHeader changeQuery={changeQuery} query={query} />
      <UserView data={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Users;
