"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  Shield,
  SquareDot,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/state/features/user/userApi";
import { RootState } from "../../../state/store";
import { Tabs } from "antd";
import InvestorInvestments from "@/views/investor/InvestorInvestments";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import SingleFileUpload from "@/components/upload/singleFileUpload";
import ProfileView from "@/views/admin/user/profileView";

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobile: z.string().regex(phoneRegex, "Invalid phone number!"),
  email: z.union([z.literal(""), z.string().email("Invalid email")]),
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

  const [isEdit, setIsEdit] = useState<boolean>(false);

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

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      if (!data?.password) {
        delete data.password;
      }

      const form = new FormData();

      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof ProfileFormData;
        if (data[typedKey]) {
          form.append(key, data[typedKey] as string | Blob);
        }
      });

      if (photoPreview) {
        form.append("photo", photoPreview);
      }

      console.log("Submitting Data:", data);

      // API call would go here
      const res = await UpdateProfile({ id: userId, data: form });
      handleResponse(res);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("User Profile Data:", userProfile);

  useEffect(() => {
    if (userProfile) {
      Object.keys(userProfile).forEach((key) => {
        setValue(key as keyof ProfileFormData, userProfile[key]);
      });
    }
  }, [userProfile, setValue]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pt-6 lg:pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <Tabs tabPosition="top" defaultActiveKey="1" size="large" type="card">
          <Tabs.TabPane tab="My Investments" key="1">
            <InvestorInvestments userId={userId!} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Profile" key="2">
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                className="mb-6"
                onClick={() => setIsEdit(!isEdit)}
              >
                {isEdit ? "View Profile" : "Edit Profile"}
              </Button>
            </div>

            {isEdit ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardContent className="space-y-4">
                    {/* Cover Photo */}
                    <div className="mt-2">
                      <label className="block mb-1 font-medium">
                        Profile Photo
                      </label>
                      <SingleFileUpload
                        image={photoPreview}
                        setImage={setPhotoPreview}
                        label=" "
                        existImage={userProfile?.photo}
                      />
                    </div>

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
                            {errors.nomineeRelation.message}
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
                            {errors.nomineeMobile.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Permanent Address
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
                    className="bg-green-700 hover:bg-green-800 cursor-pointer text-white"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <ProfileView user={userProfile} />
            )}
          </Tabs.TabPane>
        </Tabs>
      </main>
    </div>
  );
}
