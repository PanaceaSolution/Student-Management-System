import React, { useState } from "react";
import { Upload, X } from "lucide-react";

const DocumentUpload = ({ register, setDocuments, documents, errors }) => {
  const handleFileChange = (name) => (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the file in documents state (this is what react-hook-form uses for submission)
      setDocuments((prev) => ({ ...prev, [name]: file }));
    }
  };
  console.log(documents);


  const removeFile = (name) => {
    // Remove the file from documents state
    setDocuments((prev) => ({ ...prev, [name]: null }));
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    // Handle image files
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="File Preview"
          className="mt-2 w-24 h-24 object-cover rounded"
        />
      );
    }

    // Handle PDF files
    if (file.type === "application/pdf") {
      return (
        <span className="text-sm text-gray-600 mt-2">{file.name}</span>
      );
    }

    // For other document types, just show the file name
    return <span className="text-sm text-gray-600 mt-2">{file?.name}</span>;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Documents</h2>
      <div className="space-y-4">
        {[
          { name: "birthCertificate", label: "Birth Certificate (optional)" },
          { name: "citizenship", label: "Citizenship Document (optional)" },
          { name: "marksheet", label: "10th Class Marksheet (optional)" },
        ].map((doc) => (
          <div key={doc.name}>
            <label className="block text-sm font-medium text-gray-900">{doc.label}</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                {documents[doc.name] ? (
                  <div className="relative mt-2">
                    {documents[doc.name].type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(documents[doc.name])}
                        alt={`${doc.label} Preview`}
                        className="mt-2 w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <span>{documents[doc.name].name}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(doc.name)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor={doc.name}
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id={doc.name}
                          name={doc.name}
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={handleFileChange(doc.name)}
                          className="sr-only"
                          {...register(doc.name)} // Registering with react-hook-form
                        />
                      </label>
                    </div>
                  </div>
                )}
                {errors[doc.name] && (
                  <span className="text-red-500 text-sm">{errors[doc.name].message}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUpload;
