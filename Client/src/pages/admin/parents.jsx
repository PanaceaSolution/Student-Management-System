import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import ParentsForm from '@/components/admin/ParentsForm';
import useParentStore from '@/store/parentsStore';
import StaffTable from '@/components/admin/AdminTable';
import useExport from '@/hooks/useExport';
import ActiveTab from '@/components/common/activeTab';
import useStudentStore from '@/store/studentStore';

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

const parentsTableHead = ["", "First Name", "Last Name", "Gender", "Phone Number"];
const parentsTableFields = ["user_profile_fname", "user_profile_lname", "user_profile_gender", "user_contact_phoneNumber"];

const parentsContent = [
   { label: "First Name", key: "user_profile_fname" },
   { label: "Last Name", key: "user_profile_lname" },
   { label: "Email", key: "user_email" },
   { label: "Phone", key: "user_contact_phoneNumber" },
   { label: "Students", key: "studentId" }
];


const Parents = () => {
   const [formOpen, setFormOpen] = useState(false);
   const [selectedExport, setSelectedExport] = useState("");
   const [selectedGender, setSelectedGender] = useState("");
   const [activeTab, setActiveTab] = useState("all");
   const [selectedData, setSelectedData] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");

   const { parents, getAllParents, deleteParent, isSubmitting, isDeleting } = useParentStore()

   useEffect(() => {
      getAllParents("PARENT")
   }, []);


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

   const handleUserData = (data) => {
      setSelectedData(data);
   };

   const handleDelete = async (id) => {
      await deleteParent(id);
   };

   const handleEdit = () => {

   }

   return (
      <section>
         <div className='max-w-full mx-auto'>
            <div className={`grid grid-cols-1 gap-4 lg:pr-4 transition-all duration-300`}>
               <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
                  <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
                     <div className="flex gap-3 md:gap-4">
                        <Select
                           options={Exports}
                           selectedValue={selectedExport}
                           onChange={handleExportChange}
                           className="w-32 bg-white"
                        />
                        <ParentsForm
                           title="Add Parent"
                           selectedData={selectedData}
                           setSelectedData={setSelectedData}
                           formOpen={formOpen}
                           setFormOpen={setFormOpen}
                        />
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
                  <ActiveTab
                     activeTab={activeTab}
                     user={parents}
                     handleTabClick={handleTabClick}
                  />
                  <div className="relative w-full overflow-x-auto shadow-md">
                     <StaffTable
                        title="Parent"
                        tableHead={parentsTableHead}
                        tableFields={parentsTableFields}
                        user={parents}
                        handleUserData={handleUserData}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        loading={isDeleting}
                     />
                  </div>
               </div>
               {selectedData && (
                  <Dialog>
                     <DialogTrigger>Open</DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Are you absolutely sure?</DialogTitle>
                           <DialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove your data from our servers.
                           </DialogDescription>
                        </DialogHeader>
                     </DialogContent>
                  </Dialog>
               )}
            </div>
         </div>
      </section>
   );
};

export default Parents;
