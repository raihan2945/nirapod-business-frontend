"use client";

import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateNewBlogMutation,
  useUpdateBlogByIdMutation,
} from "@/state/features/blogs/blogsApi";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { Button, Card, Image, Tag } from "antd";
import { useCreateNewProjectInvestmentMutation } from "@/state/features/projects/projectInvestmentApi";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";
import { generateQueryArray } from "@/utils/query";
import { Minus, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import {
  useCreateNewWalletTransactionMutation,
  useUpdateWalletTransactionMutation,
} from "@/state/features/wallet/walletTransactionApi";

// userId: z.string().uuid(),
// investmentId: z.string().uuid().optional(),
// paymentMethod: z.string().min(1, "Payment method is required"),
// paymentDate: z.coerce.date().optional(),
// proof1: z.string().optional(),
// proof2: z.string().optional(),
// transactionId: z.string().optional(),
// amount: z.coerce.number().positive("Amount must be positive"),
// comments: z.string().optional(),
// type: z.nativeEnum(WalletTransactionType),
// status: z.nativeEnum(transactionStatus).default("PENDING"),
// investmentAt: z.date().optional(),

// ✅ Zod schema for validation
const transactionFormSchema = z.object({
  qty: z.coerce.number(),
  amount: z.coerce.number().int().positive(),
  paymentMethod: z.string().optional(),
  paymentDate: z.string().optional(),
  transactionId: z.string().optional(),
  comments: z.string().optional(),
  proof1: z.any().optional(),
  projectId: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
});

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;") // Must come first!
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type transactionFormData = z.infer<typeof transactionFormSchema>;

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
  projectId?: string;
  userId: string;
  type?: string;
  title?:string
}

