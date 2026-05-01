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
import { Button, Card, Image, Radio, Tag } from "antd";
import { useCreateNewProjectInvestmentMutation } from "@/state/features/projects/projectInvestmentApi";
import { useGetAllProjectsQuery } from "@/state/features/projects/projectsApi";
import { generateQueryArray } from "@/utils/query";
import { Minus, Plus } from "lucide-react";
import { useGetUserByIdV2Query } from "@/state/features/user/userApi";

// ✅ Zod schema for validation
const blogFormSchema = z.object({
  qty: z.coerce.number(),
  amount: z.coerce.number(),
  paymentMethod: z.string().optional(),
  paymentDate: z.string().optional(),
  transactionId: z.string().optional(),
  comments: z.string().optional(),
  proof1: z.any().optional(),
  projectId: z.string().optional(),
});

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;") // Must come first!
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type BlogFormData = z.infer<typeof blogFormSchema>;

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
  projectId?: string;
  userId: string;
  project?: any;
}

const InvestmentForm: React.FC<ComponentProps> = ({
  formType,
  info,
  modalCancel,
  projectId,
  userId,
  project,
}) => {
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null,
  );
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNew] = useCreateNewProjectInvestmentMutation();
  const [updateOne] = useUpdateBlogByIdMutation();
  const [setNewProjectId, newProjectId] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [methodValue, setMethodValue] = useState("direct");

  const [existingProject, setExistingProject] = useState<any>(
    project ? project : null,
  );

  const query = {};

  const { data: projects } = useGetAllProjectsQuery(generateQueryArray(query));
  const { data: userData, isLoading: userLoading } =
    useGetUserByIdV2Query(userId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema) as any,
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
  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("projectId", data?.projectId!);
      formData.append("userId", userId);
      formData.append("amount", data.amount.toString());
      formData.append("qty", qty.toString());
      formData.append("paymentMethod", data.paymentMethod || "");
      data.paymentDate && formData.append("paymentDate", data?.paymentDate);
      formData.append("transactionId", data.transactionId || "");
      formData.append("comments", data.comments || "");

      if (data.proof1 instanceof File) {
        formData.append("proof1", data.proof1);
      }

      if (methodValue == "fromWallet") {
        formData.append("fromWallet", "true");
      }

      let res;
      if (formType === "edit" && info?.id) {
        // res = await updateOne({ id: info.id, data: formData });
      } else {
        res = await createNew({ data: formData });
      }

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
    const currentValue = qty * Number(existingProject?.minInvestment);
    setValue("amount", currentValue);
  }, [qty, existingProject]);

  console.log("Method value : ", methodValue);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">
        {"Make Project Investment"}
      </h2>

      <Card style={{ marginBottom: ".5rem" }}>
        <label className="block mb-1 font-medium">Project</label>
        <select
          className="w-full border rounded p-2 color-green-700"
          value={watch("projectId") || ""}
          onChange={(e) => {
            const p = projects?.data?.find((p: any) => p.id === e.target.value);
            setQty(1);
            setExistingProject(p);
            setValue("projectId", p?.id);
          }}
        >
          <option value="">Select Project</option>
          {projects?.data?.map((project: any) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </Card>

      <Card style={{ marginBottom: ".5rem" }}>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div>
            <h1 className="mb-2 text-md ">Choose the investment Method</h1>
            <Radio.Group
              value={methodValue}
              onChange={(e) => {
                setMethodValue(e.target.value);
              }}
              buttonStyle="solid"
            >
              <Radio.Button value="direct">Direct</Radio.Button>
              <Radio.Button value="fromWallet">From Wallet</Radio.Button>
            </Radio.Group>
          </div>
          <div className="text-align-right flex flex-col md:items-end">
            <h1 className="text-md">Your Wallet Balance</h1>
            <h1 className="text-3xl font-bold">
              ৳{userData?.data?.balance || 0}
            </h1>
          </div>
        </div>
      </Card>

      {methodValue !== "fromWallet" && (
        <Card style={{ marginBottom: "1rem" }}>
          {existingProject?.bankInfo && (
            <>
              <p
                className="text-lg"
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: existingProject?.bankInfo }}
              ></p>
            </>
          )}
        </Card>
      )}

      <Card>
        <div
          style={{
            pointerEvents: watch("projectId") ? "auto" : "none",
            opacity: watch("projectId") ? 1 : 0.6,
          }}
        >
          {/* Payment Amount */}
          <div className="mt-2">
            <label className="block mb-3 font-medium">
              Total Investments{" "}
              <Button
                size="small"
                type="primary"
                style={{
                  backgroundColor: "#ff240b",
                  marginLeft: 1,
                }}
                shape="circle"
              >
                {qty}
              </Button>
            </label>
            <div className="flex gap-2 item-center">
              <input
                type="number"
                {...register("amount")}
                className="w-full border rounded p-2"
                placeholder="TK"
                disabled
              />
              <div className="flex gap-2 items-center">
                <Button
                  size="large"
                  type="primary"
                  color="green"
                  icon={<Plus />}
                  onClick={addQty}
                  shape="circle"
                />
                <Button
                  onClick={removeQty}
                  disabled={qty <= 1}
                  size="large"
                  icon={<Minus />}
                  shape="circle"
                />
              </div>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          {methodValue !== "fromWallet" && (
            <>
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

              {/* Payment Date */}
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

              {/* Content */}
              <div className="mt-2">
                <label className="block mb-1 font-medium">Remarks</label>
                <textarea
                  {...register("comments")}
                  className="w-full border rounded p-2"
                  placeholder="Write your content..."
                />
              </div>

              {/* Proof Photo */}
              <div className="mt-2">
                <label className="block mb-1 font-medium">
                  Submit your document
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
            </>
          )}
        </div>
      </Card>

      {Number(watch("amount") || 0) > Number(userData?.data?.balance || 0) && (
        <p className="mt-2 text-lg text-red-500 font-semibold">
          Your wallet balance is : ৳{userData?.data?.balance}
        </p>
      )}

      <Button
        // htmlType="submit"
        disabled={
        methodValue !== "direct" && Number(watch("amount") || 0) > Number(userData?.data?.balance || 0)
        }
        onClick={() => onSubmit(getValues())}
        className="mt-3 w-full cursor-pointer bg-green-600 text-white py-2 rounded hover:bg-green-700/80"
        type="primary"
      >
        Send
      </Button>
    </form>
  );
};

export default InvestmentForm;
