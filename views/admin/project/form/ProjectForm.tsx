import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateNewBlogMutation,
  useUpdateBlogByIdMutation,
} from "@/state/features/blogs/blogsApi";
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import {
  useCreateNewProjectMutation,
  useUpdateProjectByIdMutation,
} from "@/state/features/projects/projectsApi";

// 🧮 Define a reusable project schema
const decimalSchema = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val) || 0);

// ✅ Zod schema for Project Investment
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  investmentGoal: decimalSchema.default(0),
  raised: decimalSchema.default(0),
  minInvestment: decimalSchema.default(0),
  waiting: decimalSchema.default(0),
  murabahaMarkupReturn: decimalSchema.default(0),
  calculatedRoi: decimalSchema.default(0),
  repayment: z.coerce.number().int().default(0),
  projectDuration: z.coerce.number().int().default(0),
  leftDays: z.coerce.number().int().default(0),
  roles: z.any().optional(),
  theBusiness: z.any().optional(),
  theContract: z.any().optional(),
  shariahCompliance: z.any().optional(),
  potentialRisks: z.any().optional(),
  coverPhoto: z.any().optional().nullable(),
  photos: z.array(z.any()).default([]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
}

const MultiInputSection = ({
  control,
  register,
  name,
  label,
  errors,
}: {
  control: any;
  register: any;
  name: keyof ProjectFormData;
  label: string;
  errors: any;
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-700">{label}</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-7 gap-2 items-start mb-2">
          <div className="col-span-2">
            <input
              {...register(`${name}.${index}.title` as const)}
              placeholder="Title"
              className="w-full border rounded p-2"
            />
            {errors?.[name]?.[index]?.title && (
              <p className="text-red-500 text-sm">
                {errors[name][index].title.message}
              </p>
            )}
          </div>
          <div className="col-span-4">
            <textarea
              {...register(`${name}.${index}.description` as const)}
              placeholder="Description"
              className="w-full border rounded p-2"
              rows={1}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="cursor-pointer col-span-1 bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ title: "", description: "" })}
        className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add {label}
      </button>
    </div>
  );
};

