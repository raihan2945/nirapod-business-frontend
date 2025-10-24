"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

const ComponentModalContext = createContext<any>(null);

export const ComponentModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [editComponentId, setEditComponentId] = useState<string>("");
  const [addComponent, setAddComponent] = useState<boolean>(false);

  return (
    <ComponentModalContext.Provider
      value={{
        editComponentId,
        addComponent,
        setAddComponent,
        setEditComponentId
      }}
    >
      {children}
    </ComponentModalContext.Provider>
  );
};

export const useComponentModalContext = () => useContext(ComponentModalContext);
