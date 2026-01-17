"use client";

import Navbar from "@/views/navbar/Navbar";
import React, { useEffect } from "react";
import Footer from "@/views/footer/Footer";
import { APIResponseHandlerProvider } from "@/contexts/ApiResponseHandlerContext";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";
import { userLoggedOut } from "@/state/features/auth/authSlice";
// props
type DashboardLayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: DashboardLayoutProps) => {

    const router = useRouter();
  
    const userId = useSelector((state: RootState) => state?.auth?.id);
    const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
    const userProfile = useSelector((state: RootState) => state?.user?.data);
  
    const dispatch: AppDispatch = useDispatch();
  
    const logout = () => {
      console.log("logged Out!!!");
      dispatch(userLoggedOut());
      window.location.reload();
      router.push("/");
    };

    console.log("user profile is : ", userProfile)
  
    useEffect(() => {
      if (userProfile?.role !== "user") {
        router.push("/");
      }
    }, [isLoading, userProfile, router, isError]);

  return (
    <div>
      <Navbar variant="fixed" />
      <APIResponseHandlerProvider>
        <div className="mt-20">{children}</div>
      </APIResponseHandlerProvider>
      <Footer />
    </div>
  );
};

export default Layout;
