"use client";
// components/ProfileView.tsx
import { baseUrl } from "@/utils/baseUrl";
import Image from "next/image";
import { useState } from "react";
import { useLazyGetUserPasswordQuery } from "@/state/features/user/userApi";
// import { User } from '@/types/user'; // ← adjust path & type name as needed
import demoProfile from "/public/images/demo-profile.jpg";

interface ProfileViewProps {
  user: any;
}

export default function ProfileView({ user }: ProfileViewProps) {
 
  
  return (
    <div className="mx-auto w-full">
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        {/* Header / Photo area */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-10 text-white">
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/80 shadow-xl flex-shrink-0">
              {user.photo ? (
                <Image
                  src={`${baseUrl}/uploads/photos/${user?.photo}`}
                  alt={`${user.fullName}'s photo`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <img
                  src="/images/demo-profile.jpg"
                  alt="Default avatar"
                  // fill
                  className="object-cover"
                  sizes="128px"
                />
              )}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.fullName || "—"}
              </h1>
              {/* <p className="mt-1 opacity-90">
                {user?.currentProfession || "—"}
              </p> */}
              <div className="mt-2 inline-flex items-center gap-2 text-sm opacity-90">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status || "UNKNOWN"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20">
                  {user.role?.toUpperCase() || "USER"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main info */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Mobile" value={user?.mobile} important />
          <InfoItem label="Email" value={user?.email || "—"} />

          <InfoItem label="Father's Name" value={user?.fatherName} />
          <InfoItem label="Mother's Name" value={user?.motherName} />

          <InfoItem label="NID / National ID" value={user?.nid} />
          <InfoItem label="Gender" value={user?.gender} />
          <InfoItem
            label="Current Profession"
            value={user?.currentProfession}
          />
          <InfoItem
            label="Facebook"
            value={
              <a href={user?.facebook} target="_blank">
                {user?.facebook}
              </a>
            }
          />
          {/* <InfoItem label="Nominee Name" value={user?.nomineeName} />
          <InfoItem label="Nominee Relation" value={user?.nomineeRelation} />
          <InfoItem label="Nominee Mobile" value={user?.nomineeMobile} /> */}

          <InfoItem label="Address" value={user?.address}  />
          <InfoItem label="Password" value={<PasswordReveal userId={user?.id} />} />

          {/* Nominee Section */}
          {(user?.nomineeName ||
            user?.nomineeRelation ||
            user?.nomineeMobile) && (
            <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Nominee
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <InfoItem label="Name" value={user?.nomineeName} />
                <InfoItem label="Relation" value={user?.nomineeRelation} />
                <InfoItem label="Mobile" value={user?.nomineeMobile} />
              </div>
            </div>
          )}

          {/* Bank Info Section */}

          <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Bank Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <InfoItem label="Bank Name" value={user?.bankName} />
              <InfoItem label="Branch Name" value={user?.branchName} />
              <InfoItem label="Account Number" value={user?.bankAccountNo} />
              <InfoItem label="Account Name" value={user?.bankAccountName} />
              <InfoItem label="Routing Number" value={user?.routingNo} />
            </div>
          </div>

          {/* Social / Other */}
          {/* {user?.facebook && (
            <div className="col-span-1 md:col-span-2 mt-2">
              <InfoItem
                label="Facebook"
                value={
                  <a
                    href={user?.facebook.startsWith('http') ? user?.facebook : `https://${user.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.facebook}
                  </a>
                }
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

//Admin-only: the password is fetched from GET /users/:id/password only when
//"Show" is clicked, and dropped again on "Hide"
function PasswordReveal({ userId }: { userId?: string }) {
  const [fetchPassword, { data, isFetching, isError }] =
    useLazyGetUserPasswordQuery();
  const [visible, setVisible] = useState(false);

  if (!userId) return null;

  const toggle = () => {
    if (visible) {
      setVisible(false);
      return;
    }
    fetchPassword(userId);
    setVisible(true);
  };

  let content: React.ReactNode = "••••••••";
  if (visible) {
    if (isFetching) content = "Loading…";
    else if (isError) content = <span className="text-red-600">Couldn't load password</span>;
    else if (data?.data?.available)
      content = <span className="font-mono select-all">{data.data.password}</span>;
    else
      content = (
        <span className="text-gray-500 text-sm">
          Not available yet. It will be after the user's next login or password change.
        </span>
      );
  }

  return (
    <span className="inline-flex items-center gap-3 flex-wrap">
      {content}
      <button
        type="button"
        onClick={toggle}
        className="text-sm font-medium text-green-700 hover:underline"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </span>
  );
}

// Reusable small component
function InfoItem({
  label,
  value,
  important = false,
  spanFull = false,
}: {
  label: string;
  value: any;
  important?: boolean;
  spanFull?: boolean;
}) {
  return (
    <div className={spanFull ? "md:col-span-2" : ""}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd
        className={`mt-1 ${important ? "font-medium text-gray-900" : "text-gray-900"}`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
