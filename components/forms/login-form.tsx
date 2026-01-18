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
import {
  useSendOtpMutation,
  useUpdateForgotPasswordMutation,
  useUserLoginMutation,
  useVerifyOtpMutation,
} from "@/state/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";
import { useEffect, useState } from "react";
import { Flex, Input as AntdInput, message, Alert } from "antd";
import type { GetProps } from "antd";

type OTPProps = GetProps<typeof AntdInput.OTP>;

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
  const [SendOtp] = useSendOtpMutation();
  const [VerifyOtp] = useVerifyOtpMutation();
  const [UpdatePassword] = useUpdateForgotPasswordMutation();

  const [messageApi, contextHolder] = message.useMessage();

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

  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState<any>(null);
  const [otp, setOtp] = useState<any>(null);
  const [hash, setHash] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [newPassword, setNewPassword] = useState<any>(null);
  const [confirmPassword, setConfirmPassword] = useState<any>(null);

  const onChange: OTPProps["onChange"] = (text) => {
    setOtp(text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    if (screen == "login") {
      let res = await UserLogin({ ...data });
      handleResponse(res);
    }
  };

  const submitOTP = async () => {
    const res = await SendOtp({ data: { email } });
    handleResponse(res);

    if (res?.data?.statusCode == 200) {
      setHash(res?.data?.hash);
      setScreen("verify-otp");
    }
  };

  const verifyOTP = async () => {
    const res = await VerifyOtp({
      data: {
        email,
        hash,
        otp: Number(otp),
      },
    });

    handleResponse(res);

    if (res?.data?.statusCode == 200) {
      setToken(res?.data?.sessionToken);
      setScreen("update-password");
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      messageApi.open({
        type: "error",
        content: "Confirm password doesn't match",
      });
      return
    }

    const res = await UpdatePassword({
      data: {
        password: newPassword,
        sessionToken: token,
      },
    });

    handleResponse(res);

    if (res?.data?.statusCode == 200) {
      setScreen("login");
      router.refresh();
    }
  };

  return (
    <>
      {contextHolder}

      {screen == "updated" && (
        <div className={cn("flex flex-col gap-6", className)}>
          <Card>
            <CardHeader>
              <CardTitle>Password Updated</CardTitle>
              <CardDescription>Pass</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert
                // title="Success Tips"
                description="Your Password updated successful!"
                type="success"
                showIcon
              />
            </CardContent>
          </Card>
        </div>
      )}

      {screen == "update-password" && (
        <div className={cn("flex flex-col gap-6", className)}>
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>
                Update with your new password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    // {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password && (
                    <FieldDescription className="text-red-500">
                      {errors.password.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    // {...register("password")}
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
                    onClick={() => updatePassword()}
                  >
                    {isSubmitting ? "updating..." : "Update Password"}
                  </Button>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      )}

      {screen == "verify-otp" && (
        <div className={cn("flex flex-col gap-6", className)}>
          <Card>
            <CardHeader>
              <CardTitle>Verify OTP</CardTitle>
              <CardDescription>Input OTP & Verify</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">OTP</FieldLabel>
                  <AntdInput.OTP
                    formatter={(str) => str.toUpperCase()}
                    {...sharedProps}
                  />
                  {errors.email && (
                    <FieldDescription className="text-red-500">
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <Button
                    style={{ cursor: "pointer" }}
                    type="submit"
                    disabled={isSubmitting || !otp}
                    onClick={() => verifyOTP()}
                  >
                    {isSubmitting ? "Verifying in..." : "Verify"}
                  </Button>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      )}

      {screen == "send-otp" && (
        <div className={cn("flex flex-col gap-6", className)}>
          <Card>
            <CardHeader>
              <CardTitle>Send OTP</CardTitle>
              <CardDescription>
                Enter your email below to send reset otp
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <form> */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    // {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <FieldDescription className="text-red-500">
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <Button
                    style={{ cursor: "pointer" }}
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => submitOTP()}
                  >
                    {isSubmitting ? "Sending in..." : "Send"}
                  </Button>
                  {role === "investor" && (
                    <Link href="/investor-signup">
                      <FieldDescription className="text-center mt-2">
                        Don&apos;t have an investor account?{" "}
                        <a href="#">
                          <strong>Sign up</strong>
                        </a>
                      </FieldDescription>
                    </Link>
                  )}
                </Field>
              </FieldGroup>
              {/* </form> */}
            </CardContent>
          </Card>
        </div>
      )}

      {screen == "login" && (
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
                      <a
                        onClick={() => setScreen("send-otp")}
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
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
                          Don&apos;t have an investor account?{" "}
                          <a href="#">
                            <strong>Sign up</strong>
                          </a>
                        </FieldDescription>
                      </Link>
                    )}
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
