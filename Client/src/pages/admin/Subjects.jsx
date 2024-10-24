import Form from '@/components/admin/Form';
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import useSubjectStore from '@/store/subjectStore';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';


const Exports = [
   { value: "", label: "EXPORT" },
   { value: "CSV", label: "CSV" },
   { value: "PDF", label: "PDF" },
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
]

const Subjects = () => {
   const [selectedExport, setSelectedExport] = useState("");
   const [searchTerm, setSearchTerm] = useState("");

   const { subjects, getAllSubjects, addSubject } = useSubjectStore()

   useEffect(() => {
      getAllSubjects()
   }, [getAllSubjects])

   const {
      register,
      handleSubmit,
      clearErrors,
      formState: { errors },
      reset
   } = useForm({})

   const onSubmit = async (data) => {
      console.log(data);

      // Handle form submission
      const res = await addSubject(data);
      if (res.status === 200) {
         reset();
      }
   }

   // Handle format selection and trigger export
   const handleExportChange = (event) => {
      const value = event.target.value;
      setSelectedExport(value);
      if (value === "CSV") {
         exportToCSV();
      } else if (value === "PDF") {
         exportToPDF();
      }
   };

   const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
   };
   return (
      <section>
         <div className='max-w-full mx-auto'>
            <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
               <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
                  <div className="flex gap-3 md:gap-4">
                     <Button variant="print">
                        PRINT
                     </Button>
                     <Select
                        options={Exports}
                        selectedValue={selectedExport}
                        onChange={handleExportChange}
                        className="w-32 bg-white"
                     />
                     <Form
                        formFields={formFields}
                        register={register}
                        errors={errors}
                        clearErrors={clearErrors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
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
               {/* <div className="relative w-full overflow-x-auto shadow-md">
                     {filteredUser?.length === 0 ? (
                        <p className="text-center">No data available</p>
                     ) : (
                        <div></div>
                     )}
                  </div> */}
            </div>
         </div>
      </section>
   )
}

export default Subjects