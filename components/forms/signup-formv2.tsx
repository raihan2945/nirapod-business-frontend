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
import { compressImage } from "@/utils/compressImage";

//BD mobile numbers: 01[3-9] followed by 8 digits
const bdMobile = /^01[3-9]\d{8}$/;
//NID is 10, 13 or 17 digits depending on when it was issued
const nidNumber = /^(\d{10}|\d{13}|\d{17})$/;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//matches the backend multer limit and nginx client_max_body_size
const MAX_PHOTO_MB = 5;
const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

const required = (label: string) => `${label} is required`;

//errors that never reached the API (nginx 413, network drop, CORS) come back
//without a JSON body, so there is no `data.message` to show
const signupErrorMessage = (error: any): string => {
  if (error?.data?.message) return error.data.message;
  if (error?.status === 413 || error?.originalStatus === 413)
    return `Profile photo is too large. Please choose an image under ${MAX_PHOTO_MB}MB.`;
  if (error?.status === "FETCH_ERROR")
    return "Could not reach the server. If you attached a large photo, try a smaller one; otherwise check your connection and try again.";
  return "Signup failed. Please try again.";
};

const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, required("Full name"))
      .min(3, "Full name must be at least 3 characters"),
    email: z
      .string()
      .trim()
      .min(1, required("Email"))
      .email("Enter a valid email address"),
    mobile: z
      .string()
      .trim()
      .min(1, required("Mobile"))
      .regex(bdMobile, "Enter a valid 11-digit number, e.g. 01712345678"),
    fatherName: z.string().trim().min(1, required("Father's name")),
    motherName: z.string().trim().min(1, required("Mother's name")),
    nid: z
      .string()
      .trim()
      .min(1, required("NID"))
      .regex(nidNumber, "NID must be 10, 13 or 17 digits"),
    gender: z.string().trim().min(1, "Select a gender"),
    bloodGroup: z.string().trim().min(1, "Select a blood group"),
    currentProfession: z.string().trim().min(1, required("Current profession")),
    facebook: z
      .string()
      .trim()
      .min(1, required("Facebook link"))
      .url("Enter a full link, e.g. https://facebook.com/yourprofile"),
    address: z
      .string()
      .trim()
      .min(1, required("Address"))
      .min(10, "Enter a full address (at least 10 characters)"),
    //not a registered input - kept in sync from the upload widget so it takes
    //part in validation and shows up in the error summary like everything else
    photo: z
      .custom<File>((value) => value instanceof File, "Profile photo is required")
      .refine(
        (file) => !(file instanceof File) || file.size <= MAX_PHOTO_BYTES,
        `Photo must be ${MAX_PHOTO_MB}MB or smaller`,
      ),
    nomineeName: z.string().trim().min(1, required("Nominee name")),
    nomineeRelation: z.string().trim().min(1, required("Nominee relation")),
    nomineeMobile: z
      .string()
      .trim()
      .min(1, required("Nominee mobile"))
      .regex(bdMobile, "Enter a valid 11-digit number, e.g. 01712345678"),
    bankAccountName: z.string().trim().min(1, required("Account name")),
    bankAccountNo: z
      .string()
      .trim()
      .min(1, required("Account number"))
      .regex(/^\d{6,20}$/, "Account number must be 6-20 digits"),
    bankName: z.string().trim().min(1, required("Bank name")),
    branchName: z.string().trim().min(1, required("Branch name")),
    routingNo: z
      .string()
      .trim()
      .min(1, required("Routing no."))
      .regex(/^\d{9}$/, "Routing no. must be exactly 9 digits"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine((v) => v === true, "You must accept the terms to continue"),
  })
  .refine((data) => data.password === data?.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.mobile !== data.nomineeMobile, {
    message: "Nominee mobile must differ from your own",
    path: ["nomineeMobile"],
  });

type SignupFormData = z.infer<typeof signupSchema>;
type FieldName = keyof SignupFormData;

//fields that aren't plain text inputs - setFocus has no ref to move to
const UNFOCUSABLE: FieldName[] = ["photo"];

