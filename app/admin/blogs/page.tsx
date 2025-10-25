"use client";
import React, { useState } from "react";
import BlogView from "@/views/admin/blog/BlogView";
import BlogHeader from "@/views/admin/blog/HeaderSection";
import { useGetAllBlogsQuery } from "@/state/features/blogs/blogsApi";
import { generateQueryArray } from "@/utils/query";

const Blogs = () => {
  const [query, setQuery] = useState({
    search: null,
    status: null,
  });

  const { data, isLoading } = useGetAllBlogsQuery(generateQueryArray(query));

  const changeQuery = ({ key, value }: { key: string; value: any }) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <BlogHeader changeQuery={changeQuery} query={query} />
      <BlogView data={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Blogs;
