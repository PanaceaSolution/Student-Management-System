
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TableWithActions from '@/components/admin/tableWithActions';


const classTableHead = ["Teacher Name", "Gender", "Subject", "Class", "Action",];

const classData = [{
  id: 1,
  teacherName: "John Doe",
  gender: "Male",
  subject: "Mathematics",
  class: " 1",
},
{
  id: 2,
  teacherName: "Jane Smith",
  gender: "Female",
  subject: "Science",
  class: " 2",
},
{
  id: 3,
  teacherName: "David Johnson",
  gender: "Male",
  subject: "English",
  class: "3",
}

];




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



const Class = () => {


  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");


  const [searchTerm, setSearchTerm] = useState("");





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

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };



  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };





  return (
    <section>
      <div className='max-w-full mx-auto lg:pr-4'>
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

          <div className="relative w-full overflow-x-auto shadow-md">
            <TableWithActions
              tableHead={classTableHead}
              tableBody={classData}
              tableFields={["teacherName", "gender", "subject", "class"]}
              handleDelete={(data) => console.log(data)}
              keyExtractor={(data) => data.id}
              noDataMessage="No data available"
            />

            {/* {filteredUser?.length === 0 && (
                <p className="text-center">Result Not Found</p>
              )} */}
          </div>

        </div>

      </div>

    </section>
  );
};

export default Class;

