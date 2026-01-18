"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BlogCard from "./BlogCard";
import { useGetAllBlogsQuery } from "@/state/features/blogs/blogsApi";
import { generateQueryArray } from "@/utils/query";



const feedbacks = [
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

export default function BlogSection() {

  const query = {
  search: null,
  status: null,
};

const { data: blogsData } = useGetAllBlogsQuery(generateQueryArray(query));

  return (
    <section className="py-8 sm:py-8 lg:py-16 bg-white-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h2 className="mb-6 text-3xl center sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Blogs
          </h2>
        </div>

        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full"
        >
          <CarouselContent>
            {blogsData?.data?.map((item:any, index:number) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <BlogCard index={index} data={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
