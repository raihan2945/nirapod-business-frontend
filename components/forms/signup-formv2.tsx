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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { useUserSignUpMutation } from "@/state/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import SingleFileUpload from "../upload/singleFileUpload";

const signupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    mobile: z.string().min(10, "Invalid phone number"),
    email: z.email(),
    fatherName: z.string().optional().nullable(),
    motherName: z.string().optional().nullable(),
    nid: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    currentProfession: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    nomineeName: z.string().optional().nullable(),
    nomineeRelation: z.string().optional().nullable(),
    nomineeMobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    bankAccountNo: z.string().optional().nullable(),
    bankAccountName: z.string().optional().nullable(),
    bankName: z.string().optional().nullable(),
    branchName: z.string().optional().nullable(),
    routingNo: z.string().optional().nullable(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data?.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;
type FieldName = keyof SignupFormData;

//readable names for the error summary
const FIELD_LABELS: Record<string, string> = {
  fullName: "Full Name",
  email: "Email",
  mobile: "Mobile",
  password: "Password",
  confirmPassword: "Confirm Password",
  nid: "NID",
  gender: "Gender",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  currentProfession: "Current Profession",
  facebook: "Facebook Link",
  address: "Address",
  nomineeName: "Nominee Name",
  nomineeRelation: "Nominee Relation",
  nomineeMobile: "Nominee Mobile",
  bankAccountName: "Account Name",
  bankAccountNo: "Account Number",
  bankName: "Bank Name",
  branchName: "Branch Name",
  routingNo: "Routing No.",
};

const inputBase =
  "w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-transparent focus:ring-2";
const inputOk = "border-gray-300 focus:ring-[#31AD5C]";
const inputBad = "border-red-400 bg-red-50/40 focus:ring-red-400";

export function SignupFormV2({
  className,
  title = "Sign Up",
  ...props
}: React.ComponentProps<"div"> & { title?: string }) {
  const { handleResponse } = useAPIResponseHandler();
  const [UserSignup] = useUserSignUpMutation();
  const router = useRouter();

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema) as any,
    //validate as soon as a field is touched, and re-validate on every change
    //once it has failed, so errors clear the moment they are fixed
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const errorList = Object.keys(errors) as FieldName[];
  const showSummary = isSubmitted && errorList.length > 0;

  const onSubmit = async (data: SignupFormData) => {
    setApiError(null);
    try {
      //multipart, so the profile photo travels with the rest of the fields
      const form = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "confirmPassword") return;
        if (value === undefined || value === null || value === "") return;
        form.append(key, String(value));
      });

      if (photoFile instanceof File) {
        form.append("photo", photoFile);
      }

      const res = await UserSignup(form).unwrap();
      handleResponse(res);
      router.push("/user/profile");
    } catch (error: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Signup failed:", error);
      }
      setApiError(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  //bring the first invalid field into view when submit is blocked
  const onInvalid = () => {
    const first = (Object.keys(errors) as FieldName[])[0];
    if (first) setFocus(first as any);
  };

  const Label = ({
    htmlFor,
    children,
    required,
  }: {
    htmlFor: FieldName;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-gray-700"
    >
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );

  const Err = ({ name }: { name: FieldName }) =>
    errors[name] ? (
      <p
        id={`${name}-error`}
        role="alert"
        className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600"
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        {errors[name]?.message as string}
      </p>
    ) : null;

  //shared props that wire up the invalid state + a11y for any field
  const fieldProps = (name: FieldName) => ({
    id: name,
    "aria-invalid": errors[name] ? ("true" as const) : ("false" as const),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: cn(inputBase, errors[name] ? inputBad : inputOk),
  });

  const Section = ({
    title: sectionTitle,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <section className="border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-base font-semibold text-gray-900">{sectionTitle}</h3>
      <p className="mb-5 mt-0.5 text-sm text-gray-500">{description}</p>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Create your account by filling in the details below. Fields marked{" "}
            <span className="text-red-500">*</span> are required.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
            {apiError && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            {/* summary of everything that failed validation */}
            {showSummary && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  Please fix {errorList.length}{" "}
                  {errorList.length === 1 ? "field" : "fields"} before
                  submitting
                </p>
                <ul className="mt-2 space-y-1 pl-6">
                  {errorList.map((name) => (
                    <li key={name} className="text-sm text-red-600">
                      <button
                        type="button"
                        onClick={() => setFocus(name as any)}
                        className="underline underline-offset-2 hover:no-underline"
                      >
                        {FIELD_LABELS[name] || name}
                      </button>
                      {": "}
                      {errors[name]?.message as string}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {/* ---------- Account ---------- */}
              <Section
                title="Account"
                description="How you sign in and how we reach you"
              >
                <div className="sm:col-span-2">
                  <Label htmlFor="fullName" required>
                    Full Name
                  </Label>
                  <input
                    autoComplete="name"
                    placeholder="Enter full name"
                    {...fieldProps("fullName")}
                    {...register("fullName")}
                  />
                  <Err name="fullName" />
                </div>

                <div>
                  <Label htmlFor="email" required>
                    Email
                  </Label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...fieldProps("email")}
                    {...register("email")}
                  />
                  <Err name="email" />
                </div>

                <div>
                  <Label htmlFor="mobile" required>
                    Mobile
                  </Label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    {...fieldProps("mobile")}
                    {...register("mobile")}
                  />
                  <Err name="mobile" />
                </div>

                <div>
                  <Label htmlFor="password" required>
                    Password
                  </Label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      maxLength={128}
                      placeholder="At least 6 characters"
                      {...fieldProps("password")}
                      className={cn(fieldProps("password").className, "pr-11")}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Err name="password" />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" required>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      maxLength={128}
                      placeholder="Re-enter password"
                      {...fieldProps("confirmPassword")}
                      className={cn(
                        fieldProps("confirmPassword").className,
                        "pr-11",
                      )}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Err name="confirmPassword" />
                </div>
              </Section>

              {/* ---------- Personal ---------- */}
              <Section title="Personal" description="A few details about you">
                <div>
                  <Label htmlFor="nid">NID</Label>
                  <input
                    placeholder="Enter NID number"
                    {...fieldProps("nid")}
                    {...register("nid")}
                  />
                  <Err name="nid" />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select {...fieldProps("gender")} {...register("gender")}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <Err name="gender" />
                </div>

                <div>
                  <Label htmlFor="fatherName">Father&apos;s Name</Label>
                  <input
                    placeholder="Enter father's name"
                    {...fieldProps("fatherName")}
                    {...register("fatherName")}
                  />
                  <Err name="fatherName" />
                </div>

                <div>
                  <Label htmlFor="motherName">Mother&apos;s Name</Label>
                  <input
                    placeholder="Enter mother's name"
                    {...fieldProps("motherName")}
                    {...register("motherName")}
                  />
                  <Err name="motherName" />
                </div>

                <div>
                  <Label htmlFor="currentProfession">Current Profession</Label>
                  <input
                    placeholder="Enter your profession"
                    {...fieldProps("currentProfession")}
                    {...register("currentProfession")}
                  />
                  <Err name="currentProfession" />
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook Link</Label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourprofile"
                    {...fieldProps("facebook")}
                    {...register("facebook")}
                  />
                  <Err name="facebook" />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <textarea
                    rows={3}
                    autoComplete="street-address"
                    placeholder="Enter address"
                    {...fieldProps("address")}
                    {...register("address")}
                  />
                  <Err name="address" />
                </div>

                <div className="sm:col-span-2">
                  <p className="mb-1.5 block text-sm font-medium text-gray-700">
                    Profile Photo
                  </p>
                  <SingleFileUpload
                    image={photoFile}
                    setImage={setPhotoFile}
                    label=" "
                  />
                </div>
              </Section>

              {/* ---------- Nominee ---------- */}
              <Section
                title="Nominee"
                description="Who receives your holdings in your absence"
              >
                <div>
                  <Label htmlFor="nomineeName">Nominee Name</Label>
                  <input
                    placeholder="Enter nominee name"
                    {...fieldProps("nomineeName")}
                    {...register("nomineeName")}
                  />
                  <Err name="nomineeName" />
                </div>

                <div>
                  <Label htmlFor="nomineeRelation">Nominee Relation</Label>
                  <input
                    placeholder="e.g. Spouse, Son, Daughter"
                    {...fieldProps("nomineeRelation")}
                    {...register("nomineeRelation")}
                  />
                  <Err name="nomineeRelation" />
                </div>

                <div>
                  <Label htmlFor="nomineeMobile">Nominee Mobile</Label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    {...fieldProps("nomineeMobile")}
                    {...register("nomineeMobile")}
                  />
                  <Err name="nomineeMobile" />
                </div>
              </Section>

              {/* ---------- Bank ---------- */}
              <Section
                title="Bank Details"
                description="Where your returns are paid out"
              >
                <div>
                  <Label htmlFor="bankAccountName">Account Name</Label>
                  <input
                    placeholder="Enter bank account name"
                    {...fieldProps("bankAccountName")}
                    {...register("bankAccountName")}
                  />
                  <Err name="bankAccountName" />
                </div>

                <div>
                  <Label htmlFor="bankAccountNo">Account Number</Label>
                  <input
                    placeholder="Enter bank account number"
                    {...fieldProps("bankAccountNo")}
                    {...register("bankAccountNo")}
                  />
                  <Err name="bankAccountNo" />
                </div>

                {/* these two used to be registered to each other's field */}
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <input
                    placeholder="Enter bank name"
                    {...fieldProps("bankName")}
                    {...register("bankName")}
                  />
                  <Err name="bankName" />
                </div>

                <div>
                  <Label htmlFor="branchName">Branch Name</Label>
                  <input
                    placeholder="Enter branch name"
                    {...fieldProps("branchName")}
                    {...register("branchName")}
                  />
                  <Err name="branchName" />
                </div>

                <div>
                  <Label htmlFor="routingNo">Routing No.</Label>
                  <input
                    placeholder="Enter routing no."
                    {...fieldProps("routingNo")}
                    {...register("routingNo")}
                  />
                  <Err name="routingNo" />
                </div>
              </Section>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login/login-user" className="underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
