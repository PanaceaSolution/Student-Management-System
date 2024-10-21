import React, { useState, useMemo, useCallback, useEffect } from "react";
import Paginations from "@/components/Paginations"; // Pagination component
import Table from "@/components/Tables"; // Table to display student data
import ResultShowing from "@/components/ResultShowing";
import ProfileCard from "@/components/ProfileCard";
import Select from "@/components/Select";
import SearchBox from "@/components/SearchBox";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import useGetAllStudents from "@/hooks/useGetAllStudents"; // Custom hook to fetch students
import useDeleteStudent from "@/hooks/useDeleteStudnet"; // Custom hook to delete a student
import { DateSelect } from "@/components/DateSelect";
import Alert from "@/components/Alert"; // Alert notification component
import StudentForm from "@/components/StudentForm";
import { Button } from "@/components/ui/button";

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
const Experts = [
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
  const [selectedExpert, setSelectedExpert] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [studentInfo, setStudentInfo] = useState({}); // Store selected student info
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

  const itemsPerPage = 10; // Items to show per page
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounced search term for efficiency

  // Reset current page on filter change
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
  const { students: allStudents, loading, error } = useGetAllStudents(query);
  const {
    deleteStudent,
    loading: deleteLoading,
    error: deleteError,
    success,
  } = useDeleteStudent();



  // State to hold current students data
  const [students, setStudents] = useState(allStudents || []);

  // Update students when allStudents changes
  useEffect(() => {
    setStudents(allStudents);
  }, [allStudents]);

  // Show alert on successful deletion
  useEffect(() => {
    if (success) {
      setShowAlert(true);
    }
  }, [success]);

  // Handle format selection and trigger export
  const handleExpertChange = (event) => {
    const value = event.target.value;
    setSelectedExpert(value);
    if (value === "CSV") {
      exportToCSV();
    } else if (value === "PDF") {
      exportToPDF();
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
      if (id) {
        try {
          await deleteStudent(id); // Wait for the deletion to complete
          setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== id)
          );
        } catch (err) {
          console.error("Failed to delete student:", err);
          <Alert
            title="Error Occured!!!!!"
            message={err?.message} // Show success alert after deletion
            variant="warning"
            position="top-right"
            onDismiss={() => setShowAlert(false)}
          />;
        }
      }
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

  // Export students data to CSV
  const exportToCSV = useCallback(() => {
    const csv = Papa.unparse(students);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "students.csv");
    link.click(); // Trigger download
  }, [students]);

  // Export students data to PDF
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    const columns = [
      { header: "First Name", dataKey: "firstName" },
      { header: "Last Name", dataKey: "lastName" },
      { header: "Gender", dataKey: "gender" },
      { header: "Class", dataKey: "class" },
    ];

    // Map students to PDF format
    const pdfStudents = students?.map((student) => ({
      firstName: student?.firstName,
      lastName: student?.lastName,
      gender: student?.gender,
      Class: student?.Class,
    }));

    doc.setFontSize(18);
    doc.text("Student List", 14, 22);
    doc.autoTable({
      columns: columns,
      body: pdfStudents,
      startY: 30,
      margin: { horizontal: 10 },
    });

    doc.save("students.pdf"); // Save PDF
  }, [students]);

  return (
    <section>
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5">
          <div className="rounded-sm bg-[#F8F8F8] lg:col-span-3 p-3">
            <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
              <div className="flex gap-3 md:gap-4">
                <Button variant="print" onClick={exportToPDF}>
                  PRINT
                </Button>
                <Select
                  options={Experts}
                  selectedValue={selectedExpert}
                  onChange={handleExpertChange}
                  className="w-32 bg-white"
                />
                <StudentForm />
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

            <div className="bg-[#F8F8F8] flex gap-6 justify-start items-center p-4 border-b-2">
              {["all", "present", "alumni"].map((tab) => (
                <div key={tab}>
                  <a
                    href="#"
                    className={`font-semibold cursor-pointer ${activeTab === tab ? "border-b-2 border-blue-600" : ""
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
          <div className="w-auto">
            <ProfileCard
              loading={deleteLoading}
              studentInfo={studentInfo} // Show selected student info
              onEdit={handleEdit} // Handle edit action
              onDelete={handleDelete} // Handle delete action
            />
          </div>
        </div>
      </div>
      {showAlert && (
        <Alert
          title="Deleted Successfully!!!!!"
          message={`Student Deleted Successfully!!`} // Show success alert after deletion
          variant="success"
          position="top-right"
          onDismiss={() => setShowAlert(false)} // Dismiss alert
        />
      )}
    </section>
  );
};

export default Students;
