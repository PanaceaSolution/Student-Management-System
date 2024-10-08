import React, { useState, useMemo, useCallback } from "react";
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
import StudentForm from "@/components/StudentForm";


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

const Students = () => {
  const [selectedExpert, setSelectedExpert] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [studentInfo, setStudentInfo] = useState({});
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

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleEdit = useCallback(() => {
    alert("Edit action triggered");
  }, []);

  const handleDelete = useCallback(() => {
    alert("Delete action triggered");
  }, []);

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleSearch = (searchTerm) => {
    console.log("Search Term:", searchTerm);
    // Implement search logic here
  };

  // Calculate the current data to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = useMemo(() => {
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [indexOfFirstItem, indexOfLastItem]);

  // Total number of pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  const exportToCSV = useCallback(() => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Data.csv");
    link.click();
  }, []);

  const exportToPDF = useCallback(() => {
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

    doc.save("students.pdf");
  }, []);
  return (
    <section>
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5">
          <div className="rounded-sm bg-[#F8F8F8] lg:col-span-3 p-3">
            <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
              <div className="flex gap-5 md:gap-4">
                <Button type="print" onClick={exportToPDF}>
                  PRINT
                </Button>
                <Select
                  options={Experts}
                  selectedValue={selectedExpert}
                  onChange={handleExpertChange}
                  className="w-32 bg-white"
                />

                <div>
                  {/* // here I have added Add Student Button */}
                  {<StudentForm />}

                </div>

              </div>
            </div>

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
                  {/* <DateSelect/> */}
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
                      {data.length}
                    </span>
                  </a>
                </div>
              ))}
            </div>
            <ResultShowing
              start={indexOfFirstItem + 1}
              end={indexOfLastItem}
              total={data.length}
            />
            <div className="relative w-full overflow-x-auto shadow-md scrollbar-none">
              <Table
                setInfo={setStudentInfo}
                items={currentItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          <div>
            <ProfileCard
              info={studentInfo}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Students;
