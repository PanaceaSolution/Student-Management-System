// components/AddressInfo.js
import React from "react";

const AddressInfo = ({ clearErrors, register, errors }) => {
  const provinces = [
    "Province No. 1",
    "Province No. 2",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Address Info</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {[
          { name: "permanentAddress", label: "Permanent Address" },
          { name: "temporaryAddress", label: "Temporary Address" },
          { name: "city", label: "City" },
          {
            name: "province",
            label: "Province",
            type: "select",
            options: provinces,
          },
          { name: "state", label: "State" },
          { name: "villageName", label: "Village Name" },
          { name: "postalCode", label: "Postal Code", type: "text" },
        ].map((field) => (
          <div className="sm:col-span-3" key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                id={field.name}
                {...register(field.name, {
                  required: `${field.label} is required`,
                  onChange: () => clearErrors(field.name), // Clear error on change
                })}
                className={`mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm ${errors[field.name] ? 'border-red-500' : ''}`}
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
                {...register(field.name, {
                  required: `${field.label} is required`,
                  onChange: () => clearErrors(field.name), 
                })}
                className={`mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm ${errors[field.name] ? 'border-red-500' : ''}`}
                placeholder={`Enter ${field.label}`}
              />
            )}
            {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name].message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressInfo;
