"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Mail, Phone, MapPin, Lock, User, Shield } from "lucide-react";
import { useSelector } from "react-redux";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/state/features/user/userApi";
import { RootState } from "../../../state/store";
import { Tabs } from "antd";
import InvestorInvestments from "@/views/investor/InvestorInvestments";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobile: z.string().regex(phoneRegex, "Invalid phone number!"),
  email: z.union([z.literal(""), z.string().email("Invalid email")]),
  photo: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  password: z.string().optional(),
  role: z.enum(["user", "investor", "admin"]).default("user"),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleResponse } = useAPIResponseHandler();

  const [UpdateProfile] = useUpdateUserMutation();

  const userId = useSelector((state: RootState) => state.auth?.id);
  const {
    data: userData,
    isLoading: isFetchLoading,
    isError,
  } = useGetUserByIdQuery(userId);
  const userProfile: any = useSelector((state: RootState) => state?.user?.data);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      address: "",
      role: "user",
      status: "ACTIVE",
    },
  });

  const role = watch("role");
  const status = watch("status");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setValue("photo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      if (!data?.password) {
        delete data.password;
      }
      // API call would go here
      const res = await UpdateProfile({ id: userId, data });
      handleResponse(res);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      setValue("fullName", userProfile.fullName || "");
      setValue("mobile", userProfile.mobile || "");
      setValue("email", userProfile.email || "");
      setValue("address", userProfile.address || "");
      // setPhotoPreview(userProfile.photo || null);
    }
  }, [userProfile, setValue]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <Tabs tabPosition="top" defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Submitted Investments" key="1">
            <InvestorInvestments userId={userId!} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Profile" key="2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your basic profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register("fullName")}
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 absolute ml-3" />
                        <input
                          {...register("mobile")}
                          type="tel"
                          placeholder="+8801600355311"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.mobile.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 absolute ml-3" />
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="john@example.com"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 absolute ml-3" />
                        <input
                          {...register("address")}
                          type="text"
                          placeholder="Enter your address"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Tabs.TabPane>
          
        </Tabs>
      </main>
    </div>
  );
}
