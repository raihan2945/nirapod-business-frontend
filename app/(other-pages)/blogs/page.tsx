"use client";

import { useGetAllBlogsQuery } from "@/state/features/blogs/blogsApi";
import { generateQueryArray } from "@/utils/query";
import BlogCard from "@/views/blogs/BlogCard";
import { useState } from "react";

const blogs = [
  {
    id: 1,
    image: "/images/blogs/blog1.jpg",
    title: "The Benefits of Socially Responsible Investing",
    description: "Mechanical Engineer (powerplant)",
  },
  {
    id: 2,
    image: "/images/blogs/blog2.jpg",
    title: "Adnan Shahariar",
    description: "Mechanical Engineer (powerplant)",
  },
  {
    id: 3,
    image: "/images/blogs/blog3.jpg",
    title: "Adnan Shahariar",
    description: "Mechanical Engineer (powerplant)",
  },
];

export default function ProjectsPage() {

   const [query, setQuery] = useState({
      status: "PUBLISHED",
    });

  const {data: blogsData} =useGetAllBlogsQuery(generateQueryArray(query));

  console.log("Blogs Data on Blogs Page:", blogsData);

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
              Explore our diverse portfolio of Halal investment opportunities
              across real estate, technology, and infrastructure sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      {/* <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Filter by:</span>
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-medium hover:bg-cyan-600 transition-colors">
                  All Projects
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Active
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Completed
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Upcoming
                </button>
              </div>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{projects.length}</span> Projects Found
            </div>
          </div>
        </div>
      </section> */}

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
             {blogsData?.data?.map((item:any) => (
              <BlogCard key={item.id} data={item} />
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}
