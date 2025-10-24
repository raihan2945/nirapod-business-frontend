"use client";

import React, { useEffect, useState } from "react";
import InputV1 from "@/components/Input/InputV1";
import { SubmitHandler, useForm } from "react-hook-form";
import SingleFileUpload from "@/components/Input/SingleFileUpload";
import { Button } from "antd";
import SelectInput from "@/components/Input/SelectInput";
import { useCreateNewBikeMutation, useUpdateBikeByIdMutation } from "@/state/features/blogs/blogsApi";
import { useAPIResponseHandler } from "@/contexts/ApiResponseHandlerContext";
import CheckAccess from "@/utils/checkAccess";
import useCheckAccess from "@/utils/checkAccess";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

interface SelectTypes {
  value: string;
  name: string;
}

type FormValues = {
  brand: string;
  lastName: string;
  email: string;
};

interface ComponentProps {
  modalCancel: any;
  formType?: string;
  info?: any
}

const AddBike: React.FC<ComponentProps> = ({ modalCancel, formType, info }) => {
  const user = useSelector((state: RootState) => state?.user?.data);

  const { register, handleSubmit, getValues, setValue, setError, setFocus, formState: { errors } } = useForm<any>();

  const { hasAccess } = useCheckAccess()

  const { handleResponse } = useAPIResponseHandler()

  const [image, setImage] = useState<any>();

  const [CreateNew] = useCreateNewBikeMutation();
  const [UpdateOne] = useUpdateBikeByIdMutation()

  const onSubmit = async () => {
    const data: any = getValues();

    const submitData: any = {}

    Object.keys(data).map((key: string) => {
      if (data[key]) {
        console.log(data[key])
        submitData[key] = data[key]
      }
    });

    delete submitData.id
    delete submitData.created_by
    delete submitData.updated_by
    delete submitData.createdAt
    delete submitData.updatedAt

    // console.log("Data is : ", submitData);

    const form = new FormData();

    Object.keys(submitData).forEach((key) => {
      if (submitData[key]) {
        form.append(key, submitData[key]);
        submitData[key] = submitData[key];
      }
    });
    if (image) {
      form.append("photo", image);
    }


    let res: any;

    if (info?.id) {
      form.append('updated_by', user?.id || '');
      res = await UpdateOne({ id: info?.id, data: form })
    } else {
      form.append('created_by', user?.id || '');
      res = await CreateNew({ data: form })
    }

    const result: any = handleResponse(res);

    if (result?.code == 400 && result?.form_errors) {
      result?.form_errors?.map((err: any, index: number) => {
        setError(`${err?.path[0]}`, {
          type: "manual",
          message: `${err?.path[0].toUpperCase()} is ${err?.message}`,
        });

        if (index == 0) {
          setFocus(`${err?.path[0]}`);
        }
      })
    }

    // if (refetchDriver) {
    //   refetchDriver()
    // }
    // if (refetchDrivers) {
    //   refetchDrivers()
    // }
    if (result?.code == 201) {
      modalCancel()
    }
    if (result?.code == 200) {
      modalCancel()
    }

  };

  useEffect(() => {

    if (info) {
      Object.keys(info).map((key: any) => {
        if (info[key]) {
          setValue(`${key}`, info[key])
        }
      })

    }

  }, [info]);

  const carTypes: SelectTypes[] = [
    {
      name: "Individual",
      value: "individual",
    },
    {
      name: "Special",
      value: "special",
    },
  ];

  const logoPermissionTypes: SelectTypes[] = [
    {
      name: "Yes",
      value: "Yes",
    },
    {
      name: "No",
      value: "no",
    },
  ];


  return (
    <div className="pt-2">
      <form>
        <div className="grid gap-3 mb-6 md:grid-cols-2">
          <InputV1 name="brand" label="Brand" register={register("brand")} errors={errors} />
          <SelectInput
            label="Bike Type"
            name="bike_type"
            items={carTypes}
            register={register("bike_type")}
            errors={errors}
          />
          <InputV1
            name="engine_capacity"
            label="Engine Capacity (CC)"
            type="number"
            register={register("engine_capacity")}
            errors={errors}
          />
          <InputV1
            name="model"
            label="Model"
            register={register("model")}
            errors={errors}
          />
          <InputV1
            name="chassis_number"
            // type="number"
            label="Chassis Number"
            register={register("chassis_number")}
            errors={errors}
          />
          <InputV1
            name="reg_number"
            label="Reg. Number"
            register={register("reg_number")}
            errors={errors}
          />
          <InputV1
            name="reg_year"
            type="date"
            label="Registration Date"
            register={register("reg_year")}
            errors={errors}
          />
          <InputV1 name="color" label="Color" register={register("color")} errors={errors} />

          <InputV1
            name="milage"
            label="Milage"
            register={register("milage")}
            errors={errors}
          />
          <InputV1
            name="tax_token_validity"
            type="date"
            label="Tax Token Validity"
            register={register("tax_token_validity")}
            errors={errors}
          />
          <InputV1
            name="reg_validity"
            type="date"
            label="Registration Validity"
            register={register("reg_validity")}
            errors={errors}
          />
            <InputV1
            name="insurance"
            label="Insurance"
            register={register("insurance")}
            errors={errors}
          />
          <InputV1
            name="insurance_validity"
            label="Insurance Validity"
            type="date"
            register={register("insurance_validity")}
            errors={errors}
          />

        </div>

        <div className="mt-2">
          <SingleFileUpload
            label="Bike Image"
            image={image}
            setImage={setImage}
            existImage={info?.photo}
          />
        </div>
      </form>
      {
        hasAccess(["bike_management"]) &&
        <div className="flex justify-end gap-2">
          <Button onClick={modalCancel}>Cancel</Button>
          <Button onClick={() => onSubmit()} htmlType="submit" type="primary">
            {formType === "edit" ? "Update" : "Create"}
          </Button>
        </div>
      }
    </div>
  );
};

export default AddBike;
