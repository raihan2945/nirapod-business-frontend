"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { useUserSignUpMutation } from "@/state/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SingleFileUpload from "../upload/singleFileUpload";

// Define the validation schema with Zod
const signupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    mobile: z.string().min(10, "Invalid phone number"),
    email: z.union([z.literal(""), z.string().email()]),
    fatherName: z.string().optional().nullable(),
    motherName: z.string().optional().nullable(),
    nid: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    currentProfession: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    nomineeName: z.string().optional().nullable(),
    nomineeRelation: z.string().optional().nullable(),
    nomineeMobile: z.string().optional().nullable(),
    photo: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    bankAccountNo: z.string().optional().nullable(),
    bankAccountName: z.string().optional().nullable(),
    bankName: z.string().optional().nullable(),
    branchName: z.string().optional().nullable(),
    routingNo: z.string().optional().nullable(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    role: z.enum(["user", "investor", "admin"]).default("user"),
    permissions: z.array(z.string()).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    verifyStatus: z.enum(["PENDING", "APPROVED", "CANCELLED"]).optional(),
  })
  .refine((data) => data.password === data?.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the type from the schema
type SignupFormData = z.infer<typeof signupSchema>;

export function SignupFormV2({
  className,
  title = "Sign Up",
  ...props
}: React.ComponentProps<"div"> & { title?: string }) {
  const { handleResponse } = useAPIResponseHandler();
  const [UserSignup] = useUserSignUpMutation(); // Hypothetical mutation hook
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      role: "user",
      permissions: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: SignupFormData) => {
    setApiError(null);
    try {
      const form = new FormData();

      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof SignupFormData;
        if (data[typedKey]) {
          form.append(key, data[typedKey] as string | Blob);
        }
      });

      if (photoPreview) {
        form.append("photo", photoPreview);
      }

      const res = await UserSignup({ ...data }).unwrap();
      handleResponse(res);
      router.push("/user/profile"); // Redirect to login page after successful signup
    } catch (error: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Signup failed:", error);
      }
      setApiError(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Create your account by filling in the details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {apiError && (
              <div className="text-red-500 text-sm mb-4">{apiError}</div>
            )}
            {/* 🧾 Full Name */}
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                {...register("fullName")}
                className="w-full border rounded p-2"
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* 📱 Mobile */}
            <div>
              <label className="block mb-1 font-medium">Mobile </label>
              <input
                {...register("mobile")}
                className="w-full border rounded p-2"
                placeholder="Enter mobile number (e.g., +1234567890)"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            {/* 📧 Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                {...register("email")}
                className="w-full border rounded p-2"
                placeholder="Enter email (optional)"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NID
              </label>
              <div className="flex items-center">
                <input
                  {...register("nid")}
                  type="text"
                  placeholder="Enter NID number"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.nid && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nid.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="flex items-center">
                <select
                  className="w-full border rounded-lg p-2"
                  defaultValue="Bank"
                  {...register("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Profession
              </label>
              <div className="flex items-center">
                <input
                  {...register("currentProfession")}
                  type="text"
                  placeholder="Enter your profession"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.currentProfession && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentProfession.message}
                </p>
              )}
            </div>

            {/* 🏠 Address */}
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <textarea
                {...register("address")}
                className="w-full border rounded p-2"
                placeholder="Enter address (optional)"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Link
              </label>
              <div className="flex items-center">
                <input
                  {...register("facebook")}
                  type="text"
                  placeholder="Https://facebook.com/yourprofile"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.facebook && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.facebook.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father Name
              </label>
              <div className="flex items-center">
                <input
                  {...register("fatherName")}
                  type="text"
                  placeholder="Enter father name"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.fatherName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fatherName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mother Name
              </label>
              <div className="flex items-center">
                <input
                  {...register("motherName")}
                  type="text"
                  placeholder="Enter mother name"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.motherName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.motherName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominee Name
              </label>
              <div className="flex items-center">
                <input
                  {...register("nomineeName")}
                  type="text"
                  placeholder="Enter nominee name"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.nomineeName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nomineeName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominee Relation
              </label>
              <div className="flex items-center">
                <input
                  {...register("nomineeRelation")}
                  type="text"
                  placeholder="Enter nominee relation"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.nomineeRelation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.nomineeRelation?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominee Mobile
              </label>
              <div className="flex items-center">
                <input
                  {...register("nomineeMobile")}
                  type="text"
                  placeholder="Enter nominee mobile"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.nomineeMobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.nomineeMobile?.message}
                </p>
              )}
            </div>

            <hr />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <div className="flex items-center">
                <input
                  {...register("bankAccountNo")}
                  type="text"
                  placeholder="Enter bank account number"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.bankAccountNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.bankAccountNo?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <div className="flex items-center">
                <input
                  {...register("bankAccountName")}
                  type="text"
                  placeholder="Enter bank account name"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.bankAccountName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.bankAccountName?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <div className="flex items-center">
                <input
                  {...register("branchName")}
                  type="text"
                  placeholder="Enter branch name"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.branchName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.branchName?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name
              </label>
              <div className="flex items-center">
                <input
                  {...register("bankName")}
                  type="text"
                  placeholder="Enter bank name"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.bankName?.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing No.
              </label>
              <div className="flex items-center">
                <input
                  {...register("routingNo")}
                  type="text"
                  placeholder="Enter routing no."
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {errors.routingNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.routingNo?.message}
                </p>
              )}
            </div>

            <FieldGroup>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    maxLength={128}
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <FieldDescription
                    id="password-error"
                    className="text-red-500"
                  >
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    maxLength={128}
                    {...register("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirmPassword-error"
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <FieldDescription
                    id="confirmPassword-error"
                    className="text-red-500"
                  >
                    {errors.confirmPassword.message}
                  </FieldDescription>
                )}
              </Field>

              <div className="">
                <label className="block mb-1 font-medium">Profile Photo</label>
                <SingleFileUpload
                  image={photoPreview}
                  setImage={setPhotoPreview}
                  label=" "
                  // existImage={userProfile?.photo}
                />
              </div>

              <Field>
                <Button
                  style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Signing up...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <Link href="/login/login-user">
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <span className="underline">Login</span>
                  </FieldDescription>
                </Link>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
