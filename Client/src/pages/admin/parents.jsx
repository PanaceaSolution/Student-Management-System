import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import ParentsForm from '@/components/admin/ParentsForm';
import useParentStore from '@/store/parentsStore';
import StaffTable from '@/components/admin/StaffTable';
import useExport from '@/hooks/useExport';

const Exports = [
   { value: "", label: "EXPORT" },
   { value: "CSV", label: "CSV" },
   { value: "PDF", label: "PDF" },
];

const Gender = [
   { value: "", label: "Gender" },
   { value: "Male", label: "Male" },
   { value: "Female", label: "Female" },
   { value: "Others", label: "Others" },
];

const parentsTableHead = ["", "First Name", "Last Name", "Phone Number", "Email"];
const parentsTableFields = ["firstName", "lastName", "phoneNumber", "email"];

const parentsContent = [
   { label: "First Name", key: "firstName" },
   { label: "Last Name", key: "lastName" },
   { label: "Email", key: "email" },
   { label: "Phone", key: "phoneNumber" },
   { label: "Students", key: "studentId" }
];


const Parents = () => {

   const [selectedExport, setSelectedExport] = useState("");
   const [selectedGender, setSelectedGender] = useState("");
   const [activeTab, setActiveTab] = useState("all");
   const [selectedId, setSelectedId] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");

   const { parents, getAllParents, parentById, getParentsById, deleteParent } = useParentStore()

   useEffect(() => {
      getAllParents();
   }, [getAllParents])

   const { exportToCSV, exportToPDF } = useExport()


   // Handle format selection and trigger export
   const handleExportChange = (event) => {
      const value = event.target.value;
      setSelectedExport(value);
      if (value === "CSV") {
         exportToCSV(parents, "parents.csv");
      } else if (value === "PDF") {
         const headers = [
            { header: "First Name", dataKey: "firstName" },
            { header: "Last Name", dataKey: "lastName" },
            { header: "Email", dataKey: "email" },
            { header: "Phone", dataKey: "phoneNumber" },
         ]
         exportToPDF(parents, headers, "Parents List", "parents.pdf");
      }
   };

   const handleGenderChange = (event) => {
      setSelectedGender(event.target.value);
   };

   const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
   };

   const handleTabClick = useCallback((tab) => {
      setActiveTab(tab);
   }, []);

   const handleUserId = (id) => {
      setSelectedId(id);
   };

   useEffect(() => {
      if (selectedId) {
         getParentsById(selectedId);
      }
   }, [selectedId, getParentsById])

   const handleDelete = async (id) => {
      await deleteParent(id);
   };

   return (
      <section>
         <div className='max-w-full mx-auto'>
            <div className={`grid grid-cols-1 gap-4 ${selectedId ? 'lg:grid-cols-7 2xl:grid-cols-4 lg:gap-1' : 'lg:pr-4'} transition-all duration-300`}>
               <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
                  <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
                     <div className="flex gap-3 md:gap-4">
                        <Select
                           options={Exports}
                           selectedValue={selectedExport}
                           onChange={handleExportChange}
                           className="w-32 bg-white"
                        />
                        <ParentsForm title="Add Parent" />
                     </div>
                  </div>
                  <div className="border-b-2 p-2">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-1">
                           <SearchBox
                              placeholder="Search for something..."
                              onChange={handleSearchChange}
                              className="mb-4"
                           />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                           <Select
                              options={Gender}
                              selectedValue={selectedGender}
                              onChange={handleGenderChange}
                              className="w-full bg-white"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#F8F8F8] flex gap-6 justify-start items-center p-4 border-b-2">
                     {["all", "present", "alumni"].map((tab) => (
                        <div key={tab}>
                           <a
                              href="#"
                              className={`font-semibold cursor-pointer ${activeTab === tab ? "border-b-2 border-blue-600" : "text-gray-500"
                                 }`}
                              onClick={() => handleTabClick(tab)}
                           >
                              {tab.toUpperCase()}{" "}
                              <span
                                 className={`text-primary bg-gray-200 px-1 rounded ${activeTab === tab ? "" : ""}`}
                              >
                                 2
                              </span>
                           </a>
                        </div>
                     ))}
                  </div>
                  <div className="relative w-full overflow-x-auto shadow-md">
                     {parents?.length === 0 ? (
                        <p className="text-center">No data available</p>
                     ) : (
                        <StaffTable
                           tableHead={parentsTableHead}
                           tableFields={parentsTableFields}
                           user={parents}
                           handleUserId={handleUserId}
                        />
                     )}
                  </div>
               </div>

               {selectedId && (
                  <div className="lg:col-span-2 2xl:col-span-1 px-3 lg:pr-4">
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-2xl font-bold text-primary text-center">
                              Parents Details
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <img
                              src={" "}
                              alt="Profile Preview"
                              className="w-20 h-20 rounded-md border-2 border-gray-300 mb-4"
                           />
                           {parentsContent.map((field, index) => (
                              <div key={index} className="mb-4">
                                 <p className="text-xs uppercase text-gray-500">
                                    {field.label}
                                 </p>
                                 <p className="text-lg font-medium text-gray-800">
                                    {field.key === "studentId"
                                       ? (parentById[field.key]?.length
                                          ? parentById[field.key].join(", ") // Display as a comma-separated list
                                          : "N/A")
                                       : (parentById[field.key] || "N/A")
                                    }
                                 </p>
                              </div>
                           ))}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                           <ParentsForm title="Edit" data={parentById} />
                           <Button
                              variant="destructive"
                              onClick={() => handleDelete(selectedId)}
                           >
                              Delete</Button>
                        </CardFooter>
                     </Card>
                  </div>
               )}
            </div>
         </div>
      </section>
   );
};

export default Parents;
