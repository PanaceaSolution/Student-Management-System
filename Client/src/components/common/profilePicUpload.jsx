import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Upload, X } from "lucide-react";

const ProfilePicUpload = ({ profilePic, setProfilePic, errors, clearErrors }) => {
   const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
         errors.profilePic = { message: "Only image files are allowed" };
         return;
      }

      if (file.size > 2 * 1024 * 1024) {
         errors.profilePic = { message: "File size must be less than 2MB" };
         return;
      }

      setProfilePic(file);
      clearErrors("profilePic");
   };

   const removeFile = () => {
      setProfilePic(null);
      clearErrors("profilePic");
   };

   return (
      <div>
         <Label className="block text-sm font-medium text-gray-900">
            Profile Picture
         </Label>
         <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
               {profilePic ? (
                  <div className="relative mt-2">
                     <img
                        src={
                           typeof profilePic === "string"
                              ? profilePic
                              : URL.createObjectURL(profilePic)
                        }
                        alt="Profile Preview"
                        className="mt-2 w-24 h-24 rounded-full object-cover"
                     />
                     <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-0 right-0 p-1 bg-white text-red-500 border rounded-full"
                     >
                        <X className="h-4 w-4" />
                     </button>
                     {typeof profilePic !== "string" ? (
                        <span className="block mt-2">{profilePic.name}</span>
                     ) : (
                        <span>{profilePic.split("/").pop()}</span>
                     )
                     }
                  </div>
               ) : (
                  <>
                     <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                     <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <Label
                           htmlFor="profilePic"
                           className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                           <span>Upload a file</span>
                           <Input
                              id="profilePic"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                           />
                        </Label>
                     </div>
                  </>
               )}
               {errors.profilePic && <p className="text-red-500 text-sm">{errors.profilePic.message}</p>}
            </div>
         </div>
      </div>
   );
};

export default ProfilePicUpload;