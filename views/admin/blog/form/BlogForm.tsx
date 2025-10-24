"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useState } from "react";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.any().optional(),
  coverPhoto: z.string().min(1, "Cover photo is required"),
  photos: z.array(z.string()).optional().default([]),
  authorId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface ComponentProps {
  modalCancel: any;
  formType?: string;
  info?: any;
}

const BlogForm: React.FC<ComponentProps> = ({
  modalCancel,
  formType,
  info,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>("");
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BlogFormData>({
    // resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      coverPhoto: "",
      photos: [],
      authorId: "",
      status: "DRAFT",
    },
  });

  const photos = watch("photos");

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverPhotoPreview(result);
        setValue("coverPhoto", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPhotoPreviews((prev) => [...prev, result]);
          setValue("photos", [...(photos || []), result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setValue("photos", photos?.filter((_, i) => i !== index) || []);
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Blog form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/blog");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Create Blog Post
        </h1>
        <p className="text-gray-600">
          Share your thoughts and insights with the world
        </p>
      </div>

      {/* Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter blog post title"
              {...register("title")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter a brief description of your blog post"
              rows={3}
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              placeholder="Write your blog post content here..."
              rows={8}
              {...register("content")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Cover Photo */}
          <div>
            <label
              htmlFor="coverPhoto"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Cover Photo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="coverPhoto"
                accept="image/*"
                onChange={handleCoverPhotoChange}
                className="hidden"
              />
              {coverPhotoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={coverPhotoPreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="max-h-48 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverPhotoPreview("");
                      setValue("coverPhoto", "");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="coverPhoto" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              )}
            </div>
            {errors.coverPhoto && (
              <p className="text-red-500 text-sm mt-1">
                {errors.coverPhoto.message}
              </p>
            )}
          </div>

          {/* Additional Photos */}
          <div>
            <label
              htmlFor="photos"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Additional Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="photos"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="hidden"
              />
              <label htmlFor="photos" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </label>
            </div>

            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Author ID */}
          <div>
            <label
              htmlFor="authorId"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Author ID
            </label>
            <input
              type="text"
              id="authorId"
              placeholder="Your author ID (optional)"
              {...register("authorId")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? "Publishing..." : "Publish Blog"}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default BlogForm;
