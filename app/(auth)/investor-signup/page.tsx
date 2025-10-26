import { SignupForm } from "@/components/forms/signup-form";

const InvestorSignup = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm role="investor" title="SignUp as Investor"/>
      </div>
    </div>
  );
};

export default InvestorSignup;
