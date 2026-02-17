import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// Adjust import path based on your setup
import { baseUrl } from "@/utils/baseUrl";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import {
  useCreateNewUserMutation,
  useUpdateUserMutation,
} from "@/state/features/user/userApi";

// ✅ Zod schema for User
export const createUserDTOSchema = z.object({
  fullName: z.string(),
  mobile: z.string(), // Example phone regex
  email: z.union([z.literal(""), z.string().email()]),
  photo: z.any().optional().nullable(), // Adjusted to handle File for form
  address: z.string().optional().nullable(),
  password: z.string(),
  role: z.enum(["user", "investor", "admin"]).default("user"),
  permissions: z.array(z.string()).optional().default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  verifyStatus: z.enum(["PENDING", "APPROVED", "CANCELLED"]).optional(),
});

type UserFormData = z.infer<typeof createUserDTOSchema>;

interface ComponentProps {
  modalCancel: () => void;
  formType?: "create" | "edit";
  info?: any;
  isAdmin?: boolean;
}

const PermissionsInputSection = ({
  control,
  register,
  name,
  label,
  errors,
}: {
  control: any;
  register: any;
  name: keyof UserFormData;
  label: string;
  errors: any;
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-700">{label}</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-7 gap-2 items-start mb-2">
          <div className="col-span-6">
            <input
              {...register(`${name}.${index}` as const)}
              placeholder="Permission (e.g., read, write)"
              className="w-full border rounded p-2"
            />
            {errors?.[name]?.[index] && (
              <p className="text-red-500 text-sm">
                {errors[name][index].message || "Invalid permission"}
              </p>
            )}
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
        onClick={() => append("")}
        className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add {label}
      </button>
    </div>
  );
};

const UserForm: React.FC<ComponentProps> = ({
  formType,
  info,
  modalCancel,
  isAdmin
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { handleResponse } = useAPIResponseHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNew] = useCreateNewUserMutation();
  const [updateOne] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    control,
  } = useForm<UserFormData>({
    resolver: zodResolver(createUserDTOSchema) as any,
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      photo: null,
      address: "",
      password: "",
      role: "user",
      permissions: [],
      status: "ACTIVE",
      ...info,
    },
  });

  // ✅ Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("photo", file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ On form submit
  const onSubmit = async (data: UserFormData) => {
    console.log("Submitting Data:", data);
    setIsSubmitting(true);

    try {
      // const formData = new FormData();

      // Append all fields
      // Object.keys(data).forEach((key) => {
      //   const value = data[key as keyof UserFormData];
      //   if (key === "photo" && value instanceof File) {
      //     formData.append("photo", value);
      //   } else if (key === "permissions" && Array.isArray(value)) {
      //     formData.append(key, JSON.stringify(value));
      //   } else {
      //     formData.append(key, value != null ? String(value) : "");
      //   }
      // });

      // Log FormData for debugging
      // for (const [key, value] of formData.entries()) {
      //   console.log(`FormData: ${key} = ${value}`);
      // }

      let res;
      if (formType === "edit" && info?.id) {
        res = await updateOne({ id: info.id, data: data });
      } else {
        res = await createNew({ data: data });
      }

      handleResponse(res);
      modalCancel();
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Failed to submit user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Initialize form when editing
  useEffect(() => {
    if (info) {
      console.log("info:", info);

      // Handle photo
      if (info.photo) {
        setPhotoPreview(`${baseUrl}/uploads/photos/${info.photo}`);
      }

      // Handle permissions
      if (info.permissions) {
        let parsedPermissions;
        try {
          parsedPermissions =
            typeof info.permissions === "string"
              ? JSON.parse(info.permissions)
              : info.permissions;
          if (!Array.isArray(parsedPermissions)) {
            console.warn("Permissions is not an array:", parsedPermissions);
            parsedPermissions = [];
          }
        } catch (error) {
          console.error("Error parsing permissions:", error);
          parsedPermissions = [];
        }
        reset((prev) => ({ ...prev, permissions: parsedPermissions }));
      }

      // Reset other fields
      reset((prev) => ({
        ...prev,
        fullName: info.fullName || "",
        mobile: info.mobile || "",
        email: info.email || "",
        address: info.address || "",
        password: info.password || "",
        role: info.role || "user",
        status: info.status || "ACTIVE",
        photo: info.photo || null,
      }));
    }
  }, [info, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md bg-white space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        {formType === "edit" ? "Update" : "Create"} User
      </h2>

      {/* 🧾 Full Name */}
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          {...register("fullName")}
          className="w-full border rounded p-2"
          placeholder="Enter full name"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* 📱 Mobile */}
      <div>
        <label className="block mb-1 font-medium">Mobile</label>
        <input
          {...register("mobile")}
          className="w-full border rounded p-2"
          placeholder="Enter mobile number (e.g., +1234567890)"
        />
        {errors.mobile && (
          <p className="text-red-500 text-sm">{errors.mobile.message}</p>
        )}
      </div>

      {/* 📧 Email */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          {...register("email")}
          className="w-full border rounded p-2"
          placeholder="Enter email (optional)"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* 🏠 Address */}
      <div>
        <label className="block mb-1 font-medium">Address</label>
        <textarea
          {...register("address")}
          className="w-full border rounded p-2"
          placeholder="Enter address (optional)"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>

      {/* 🔑 Password */}
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full border rounded p-2"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* 🧑‍💼 Role */}
      <div>
        <label className="block mb-1 font-medium">Role</label>
        <select {...register("role")} className="w-full border rounded p-2">
          <option value="user">User</option>
          <option value="investor">Investor</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}
      </div>

      {/* ✅ Status */}
      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select {...register("status")} className="w-full border rounded p-2">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>
      {/* ✅ Status */}
      {isAdmin && (
        <div>
          <label className="block mb-1 font-medium">Verify Status</label>
          <select
            {...register("verifyStatus")}
            className="w-full border rounded p-2"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>
      )}

      {/* 🔐 Permissions */}
      {/* <PermissionsInputSection
        control={control}
        register={register}
        name="permissions"
        label="Permissions"
        errors={errors}
      /> */}

      {/* 📸 Photo */}
      {/* <div>
        <label className="block mb-1 font-medium">Profile Photo</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Preview"
            className="mt-2 w-40 h-40 object-cover rounded-lg border"
          />
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
            ? "Update User"
            : "Create User"}
      </button>
    </form>
  );
};

export default UserForm;
