import React, { useState, useMemo, useCallback, useEffect } from "react";
import Paginations from "@/components/common/Paginations"; // Pagination component
import Table from "@/components/common/Tables"; // Table to display student data
import ResultShowing from "@/components/common/ResultShowing";
import ProfileCard from "@/components/ProfileCard";
import Select from "@/components/Select";
import SearchBox from "@/components/SearchBox";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import useGetAllStudents from "@/hooks/useGetAllStudents"; // Custom hook to fetch students
import useDeleteStudent from "@/hooks/useDeleteStudnet"; // Custom hook to delete a student
import { DateSelect } from "@/components/DateSelect";
import useStudent from "@/Zustand/useStudent";
import AddStudentFormModal from "./StudentForm/AddStudentFormModal";
import { Button } from "@/components/ui/button";
import useExport from "@/hooks/useExport";
// Custom hook for debouncing input value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value); // Set the debounced value after a delay
    }, delay);

    return () => {
      clearTimeout(handler); // Cleanup on component unmount or value change
    };
  }, [value, delay]);

  return debouncedValue; // Return the debounced value
};

// Options for export formats
const Exports = [
  { value: "", label: "EXPORT" },
  { value: "CSV", label: "CSV" },
  { value: "PDF", label: "PDF" },
];

// Gender options for filtering
const Gender = [
  { value: "", label: "Gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

// Department options for filtering
const Department = [
  { value: "", label: "CLASS" },
  { value: "CSIT", label: "CSIT" },
  { value: "BCA", label: "BCA" },
  { value: "BIM", label: "BIM" },
];

const Students = () => {
  // State management
  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [studentInfo, setStudentInfo] = useState({}); // Store selected student info
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const {} = useStudent();
  const itemsPerPage = 10; // Items to show per page
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounced search term for efficiency

  // Reset current page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGender, selectedDepartment, debouncedSearchTerm]);

  // Construct query parameters for fetching students
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGender) params.append("gender", selectedGender);
    if (selectedDepartment) params.append("Class", selectedDepartment);
    if (debouncedSearchTerm) params.append("firstName", debouncedSearchTerm);
    return `?${params.toString()}`;
  }, [selectedGender, selectedDepartment, debouncedSearchTerm]);

  // Fetch all students using custom hook
  const { students, loading, error } = useGetAllStudents(query);
  const { deleteStudent, loading: deleteLoading, success } = useDeleteStudent();
  // Show alert on successful deletion
  useEffect(() => {
    if (success) {
      setShowAlert(true);
    }
  }, [success]);

  // Export students data
  const { exportToCSV, exportToPDF } = useExport();

  // Handle format selection and trigger export
  const handleExportChange = (event) => {
    const value = event.target.value;
    setSelectedExport(value);
    if (value === 'CSV') {
      exportToCSV(students, "students.csv");
    } else if (value === 'PDF') {
      const headers = [
        { header: "First Name", dataKey: "firstName" },
        { header: "Last Name", dataKey: "lastName" },
        { header: "Gender", dataKey: "gender" },
        { header: "Class", dataKey: "class" },
      ];
      exportToPDF(students, headers, "Students List", "students.pdf");
    }
  };

  // Handle tab click to set active tab
  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Placeholder for edit functionality
  const handleEdit = useCallback(() => {
    alert("Edit action triggered");
  }, []);

  // Handle student deletion
  const handleDelete = useCallback(
    async (id) => {
      await deleteStudent(id);
    },
    [deleteStudent]
  );

  // Update selected gender from dropdown
  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  // Update selected department from dropdown
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  // Update search term for filtering
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Update selected date from date picker
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get current items for the displayed page
  const currentItems = useMemo(() => {
    return students?.slice(indexOfFirstItem, indexOfLastItem);
  }, [students, indexOfFirstItem, indexOfLastItem]);

  // Calculate total number of pages
  const totalPages = useMemo(() => {
    return Math.ceil((students?.length || 0) / itemsPerPage);
  }, [students, itemsPerPage]);


  return (
    <section>
      <div className="max-w-full mx-auto p-2">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5">
          <div className="rounded-sm bg-[#F8F8F8] lg:col-span-3 p-2">
            <div className="flex justify-evenly sm:justify-end border-b-2 p-1">
              <div className="flex gap-3 md:gap-4">
                <Select
                  options={Exports}
                  selectedValue={selectedExport}
                  onChange={handleExportChange}
                  className="w-32 bg-white"
                />
                <Button
                  type="create"
                  onClick={() => setShowAddStudentModal(true)}
                >
                  Add Student
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
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                  <div className="col-span-1">
                    <DateSelect onChange={handleDateChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F8F8] flex gap-6 justify-start items-center p-2 border-b-2">
              {["all", "present", "alumni"].map((tab) => (
                <div key={tab}>
                  <a
                    href="#"
                    className={`font-semibold cursor-pointer ${
                      activeTab === tab ? "border-b-2 border-blue-600" : ""
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab.toUpperCase()}{" "}
                    <span className="text-blue-600 bg-white rounded-lg">
                      {students.length}
                    </span>
                  </a>
                </div>
              ))}
            </div>
            <ResultShowing
              start={indexOfFirstItem + 1}
              end={indexOfLastItem}
              total={students.length}
            />
            <div className="relative w-full overflow-x-auto shadow-md">
              {error ? (
                <div className="text-red-500">Error: {error}</div> // Display error message if any
              ) : (
                <Table
                  setStudentInfo={setStudentInfo}
                  items={currentItems}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
              {students?.length === 0 && (
                <p className="text-center">Result Not Found</p>
              )}
            </div>

            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage} // Handle page change
            />
          </div>
          <div className=" w-auto ">
            <ProfileCard
              loading={deleteLoading}
              studentInfo={studentInfo} // Show selected student info
              onEdit={handleEdit} // Handle edit action
              onDelete={handleDelete} // Handle delete action
            />
          </div>
        </div>
      </div>
      <AddStudentFormModal
        cancelOption={() => setShowAddStudentModal(false)}
        showModal={showAddStudentModal}
      />
    </section>
  );
};

export default Students;
