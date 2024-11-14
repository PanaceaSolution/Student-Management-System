import { DateSelect } from '@/components/DateSelect';
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StaffTable from '@/components/admin/staffTable';
import DetailsCard from '@/components/admin/DetailsCard';
import AddStaffForm from '@/components/admin/StaffForm/AddStaffForm';
import useExport from '@/hooks/useExport';
import ActiveTab from '@/components/common/activeTab';
import useUserStore from '@/store/userStore';
import useStaffStore from '@/store/staffStore';

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
const staffTableFields = ["profile.fname", "profile.lname", "contact.phoneNumber", "profile.gender", "role"];

const staffDetails = [
  { label: "First Name", key: "profile.fname" },
  { label: "Last Name", key: "profile.lname" },
  { label: "Gender", key: "profile.gender" },
  { label: "Date of Birth", key: "profile.dob" },
  { label: "Email", key: "email" },
  { label: "Phone Number", key: "contact.phoneNumber" },
  { label: "Telephone Number", key: "contact.telephoneNumber" },
  { label: "Role", key: "role" },
  { label: "Ward Number", key: "address[0].wardNumber" },
  { label: "Municipality", key: "address[0].municipality" },
  { label: "District", key: "address[0].district" },
  { label: "Province", key: "address[0].province" },
  { label: "Enrollment Date", key: "hireDate" },
  { label: "Salary", key: "salary" },
];


const Staffs = () => {

  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [date, setDate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { staff, getStaff, deleteStaff, loading } = useStaffStore()

  useEffect(() => {
    getStaff("STAFF");
  }, []);


  // const staff = useMemo(() => allUsers, [allUsers]);

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

  const handleUserId = (data) => {
    setSelectedData(data);
  };

  const handleDelete = () => {
    const res = deleteStaff(selectedData.id);
    if (res.status === 200) {
      setSelectedData(null);
    }
  };

  return (
    <section>
      <div className='max-w-full mx-auto'>
        <div className={`grid grid-cols-1 gap-4 ${selectedData ? 'lg:grid-cols-7 2xl:grid-cols-4 lg:gap-1' : 'lg:pr-4'} transition-all duration-300`}>
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
              <StaffTable
                title="Staff"
                tableHead={staffTableHead}
                tableFields={staffTableFields}
                user={staff}
                handleUserId={handleUserId}
                loading={loading}
              />
            </div>
          </div>

          {/* Conditionally show the DetailsCard */}
          {selectedData && (
            <div className="lg:col-span-2 2xl:col-span-1 px-3 lg:pr-4">
              <DetailsCard
                title="Staff"
                userDetails={selectedData}
                content={staffDetails}
                handleDelete={handleDelete}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Staffs;
