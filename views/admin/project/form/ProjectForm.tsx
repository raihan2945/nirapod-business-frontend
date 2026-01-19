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
  musharakaMarkupReturn: z.string().optional(),
  expectedRoi: z.string().optional(),
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
    } else if (!info) {
      setValue("roles", [
        {
          title: "1",
          description: `নিরাপদ বিজনেস কর্তৃপক্ষ সম্পূর্ণ হালাল পদ্ধতিতে প্রফিট শেয়ারিংয়ের ভিত্তিতে বিনিয়োগকারীদের বিনিয়োগ গ্রহণ করবে এবং প্রতিষ্ঠানের নিজস্ব নীতিমালা ও পরিচালকদের বাস্তব ব্যবসায়িক অভিজ্ঞতার আলোকে সর্বোচ্চ সতর্কতা, স্বচ্ছতা ও দায়বদ্ধতার সঙ্গে বিনিয়োগ কার্যক্রম পরিচালনা করবে। কোনো প্রকল্পে অনাকাঙ্ক্ষিত ক্ষতির সম্ভাবনা সৃষ্টি হলে, প্রতিষ্ঠান তার অন্যান্য চলমান ও লাভজনক প্রকল্প থেকে অভ্যন্তরীণ সমন্বয় বা ভর্তুকির মাধ্যমে বিনিয়োগকারীদের সম্ভাব্য ক্ষতি লাঘবে সর্বাত্মক চেষ্টা করবে, যাতে বিনিয়োগকারীদের মূলধন সর্বোচ্চভাবে সুরক্ষিত থাকে।`,
        },
        {
          title: "2",
          description: `প্রয়োজনে, নিরাপদ বিজনেস সংশ্লিষ্ট প্রকল্পের বিনিয়োগকারীদের মধ্য থেকে একটি পরামর্শ বোর্ড গঠন করতে পারবে, যা প্রকল্প পরিচালনা ও গুরুত্বপূর্ণ সিদ্ধান্ত গ্রহণে সহযোগী ভূমিকা পালন করবে। নিরাপদ বিজনেস কর্তৃপক্ষ প্রতি অর্থবছর শেষে বিনিয়োগকারীদের অবগতির জন্য নিরীক্ষা (Audit) রিপোর্ট উন্মুক্ত করবে। এছাড়াও, ব্যবসা পরিচালনা ও ব্যবস্থাপনার জন্য পরিচালকরা নেট প্রফিটের ৪৫% গ্রহন করবে এবং অবশিষ্ট ৫৫% প্রফিট প্রফিট শেয়ারিং নীতিমালা অনুযায়ী বিনিয়োগকারীদের মধ্যে বিতরণ করা হবে।`,
        },
      ]);
      setValue("theContract", [
        {
          title: "বিনিয়োগের পরিমান ও সময়",
          description: `বিনিয়োগকারীদের নিকট থেকে সংগৃহীত মোট বিনিয়োগের পরিমাণ হবে টাকা ১০,০০,০০০০ (এক কোটি টাকা মাত্র), যা মোট ১২ মাস মেয়াদের জন্য`,
        },
        {
          title: "বিনিয়োগের সম্ভাব্য রিটার্ন",
          description: `নিরাপদ বিজনেস কর্তৃপক্ষ সম্পূর্ণ হালাল পদ্ধতিতে প্রফিট শেয়ারিংয়ের ভিত্তিতে বিনিয়োগ কার্যক্রম পরিচালনা করবে। বিনিয়োগকারীরা তাদের বিনিয়োগকৃত মূলধনের উপর নিম্নবর্ণিত হারে প্রত্যাশিত (Expected) রিটার্ন প্রাপ্ত হবেন—

প্রতি শেয়ারের মূল্য: ৩০,০০০/- টাকা

প্রতি শেয়ার বিপরীতে মাসিক প্রত্যাশিত রিটার্ন: ৬০০/- টাকা

প্রারম্ভিক পর্যায়ে, প্রথম দুই মাসের মধ্যে যুক্ত হওয়া বিনিয়োগকারীরা প্রতি শেয়ার বিপরীতে মাসিক ১,০০০/- টাকা করে প্রত্যাশিত রিটার্ন প্রাপ্ত হবেন এবং অর্থবছর শেষে অর্জিত নেট প্রফিটের উপর ভিত্তি করে অতিরিক্ত ৫% প্রফিট শেয়ারিং সুবিধা গ্রহণ করবেন।

প্রতি শেয়ারের ক্ষেত্রে আমাদের ব্যবসায়িক বিশ্লেষণের ভিত্তিতে প্রজেক্টেড প্রফিটের হার আনুমানিক ৩৬% থেকে ৪৫% পর্যন্ত হতে পারে। সে অনুযায়ী, কোনো বিনিয়োগকারী যদি ১,০০,০০০/- টাকা বিনিয়োগ করেন, তবে তিনি প্রতি অর্থবছর শেষে চূড়ান্ত হিসাব অনুযায়ী অর্জিত নেট প্রফিটের ভিত্তিতে আনুমানিক ৩৬,০০০/- টাকা থেকে ৪৫,০০০/- টাকা পর্যন্ত প্রফিট শেয়ারিং সুবিধা পেতে পারেন।`,
        },
      ]);

      setValue("shariahCompliance", [
        {
          title: "অন্তর্নিহিত চুক্তি",
          description: `নিরাপদ বিজনেস একটি সুদমুক্ত ও ন্যায়ভিত্তিক অর্থনৈতিক ব্যবস্থা প্রতিষ্ঠার লক্ষ্যে শরিয়াহ-সম্মত প্রফিট শেয়ারিং মডেল অনুসরণ করে ব্যবসায়িক কার্যক্রম পরিচালনা করে। এই দর্শনের মূল ভিত্তি হলো—লাভ ও ঝুঁকির ন্যায্য বণ্টন, স্বচ্ছতা এবং বাস্তব অর্থনৈতিক কর্মকাণ্ডে অংশগ্রহণ।

এই ব্যবস্থায় বিনিয়োগকারী কেবল অর্থ প্রদানকারী হিসেবে সীমাবদ্ধ থাকেন না; বরং তিনি ব্যবসার ঝুঁকি ও সম্ভাব্য লাভ–ক্ষতির অংশীদার হিসেবে যুক্ত থাকেন। ফলে নির্ধারিত বা গ্যারান্টেড সুদের পরিবর্তে প্রকৃত ব্যবসায়িক লাভের উপর ভিত্তি করে প্রফিট বণ্টন করা হয়, যা শরিয়াহ নীতিমালার সঙ্গে সামঞ্জস্যপূর্ণ।

নিরাপদ বিজনেস সুদ (Riba), অতিরিক্ত অনিশ্চয়তা (Gharar) এবং অবৈধ বা নিষিদ্ধ খাতে বিনিয়োগ পরিহার করে। সকল বিনিয়োগ কার্যক্রম বাস্তব ব্যবসা, উৎপাদনশীল উদ্যোগ এবং সেবাভিত্তিক প্রকল্পের সঙ্গে সম্পৃক্ত থাকে, যাতে অর্থনীতি ও সমাজ উভয়ের জন্য টেকসই মূল্য সৃষ্টি হয়।

এই শরিয়াহ-সম্মত প্রফিট শেয়ারিং পদ্ধতি বিনিয়োগকারীদের দায়িত্বশীল অংশীদারত্বকে উৎসাহিত করে, স্বচ্ছতা বৃদ্ধি করে এবং দীর্ঘমেয়াদে ন্যায়সংগত ও স্থিতিশীল অর্থনৈতিক উন্নয়নে অবদান রাখে।
          `,
        },
      ]);

      setValue("potentialRisks", [
        {
          title: "সম্ভাব্য ঝুঁকি",
          description: `নিরাপদ বিজনেস তার ব্যবসায়িক কার্যক্রমের সম্ভাব্য লাভ, রিটার্ন এবং সংশ্লিষ্ট ঝুঁকি বিবেচনায় একটি অভ্যন্তরীণ বিচার-বিশ্লেষণ ও ঝুঁকি মূল্যায়ন সম্পন্ন করেছে। উক্ত বিশ্লেষণের ভিত্তিতে প্রতিষ্ঠানটি যুক্তিসংগতভাবে প্রত্যাশা করে যে, কোনো অনাকাঙ্ক্ষিত, অপ্রত্যাশিত বা নিয়ন্ত্রণের বাইরে থাকা ঝুঁকি বা পরিস্থিতির উদ্ভব না হলে, বিনিয়োগকারীদের নিকট অর্জিত লাভসহ বিনিয়োগকৃত অর্থ পরিশোধ করতে সক্ষম হবে।

তবে ব্যবসায়িক কার্যক্রম স্বভাবতই ঝুঁকিপূর্ণ হওয়ায়, লাভ বা রিটার্নের কোনো অংশই নির্দিষ্ট বা গ্যারান্টেড হিসেবে বিবেচিত হবে না। সকল বিনিয়োগ সম্পূর্ণরূপে প্রফিট শেয়ারিং নীতিমালা ও বাস্তব ব্যবসায়িক ফলাফলের উপর নির্ভরশীল। বিনিয়োগের পূর্বে সংশ্লিষ্ট শর্তাবলি, ঝুঁকি বিবরণী ও নীতিমালা সতর্কতার সঙ্গে পর্যালোচনা করার জন্য বিনিয়োগকারীদের অনুরোধ করা হলো।
          `,
        },
      ]);
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
            step="0.01"
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
            step="0.01"
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
            step="0.01"
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
            step="0.01"
            {...register("waiting")}
            className="w-full border rounded p-2"
          />
          {errors?.waiting && (
            <p className="text-red-500 text-sm">{errors?.waiting?.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Musharakah Muarkup Return
          </label>
          <input
            type="text"
            step="0.01"
            {...register("musharakaMarkupReturn")}
            className="w-full border rounded p-2"
          />
          {errors?.murabahaMarkupReturn && (
            <p className="text-red-500 text-sm">
              {errors?.murabahaMarkupReturn?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Expected ROI</label>
          <input
            step="0.01"
            type="text"
            {...register("expectedRoi")}
            className="w-full border rounded p-2"
          />
          {errors?.calculatedRoi && (
            <p className="text-red-500 text-sm">
              {errors?.calculatedRoi?.message}
            </p>
          )}
        </div>
        
        <div>
          <label className="block mb-1 font-medium">
            Murabaha Markup Return
          </label>
          <input
            type="number"
            step="0.01"
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
            step="0.01"
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
            step="0.01"
            {...register("repayment")}
            className="w-full border rounded p-2"
          />
          {errors?.repayment && (
            <p className="text-red-500 text-sm">{errors?.repayment?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Project Duration (Month)
          </label>
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
          <label className="block mb-1 font-medium">Left Days (Day)</label>
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