const WalletTransactionForm: React.FC<ComponentProps> = ({
  formType,
  info,
  modalCancel,
  projectId,
  userId,
  type,
  title
}) => {
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null,
  );
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setNewProjectId, newProjectId] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [customError, setCustomError] = useState<any>(null);

  const userProfile: any = useSelector((state: RootState) => state?.user?.data);

  const [CreateTransaction, { isLoading: isCreating }] =
    useCreateNewWalletTransactionMutation();

  const [UpdateTransaction, { isLoading: isUpdating }] =
    useUpdateWalletTransactionMutation();

  const {
    register,

    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
    setError,
    getValues,
  } = useForm<transactionFormData>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: {
      qty: 1,
      //   description: "",
      //   content: "",
      //   status: "DRAFT",
      projectId: projectId,
    },
  });

  // ✅ Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("proof1", file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ On form submit
  const onSubmit = async (data: transactionFormData) => {
    setIsSubmitting(true);
    console.log("Submitting........");
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      type && formData.append("type", type);
      formData.append("amount", data.amount.toString());
      formData.append("qty", qty.toString());
      formData.append("paymentMethod", data.paymentMethod || "");
      data.paymentDate && formData.append("paymentDate", data?.paymentDate);
      formData.append("transactionId", data.transactionId || "");
      formData.append("comments", data.comments || "");

      if (data.proof1 instanceof File) {
        formData.append("proof1", data.proof1);
      }

      if (formType == "edit") {
        formData.append("status", "APPROVED");
      }

      let res;
      if (formType === "edit" && info?.id) {
        res = await UpdateTransaction({ id: info.id, data: formData });
      } else {
        res = await CreateTransaction({ data: formData });
      }

      console.log("Response is : ", res);

      handleResponse(res);
      modalCancel();
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Failed to create blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQty = () => {
    setQty((ext) => Number(ext) + 1);
  };
  const removeQty = () => {
    setQty((ext) => Number(ext) - 1);
  };

  // ✅ Initialize form when editing
  useEffect(() => {
    if (info) {
      reset({
        amount: info.amount || "",
        paymentMethod: info.paymentMethod || "",
        paymentDate: info.paymentDate || "",
        transactionId: info.transactionId || "",
        comments: info.comments || "",
      });
      if (info.coverPhoto) {
        setCoverPhotoPreview(`${baseUrl}/uploads/photos/${info.coverPhoto}`);
      }
    }
  }, [info, reset]);

  useEffect(() => {
    if (type == "WITHDRAWAL") {
      if (Number(watch("amount") || 0) > userProfile?.balance) {
        setCustomError("You've reached your limit!");
      } else {
        setCustomError(null);
      }
    }
  }, [watch("amount")]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">
        {title || (formType == "create"
          ? type == "DEPOSIT"
            ? "Add Money To Your Wallet"
            : type == "WITHDRAWAL"
              ? "Withdraw From Your Wallet"
              : ""
          : "Edit Transaction")}
      </h2>

      <Card>
        <div
          style={
            {
              // pointerEvents: watch("projectId") ? "auto" : "none",
              // opacity: watch("projectId") ? 1 : 0.6,
            }
          }
        >
          {formType == "create" && (
            <Card>
              <h1 className="text-lg font-bold">
                Your current wallet balance : ৳{userProfile?.balance}
              </h1>
            </Card>
          )}

          {/* Payment Amount */}
          <div className="mt-2">
            <label className="block mb-3 font-medium">Amount</label>
            <div className="flex gap-2 item-center">
              <input
                type="number"
                {...register("amount")}
                className="w-full border rounded p-2"
                placeholder="TK"
                disabled={formType == "edit"}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          <div className="mt-2">
            <label className="block mb-1 font-medium">Payment Method</label>
            <select
              className="w-full border rounded p-2"
              defaultValue="Bank"
              {...register("paymentMethod")}
            >
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Payment Date */}
          {(formType == "edit" || type == "DEPOSIT") && (
            <div className="mt-2">
              <label className="block mb-1 font-medium">Payment Date</label>
              <input
                type="date"
                {...register("paymentDate")}
                className="w-full border rounded p-2"
                placeholder="Enter blog title"
              />
              {errors.paymentDate && (
                <p className="text-red-500 text-sm">
                  {errors.paymentDate.message}
                </p>
              )}
            </div>
          )}

          {/* Payment Date */}
          {(formType == "edit" || type == "DEPOSIT") && (
            <div className="mt-2">
              <label className="block mb-1 font-medium">Transaction Id</label>
              <input
                {...register("transactionId")}
                className="w-full border rounded p-2"
                placeholder="Enter blog title"
              />
              {/* {errors.transactionId && (
            <p className="text-red-500 text-sm">{errors.transactionId.message}</p>
          )} */}
            </div>
          )}

          {/* Content */}
          <div className="mt-2">
            <label className="block mb-1 font-medium">Remarks</label>
            <textarea
              {...register("comments")}
              className="w-full border rounded p-2"
              placeholder="Write your content..."
            />
          </div>

          {/* Cover Photo */}
          {(formType == "edit" || type == "DEPOSIT") && (
            <div className="mt-2">
              <label className="block mb-1 font-medium">
                Submit your proof
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverPhotoChange}
              />
              {coverPhotoPreview && (
                <img
                  src={coverPhotoPreview}
                  alt="Preview"
                  className="mt-2 w-40 h-40 object-cover rounded-lg border"
                />
              )}
            </div>
          )}
        </div>
      </Card>

      {customError && (
        <p className="mt-2 text-lg text-red-500 font-semibold">{customError}</p>
      )}

      <Button
        // htmlType="submit"
        disabled={isCreating || isUpdating || customError}
        className="mt-3 w-full cursor-pointer bg-green-500 text-white py-2 rounded hover:bg-green-600"
        onClick={() => {
          onSubmit(getValues());
        }}
        type="primary"
      >
        {formType == "edit" ? "Approve" : "Send"}
      </Button>
    </form>
  );
};

export default WalletTransactionForm;
