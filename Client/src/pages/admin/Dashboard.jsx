import React, { useState } from "react";
import Paginations from "@/components/Paginations";
import Table from "@/components/Tables";
import ResultShowing from "@/components/ResultShowing";
import ProfileCard from "@/components/ProfileCard";
import Select from "@/components/Select";
import Button from "@/components/Button";
import SearchBox from "@/components/SearchBox";
import data from "@/data.json";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Experts = [
   { value: "", label: "EXPERT" },
   { value: "CSV", label: "CSV" },
   { value: "PDF", label: "PDF" },
];

const Gender = [
   { value: "", label: "Gender" },
   { value: "M", label: "Male" },
   { value: "F", label: "Female" },
   { value: "O", label: "Others" },
];

const Department = [
   { value: "", label: "Department" },
   { value: "STU", label: "Student" },
   { value: "STT", label: "Staff" },
];

const Dashboard = () => {
   const [selectedExpert, setSelectedExpert] = useState("");
   const [selectedGender, setSelectedGender] = useState("");
   const [selectedDepartment, setSelectedDepartment] = useState("");
   const [activeTab, setActiveTab] = useState("all");
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   const handleExpertChange = (event) => {
      const value = event.target.value;
      setSelectedExpert(value);

      if (value === "CSV") {
         exportToCSV();
      } else if (value === "PDF") {
         exportToPDF();
      }
   };
   const handleTabClick = (tab) => {
      setActiveTab(tab);
   };

   const handleEdit = () => {
      alert("Edit action triggered");
   };

   const handleDelete = () => {
      alert("Delete action triggered");
   };

   const handleGenderChange = (event) => {
      setSelectedGender(event.target.value);
   };

   const handleDepartmentChange = (event) => {
      setSelectedDepartment(event.target.value);
   };

   // Search functionality
   const handleSearch = (searchTerm) => {
      console.log("Search Term:", searchTerm);
      // Implement search logic here
   };

   // Calculate the current data to display
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

   // Total number of pages
   const totalPages = Math.ceil(data.length / itemsPerPage);

   // Export to CSV function
   const exportToCSV = () => {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Data.csv");
      link.click();
   };

   // Export to PDF function
   const exportToPDF = () => {
      const doc = new jsPDF();
      const columns = [
         { header: "First Name", dataKey: "firstName" },
         { header: "Last Name", dataKey: "lastName" },
         { header: "Gender", dataKey: "gender" },
         { header: "Department", dataKey: "department" },
      ];

      const pdfData = data.map((student) => ({
         firstName: student.firstName,
         lastName: student.lastName,
         gender: student.gender,
         department: student.department,
      }));

      doc.setFontSize(18);
      doc.text("Student List", 14, 22);
      doc.autoTable({
         columns: columns,
         body: pdfData,
         startY: 30,
         margin: { horizontal: 10 },
      });

      // Save the PDF
      doc.save("students.pdf");
   };

   // Print PDF function
   const printPDF = () => {
      const doc = new jsPDF();
      const columns = [
         { header: "First Name", dataKey: "firstName" },
         { header: "Last Name", dataKey: "lastName" },
         { header: "Gender", dataKey: "gender" },
         { header: "Department", dataKey: "department" },
      ];

      const pdfData = data.map((student) => ({
         firstName: student.firstName,
         lastName: student.lastName,
         gender: student.gender,
         department: student.department,
      }));

      doc.setFontSize(18);
      doc.text("Student List", 14, 22);
      doc.autoTable({
         columns: columns,
         body: pdfData,
         startY: 30,
         margin: { horizontal: 10 },
      });

      // Instead of using an iframe, directly call print after generating the PDF
      const pdfOutput = doc.output("blob");

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfOutput);
      const newWindow = window.open(pdfUrl);

      // After the window loads, call print
      newWindow.onload = () => {
         newWindow.print();
         URL.revokeObjectURL(pdfUrl); // Clean up the URL
         newWindow.close(); // Close the print window
      };
   };

   return (
      <section>
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5">
               <div className="rounded-sm bg-[#F8F8F8] lg:col-span-3 p-3">
                  {/* Button Parts */}
                  {/* Button Parts */}
                  <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
                     <div className=" flex  gap-5 md:gap-4">
                        <Button type="print" onClick={printPDF}>
                           PRINT
                        </Button>
                        <Select
                           options={Experts}
                           selectedValue={selectedExpert}
                           onChange={handleExpertChange}
                           className="w-32 bg-white"
                        />
                        <Button type="create">ADD</Button>
                     </div>
                  </div>

                  {/* Select Parts */}
                  <div className="border-b-2 p-2">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-1">
                           <SearchBox
                              placeholder="Search for items..."
                              onSearch={handleSearch}
                           />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <Select
                              options={Gender}
                              selectedValue={selectedGender}
                              onChange={handleGenderChange}
                              className="w-full bg-white"
                           />
                           <Select
                              options={Department}
                              selectedValue={selectedDepartment}
                              onChange={handleDepartmentChange}
                              className="w-full bg-white"
                           />
                           <Select
                              options={Department}
                              selectedValue={selectedDepartment}
                              onChange={handleDepartmentChange}
                              className="w-full bg-white"
                           />
                        </div>
                     </div>
                  </div>
                  {/* Tabs */}
                  <div className="bg-[#F8F8F8] flex gap-6 justify-start items-center p-4 border-b-2">
                     <div className="flex">
                        <a
                           href="#"
                           className={`font-semibold cursor-pointer ${activeTab === "all" ? " border-b-2 border-blue-600" : ""
                              }`}
                           onClick={() => handleTabClick("all")}
                        >
                           All{" "}
                           <span className="text-blue-600 bg-white rounded-lg">
                              {data.length}
                           </span>
                        </a>
                     </div>
                     <div>
                        <a
                           href="#"
                           className={`font-semibold cursor-pointer ${activeTab === "present" ? " border-b-2 border-blue-600" : ""
                              }`}
                           onClick={() => handleTabClick("present")}
                        >
                           Present{" "}
                           <span className="text-blue-600 bg-white rounded-lg">
                              {data.length}
                           </span>
                        </a>
                     </div>
                     <div>
                        <a
                           href="#"
                           className={`font-semibold cursor-pointer ${activeTab === "alumni" ? " border-b-2 border-blue-600" : ""
                              }`}
                           onClick={() => handleTabClick("alumni")}
                        >
                           ALUMNI{" "}
                           <span className="text-blue-600 bg-white rounded-lg">
                              {data.length}
                           </span>
                        </a>
                     </div>
                  </div>
                  {/* end of tabs */}
                  <div className="relative overflow-x-auto shadow-md scrollbar-none">
                     <ResultShowing
                        start={indexOfFirstItem + 1}
                        end={indexOfLastItem}
                        total={data.length}
                     />
                     {/* Table Start */}
                     <Table
                        items={currentItems}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                     />
                  </div>
                  {/* Paginations */}
                  <Paginations
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={setCurrentPage}
                  />
                  {/* End of Paginations */} {/* Table End */}
               </div>
               <div>
                  <ProfileCard
                     refId="stu432101f"
                     firstName="Michelle"
                     lastName="Livingston"
                     gender="Female"
                     email="michellelivingston@gmail.com"
                     address="No. 11 Tony Ave, Shomolu, Lagos, Nigeria"
                     department="Technology"
                     className="SS2"
                     dateCreated="25th September 2015"
                     staffStatus="Current"
                     onEdit={handleEdit}
                     onDelete={handleDelete}
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default Dashboard;
