import React, { useState, useMemo, useCallback, useEffect } from "react";
import Paginations from "@/components/common/Paginations";
import Table from "@/components/common/Tables";
import ResultShowing from "@/components/common/ResultShowing";
import ProfileCard from "@/components/ProfileCard";
import Select from "@/components/Select";
import SearchBox from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { DateSelect } from "@/components/DateSelect";
import AddStudentFormModal from "./StudentForm/AddStudentFormModal";
import useExport from "@/hooks/useExport";
import useStudentStore from "@/store/studentStore";

// Custom hook for debouncing input value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value); // Set the debounced value after a delay
    }, delay);
    return () => clearTimeout(handler); // Cleanup on value change
  }, [value, delay]);

  return debouncedValue; // Return the debounced value
};

// Options for export formats
const Exports = [
  { value: "", label: "EXPORT" },
  { value: "CSV", label: "CSV" },
  { value: "PDF", label: "PDF" },
];

// Gender and Department options for filtering
const Gender = [
  { value: "", label: "Gender" },
  { value: "MALE", label: "MALE" },
  { value: "FEMALE", label: "FEMALE" },
  { value: "OTHERS", label: "OTHERS" },
];

const Department = [
  { value: "", label: "CLASS" },
  { value: "CSIT", label: "CSIT" },
  { value: "BCA", label: "BCA" },
  { value: "BIM", label: "BIM" },
];
const Students = () => {
  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [studentInfo, setStudentInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const { getAllStudents, loading, error, students, totalPages, totalItems } =
    useStudentStore();
  const itemsPerPage = 8;

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounced search term for efficiency

  // Ensure query is correct whenever filters or page change
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGender) params.append("gender", selectedGender);
    if (selectedDepartment) params.append("Class", selectedDepartment);
    if (debouncedSearchTerm) params.append("firstName", debouncedSearchTerm);
    if (date) params.append("date", date);
    params.append("page", currentPage);
    return `${params.toString()}`;
  }, [
    selectedGender,
    selectedDepartment,
    debouncedSearchTerm,
    date,
    currentPage,
  ]);

  // Fetch students when page or filters change
  useEffect(() => {
    const fetchStudents = async () => {
      await getAllStudents(query);
    };

    fetchStudents();
  }, [query, getAllStudents, currentPage]);

  // Export function logic
  const { exportToCSV, exportToPDF } = useExport();

  const handleExportChange = useCallback(
    (event) => {
      const value = event.target.value;
      setSelectedExport(value);
      if (value === "CSV") {
        exportToCSV(students, "students.csv");
      } else if (value === "PDF") {
        const headers = [
          { header: "First Name", dataKey: "firstName" },
          { header: "Last Name", dataKey: "lastName" },
          { header: "Gender", dataKey: "gender" },
          { header: "Class", dataKey: "class" },
        ];
        exportToPDF(students, headers, "Students List", "students.pdf");
      }
    },
    [students, exportToCSV, exportToPDF]
  );

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  //Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return (
    <section>
      <div className="max-w-full mx-auto p-2">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5">
          <div className="rounded-sm bg-[#F8F8F8] lg:col-span-3 p-2">
            <div className="flex justify-end border-b-2 p-1">
              <div className="flex gap-4">
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
                <SearchBox
                  placeholder="Search for something..."
                  onChange={handleSearchChange}
                  className="mb-4"
                />
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
              total={totalItems}
            />

            <div className="relative w-full overflow-x-auto shadow-md">
              {error ? (
                <div className="text-red-500">Error: {error}</div>
              ) : (
                <Table
                  setStudentInfo={setStudentInfo}
                  items={students}
                  loading={loading}
                />
              )}
            </div>

            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          <div className="w-auto">
            <ProfileCard studentInfo={studentInfo} />
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
