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
import Loadding from '@/components/Loader/Spinner';
import Spinner from '@/components/Loader/Spinner';
import { Button } from '@/components/ui/button';

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

const staffTableHead = ["", "First Name", "Last Name", "Phone Number", "Gender", "Role", "Actions"];
const staffTableFields = ["user.profile.fname", "user.profile.lname", "user.contact.phoneNumber", "user.profile.gender", "staffRole"];

const personalInfo = [
  { label: "First Name", key: "user.profile.fname" },
  { label: "Last Name", key: "user.profile.lname" },
  { label: "Gender", key: "user.profile.gender" },
  { label: "Email", key: "user.email" },
  { label: "Role", key: "staffRole" },
  { label: "Salary", key: "salary" },
  { label: "Date of Birth", key: "user.profile.dob" },
  { label: "Enrollment Date", key: "hireDate" },
  { label: "Phone Number", key: "user.contact.phoneNumber" },
  { label: "Telephone Number", key: "user.contact.telephoneNumber" },
  { label: "Ward Number", key: "user.address[0].wardNumber" },
  { label: "Municipality", key: "user.address[0].municipality" },
  { label: "District", key: "user.address[0].district" },
  { label: "Province", key: "user.address[0].province" },
];


const Staffs = () => {

  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [date, setDate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cardOpen, setCardOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { staff, getStaff, deleteStaff } = useStaffStore()

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

  const handleUserData = (data) => {
    setSelectedData(data);
  };

  const handleEdit = (data) => {
    setFormOpen(true);
    setSelectedData(data)
  }

  const handleDelete = (id) => {
    setLoading(true);
    const res = deleteStaff(id);
    if (res.status === 200) {
      setSelectedData(null);
    }
    setLoading(false);
  };

  return (
    <section>
      <div className='max-w-full mx-auto'>
        <div className={`grid grid-cols-1 gap-4 lg:pr-4 transition-all duration-300`}>
          <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
            <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
              <div className="flex gap-3 md:gap-4">
                <Select
                  options={Exports}
                  selectedValue={selectedExport}
                  onChange={handleExportChange}
                  className="w-32 bg-white"
                />
                <AddStaffForm formOpen={formOpen} setFormOpen={setFormOpen} selectedData={selectedData} setLoading={setLoading} />
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
                handleUserData={handleUserData}
                loading={loading}
                setCardOpen={setCardOpen}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                setFormOpen={setFormOpen}
              />
            </div>
          </div>

          {/* Conditionally show the DetailsCard */}
          {selectedData && (
            <div className="lg:col-span-2 2xl:col-span-1 px-3 lg:pr-4">
              <DetailsCard
                title="Staff"
                userDetails={selectedData}
                loading={loading}
                cardOpen={cardOpen}
                setCardOpen={setCardOpen}
                personalInfo={personalInfo}
              />
            </div>
          )}
        </div>
      </div>

      {loading === true && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black opacity-50 z-50 flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </section>
  );
};

export default Staffs;
