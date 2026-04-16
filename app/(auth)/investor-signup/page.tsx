import { SignupFormV2 } from "@/components/forms/signup-formv2";

const InvestorSignup = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-[90dvw] lg:w-[40dvw]">
        <SignupFormV2 role="investor" title="SignUp as Investor"/>
      </div>
    </div>
  );
};

export default InvestorSignup;
