"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

const DriverModalContext = createContext<any>(null);

export const DriverModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [driverId, setDriverId] = useState<string>("");

  return (
    <DriverModalContext.Provider
      value={{
        driverId,
        setDriverId
      }}
    >
      {children}
    </DriverModalContext.Provider>
  );
};

export const useDriverModalContext = () => useContext(DriverModalContext);
