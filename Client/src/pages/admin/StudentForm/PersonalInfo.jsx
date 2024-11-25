import React from "react";
import { Input } from "@/components/ui/input";
import { AtSign, CircleDollarSign, Phone, Smartphone, SquareUser, SquareUserRound, User } from 'lucide-react';
import { Label } from "@/components/ui/label";

const PersonalInfo = ({ register, errors, clearErrors }) => {
  const formFields = [
    {
      name: "fname",
      label: "First Name*",
      required: "First Name is required",
      placeholder: "Enter First Name",
      type: "text",
      icon: <User size={20} />
    },
    {
      name: "lname",
      label: "Last Name*",
      required: "Last Name is required",
      placeholder: "Enter Last Name",
      type: "text",
      icon: <User size={20} />
    },
    {
      name: "fatherName",
      label: "Father Name*",
      required: "Father Name is required",
      placeholder: "Enter Father Name",
      type: "text",
      icon: <User size={20} />
    },
    {
      name: "motherName",
      label: "Mother Name*",
      required: "Mother Name is required",
      placeholder: "Enter Mother Name",
      type: "text",
      icon: <User size={20} />
    },
    {
      name: "guardianName",
      label: "GuardianName*",
      required: "Guardian Name is required",
      placeholder: "Enter Guardian Name",
      type: "text",
      icon: <User size={20} />
    },
    {
      name: "religion",
      label: "Religion*",
      required: "Religion is required",
      placeholder: "Enter Religion",
      type: "text",
      icon: <SquareUser size={20} />
    },
    {
      name: "gender",
      label: "Gender*",
      required: "Gender is required",
      placeholder: "Select Gender",
      type: "select",
      options: ["MALE", "FEMALE", "OTHER"],
    },
    {
      name: "bloodType",
      label: "Blood Type*",
      required: "Blood Type is required",
      placeholder: "Select Blood Type",
      type: "select",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    {
      name: "registrationNumber",
      label: "Registration-Number*",
      required: "Registration-Number is required",
      placeholder: "Enter Registration-Number",
      type: "text",
      icon: <SquareUserRound size={20} />
    },
    {
      name: "previousSchool",
      label: "Previous-School*",
      required: "Previous-School is required",
      placeholder: "Enter Previous-School",
      type: "text",
      icon: <SquareUser size={20} />
    },
    {
      name: "rollNumber",
      label: "Roll-Number*",
      required: "Roll-Number is required",
      placeholder: "Enter Roll-Number",
      type: "text",
      icon: <CircleDollarSign size={20} />
    },
    {
      name: "email",
      label: "Email*",
      required: "Email is required",
      placeholder: "Enter Email",
      type: "email",
      icon: <AtSign size={20} />
    },
    {
      name: "studentClass",
      label: "Class*",
      required: "Class is required",
      placeholder: "Select Class",
      type: "select",
      options: ["Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
      ],
    },
    {
      name: "section",
      label: "Section*",
      required: "Section is required",
      placeholder: "Select Section",
      type: "select",
      options: ["A", "B", "C"],
    },
    {
      name: "phoneNumber",
      label: "Phone*",
      required: "Phone is required",
      placeholder: "Enter Phone",
      type: "text",
      icon: <Smartphone size={20} />
    },
    {
      name: "alternatePhoneNumber",
      label: "Alternate Phone Number",
      placeholder: "Enter Alternate Phone Number",
      type: "text",
      icon: <Smartphone size={20} />
    },
    {
      name: 'telephoneNumber',
      label: 'Telephone Number',
      placeholder: 'Enter Telephone Number',
      type: 'text',
      icon: <Phone size={20} />
    },
    {
      name: "transportationMode",
      label: "Transportation Mode",
      placeholder: "Select Transportation Mode",
      type: "select",
      options: ["BUS", "WALK"],
    },
    {
      name: "dob",
      label: "Date of Birth*",
      required: "Date of Birth is required",
      type: "date",
    },
    {
      name: "admissionDate",
      label: "Admission Date*",
      required: "Admission Date is required",
      type: "date",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {formFields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
              {field.label}
            </Label>
            <div className="relative">
              {field.icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  {field.icon}
                </div>
              )}
              {field.type === "select" ? (
                <select
                  id={field.name}
                  defaultValue=""
                  {...register(field.name, {
                    required: field.required,
                    // validate: (value) => value !== "",
                    onChange: () => clearErrors(field.name),
                  })}
                  className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""
                    } ${field.icon ? 'pl-10' : ''}`}
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {field.options && field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""} ${field.icon ? 'pl-10' : ''}`}
                  placeholder={field.placeholder}
                  {...register(field.name, {
                    required: field.required,
                  })}
                />
              )}
            </div>
            {errors[field.name] && (
              <p className="text-red-600 text-sm">{errors[field.name].message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;
