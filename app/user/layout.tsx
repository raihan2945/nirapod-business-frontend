"use client";

import Navbar from "@/views/navbar/Navbar";
import React from "react";
import Footer from "@/views/footer/Footer";
import { APIResponseHandlerProvider } from "@/contexts/ApiResponseHandlerContext";
// props
type DashboardLayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: DashboardLayoutProps) => {
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
