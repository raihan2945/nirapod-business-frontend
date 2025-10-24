import { LoginForm } from "@/components/forms/login-form";

const FinanceLogin = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm title="Login as Finance"/>
      </div>
    </div>
  );
};

export default FinanceLogin;
