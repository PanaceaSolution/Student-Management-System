import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Upload, X } from 'lucide-react';


const StaffInfo = ({
   register,
   errors,
   user,
   handleFileChange,
   profilePic,
   removeFile,
   clearErrors
}) => {
   const formFields = [
      {
         name: "fname",
         label: "First Name",
         required: "First Name is required",
         placeholder: "Enter First Name",
         type: "text",
         condition: true,
      },
      {
         name: "lname",
         label: "Last Name",
         required: "Last Name is required",
         placeholder: "Enter Last Name",
         type: "text",
         condition: true,
      },
      {
         name: "email",
         label: "Email",
         required: "Email is required",
         placeholder: "Enter Email",
         type: "email",
         condition: true,
      },
      {
         name: "phoneNumber",
         label: "Phone",
         required: "Phone is required",
         placeholder: "Enter Phone",
         type: "number",
         condition: true,
      },
      {
         name: "gender",
         label: "Gender",
         required: "Gender is required",
         placeholder: "Select Gender",
         type: "select",
         options: ["Male", "Female", "Other"],
         condition: true,
      },
      {
         name: "bloodType",
         label: "Blood Type",
         required: "Blood Type is required",
         placeholder: "Select Blood Type",
         type: "select",
         options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
         condition: true,
      },
      {
         name: "salary",
         label: "Salary",
         required: "Salary is required",
         placeholder: "Enter Salary",
         type: "number",
         condition: true,
      },
      {
         name: "role",
         label: "Role",
         required: "Role is required",
         placeholder: "Select Role",
         type: "select",
         options: ["Accountant", "Librarian", "Janitor"],
         condition: user !== "Teacher",
      },
      {
         name: "dob",
         label: "Date of Birth",
         required: "Date of Birth is required",
         type: "date",
         condition: true,
      },
      {
         name: "enrollDate",
         label: "Enrollment Date",
         required: "Enrollment Date is required",
         type: "date",
         condition: true,
      }

   ];
   return (
      <div className='space-y-6'>
         <div className="grid grid-cols-2 gap-4 mb-4">
            {formFields.map((field, index) =>
               field.condition && (
                  <div key={index}>
                     <Label htmlFor={field.name} className="block text-sm font-medium text-gray-900">{field.label}</Label>
                     {field.type === "select" ? (
                        <select
                           id={field.name}
                           defaultValue=""
                           {...register(field.name, {
                              required: field.required,
                              validate: (value) => value !== "" || "This field is required",
                              onChange: () => clearErrors(field.name),
                           })}
                           className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""
                              }`}
                        >
                           <option value="" disabled>
                              {field.placeholder}
                           </option>
                           {field.options.map((option, idx) => (
                              <option key={idx} value={option}>
                                 {option}
                              </option>
                           ))}
                        </select>
                     ) : (
                        <Input
                           id={field.name}
                           type={field.type}
                           className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""}`}
                           placeholder={field.placeholder}
                           {...register(field.name, {
                              required: field.required,
                           })}
                        />
                     )}
                     {errors[field.name] && (
                        <p className="text-red-600 text-sm">{errors[field.name].message}</p>
                     )}
                  </div>
               )
            )}
         </div>

         {/* Profile Picture Upload */}
         <div>
            <label className="block text-sm font-medium text-gray-900">
               Profile Picture
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
               <div className="text-center">
                  <Upload
                     className="mx-auto h-12 w-12 text-gray-300"
                     aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                     <label
                        htmlFor="profilePic"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                     >
                        <span>Upload a file</span>
                        <input
                           id="profilePic"
                           type="file"
                           accept="image/*"
                           onChange={(e) => {
                              handleFileChange(e);
                              clearErrors("profilePic"); // Clear profilePic error on change
                           }}
                           className="sr-only"
                        />
                     </label>
                  </div>
                  {profilePic && (
                     <div className="relative mt-2">
                        <img
                           src={URL.createObjectURL(profilePic)}
                           alt="Profile Preview"
                           className="mt-2 w-24 h-24 rounded-full object-cover"
                        />
                        <span className="block mt-2">{profilePic.name}</span>
                        <button
                           type="button"
                           onClick={removeFile}
                           className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>
                  )}
                  {errors.profilePic && (
                     <p className="text-red-500 text-sm">
                        {errors.profilePic.message}
                     </p>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default StaffInfo