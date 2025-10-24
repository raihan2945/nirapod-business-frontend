"use client";

import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";

interface GetUserResponse {
  data: Object;
  message: string;
  status: number;
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => {
  const Wrapper = (props: P) => {
    const router = useRouter();

    const userId = useSelector((state: RootState) => state.auth?.id);
    const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
    const userProfile = useSelector((state: RootState) => state?.user?.data);

    useEffect(() => {
      if (!isLoading && !userProfile && isError) {
        router.push("/login/finance-login");
      }
    }, [isLoading, userProfile, router, isError]);

    if (isLoading) {
      return null; // Or a loading spinner
    }
    if (!userProfile) {
      return null; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
