'use client';

import { SignupForm } from "@/components/forms/signup-form"
import { APIResponseHandlerProvider } from "@/contexts/ApiResponseHandlerContext";

export default function SignUp() {
  return (
    <APIResponseHandlerProvider>
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
    </APIResponseHandlerProvider>
  )
}
