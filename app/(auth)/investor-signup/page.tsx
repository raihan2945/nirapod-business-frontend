import { SignupFormV2 } from "@/components/forms/signup-formv2";

const InvestorSignup = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-10">
      {/* the form previously took a `role` prop that was silently discarded -
          signup creates a normal user, and an admin promotes them afterwards */}
      <div className="w-full max-w-3xl">
        <SignupFormV2 title="Sign Up as Investor" />
      </div>
    </div>
  );
};

export default InvestorSignup;
