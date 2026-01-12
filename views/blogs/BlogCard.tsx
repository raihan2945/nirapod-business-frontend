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
        className="box-border overflow-hidden relative rounded-md"
      >
        <img
          src={`${baseUrl}/uploads/photos/${data?.coverPhoto}`}
          alt="Team holding frames"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />

        {/* Gradient overlay: dark at bottom, fading to transparent at top */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        <div className="relative w-full h-full p-8 flex flex-col justify-end items-start z-20">
          <div>
            <p className="font-bold text-md text-white text-3xl">
              {data?.title}
            </p>
            <p className="text-white">{data?.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

// <div
//   style={{ height: "20rem" }}
//   className="box-border overflow-hidden relative rounded-md "
// >
//   <img
//     src={`${baseUrl}/uploads/photos/${data?.coverPhoto}`}
//     alt="Team holding frames"
//     className="w-full h-full object-cover absolute z-0"
//     // style={{ zIndex: "-50" }}
//   />

//   <div className="relative w-full h-full p-8 flex flex-col justify-end items-start z-10">
//     <div>
//       <p className="font-bold text-md text-white text-3xl z-10">
//         {data?.title}
//       </p>
//       <p className="text-white z-10">{data?.description}</p>
//     </div>
//   </div>
// </div>
