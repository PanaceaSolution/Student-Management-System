import React from "react";
import ImageUploader from "@/components/common/ImageUploader";

const DocumentUpload = ({ register, errors, clearErrors }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Documents</h2>
      <div className=" flex flex-wrap justify-center items-center">
        {[
          { name: "birthCertificate", label: "Birth Certificate (optional)" },
          { name: "citizenship", label: "Citizenship Document (optional)" },
          { name: "marksheet", label: "10th Class Marksheet (optional)" },
        ].map((doc) => (
          <div className=" flex justify-center items-center gap-4" key={doc.name}>
            <ImageUploader
              name={doc.name}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
              placeholder="Upload your image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUpload;
