import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Upload, X } from "lucide-react";

const ImageUpload = ({ image, setImage, errors, clearErrors, label }) => {
   const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
         errors.image = { message: "Only image files are allowed" };
         return;
      }

      if (file.size > 2 * 1024 * 1024) {
         errors.image = { message: "File size must be less than 2MB" };
         return;
      }

      setImage(file);
      clearErrors("image");
   };

   const removeFile = () => {
      setImage(null);
      clearErrors("image");
   };

   return (
      <div>
         <Label className="block text-sm font-medium text-gray-900">
            {label}
         </Label>
         <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-500 px-6 py-4">
            <div className="text-center">
               {image ? (
                  <div className="flex flex-col justify-center items-center">
                     <div className="relative mt-2">
                        <img
                           src={
                              typeof image === "string"
                                 ? image
                                 : URL.createObjectURL(image)
                           }
                           alt="Profile Preview"
                           className="mt-2 w-32 h-32 rounded-xl object-cover"
                        />
                        <button
                           type="button"
                           onClick={removeFile}
                           className="absolute -top-1 -right-2 p-1 bg-white text-red-500 border rounded-full"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>
                     {typeof image !== "string" ? (
                        <span className="block mt-2">{image.name}</span>
                     ) : (
                        <span>{image.split("/").pop()}</span>
                     )
                     }
                  </div>
               ) : (
                  <div className="py-10">
                     <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                     <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <Label
                           htmlFor="image"
                           className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                           <span>Upload a file</span>
                           <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                           />
                        </Label>
                     </div>
                  </div>
               )}
               {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>
         </div>
      </div>
   );
};

export default ImageUpload;