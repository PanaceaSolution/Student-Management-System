import SubjectForm from '@/components/admin/SubjectForm';
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import useSubjectStore from '@/store/subjectStore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableWithActions from '@/components/admin/tableWithActions';
import useExport from '@/hooks/useExport';


const Exports = [
   { value: "", label: "EXPORT" },
   { value: "CSV", label: "CSV" },
   { value: "PDF", label: "PDF" },
];

const Classes = [
   { value: "", label: "Class" },
   { value: "1", label: "1" },
   { value: "2", label: "2" },
   { value: "3", label: "3" },
   { value: "4", label: "4" },
   { value: "5", label: "5" },
   { value: "6", label: "6" },
   { value: "7", label: "7" },
   { value: "8", label: "8" },
   { value: "9", label: "9" },
   { value: "10", label: "10" },
];

const formFields = [
   {
      name: "subjectName",
      label: "Subject Name",
      required: "Subject Name is required",
      placeholder: "Enter Subject Name",
      type: "text",
   },
   {
      name: "class",
      label: "Class Name",
      required: "Class Name is required",
      placeholder: "Enter Class Name",
      type: "text",
   },
];

const subjectsTableHead = ["Id", "Subject Name", "Class", "Actions"];
const subjectTableField = ["id", "subjectName", "class"];

const Subjects = () => {
   const navigate = useNavigate();
   const [selectedExport, setSelectedExport] = useState("");
   const [selectedClass, setSelectedClass] = useState("");
   const [searchTerm, setSearchTerm] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedId, setSelectedId] = useState(null);
   const [isUpdating, setIsUpdating] = useState(false);

   const { subjects, getAllSubjects, deleteSubject } = useSubjectStore();
   const { exportToCSV, exportToPDF } = useExport();

   useEffect(() => {
      getAllSubjects();
   }, [getAllSubjects]);

   const sortedSubjects = subjects.sort((a, b) => {
      return parseInt(a.class) - parseInt(b.class);
   });

   const handleEdit = (data) => {
      setIsModalOpen(true);
      setIsUpdating(true);
      setSelectedId(data.id);
   };

   const handleDelete = async (id) => {
      await deleteSubject(id);
   };

   const handleExportChange = (event) => {
      const value = event.target.value;
      setSelectedExport(value);
      if (value === 'CSV') {
         exportToCSV(sortedSubjects, "subjects.csv");
      } else if (value === 'PDF') {
         const headers = [
            { header: "Id", dataKey: "id" },
            { header: "Subject Name", dataKey: "subjectName" },
            { header: "Class", dataKey: "class" },
         ];
         exportToPDF(sortedSubjects, headers, "Subjects List", "subjects.pdf");
      }
   };

   const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
   };

   const handleClassChange = (event) => {
      setSelectedClass(event.target.value);
   };

   const filteredSubjects = sortedSubjects.filter(subject => {
      const matchesSearchTerm = subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass ? subject.class === selectedClass : true;
      return matchesSearchTerm && matchesClass;
   });

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
                        formFields={formFields}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        id={selectedId}
                        setId={setSelectedId}
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
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
                           options={Classes}
                           selectedValue={selectedClass}
                           onChange={handleClassChange}
                           className="w-32 bg-white"
                        />
                     </div>
                  </div>
               </div>
               <div className="relative w-full overflow-x-auto shadow-md">
                  <TableWithActions
                     tableHead={subjectsTableHead}
                     tableBody={filteredSubjects}
                     tableFields={subjectTableField}
                     noDataMessage="No subjects found"
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
