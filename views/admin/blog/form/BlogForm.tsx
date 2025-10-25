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

// ✅ Zod schema for validation
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  coverPhoto: z.any().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
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
    null
  );
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNew] = useCreateNewBlogMutation();
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
      title: "",
      description: "",
      content: "",
      status: "DRAFT",
    },
  });

  // ✅ Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("coverPhoto", file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ On form submit
  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("content", data.content || "");
      formData.append("status", data.status);

      if (data.coverPhoto instanceof File) {
        formData.append("photo", data.coverPhoto);
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
        title: info.title || "",
        description: info.description || "",
        content: info.content || "",
        status: info.status || "DRAFT",
      });
      if (info.coverPhoto) {
        setCoverPhotoPreview(`${baseUrl}/uploads/photos/${info.coverPhoto}`);
      }
    }
  }, [info, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 border rounded-lg shadow-md bg-white space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        {formType === "edit" ? "Update Blog" : "Create New Blog"}
      </h2>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          {...register("title")}
          className="w-full border rounded p-2"
          placeholder="Enter blog title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full border rounded p-2"
          placeholder="Enter short description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          {...register("content")}
          className="w-full border rounded p-2"
          placeholder="Write your content..."
        />
      </div>

      {/* Cover Photo */}
      <div>
        <label className="block mb-1 font-medium">Cover Photo</label>
        <input type="file" accept="image/*" onChange={handleCoverPhotoChange} />
        {coverPhotoPreview && (
          <img
            src={coverPhotoPreview}
            alt="Preview"
            className="mt-2 w-40 h-40 object-cover rounded-lg border"
          />
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select {...register("status")} className="w-full border rounded p-2">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting
          ? "Submitting..."
          : formType === "edit"
          ? "Update Blog"
          : "Create Blog"}
      </button>
    </form>
  );
};

export default BlogForm;
