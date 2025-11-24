import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import {
  useCreateNewInvestorMutation,
  useUpdateInvestorByIdMutation,
} from "@/state/features/investors/investorApi";

// ✅ Zod schema for Investor
const decimalSchema = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val) || 0);

export const createInvestorDTOSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  email: z.string().email("Invalid email format"),
  businessAddress: z.string().min(1, "Business address is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  whatsApp: z.string().optional(),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  sizeOfBusiness: decimalSchema.default(0),
  revenuePerMonth: decimalSchema.default(0),
  facebook: z.string().optional(),
  website: z.string().optional(),
  askingInvestmentAmount: decimalSchema.default(0),
  investmentDuration: z.coerce.number().int().nonnegative().default(0),
  expectedRoi: decimalSchema.default(0),
  whyInvestmentNeed: z
    .string()
    .min(1, "Please explain why investment is needed"),
  securities: z.string().min(1, "Securities information is required"),
  howMaintain: z.string().min(1, "Maintenance plan is required"),
  howDidYouKnowAboutUs: z.string().min(1, "Source information is required"),
  aboutBusiness: z.string().min(1, "Business description is required"),
});

type InvestorFormData = z.infer<typeof createInvestorDTOSchema>;

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
}

const InvestorForm: React.FC<ComponentProps> = ({
  formType,
  info,
  modalCancel,
}) => {
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createNew] = useCreateNewInvestorMutation();
  const [updateOne] = useUpdateInvestorByIdMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvestorFormData>({
    resolver: zodResolver(createInvestorDTOSchema) as any,
    defaultValues: {
      businessName: "",
      ownerName: "",
      email: "",
      businessAddress: "",
      mobile: "",
      whatsApp: "",
      natureOfBusiness: "",
      sizeOfBusiness: 0,
      revenuePerMonth: 0,
      facebook: "",
      website: "",
      askingInvestmentAmount: 0,
      investmentDuration: 0,
      expectedRoi: 0,
      whyInvestmentNeed: "",
      securities: "",
      howMaintain: "",
      howDidYouKnowAboutUs: "",
      aboutBusiness: "",
      ...info,
    },
  });

  // ✅ On form submit
  const onSubmit = async (data: InvestorFormData) => {
    console.log("Submitting Data:", data);
    setIsSubmitting(true);

    try {
      // Send data as JSON
      const payload = { ...data };

      let res;
      if (formType === "edit" && info?.id) {
        res = await updateOne({ id: info.id, data: payload });
      } else {
        res = await createNew({ data: payload });
      }

      handleResponse(res);
      modalCancel();
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Failed to submit investor profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Initialize form when editing
  useEffect(() => {
    if (info) {
      console.log("info:", info);
      reset({
        businessName: info.businessName || "",
        ownerName: info.ownerName || "",
        email: info.email || "",
        businessAddress: info.businessAddress || "",
        mobile: info.mobile || "",
        whatsApp: info.whatsApp || "",
        natureOfBusiness: info.natureOfBusiness || "",
        sizeOfBusiness: info.sizeOfBusiness || 0,
        revenuePerMonth: info.revenuePerMonth || 0,
        facebook: info.facebook || "",
        website: info.website || "",
        askingInvestmentAmount: info.askingInvestmentAmount || 0,
        investmentDuration: info.investmentDuration || 0,
        expectedRoi: info.expectedRoi || 0,
        whyInvestmentNeed: info.whyInvestmentNeed || "",
        securities: info.securities || "",
        howMaintain: info.howMaintain || "",
        howDidYouKnowAboutUs: info.howDidYouKnowAboutUs || "",
        aboutBusiness: info.aboutBusiness || "",
      });
    }
  }, [info, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 rounded-lg bg-white space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        {formType === "edit" ? "Update" : "Create"} Investor Profile
      </h2>

      {/* Grid: Business and Owner Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Business Name</label>
          <input
            {...register("businessName")}
            className="w-full border rounded p-2"
            placeholder="Enter business name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm">
              {errors.businessName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Owner Name</label>
          <input
            {...register("ownerName")}
            className="w-full border rounded p-2"
            placeholder="Enter owner name"
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
          )}
        </div>
      </div>

      {/* Grid: Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email")}
            className="w-full border rounded p-2"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Mobile</label>
          <input
            {...register("mobile")}
            className="w-full border rounded p-2"
            placeholder="Enter mobile number"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">WhatsApp (Optional)</label>
          <input
            {...register("whatsApp")}
            className="w-full border rounded p-2"
            placeholder="Enter WhatsApp number"
          />
          {errors.whatsApp && (
            <p className="text-red-500 text-sm">{errors.whatsApp.message}</p>
          )}
        </div>
      </div>

      {/* Full-width: Business Address */}
      <div>
        <label className="block mb-1 font-medium">Business Address</label>
        <textarea
          {...register("businessAddress")}
          className="w-full border rounded p-2"
          placeholder="Enter business address"
          rows={3}
        />
        {errors.businessAddress && (
          <p className="text-red-500 text-sm">
            {errors.businessAddress.message}
          </p>
        )}
      </div>

      {/* Grid: Business Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Nature of Business</label>
          <input
            {...register("natureOfBusiness")}
            className="w-full border rounded p-2"
            placeholder="Enter nature of business"
          />
          {errors.natureOfBusiness && (
            <p className="text-red-500 text-sm">
              {errors.natureOfBusiness.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Size of Business</label>
          <input
            type="number"
            {...register("sizeOfBusiness")}
            className="w-full border rounded p-2"
            placeholder="Enter size of business"
          />
          {errors.sizeOfBusiness && (
            <p className="text-red-500 text-sm">
              {errors.sizeOfBusiness.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Revenue Per Month</label>
          <input
            type="number"
            {...register("revenuePerMonth")}
            className="w-full border rounded p-2"
            placeholder="Enter monthly revenue"
          />
          {errors.revenuePerMonth && (
            <p className="text-red-500 text-sm">
              {errors.revenuePerMonth.message}
            </p>
          )}
        </div>
      </div>

      {/* Grid: Online Presence */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">
            Facebook URL (Optional)
          </label>
          <input
            {...register("facebook")}
            className="w-full border rounded p-2"
            placeholder="Enter Facebook URL"
          />
          {errors.facebook && (
            <p className="text-red-500 text-sm">{errors.facebook.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Website URL (Optional)
          </label>
          <input
            {...register("website")}
            className="w-full border rounded p-2"
            placeholder="Enter website URL"
          />
          {errors.website && (
            <p className="text-red-500 text-sm">{errors.website.message}</p>
          )}
        </div>
      </div>

      {/* Grid: Investment Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">
            Asking Investment Amount
          </label>
          <input
            type="number"
            {...register("askingInvestmentAmount")}
            className="w-full border rounded p-2"
            placeholder="Enter investment amount"
          />
          {errors.askingInvestmentAmount && (
            <p className="text-red-500 text-sm">
              {errors.askingInvestmentAmount.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Investment Duration</label>
          <input
            type="number"
            {...register("investmentDuration")}
            className="w-full border rounded p-2"
            placeholder="Enter duration (months)"
          />
          {errors.investmentDuration && (
            <p className="text-red-500 text-sm">
              {errors.investmentDuration.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Expected ROI</label>
          <input
            type="number"
            {...register("expectedRoi")}
            className="w-full border rounded p-2"
            placeholder="Enter expected ROI"
          />
          {errors.expectedRoi && (
            <p className="text-red-500 text-sm">{errors.expectedRoi.message}</p>
          )}
        </div>
      </div>

      {/* Full-width: Investment Purpose */}
      <div>
        <label className="block mb-1 font-medium">
          Why Investment is Needed
        </label>
        <textarea
          {...register("whyInvestmentNeed")}
          className="w-full border rounded p-2"
          placeholder="Explain why investment is needed"
          rows={4}
        />
        {errors.whyInvestmentNeed && (
          <p className="text-red-500 text-sm">
            {errors.whyInvestmentNeed.message}
          </p>
        )}
      </div>

      {/* Full-width: Securities */}
      <div>
        <label className="block mb-1 font-medium">Securities</label>
        <textarea
          {...register("securities")}
          className="w-full border rounded p-2"
          placeholder="Enter securities information"
          rows={4}
        />
        {errors.securities && (
          <p className="text-red-500 text-sm">{errors.securities.message}</p>
        )}
      </div>

      {/* Full-width: Maintenance Plan */}
      <div>
        <label className="block mb-1 font-medium">Maintenance Plan</label>
        <textarea
          {...register("howMaintain")}
          className="w-full border rounded p-2"
          placeholder="Enter maintenance plan"
          rows={4}
        />
        {errors.howMaintain && (
          <p className="text-red-500 text-sm">{errors.howMaintain.message}</p>
        )}
      </div>

      {/* Full-width: Source Information */}
      <div>
        <label className="block mb-1 font-medium">
          How Did You Know About Us
        </label>
        <input
          {...register("howDidYouKnowAboutUs")}
          className="w-full border rounded p-2"
          placeholder="Enter source information"
        />
        {errors.howDidYouKnowAboutUs && (
          <p className="text-red-500 text-sm">
            {errors.howDidYouKnowAboutUs.message}
          </p>
        )}
      </div>

      {/* Full-width: Business Description */}
      <div>
        <label className="block mb-1 font-medium">About Business</label>
        <textarea
          {...register("aboutBusiness")}
          className="w-full border rounded p-2"
          placeholder="Enter business description"
          rows={4}
        />
        {errors.aboutBusiness && (
          <p className="text-red-500 text-sm">{errors.aboutBusiness.message}</p>
        )}
      </div>

      {/* ✅ Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting
          ? "Submitting..."
          : formType === "edit"
          ? "Update Investor Request"
          : "Create Investor Request"}
      </button>
    </form>
  );
};

export default InvestorForm;
