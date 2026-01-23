"use client";
import React, { useRef, useState, ChangeEvent, useEffect } from "react";

import { baseUrl } from "@/utils/baseUrl";
import { Button } from "antd";

//icons
import { AiOutlineCloudUpload } from "react-icons/ai";

interface ComponentProps {
  image?: any;
  setImage: (arg: any) => void;
  existImage?: string;
  label?: string;
}

const SingleFileUpload: React.FC<ComponentProps> = ({
  image,
  setImage,
  existImage,
  label,
}) => {
  const [previewImage, setPreviewImage] = useState<any>();
  const fileInputRef = useRef<any>("<input type='file' accept='image/*' />");

  const handleImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target.files?.[0] || null;

    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  return (
    <div>
      <p className="text-sm font-medium text-gray-600">
        {label || "Upload Photo :"}
      </p>

      <div
        style={{
          margin: ".5rem 0rem",
          display: "flex",
          alignItems: "end",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "8rem",
            padding: ".2rem",
            borderRadius: "5px",
            border: "2px solid #e6e6e6",
          }}
        >
          <img
            src={
              previewImage
                ? previewImage
                : existImage
                ? `${baseUrl}/uploads/photos/${existImage}`
                : "/icons/uploadIcon.png"
            }
            style={{
              width: "100%",
              height: "6rem",
              objectFit: "contain",
            }}
            alt="Upload_Image"
          />
        </div>
        <input
          onChange={handleImageSelected}
          ref={fileInputRef}
          style={{ display: "none" }}
          type="file"
          accept="/*image/"
        />
        <Button
          //   size="small"
          onClick={() => fileInputRef.current.click()}
          style={{
            marginTop: ".5rem",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <AiOutlineCloudUpload />
          {existImage ? "Change Photo" : image ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>
    </div>
  );
};

export default SingleFileUpload;