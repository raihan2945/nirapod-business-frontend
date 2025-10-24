import { LoginForm } from "@/components/forms/login-form";

const InvestorLogin = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm role="investor" title="Login as Investor"/>
      </div>
    </div>
  );
};

export default InvestorLogin;
