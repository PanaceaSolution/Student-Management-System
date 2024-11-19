import React from "react";
import { Upload, X } from "lucide-react";

const StaffDocumentUpload = ({ setDocuments, documents, errors, documentFields }) => {
   const handleFileChange = (name) => (e) => {
      const file = e.target.files[0];
      if (file) {
         setDocuments((prev) => ({ ...prev, [name]: file }));
      }
   };

   const removeFile = (name) => {
      setDocuments((prev) => ({ ...prev, [name]: null }));
   };

   return (
      <div className="space-y-6">
         <h2 className="text-2xl font-semibold text-gray-800">Documents</h2>
         <div className="space-y-4">
            {documentFields.map((doc) => (
               <div key={doc.name}>
                  <label className="block text-sm font-medium text-gray-900">{doc.label}</label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                     <div className="text-center">
                        {documents[doc.name] ? (
                           <div className="relative">
                              {typeof documents[doc.name] === "string" ? (
                                 // If the value is a URL, display it as a link
                                 documents[doc.name].endsWith(".pdf") ? (
                                    <a
                                       href={documents[doc.name]}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-indigo-600"
                                    >
                                       {documents[doc.name].split("/").pop()}
                                    </a>
                                 ) : (
                                    // Handle image URLs
                                    <div className="flex flex-col justify-center items-center">
                                       <img
                                          src={documents[doc.name]}
                                          alt={`${doc.label} Preview`}
                                          className="my-2 w-24 h-24 object-cover rounded"
                                       />
                                       <span>{documents[doc.name].split("/").pop()}</span>
                                    </div>
                                 )
                              ) : (
                                 // If it's a file object, render it accordingly
                                 <div className=" mt-2">
                                    {documents[doc.name]?.type?.startsWith("image/") ? (
                                       <>
                                          <img
                                             src={URL.createObjectURL(documents[doc.name])}
                                             alt={`${doc.label} Preview`}
                                             className="mt-2 w-24 h-24 object-cover rounded"
                                          />
                                          <span>{documents[doc.name].name}</span>
                                       </>
                                    ) : (
                                       <span>{documents[doc.name].name}</span>
                                    )}
                                 </div>
                              )}
                              <button
                                 type="button"
                                 onClick={() => removeFile(doc.name)}
                                 className="absolute -top-4 -right-3 p-1 bg-red-500 text-white rounded-full"
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

export default StaffDocumentUpload;
