import React from "react";
import ImageUploader from "@/components/common/ImageUploader";

const DocumentUpload = ({ register, errors, clearErrors }) => {
  return (
    <section className="max-w-7xl mx-auto">
      
        {[
          { name: "birthCertificate", label: "Birth Certificate (optional)" },
          { name: "citizenship", label: "Citizenship Document (optional)" },
          { name: "marksheet", label: "10th Class Marksheet (optional)" },
        ].map((doc) => (
          <div
            className="justify-center items-center space-y-2"
            key={doc.name}
          >
            <ImageUploader
              name={doc.name}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
              placeholder="Upload your image"
            />
          </div>
        ))}
      
    </section>
  );
};

export default DocumentUpload;
