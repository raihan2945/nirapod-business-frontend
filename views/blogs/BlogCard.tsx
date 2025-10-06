import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const BlogCard = (props: any) => {
  const { index, data } = props;

  return (
    <div
      style={{ height: "20rem" }}
      className="box-border overflow-hidden relative rounded-md "
    >
      <img
        src={data?.image}
        alt="Team holding frames"
        className="w-full h-full object-cover absolute z-0"
        style={{ zIndex: "-50" }}
      />

      <div className="w-full h-full p-8 flex flex-col justify-end items-start">
        <div>
          <p className="font-bold text-md text-white text-3xl">{data?.title}</p>
          <p className="text-white">{data?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