const ProjectForm: React.FC<ComponentProps> = ({
  formType,
  info,
  modalCancel,
}) => {
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null
  );
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNew] = useCreateNewProjectMutation();
  const [updateOne] = useUpdateProjectByIdMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    control,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: info || {},
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
  const onSubmit = async (data: any) => {
    console.log("Submitting Data:", data);
    // return

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        console.log(`Key: ${key}, Value:`, data[key]);
        if (key !== "coverPhoto" && key !== "photos") {
          if (
            key === "roles" ||
            key === "theBusiness" ||
            key === "theContract" ||
            key === "shariahCompliance" ||
            key === "potentialRisks"
          ) {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      if (data.coverPhoto instanceof File)
        formData.append("photo", data.coverPhoto);

      // if (Array.isArray(data.photos)) {
      //   data.photos.forEach((photo: any) => {
      //     if (photo instanceof File) formData.append("photos", photo);
      //   });
      // }

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
      // Handle cover photo
      if (info.coverPhoto) {
        setCoverPhotoPreview(`${baseUrl}/uploads/photos/${info.coverPhoto}`);
      }

      // Handle roles and other array fields
      const fields = [
        "roles",
        "theBusiness",
        "theContract",
        "shariahCompliance",
        "potentialRisks",
      ];

      fields.forEach((field) => {
        if (info[field]) {
          let parsedData;
          try {
            parsedData =
              typeof info[field] === "string"
                ? JSON.parse(info[field])
                : info[field];
            // Ensure parsedData is an array
            if (!Array.isArray(parsedData)) {
              console.warn(`Field ${field} is not an array:`, parsedData);
              parsedData = [];
            }
          } catch (error) {
            console.error(`Error parsing ${field}:`, error);
            parsedData = []; // Fallback to empty array
          }
          reset((prev) => ({ ...prev, [field]: parsedData }));
        } else {
          // If field is undefined, reset to empty array
          reset((prev) => ({ ...prev, [field]: [] }));
        }
      });

      // Set other fields (non-array)
      reset((prev) => ({
        ...prev,
        title: info.title || "",
        description: info.description || "",
        investmentGoal: info.investmentGoal || 0,
        raised: info.raised || 0,
        minInvestment: info.minInvestment || 0,
        waiting: info.waiting || 0,
        murabahaMarkupReturn: info.murabahaMarkupReturn || 0,
        calculatedRoi: info.calculatedRoi || 0,
        repayment: info.repayment || 0,
        projectDuration: info.projectDuration || 0,
        leftDays: info.leftDays || 0,
        coverPhoto: info.coverPhoto || null,
        photos: info.photos || [],
      }));
    }
  }, [info, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        {formType === "edit" ? "Update" : "Create"} Project
      </h2>

      {/* 🧾 Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          {...register("title")}
          className="w-full border rounded p-2"
          placeholder="Enter project title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors?.title?.message}</p>
        )}
      </div>

      {/* 📝 Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full border rounded p-2"
          placeholder="Enter description"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors?.description?.message}</p>
        )}
      </div>

      {/* 💰 Investment Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Investment Goal</label>
          <input
            type="number"
            {...register("investmentGoal")}
            className="w-full border rounded p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">
              {errors?.description?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Raised</label>
          <input
            type="number"
            {...register("raised")}
            className="w-full border rounded p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors?.raised?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Min Investment</label>
          <input
            type="number"
            {...register("minInvestment")}
            className="w-full border rounded p-2"
          />
          {errors?.description && (
            <p className="text-red-500 text-sm">
              {errors?.description?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Waiting</label>
          <input
            type="number"
            {...register("waiting")}
            className="w-full border rounded p-2"
          />
          {errors?.waiting && (
            <p className="text-red-500 text-sm">{errors?.waiting?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Murabaha Markup Return
          </label>
          <input
            type="number"
            {...register("murabahaMarkupReturn")}
            className="w-full border rounded p-2"
          />
          {errors?.murabahaMarkupReturn && (
            <p className="text-red-500 text-sm">
              {errors?.murabahaMarkupReturn?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Calculated ROI</label>
          <input
            type="number"
            {...register("calculatedRoi")}
            className="w-full border rounded p-2"
          />
          {errors?.calculatedRoi && (
            <p className="text-red-500 text-sm">
              {errors?.calculatedRoi?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Repayment</label>
          <input
            type="number"
            {...register("repayment")}
            className="w-full border rounded p-2"
          />
          {errors?.repayment && (
            <p className="text-red-500 text-sm">{errors?.repayment?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Project Duration</label>
          <input
            type="number"
            {...register("projectDuration")}
            className="w-full border rounded p-2"
          />
          {errors?.projectDuration && (
            <p className="text-red-500 text-sm">
              {errors?.projectDuration?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Left Days</label>
          <input
            type="number"
            {...register("leftDays")}
            className="w-full border rounded p-2"
          />
          {errors?.leftDays && (
            <p className="text-red-500 text-sm">{errors?.leftDays?.message}</p>
          )}
        </div>
      </div>

      <MultiInputSection
        control={control}
        register={register}
        name="roles"
        label="Roles"
        errors={errors}
      />
      <MultiInputSection
        control={control}
        register={register}
        name="theBusiness"
        label="The Business"
        errors={errors}
      />
      <MultiInputSection
        control={control}
        register={register}
        name="theContract"
        label="The Contract"
        errors={errors}
      />
      <MultiInputSection
        control={control}
        register={register}
        name="shariahCompliance"
        label="Shariah Compliance"
        errors={errors}
      />
      <MultiInputSection
        control={control}
        register={register}
        name="potentialRisks"
        label="Potential Risks"
        errors={errors}
      />

      {/* 📸 Cover Photo */}
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

      {/* 🖼️ Additional Photos */}
      {/* <div>
        <label className="block mb-1 font-medium">Additional Photos</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotosChange}
        />
        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {photoPreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-24 h-24 object-cover rounded border"
                alt={`photo-${i}`}
              />
            ))}
          </div>
        )}
      </div> */}

      {/* ✅ Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting
          ? "Submitting..."
          : formType === "edit"
          ? "Update Project"
          : "Create Project"}
      </button>
    </form>
  );
};

export default ProjectForm;
