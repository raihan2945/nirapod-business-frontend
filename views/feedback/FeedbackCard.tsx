import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const FeedbackCard = (props: any) => {
  const { index, data } = props;

  return (
    <Card style={{ height:"100%"}}>
      <CardContent className="h-full flex flex-col items-start justify-between py-1 px-8">
        <p className="italic">{data?.text}</p>

        <div className="mt-4">
          <p className="font-bold text-md">{data?.name}</p>
          <p >{data?.designation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
