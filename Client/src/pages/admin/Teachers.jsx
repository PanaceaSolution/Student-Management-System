import { DateSelect } from '@/components/DateSelect';
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import useStaffStore from '@/store/staffStore';
import React, { useCallback, useEffect, useState } from 'react';
import StaffTable from '@/components/admin/staffTable';
import DetailsCard from '@/components/admin/DetailsCard';
import AddStaffForm from '@/components/admin/StaffForm/AddStaffForm';
import useExport from '@/hooks/useExport';

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


const teacherTableHead = ["", "First Name", "Last Name", "Phone Number", "Gender"];
const teacherTableFields = ["fname", "lname", "phoneNumber", "gender"];

const teacherContent = [
  { label: "First Name", key: "fname" },
  { label: "Last Name", key: "lname" },
  { label: "Gender", key: "gender" },
  { label: "Blood Type", key: "bloodType" },
  { label: "Date of Birth", key: "dob" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phoneNumber" },
  { label: "Permanent Address", key: "permanentAddress" },
  { label: "Temporary Address", key: "temporaryAddress" },
  { label: "City", key: "city" },
  { label: "Province", key: "province" },
  { label: "Postal Code", key: "postalCode" },
  { label: "State", key: "state" },
  { label: "Village Name", key: "villageName" },
  { label: "Enrollment Date", key: "enrollDate" },
  { label: "Salary", key: "salary" },
];


const Teachers = () => {

  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [date, setDate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { staff, getAllStaff, staffById, getStaffById, deleteStaff } = useStaffStore();

  useEffect(() => {
    getAllStaff();
  }, [getAllStaff]);

  // Memoized filtered staff data
  const filteredUser = staff.filter((staffMember) => staffMember.role === "Teacher")

  const { exportToCSV, exportToPDF } = useExport();
  // Handle format selection and trigger export
  const handleExportChange = (event) => {
    const value = event.target.value;
    setSelectedExport(value);
    if (value === "CSV") {
      exportToCSV(filteredUser, "teachers.csv");
    } else if (value === "PDF") {
      const headers = [
        { header: "First Name", dataKey: "fname" },
        { header: "Last Name", dataKey: "lname" },
        { header: "Gender", dataKey: "gender" },
      ];
      exportToPDF(filteredUser, headers, "Teachers List", "teachers.pdf");
    }
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleUserId = (id) => {
    setSelectedId(id);
  };

  useEffect(() => {
    if (selectedId) {
      getStaffById(selectedId);
    }
  }, [selectedId, getStaffById]);

  const handleDelete = () => {
    deleteStaff(selectedId);
    setSelectedId(null);
  };

  return (
    <section>
      <div className='max-w-full mx-auto'>
        <div className={`grid grid-cols-1 gap-4 ${selectedId ? 'lg:grid-cols-7 2xl:grid-cols-4 lg:gap-1' : 'lg:pr-4'}  transition-all duration-300`}>
          <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
            <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
              <div className="flex gap-3 md:gap-4">
                <Select
                  options={Exports}
                  selectedValue={selectedExport}
                  onChange={handleExportChange}
                  className="w-32 bg-white"
                />

                <AddStaffForm title="Create" user="Teacher" />
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
                    className={`font-semibold cursor-pointer ${activeTab === tab ? "border-b-2 border-blue-600" : "text-gray-500"
                      }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab.toUpperCase()}{" "}
                    <span
                      className={`text-primary bg-gray-200 px-1 rounded ${activeTab === tab ? "" : ""}`}
                    >
                      {filteredUser.length}
                    </span>
                  </a>
                </div>
              ))}
            </div>
            <div className="relative w-full overflow-x-auto shadow-md">
              {filteredUser?.length === 0 ? (
                <p className="text-center">No data available</p>
              ) : (
                <StaffTable
                  title="Teacher"
                  tableHead={teacherTableHead}
                  tableFields={teacherTableFields}
                  user={filteredUser}
                  handleUserId={handleUserId}
                />
              )}
            </div>
          </div>

          {/* Conditionally show the DetailsCard */}
          {selectedId && (
            <div className="lg:col-span-2 2xl:col-span-1 px-3 lg:pr-4">
              <DetailsCard
                title="Teacher"
                selectedId={selectedId}
                userDetails={staffById}
                content={teacherContent}
                handleDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Teachers;