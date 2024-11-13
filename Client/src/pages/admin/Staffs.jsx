import { DateSelect } from '@/components/DateSelect';
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import useStaffStore from '@/store/staffStore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StaffTable from '@/components/admin/staffTable';
import DetailsCard from '@/components/admin/DetailsCard';
import AddStaffForm from '@/components/admin/StaffForm/AddStaffForm';
import useExport from '@/hooks/useExport';
import ActiveTab from '@/components/common/activeTab';

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

const Role = [
  { value: "", label: "Role" },
  { value: "Accountant", label: "Accountant" },
  { value: "Librarian", label: "Librarian" },
];

const staffTableHead = ["", "First Name", "Last Name", "Phone Number", "Gender", "Role"];
const staffTableFields = ["profile.fname", "profile.lname", "contact.phoneNumber", "profile.gender", "staffRole"];

const staffDetails = [
  { label: "First Name", key: "profile.fname" },
  { label: "Last Name", key: "lname" },
  { label: "Gender", key: "gender" },
  { label: "Blood Type", key: "bloodType" },
  { label: "Date of Birth", key: "dob" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phoneNumber" },
  { label: "Role", key: "role" },
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



const Staffs = () => {

  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [date, setDate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { staff, getAllStaff, staffById, getStaffById, deleteStaff, error } = useStaffStore();

  useEffect(() => {
    getAllStaff();
  }, [getAllStaff]);



  // Handle format selection and trigger export
  const { exportToCSV, exportToPDF } = useExport()
  const handleExportChange = (event) => {
    const value = event.target.value;
    setSelectedExport(value);
    if (value === "CSV") {
      exportToCSV(staff, "staffs.csv");
    } else if (value === "PDF") {
      const headers = [
        { header: "First Name", dataKey: "fname" },
        { header: "Last Name", dataKey: "lname" },
        { header: "Gender", dataKey: "gender" },
        { header: "Role", dataKey: "role" },
      ]
      exportToPDF(staff, headers, "Staff List", "staffs.pdf");
    }
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
        <div className={`grid grid-cols-1 gap-4 ${selectedId ? 'lg:grid-cols-7 2xl:grid-cols-4 lg:gap-1' : 'lg:pr-4'} transition-all duration-300`}>
          <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
            <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
              <div className="flex gap-3 md:gap-4">
                <Select
                  options={Exports}
                  selectedValue={selectedExport}
                  onChange={handleExportChange}
                  className="w-32 bg-white"
                />
                <AddStaffForm />
              </div>
            </div>
            <div className="border-b-2 p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <SearchBox
                    placeholder="Search for something..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Select
                    options={Gender}
                    selectedValue={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full bg-white"
                  />
                  <Select
                    options={Role}
                    selectedValue={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-white"
                  />
                  <div className="col-span-1">
                    <DateSelect onChange={(date) => handleDateChange(date)} />
                  </div>
                </div>
              </div>
            </div>
            <ActiveTab
              activeTab={activeTab}
              staff={staff}
              handleTabClick={handleTabClick}
            />
            <div className="relative w-full overflow-x-auto shadow-md">
              {staff?.length === 0 ? (
                <p className="text-center text-destructive">
                  No staff found
                </p>
              ) : (
                <StaffTable
                  title="Staff"
                  tableHead={staffTableHead}
                  tableFields={staffTableFields}
                  user={staff}
                  handleUserId={handleUserId}
                />
              )}
            </div>
          </div>

          {/* Conditionally show the DetailsCard */}
          {selectedId && (
            <div className="lg:col-span-2 2xl:col-span-1 px-3 lg:pr-4">
              <DetailsCard
                title="Staff"
                selectedId={selectedId}
                userDetails={staffById}
                content={staffDetails}
                handleDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Staffs;
