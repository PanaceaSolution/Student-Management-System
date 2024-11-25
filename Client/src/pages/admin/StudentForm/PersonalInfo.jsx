import React from "react";
import ImageUploader from "@/components/common/ImageUploader";
const PersonalInfo = ({ register, errors, clearErrors,getValues }) => {
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Personal Info</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
        {[
          { name: "fname", label: "First Name*" },
          { name: "lname", label: "Last Name*" },
          { name: "fatherName", label: "Father Name*" },
          { name: "motherName", label: "Mother Name*" },
          { name: "guardianName", label: "GuardianName*" },
          { name: "religion", label: "Religion*" },
          { name: "registrationNumber", label: "Registration-Number*" },
          { name: "previousSchool", label: "Previous-School*" },
          { name: "phoneNumber", label: "Phone Number*" },
          { name: "alternatePhoneNumber", label: "Alternate-PhoneNumber" },
          { name: "telephoneNumber", label: "Tele-phoneNumber" },
          { name: "rollNumber", label: "Roll-Number*" },

          { name: "email", label: "Email*", type: "email" },

          {
            name: "section",
            label: "Section*",
            type: "select",
            options: ["A", "B", "C", "D", "E", "F", "G", "H"],
          },
          {
            name: "gender",
            label: "Gender*",
            type: "select",
            options: ["MALE", "FEMALE", "OTHERS"],
          },

          {
            name: "bloodType",
            label: "Blood Type*",
            type: "select",
            options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          },
          {
            name: "studentClass",
            label: "Class*",
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
            name: "transportationMode",
            label: "Transportation Mode",
            type: "select",
            options: ["BUS", "WALK"],
          },
          {
            name: "dob",
            label: "Date of Birth*",
            type: "date",
          },
          {
            name: "admissionDate",
            label: "Admission Date*",
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
                type={field.type === "date" ? "date" : field.type}
                {...register(field.name, {
                  required: `${field.label} is required`,
                  pattern: field.type === "email" && {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Please enter a valid email address",
                  },
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
      <ImageUploader
        name="profilePicture"
        getValues={getValues}
        register={register}
        errors={errors}
        clearErrors={clearErrors}
      />
    </div>
  );
};

export default PersonalInfo;
