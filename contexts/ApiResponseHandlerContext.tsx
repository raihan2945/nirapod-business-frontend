import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, message } from "antd";

type ModalOptions = any;

type ModalContextType = {
    handleResponse: (options: any) => any;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const APIResponseHandlerProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [modalContent, setModalContent] = useState<ReactNode | Object>(null);

    //* : MESSAGES
    const success = (message: string) => {
        messageApi.open({
            type: "success",
            content: message || "Success",
        });
    };

    const error = (message: string) => {
        messageApi.open({
            type: "error",
            content: message || "Error",
        });
    };

    const warning = (message: string) => {
        messageApi.open({
            type: "warning",
            content: message || "Warning",
        });
    };

    const handleResponse = (res: ModalOptions) => {

        let returnRes: any = {}

        if (res?.error?.status == 400) {
            if (res?.error?.data?.errors) {

                // let formatedErrors: any = {}
                // res?.error?.data?.errors?.map((err: any) => {
                // error(`${err?.path[0]} is ${err?.message}`);
                // formatedErrors[`${err?.path[0]}`] = {
                //     message: `${err?.path[0].toUpperCase()} is ${err?.message}`,
                //     type: err?.invalid_type,
                //     ref: `<input id="${err?.path[0]}" class="w-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Engine Capacity(cc)" type="number" name="${err?.path[0]}">`
                // }
                // })
                error("Data input error")
                returnRes["code"] = 400
                returnRes["form_errors"] = res?.error?.data?.errors

                // res?.error?.data?.errors?.map((error: any) => {
                // })

            }
            else if (res?.error?.data) {
                returnRes["code"] = 400
                error(`${res?.error?.data?.message}`)
            }
        }

        if (res?.error?.status == 404) {
            returnRes["code"] = 404
            error(`${res?.error?.data?.message}`)
        }

        if (res?.error?.status == 500) {
            returnRes["code"] = 500
            error(`${res?.error?.data?.message || 'Server Error'}`)
        }

        if (res?.data?.status == 200) {
            returnRes["code"] = 200
            success(`${res?.data?.message}`)
        }
        if (res?.data?.status == 201) {
            returnRes["code"] = 201
            success(`${res?.data?.message}`)
        }

        return returnRes
    };

    return (
        <ModalContext.Provider value={{ handleResponse }}>
            {contextHolder}
            {children}
        </ModalContext.Provider>
    );
};

export const useAPIResponseHandler = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
