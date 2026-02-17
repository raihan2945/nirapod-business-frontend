import InvestorInvestments from "@/views/investor/InvestorInvestments";
import React from "react";

const InvestmentInfo = ({ userId }: { userId: string }) => {
  return (
    <div>
      <InvestorInvestments userId={userId!} isAdmin={true}/>
    </div>
  );
};

export default InvestmentInfo;
