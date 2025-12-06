import { Card, CardContent } from "@/components/ui/card";
import { baseUrl } from "@/utils/baseUrl";
import Link from "next/link";
import React from "react";

const BlogCard = (props: any) => {
  const { index, data } = props;

  console.log("Blog Card Data:", data);

  return (
    <Link href={`/blogs/${data?.id}`}>
      <div
        style={{ height: "20rem" }}
        className="box-border overflow-hidden relative rounded-md "
      >
        <img
          src={`${baseUrl}/uploads/photos/${data?.coverPhoto}`}
          alt="Team holding frames"
          className="w-full h-full object-cover absolute z-0"
          // style={{ zIndex: "-50" }}
        />

        <div className="relative w-full h-full p-8 flex flex-col justify-end items-start z-10">
          <div>
            <p className="font-bold text-md text-white text-3xl z-10">
              {data?.title}
            </p>
            <p className="text-white z-10">{data?.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
