"use client";

import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

// Custom hook to check access
const useGeneralCheckAccess = () => {

    const userProfile: any = useSelector((state: RootState) => state?.user?.data);

    const hasAccessGen = (roles: string[]): boolean => {
        let finalReturn = false;

        for (let item of userProfile?.roles) {
            if (roles.includes(item)) {
                finalReturn = true;
                break;
            }
        }

        return finalReturn;
    }

    return { hasAccessGen }
};

export default useGeneralCheckAccess;
