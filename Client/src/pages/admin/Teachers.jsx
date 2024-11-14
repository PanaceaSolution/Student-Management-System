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
import useUserStore from '@/store/userStore';

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


const teacherTableHead = ["", "First Name", "Last Name", "Phone Number", "Gender", "Actions"];
const teacherTableFields = ["user.profile.fname", "user.profile.lname", "user.contact.phoneNumber", "user.profile.gender"];

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


const Teachers = () => {

  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [date, setDate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cardOpen, setCardOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const { teacher, getStaff, deleteStaff, loading } = useStaffStore()

  useEffect(() => {
    getStaff("STAFF");
  }, []);

  // const teacher = useMemo(() => staff, [staff]);

  const { exportToCSV, exportToPDF } = useExport();
  // Handle format selection and trigger export
  const handleExportChange = (event) => {
    const value = event.target.value;
    setSelectedExport(value);
    if (value === "CSV") {
      exportToCSV(teacher, "teachers.csv");
    } else if (value === "PDF") {
      const headers = [
        { header: "First Name", dataKey: "fname" },
        { header: "Last Name", dataKey: "lname" },
        { header: "Gender", dataKey: "gender" },
      ];
      exportToPDF(teacher, headers, "Teachers List", "teachers.pdf");
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

  const handleUserData = (data) => {
    setSelectedData(data);
  };

  const handleEdit = (data) => {
    setFormOpen(true);
    setSelectedData(data)
  }

  const handleDelete = (id) => {
    const res = deleteStaff(id);
    if (res.status === 200) {
      setSelectedData(null);
    }
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

                <AddStaffForm formOpen={formOpen} setFormOpen={setFormOpen} selectedData={selectedData} />
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
                  <div className="col-span-1">
                    <DateSelect onChange={(date) => handleDateChange(date)} />
                  </div>
                </div>
              </div>
            </div>
            <ActiveTab
              activeTab={activeTab}
              staff={teacher}
              handleTabClick={handleTabClick}
            />
            <div className="relative w-full overflow-x-auto shadow-md">
              <StaffTable
                title="Teacher"
                tableHead={teacherTableHead}
                tableFields={teacherTableFields}
                user={teacher}
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
                title="Teacher"
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
    </section>
  );
};

export default Teachers;
