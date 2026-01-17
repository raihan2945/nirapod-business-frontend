import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateNewBlogMutation,
  useUpdateBlogByIdMutation,
} from "@/state/features/blogs/blogsApi";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import { Card } from "antd";
import { useCreateNewProjectInvestmentMutation } from "@/state/features/projects/projectInvestmentApi";

// ✅ Zod schema for validation
const blogFormSchema = z.object({
  amount: z.coerce.number(),
  paymentMethod: z.string().optional(),
  paymentDate: z.coerce.date().optional(),
  transactionId: z.string().optional(),
  comments: z.string().optional(),
  proof1: z.any().optional(),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
  projectId: string;
  userId: string;
}

const InvestmentForm: React.FC<ComponentProps> = ({
  formType,
  info,
  modalCancel,
  projectId,
  userId
}) => {
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null
  );
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNew] = useCreateNewProjectInvestmentMutation();
  const [updateOne] = useUpdateBlogByIdMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema) as any,
    defaultValues: {
      //   title: "",
      //   description: "",
      //   content: "",
      //   status: "DRAFT",
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
      formData.append("projectId", projectId);
      formData.append("userId",userId);
      formData.append("amount", data.amount.toString());
      formData.append("paymentMethod", data.paymentMethod || "");
      formData.append(
        "paymentDate",
        data.paymentDate ? data.paymentDate.toISOString() : ""
      );
      formData.append("transactionId", data.transactionId || "");
      formData.append("comments", data.comments || "");

      if (data.proof1 instanceof File) {
        formData.append("proof1", data.proof1);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-auto mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">
        {"Make Project Investment"}
      </h2>

      <Card style={{ marginBottom: "1rem" }}>
        <p className="text-lg">
          <strong>Account No :</strong> 7862147000053636
        </p>
        <p className="text-lg">
          <strong>Account Name :</strong> Amanah Fintech Limited
        </p>
        <p className="text-lg">
          <strong>Bank Name :</strong> United Commercial Bank PLC (UCB)
        </p>
        <p className="text-lg">
          <strong>Branch :</strong> UCB Taqwa Islamic Banking Branch
        </p>
        <p className="text-lg">
          <strong></strong>
        </p>
      </Card>

      <Card>
        {/* Payment Amount */}
        <div className="mt-2">
          <label className="block mb-1 font-medium">Payment Amount</label>
          <input
            type="number"
            {...register("amount")}
            className="w-full border rounded p-2"
            placeholder="Enter blog title"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        <div className="mt-2">
          <label className="block mb-1 font-medium">Payment Method</label>
          <input
            {...register("paymentMethod")}
            className="w-full border rounded p-2"
            placeholder="Enter blog title"
          />
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
            <p className="text-red-500 text-sm">{errors.paymentDate.message}</p>
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
          <label className="block mb-1 font-medium">Comments</label>
          <textarea
            {...register("comments")}
            className="w-full border rounded p-2"
            placeholder="Write your content..."
          />
        </div>

        {/* Cover Photo */}
        <div className="mt-2">
          <label className="block mb-1 font-medium">Proof</label>
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
      </Card>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
};

export default InvestmentForm;
