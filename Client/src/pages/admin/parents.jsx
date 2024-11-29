import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
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
import useExport from '@/hooks/useExport';
import ActiveTab from '@/components/common/activeTab';
import AdminTable from '@/components/admin/AdminTable';

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

const parentsTableHead = ["", "Father's Name", "Mother's Name", "No. of Children", "Phone Number"];
const parentsTableFields = ["user_profile_fname", "user_profile_lname", "child_0", "user_contact_phoneNumber"];

const parentsContent = [
   { label: "First Name", key: "user_profile_fname" },
   { label: "Last Name", key: "user_profile_lname" },
   { label: "Email", key: "user_email" },
   { label: "Phone", key: "user_contact_phoneNumber" },
   { label: "Students", key: "studentId" }
];


const Parents = () => {
   const [formOpen, setFormOpen] = useState(false);
   const [cardOpen, setCardOpen] = useState(false);
   const [selectedExport, setSelectedExport] = useState("");
   const [selectedGender, setSelectedGender] = useState("");
   const [activeTab, setActiveTab] = useState("all");
   const [selectedData, setSelectedData] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");

   const { parents, getAllParents } = useParentStore()

   useEffect(() => {
      const fetchParents = async () => {
         await getAllParents('PARENT');
      };
      fetchParents();
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
      setCardOpen(true);
   };

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
                        {/* <ParentsForm
                           title="Add Parent"
                           selectedData={selectedData}
                           setSelectedData={setSelectedData}
                           formOpen={formOpen}
                           setFormOpen={setFormOpen}
                        /> */}
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
                     <AdminTable
                        title="Parent"
                        tableHead={parentsTableHead}
                        tableFields={parentsTableFields}
                        user={parents}
                        handleUserData={handleUserData}
                        handleDelete={() => { }}
                        handleEdit={() => { }}
                        loading={false}
                     />
                  </div>
               </div>
               {selectedData && (
                  <Dialog open={cardOpen} onOpenChange={setCardOpen}>
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
