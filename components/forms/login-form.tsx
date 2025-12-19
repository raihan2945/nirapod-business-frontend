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
import { email, z } from "zod";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { useUserLoginMutation } from "@/state/features/auth/authApi";
import { useRouter } from "next/navigation"; 
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";
import { useEffect } from "react";

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Infer the type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  title = "Login",
  role,
  ...props
}: React.ComponentProps<"div"> & { title?: string; role?: string }) {
  const { handleResponse } = useAPIResponseHandler();
  const [UserLogin] = useUserLoginMutation();

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const userId = useSelector((state: RootState) => state?.auth?.id);
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
  const userProfile = useSelector((state: RootState) => state?.user?.data);

useEffect(() => {
  if (isLoading) return;
  if (isError) {
    console.error("Failed to fetch user data");
    return;
  }
  if (userProfile) {
    if (userProfile.role === "admin") {
      router.push("/admin/projects");
    } else if (userProfile.role === "user") {
      router.push("/user/profile");
    }
  }
}, [isLoading, isError, userProfile, router]);

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    console.log("Form Data:", data);
    let res = await UserLogin({ ...data });
    console.log("Login Response:", res);
    handleResponse(res);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <FieldDescription className="text-red-500">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button
                  style={{ cursor: "pointer" }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                {role === "investor" && (
                  <Link href="/investor-signup">
                    <FieldDescription className="text-center mt-2">
                      Don&apos;t have an investor account? <a href="#"><strong>Sign up</strong></a>
                    </FieldDescription>
                  </Link>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
