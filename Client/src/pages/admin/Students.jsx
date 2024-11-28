import React, { useState, useMemo, useCallback, useEffect, } from "react";
import Table from "@/components/common/Tables";
import Select from "@/components/Select";
import SearchBox from "@/components/SearchBox";
import { DateSelect } from "@/components/DateSelect";
import useExport from "@/hooks/useExport";
import useStudentStore from "@/store/studentStore";
import { flattenData } from "@/utilities/utilities.js";
import ActiveTab from "@/components/common/activeTab";
import DetailsCard from "@/components/admin/DetailsCard";
import AddStudentForm from "./StudentForm/AddStudentForm";
import AdminTable from "@/components/admin/AdminTable";

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

const studentTableHead = ["", "First Name", "Last Name", "Gender", "Class", "Section", "Actions"];
const studentTableFields = ["user_profile_fname", "user_profile_lname", "user_profile_gender", "studentClass", "section"];


const personalInfo = [
  { label: "First Name", key: "user_profile_fname" },
  { label: "Last Name", key: "user_profile_lname" },
  { label: "Father Name", key: "fatherName" },
  { label: "Mother Name", key: "motherName" },
  { label: "Guardian Name", key: "guardianName" },
  { label: "Date of Birth", key: "user_profile_dob" },
  { label: "Gender", key: "user_profile_gender" },
  { label: "Blood Group", key: "bloodType" },
  { label: "Religion", key: "religion" },
  { label: "Class", key: "studentClass" },
  { label: "Section", key: "section" },
  { label: "Roll Number", key: "rollNumber" },
  { label: "Registration Number", key: "registrationNumber" },
  { label: "Previous School", key: "previousSchool" },
  { label: "Date of Admission", key: "admissionDate" },
  { label: "Email", key: "user_email" },
  { label: "Phone Number", key: "user_contact_phoneNumber" },
  { label: "Telephone Number", key: "user_contact_telephoneNumber" },
  { label: "Ward Number", key: "user_address_0_wardNumber" },
  { label: "Municipality", key: "user_address_0_municipality" },
  { label: "District", key: "user_address_0_district" },
  { label: "Province", key: "user_address_0_province" },
];

const personalDocuments = [
  { label: "Birth Certificate", key: "user_documents_0_documentFile" },
  { label: "CitizenShip", key: "user_documents_1_documentFile" },
  { label: "MarkSheet", key: "user_documents_2_documentFile" }
]

const Students = () => {
  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { getAllStudents, deleteStudent, isDeleting, error, students, totalPages, total } = useStudentStore();

  useEffect(() => {
    getAllStudents("STUDENT");
  }, []);

  // Export function logic
  const { exportToCSV, exportToPDF } = useExport();

  const handleExportChange = useCallback(
    (event) => {
      const value = event.target.value;
      setSelectedExport(value);
      if (value === "CSV") {
        if (students.length > 0) {
          exportToCSV(flattenData(students), "students.csv");
        } else {
          alert("No students to export");
        }
      } else if (value === "PDF") {
        if (students.length > 0) {
          const headers = [
            { header: "First Name", dataKey: "firstName" },
            { header: "Last Name", dataKey: "lastName" },
            { header: "Gender", dataKey: "gender" },
            { header: "Class", dataKey: "class" },
          ];
          exportToPDF(flattenData(students), headers, "Students List", "students.pdf");
        } else {
          alert("No students to export");
        }
      }
    },
    [students, exportToCSV, exportToPDF]
  );

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleGenderChange = useCallback((event) => {
    setSelectedGender(event.target.value);
  }, []);

  const handleDepartmentChange = useCallback((event) => {
    setSelectedDepartment(event.target.value);
  }, []);

  const handleDateChange = useCallback((selectedDate) => {
    if (selectedDate !== date) {
      setDate(selectedDate);
    }
  }, [date]);

  const handleUserData = (data) => {
    setSelectedData(data);
    setCardOpen(true)
  };

  const handleEdit = (data) => {
    setCurrentStep(0);
    setFormOpen(true);
    setSelectedData(data)
  }

  const handleDelete = async (data) => {
    await deleteStudent(data.user_id);
  }

  return (
    <section>
      <div className="max-w-full mx-auto p-2">
        <div className="grid grid-cols-1 gap-4 lg:pr-4">
          <div className="rounded-sm bg-[#F8F8F8] lg:col-span-3 p-2">
            <div className="flex justify-end border-b-2 p-1">
              <div className="flex gap-4">
                <Select
                  options={Exports}
                  selectedValue={selectedExport}
                  onChange={handleExportChange}
                  className="w-32 bg-white"
                />
                <AddStudentForm
                  formOpen={formOpen}
                  setFormOpen={setFormOpen}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  selectedData={selectedData}
                  setSelectedData={setSelectedData}
                />
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
            <ActiveTab
              activeTab={activeTab}
              user={students}
              handleTabClick={handleTabClick}
            />
            <div className="relative w-full overflow-x-auto shadow-md">
              <AdminTable
                title="Students"
                tableHead={studentTableHead}
                tableFields={studentTableFields}
                handleUserData={handleUserData}
                user={students}
                loading={isDeleting}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedData &&
        <DetailsCard
          title="Student"
          userDetails={selectedData}
          cardOpen={cardOpen}
          setCardOpen={setCardOpen}
          personalInfo={personalInfo}
          personalDocuments={personalDocuments}
        />
      }
    </section>
  );
};

export default Students;
