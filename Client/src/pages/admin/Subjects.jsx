import SubjectForm from '@/components/admin/SubjectForm';
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import useSubjectStore from '@/store/subjectStore';
import React, { useEffect, useState } from 'react';
import useExport from '@/hooks/useExport';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';


const Exports = [
   { value: "", label: "EXPORT" },
   { value: "CSV", label: "CSV" },
   { value: "PDF", label: "PDF" },
];

const subjectsTableHead = ["", "Subject Name", "Description", "Actions"];
const subjectTableField = ["courseName", "courseDescription"];

const Subjects = () => {
   const [selectedExport, setSelectedExport] = useState("");
   const [selectedClass, setSelectedClass] = useState("");
   const [searchTerm, setSearchTerm] = useState("");
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [selectedData, setSelectedData] = useState(null);

   const { subjects, getAllSubjects, deleteSubject } = useSubjectStore();
   const { exportToCSV, exportToPDF } = useExport();

   useEffect(() => {
      const fetchSubjects = async () => {
         await getAllSubjects();
      };
      fetchSubjects();
   }, []);

   const handleExport = () => {
      const exportHandlers = {
         CSV: () => exportToCSV(subjects, "subjects.csv"),
         PDF: () => {
            const headers = [
               { header: "Id", dataKey: "id" },
               { header: "Subject Name", dataKey: "subjectName" },
               { header: "Class", dataKey: "class" },
            ];
            exportToPDF(subjects, headers, "Subjects List", "subjects.pdf");
         }
      };
      if (selectedExport) exportHandlers[selectedExport]();
   };

   const handleExportChange = (event) => {
      setSelectedExport(event.target.value);
      handleExport();
   };

   const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
   };

   const handleEdit = (data) => {
      setIsFormOpen(true);
      setSelectedData(data);
   };

   const handleDelete = async (data) => {
      await deleteSubject(data.courseId);
   };


   return (
      <section>
         <div className="max-w-full mx-auto lg:pr-4">
            <div className="rounded-sm bg-card lg:col-span-5 p-3">
               <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
                  <div className="flex gap-3 md:gap-4">
                     <Select
                        options={Exports}
                        selectedValue={selectedExport}
                        onChange={handleExportChange}
                        className="w-32 bg-white"
                     />
                     <SubjectForm
                        isFormOpen={isFormOpen}
                        setIsFormOpen={setIsFormOpen}
                        selectedData={selectedData}
                        setSelectedData={setSelectedData}
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
                  </div>
               </div>
               <div className="relative w-full overflow-x-auto shadow-md">
                  <AdminTable
                     title="Subjects"
                     tableHead={subjectsTableHead}
                     tableFields={subjectTableField}
                     user={subjects}
                     handleUserData={handleEdit}
                     handleEdit={handleEdit}
                     handleDelete={handleDelete}
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default Subjects;
