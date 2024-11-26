
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useClassStore from '@/store/classStore';
import AdminTable from '@/components/admin/AdminTable';
import useExport from '@/hooks/useExport';
import ClassForm from '@/components/admin/ClassForm';


const classTableHead = ["", "Class Name", "Section", "Action",];
const classTableField = ["className", "section"];


const Exports = [
  { value: "", label: "EXPORT" },
  { value: "CSV", label: "CSV" },
  { value: "PDF", label: "PDF" },
];



const Class = () => {
  const [selectedExport, setSelectedExport] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const { classes, getAllClasses, isDeleting } = useClassStore();

  useEffect(() => {
    const fetchClasses = async () => {
      await getAllClasses();
    }

    fetchClasses();
  }, []);


  const { exportToCSV, exportToPDF } = useExport();
  // Handle format selection and trigger export
  const handleExport = () => {
    const exportHandlers = {
      CSV: () => exportToCSV(subjects, "classes.csv"),
      PDF: () => {
        const headers = [
          { header: "Class", dataKey: "className" },
          { header: "Section", dataKey: "section" },
          { header: "Class Teacher", dataKey: "classTeacher" },
          { header: "Subjects", dataKey: "subject" },
        ];
        exportToPDF(subjects, headers, "Classes List", "classes.pdf");
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
  }

  const handleDelete = async (id) => {
    await deleteClass(id);
  }

  return (
    <section>
      <div className='max-w-full mx-auto lg:pr-4'>
        <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
          <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
            <div className="flex gap-3 md:gap-4">
              <Select
                options={Exports}
                selectedValue={selectedExport}
                onChange={handleExportChange}
                className="w-32 bg-white"
              />
              <Button
                variant="create"
                className="uppercase"
                onClick={() => setIsFormOpen(true)}
              >
                Add Class
              </Button>
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
              title="Classes"
              tableHead={classTableHead}
              tableFields={classTableField}
              user={classes}
              loading={isDeleting}
              handleUserData={(data) => console.log(data)}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      <ClassForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
      />
    </section>
  );
};

export default Class;

