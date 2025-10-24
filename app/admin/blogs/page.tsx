'use client';
import React from "react";
import BlogView from "@/views/admin/blog/BlogView";
import BlogHeader from "@/views/admin/blog/HeaderSection";

const Blogs = () => {
  return (
    <div>
      <BlogHeader />
      <BlogView />
    </div>
  );
};

export default Blogs;
