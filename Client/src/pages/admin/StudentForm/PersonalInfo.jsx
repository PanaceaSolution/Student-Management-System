// components/PersonalInfo.js
import React from "react";
import { Upload, X } from "lucide-react";

const PersonalInfo = ({
  register,
  errors,
  handleFileChange,
  profilePicture,
  removeFile,
  clearErrors,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Personal Info</h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
        {[
          { name: "fname", label: "First Name" },
          { name: "lname", label: "Last Name" },
          { name: "fatherName", label: "Father Name" },
          { name: "motherName", label: "Mother Name" },
          { name: "guardianName", label: "GuardianName" },
          { name: "registrationNumber", label: "Registration-Number" },
          { name: "previousSchool", label: "Previous-School" },
          { name: "transportationMode", label: "Transportation-Mode" },
          { name: "email", label: "Email" },
          { name: "phoneNumber", label: "Phone Number" },
          { name: "alternatePhoneNumber", label: "Alternate-PhoneNumber" },
          { name: "telephoneNumber", label: "Tele-phoneNumber" },
          { name: "rollNumber", label: "Roll-Number" },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            options: ["MALE", "FEMALE", "OTHERS"],
          },
          {
            name: "bloodType",
            label: "Blood Type",
            type: "select",
            options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          },
          {
            name: "studentClass",
            label: "Class",
            type: "select",
            options: [
              "Nursery",
              "LKG",
              "UKG",
              "Grade I",
              "Grade II",
              "Grade III",
              "Grade IV",
              "Grade VI",
              "Grade VII",
              "Grade VIII",
            ],
          },
          {
            name: "dob",
            label: "Date of Birth",
            type: "date",
          },
          {
            name: "admissionDate",
            label: "Admission Date",
            type: "date",
          },
        ].map((field) => (
          <div className="sm:col-span-3" key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-900"
            >
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                id={field.name}
                {...register(field.name, {
                  required: `${field.label} is required`,
                  onChange: () => clearErrors(field.name),
                })}
                className={`mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type === "date" ? "date" : "text"}
                {...register(field.name, {
                  required: `${field.label} is required`,
                  onChange: () => clearErrors(field.name),
                })}
                className={`mt-1 block w-full rounded-sm border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                placeholder={
                  field.type !== "date" ? `Enter ${field.label}` : ""
                }
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm">
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}
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
                htmlFor="profilePicture"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
            {profilePicture && (
              <div className="relative mt-2">
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile Preview"
                  className="mt-2 w-24 h-24 rounded-full object-cover"
                />
                <span className="block mt-2">{profilePicture.name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {errors.profilePicture && (
              <p className="text-red-500 text-sm">
                {errors.profilePicture.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;