//readable names for the error summary
const FIELD_LABELS: Record<string, string> = {
  fullName: "Full Name",
  email: "Email",
  mobile: "Mobile",
  password: "Password",
  confirmPassword: "Confirm Password",
  nid: "NID",
  gender: "Gender",
  bloodGroup: "Blood Group",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  currentProfession: "Current Profession",
  facebook: "Facebook Link",
  address: "Address",
  photo: "Profile Photo",
  nomineeName: "Nominee Name",
  nomineeRelation: "Nominee Relation",
  nomineeMobile: "Nominee Mobile",
  bankAccountName: "Account Name",
  bankAccountNo: "Account Number",
  bankName: "Bank Name",
  branchName: "Branch Name",
  routingNo: "Routing No.",
  terms: "Terms & Conditions",
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
    setValue,
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

  //the upload widget lives outside react-hook-form - mirror its value in so
  //the required-photo rule runs with the rest of the schema
  const handlePhotoChange = (file: any) => {
    setPhotoFile(file);
    //validate straight away so an oversized photo is flagged on selection
    setValue("photo", file, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: SignupFormData) => {
    setApiError(null);
    try {
      //multipart, so the profile photo travels with the rest of the fields
      const form = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        //client-only fields the API doesn't know about
        if (key === "confirmPassword" || key === "terms" || key === "photo")
          return;
        if (value === undefined || value === null || value === "") return;
        form.append(key, String(value));
      });

      if (data.photo instanceof File) {
        const photo = await compressImage(data.photo);
        form.append("photo", photo, photo.name);
      }

      const res = await UserSignup(form).unwrap();
      handleResponse(res);
      router.push("/user/profile");
    } catch (error: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Signup failed:", error);
      }
      setApiError(signupErrorMessage(error));
    }
  };

  //bring the first invalid field into view when submit is blocked
  const focusField = (name: FieldName) => {
    if (UNFOCUSABLE.includes(name)) {
      document
        .getElementById(name)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setFocus(name as any);
  };

  const onInvalid = (formErrors: Record<string, unknown>) => {
    const first = (Object.keys(formErrors) as FieldName[])[0];
    if (first) focusField(first);
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
            Create your account by filling in the details below. Every field is
            required — we need the full profile to verify your account and pay
            out your returns.
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
                        onClick={() => focusField(name)}
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
                  <Label htmlFor="nid" required>
                    NID
                  </Label>
                  <input
                    inputMode="numeric"
                    placeholder="10, 13 or 17 digits"
                    {...fieldProps("nid")}
                    {...register("nid")}
                  />
                  <Err name="nid" />
                </div>

                <div>
                  <Label htmlFor="gender" required>
                    Gender
                  </Label>
                  <select {...fieldProps("gender")} {...register("gender")}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <Err name="gender" />
                </div>

                <div>
                  <Label htmlFor="bloodGroup" required>
                    Blood Group
                  </Label>
                  <select
                    {...fieldProps("bloodGroup")}
                    {...register("bloodGroup")}
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  <Err name="bloodGroup" />
                </div>

                <div>
                  <Label htmlFor="fatherName" required>
                    Father&apos;s Name
                  </Label>
                  <input
                    placeholder="Enter father's name"
                    {...fieldProps("fatherName")}
                    {...register("fatherName")}
                  />
                  <Err name="fatherName" />
                </div>

                <div>
                  <Label htmlFor="motherName" required>
                    Mother&apos;s Name
                  </Label>
                  <input
                    placeholder="Enter mother's name"
                    {...fieldProps("motherName")}
                    {...register("motherName")}
                  />
                  <Err name="motherName" />
                </div>

                <div>
                  <Label htmlFor="currentProfession" required>
                    Current Profession
                  </Label>
                  <input
                    placeholder="Enter your profession"
                    {...fieldProps("currentProfession")}
                    {...register("currentProfession")}
                  />
                  <Err name="currentProfession" />
                </div>

                <div>
                  <Label htmlFor="facebook" required>
                    Facebook Link
                  </Label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourprofile"
                    {...fieldProps("facebook")}
                    {...register("facebook")}
                  />
                  <Err name="facebook" />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="address" required>
                    Address
                  </Label>
                  <textarea
                    rows={3}
                    autoComplete="street-address"
                    placeholder="House, road, area, city"
                    {...fieldProps("address")}
                    {...register("address")}
                  />
                  <Err name="address" />
                </div>

                <div className="sm:col-span-2" id="photo">
                  <p className="mb-1.5 block text-sm font-medium text-gray-700">
                    Profile Photo
                    <span className="ml-0.5 text-red-500">*</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or WEBP, up to {MAX_PHOTO_MB}MB
                  </p>
                  <SingleFileUpload
                    image={photoFile}
                    setImage={handlePhotoChange}
                    label=" "
                  />
                  <Err name="photo" />
                </div>
              </Section>

              {/* ---------- Nominee ---------- */}
              <Section
                title="Nominee"
                description="Who receives your holdings in your absence"
              >
                <div>
                  <Label htmlFor="nomineeName" required>
                    Nominee Name
                  </Label>
                  <input
                    placeholder="Enter nominee name"
                    {...fieldProps("nomineeName")}
                    {...register("nomineeName")}
                  />
                  <Err name="nomineeName" />
                </div>

                <div>
                  <Label htmlFor="nomineeRelation" required>
                    Nominee Relation
                  </Label>
                  <input
                    placeholder="e.g. Spouse, Son, Daughter"
                    {...fieldProps("nomineeRelation")}
                    {...register("nomineeRelation")}
                  />
                  <Err name="nomineeRelation" />
                </div>

                <div>
                  <Label htmlFor="nomineeMobile" required>
                    Nominee Mobile
                  </Label>
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
                  <Label htmlFor="bankAccountName" required>
                    Account Name
                  </Label>
                  <input
                    placeholder="Enter bank account name"
                    {...fieldProps("bankAccountName")}
                    {...register("bankAccountName")}
                  />
                  <Err name="bankAccountName" />
                </div>

                <div>
                  <Label htmlFor="bankAccountNo" required>
                    Account Number
                  </Label>
                  <input
                    inputMode="numeric"
                    placeholder="Enter bank account number"
                    {...fieldProps("bankAccountNo")}
                    {...register("bankAccountNo")}
                  />
                  <Err name="bankAccountNo" />
                </div>

                {/* these two used to be registered to each other's field */}
                <div>
                  <Label htmlFor="bankName" required>
                    Bank Name
                  </Label>
                  <input
                    placeholder="Enter bank name"
                    {...fieldProps("bankName")}
                    {...register("bankName")}
                  />
                  <Err name="bankName" />
                </div>

                <div>
                  <Label htmlFor="branchName" required>
                    Branch Name
                  </Label>
                  <input
                    placeholder="Enter branch name"
                    {...fieldProps("branchName")}
                    {...register("branchName")}
                  />
                  <Err name="branchName" />
                </div>

                <div>
                  <Label htmlFor="routingNo" required>
                    Routing No.
                  </Label>
                  <input
                    inputMode="numeric"
                    placeholder="9 digits"
                    {...fieldProps("routingNo")}
                    {...register("routingNo")}
                  />
                  <Err name="routingNo" />
                </div>
              </Section>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <label
                htmlFor="terms"
                className="flex cursor-pointer items-start gap-3 text-sm text-gray-700"
              >
                <input
                  id="terms"
                  type="checkbox"
                  aria-invalid={errors.terms ? "true" : "false"}
                  aria-describedby={errors.terms ? "terms-error" : undefined}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#31AD5C]"
                  {...register("terms")}
                />
                <span>
                  I confirm the information above is accurate and I accept the
                  terms &amp; conditions
                  <span className="ml-0.5 text-red-500">*</span>
                </span>
              </label>
              <Err name="terms" />
            </div>

            <div className="mt-6">
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
