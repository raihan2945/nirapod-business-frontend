"use client";

import { useGetAllBlogsQuery } from "@/state/features/blogs/blogsApi";
import { generateQueryArray } from "@/utils/query";
import BlogCard from "@/views/blogs/BlogCard";
import { useState } from "react";

// Define the exact shape of your blog item (adjust fields as needed)
type Blog = {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  // add any other fields your BlogCard expects
};

export default function BlogsPage() {
  // Remove setQuery since you're not using it anywhere
  const [query] = useState({
    status: "PUBLISHED",
  });

  const { data: blogsData } = useGetAllBlogsQuery(generateQueryArray(query));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Blogs
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our diverse portfolio of Nirapod Business opportunities
              across Condominium Project, Land Sharing, Travel and
              infrastructure sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {blogsData?.data?.map((item: Blog) => (
              <BlogCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
