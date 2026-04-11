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
import { useUpdateProjectInvestmentReturnByIdMutation } from "@/state/features/projects/investmentReturnApi";

// ✅ Zod schema for validation
const blogFormSchema = z.object({
  note: z.string().optional(),
  photo: z.any().optional(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]).default("PENDING"),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
}

const BlogForm: React.FC<ComponentProps> = ({
  formType,
  info,
  modalCancel,
}) => {
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null,
  );
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNew] = useCreateNewBlogMutation();
  const [updateOne] = useUpdateProjectInvestmentReturnByIdMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema) as any,
    defaultValues: {
      note: "",
      photo: "",
      status: "PENDING",
    },
  });

  // ✅ Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("photo", file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ On form submit
  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("note", data.note);
      formData.append("status", "PAID");

      if (data.photo instanceof File) {
        formData.append("photo", data.photo);
      }

      let res;
      if (formType === "edit" && info?.id) {
        res = await updateOne({ id: info.id, data: formData });
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
        note: info.note || "",
        status: info.status || "PENDING",
      });
      if (info.coverPhoto) {
        setCoverPhotoPreview(`${baseUrl}/uploads/photos/${info.coverPhoto}`);
      }
    }
  }, [info, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 rounded-lg space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        {formType === "edit" ? "Confirm paid" : ""}
      </h2>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Note</label>
        <input
          {...register("note")}
          className="w-full border rounded p-2"
          placeholder="Enter note"
        />
        {errors.note && (
          <p className="text-red-500 text-sm">{errors.note.message}</p>
        )}
      </div>


      {/* Cover Photo */}
      <div>
        <label className="block mb-1 font-medium">Photo</label>
        <input className="" type="file" accept="image/*" onChange={handleCoverPhotoChange} />
        {coverPhotoPreview && (
          <img
            src={coverPhotoPreview}
            alt="Preview"
            className="mt-2 w-40 h-40 object-cover rounded-lg border"
          />
        )}
      </div>

      {/* Status */}
      {/* <div>
        <label className="block mb-1 font-medium">Status</label>
        <select {...register("status")} className="w-full border rounded p-2">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div> */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting
          ? "Submitting..."
          : formType === "edit"
            ? "Submit Paid"
            : "Create Blog"}
      </button>
    </form>
  );
};

export default BlogForm;
