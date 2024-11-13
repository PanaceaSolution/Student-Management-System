
import React, { useState } from "react";
import districtData from "../../../assets/Districtdata.json"

const AddressInfo = ({ clearErrors, register, errors }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Get the list of provinces
  const provinces = districtData.provinceList.map((province) => province.name);

  // Get the list of districts for the selected province
  const districts = districtData.provinceList.find(
    (province) => province.name === selectedProvince
  )?.districtList || [];

  // Get the list of municipalities for the selected district
  const municipalities = districts.find(
    (district) => district.name === selectedDistrict
  )?.municipalityList || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Address Info</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        
        {/* Permanent Address */}
        <div className="sm:col-span-3">
          <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-900">
            Permanent Address
          </label>
          <input
            id="permanentAddress"
            type="text"
            {...register("permanentAddress", {
              required: "Permanent Address is required",
              onChange: () => clearErrors("permanentAddress"),
            })}
            className={`mt-1 block w-full rounded-md border ${errors.permanentAddress ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            placeholder="Enter Permanent Address"
          />
          {errors.permanentAddress && <p className="text-red-500 text-sm">{errors.permanentAddress.message}</p>}
        </div>

        {/* Temporary Address */}
        <div className="sm:col-span-3">
          <label htmlFor="temporaryAddress" className="block text-sm font-medium text-gray-900">
            Temporary Address
          </label>
          <input
            id="temporaryAddress"
            type="text"
            {...register("temporaryAddress", {
              required: "Temporary Address is required",
              onChange: () => clearErrors("temporaryAddress"),
            })}
            className={`mt-1 block w-full rounded-md border ${errors.temporaryAddress ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            placeholder="Enter Temporary Address"
          />
          {errors.temporaryAddress && <p className="text-red-500 text-sm">{errors.temporaryAddress.message}</p>}
        </div>

        {/* Village Name */}
        <div className="sm:col-span-3">
          <label htmlFor="villageName" className="block text-sm font-medium text-gray-900">
            Village Name
          </label>
          <input
            id="villageName"
            type="text"
            {...register("villageName", {
              required: "Village Name is required",
              onChange: () => clearErrors("villageName"),
            })}
            className={`mt-1 block w-full rounded-md border ${errors.villageName ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            placeholder="Enter Village Name"
          />
          {errors.villageName && <p className="text-red-500 text-sm">{errors.villageName.message}</p>}
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="villageName" className="block text-sm font-medium text-gray-900">
          wardNumber
          </label>
          <input
            id="wardNumber"
            type="number"
            {...register("wardNumber", {
              required: "wardNumber is required",
              onChange: () => clearErrors("wardNumber"),
            })}
            className={`mt-1 block w-full rounded-md border ${errors.villageName ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            placeholder="Enter Village Name"
          />
          {errors.wardNumber && <p className="text-red-500 text-sm">{errors.wardNumber.message}</p>}
        </div>

        {/* Religion */}
        <div className="sm:col-span-3">
          <label htmlFor="religion" className="block text-sm font-medium text-gray-900">
            Religion
          </label>
          <input
            id="religion"
            type="text"
            {...register("religion", {
              required: "Religion is required",
              onChange: () => clearErrors("religion"),
            })}
            className={`mt-1 block w-full rounded-md border ${errors.religion ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            placeholder="Enter Religion"
          />
          {errors.religion && <p className="text-red-500 text-sm">{errors.religion.message}</p>}
        </div>

        {/* Nationality */}
        <div className="sm:col-span-3">
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-900">
            Nationality
          </label>
          <input
            id="nationality"
            type="text"
            {...register("nationality", {
              required: "Nationality is required",
              onChange: () => clearErrors("nationality"),
            })}
            className={`mt-1 block w-full rounded-md border ${errors.nationality ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            placeholder="Enter Nationality"
          />
          {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality.message}</p>}
        </div>

        {/* Province Selection */}
        <div className="sm:col-span-3">
          <label htmlFor="province" className="block text-sm font-medium text-gray-900">
            Province
          </label>
          <select
            id="province"
            {...register("province", {
              required: "Province is required",
              onChange: (e) => {
                clearErrors("province");
                setSelectedProvince(e.target.value);
                setSelectedDistrict(""); 
              },
            })}
            className={`mt-1 block w-full rounded-md border ${errors.province ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          {errors.province && <p className="text-red-500 text-sm">{errors.province.message}</p>}
        </div>

        {/* District Selection */}
        <div className="sm:col-span-3">
          <label htmlFor="district" className="block text-sm font-medium text-gray-900">
            District
          </label>
          <select
            id="district"
            {...register("district", {
              required: "District is required",
              onChange: (e) => {
                clearErrors("district");
                setSelectedDistrict(e.target.value);
              },
            })}
            className={`mt-1 block w-full rounded-md border ${errors.district ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            disabled={!selectedProvince}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
        </div>

        {/* Municipality Selection */}
        <div className="sm:col-span-3">
          <label htmlFor="municipality" className="block text-sm font-medium text-gray-900">
            Municipality
          </label>
          <select
            id="municipality"
            {...register("municipality", {
              required: "Municipality is required",
              onChange: () => clearErrors("municipality"),
            })}
            className={`mt-1 block w-full rounded-md border ${errors.municipality ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            disabled={!selectedDistrict}
          >
            <option value="">Select Municipality</option>
            {municipalities.map((municipality) => (
              <option key={municipality.id} value={municipality.name}>
                {municipality.name}
              </option>
            ))}
          </select>
          {errors.municipality && <p className="text-red-500 text-sm">{errors.municipality.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
