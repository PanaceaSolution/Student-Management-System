// import React, { useState } from "react";
// import districtData from "../../../assets/Districtdata.json";
// const AddressInfo = ({ clearErrors, register, errors,getValues }) => {
//   const [selectedProvince, setSelectedProvince] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");

//   // Get the list of provinces
//   const provinces = districtData.provinceList.map((province) => province.name);

//   // Get the list of districts for the selected province
//   const districts =
//     districtData.provinceList.find(
//       (province) => province.name === selectedProvince
//     )?.districtList || [];

//   // Get the list of municipalities for the selected district
//   const municipalities =
//     districts.find((district) => district.name === selectedDistrict)
//       ?.municipalityList || [];

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Address Info</h2>
//       <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//         {/* Ward Number */}
//         <div className="sm:col-span-3">
//           <label
//             htmlFor="wardNumber"
//             className="block text-sm font-medium text-gray-900"
//           >
//             Ward Number
//           </label>
//           <input
//             id="wardNumber"
//             type="number"
//             {...register("wardNumber", {
//               required: "wardNumber is required",
//               onChange: () => clearErrors("wardNumber"),
//             })}
//             className={`mt-1 block w-full rounded-md border ${
//               errors.villageName ? "border-red-500" : "border-gray-300"
//             } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
//             placeholder="Enter Ward Number"
//           />
//           {errors.wardNumber && (
//             <p className="text-red-500 text-sm">{errors.wardNumber.message}</p>
//           )}
//         </div>

//         {/* Province Selection */}
//         <div className="sm:col-span-3">
//           <label
//             htmlFor="province"
//             className="block text-sm font-medium text-gray-900"
//           >
//             Province
//           </label>
//           <select
//             id="province"
//             {...register("province", {
//               required: "Province is required",
//               onChange: (e) => {
//                 clearErrors("province");
//                 setSelectedProvince(e.target.value);
//                 setSelectedDistrict("");
//               },
//             })}
//             className={`mt-1 block w-full rounded-md border ${
//               errors.province ? "border-red-500" : "border-gray-300"
//             } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
//           >
//             <option value="">Select Province</option>
//             {provinces.map((province) => (
//               <option key={province} value={getValues("province")?getValues("province"):province}>
//                 {province}
//               </option>
//             ))}
//           </select>
//           {errors.province && (
//             <p className="text-red-500 text-sm">{errors.province.message}</p>
//           )}
//         </div>

//         {/* District Selection */}
//         <div className="sm:col-span-3">
//           <label
//             htmlFor="district"
//             className="block text-sm font-medium text-gray-900"
//           >
//             District
//           </label>
//           <select
//             id="district"
//             {...register("district", {
//               required: "District is required",
//               onChange: (e) => {
//                 clearErrors("district");
//                 setSelectedDistrict(e.target.value);
//               },
//             })}
//             className={`mt-1 block w-full rounded-md border ${
//               errors.district ? "border-red-500" : "border-gray-300"
//             } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
//             disabled={!selectedProvince}
//           >
//             <option value="">Select District</option>
//             {districts.map((district) => (
//               <option key={district.id} value={getValues("district")?getValues("district"):district.name}>
//                 {district.name}
//               </option>
//             ))}
//           </select>
//           {errors.district && (
//             <p className="text-red-500 text-sm">{errors.district.message}</p>
//           )}
//         </div>

//         {/* Municipality Selection */}
//         <div className="sm:col-span-3">
//           <label
//             htmlFor="municipality"
//             className="block text-sm font-medium text-gray-900"
//           >
//             Municipality
//           </label>
//           <select
//             id="municipality"
//             {...register("municipality", {
//               required: "Municipality is required",
//               onChange: () => clearErrors("municipality"),
//             })}
//             className={`mt-1 block w-full rounded-md border ${
//               errors.municipality ? "border-red-500" : "border-gray-300"
//             } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
//             disabled={!selectedDistrict}
//           >
//             <option value="">Select Municipality</option>
//             {municipalities.map((municipality) => (
//               <option key={municipality.id} value={municipality.name}>
//                 {municipality.name}
//               </option>
//             ))}
//           </select>
//           {errors.municipality && (
//             <p className="text-red-500 text-sm">
//               {errors.municipality.message}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddressInfo;
import React, { useState } from "react";
import districtData from "../../../assets/Districtdata.json";

const AddressInfo = ({ clearErrors, register, errors, getValues }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Get the list of provinces
  const provinces = districtData.provinceList.map((province) => province.name);

  // Get the list of districts for the selected province
  const districts =
    districtData.provinceList.find(
      (province) => province.name === selectedProvince
    )?.districtList || [];

  // Get the list of municipalities for the selected district
  const municipalities =
    districts.find((district) => district.name === selectedDistrict)
      ?.municipalityList || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Address Info</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Ward Number */}
        <div className="sm:col-span-3">
          <label
            htmlFor="wardNumber"
            className="block text-sm font-medium text-gray-900"
          >
            Ward Number
          </label>
          <input
            id="wardNumber"
            type="number"
            {...register("wardNumber", {
              required: "Ward number is required",
              onChange: () => clearErrors("wardNumber"),
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.wardNumber ? "border-red-500" : "border-gray-300"
            } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            placeholder="Enter Ward Number"
          />
          {errors.wardNumber && (
            <p className="text-red-500 text-sm">{errors.wardNumber.message}</p>
          )}
        </div>

        {/* Province Selection */}
        <div className="sm:col-span-3">
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-900"
          >
            Province
          </label>
          <select
            id="province"
            {...register("province", {
              required: "Province is required",
              onChange: (e) => {
                clearErrors("province");
                setSelectedProvince(e.target.value);
                setSelectedDistrict(""); // Reset district selection when province changes
              },
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.province ? "border-red-500" : "border-gray-300"
            } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm">{errors.province.message}</p>
          )}
        </div>

        {/* District Selection */}
        <div className="sm:col-span-3">
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-900"
          >
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
            className={`mt-1 block w-full rounded-md border ${
              errors.district ? "border-red-500" : "border-gray-300"
            } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            disabled={!selectedProvince}
          >
            <option value="">Select District</option>
            {districts.map((district, index) => (
              <option key={index} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district.message}</p>
          )}
        </div>

        {/* Municipality Selection */}
        <div className="sm:col-span-3">
          <label
            htmlFor="municipality"
            className="block text-sm font-medium text-gray-900"
          >
            Municipality
          </label>
          <select
            id="municipality"
            {...register("municipality", {
              required: "Municipality is required",
              onChange: () => clearErrors("municipality"),
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.municipality ? "border-red-500" : "border-gray-300"
            } py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm`}
            disabled={!selectedDistrict}
          >
            <option value="">Select Municipality</option>
            {municipalities.map((municipality, index) => (
              <option key={index} value={municipality.name}>
                {municipality.name}
              </option>
            ))}
          </select>
          {errors.municipality && (
            <p className="text-red-500 text-sm">{errors.municipality.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
