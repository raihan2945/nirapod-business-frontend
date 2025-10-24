"use client";

import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

// Custom hook to check access
const useCheckAccess = () => {

    const userProfile: any = useSelector((state: RootState) => state?.user?.data);

    const hasAccess = (roles: string[]): boolean => {
        let finalReturn = false;

        for (let item of userProfile?.roles) {
            if (item === "super_admin" || item === "admin" || roles.includes(item)) {
                finalReturn = true;
                break;
            }
        }

        return finalReturn;
    }

    return { hasAccess }
};

export default useCheckAccess;
