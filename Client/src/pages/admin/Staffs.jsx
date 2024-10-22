import { DateSelect } from '@/components/DateSelect';
import SearchBox from '@/components/SearchBox';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import useStaffStore from '@/store/staffStore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StaffTable from '@/components/admin/staffTable';
import DetailsCard from '@/components/admin/DetailsCard';
import Form from '@/components/admin/Form';

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
  { value: "Janitor", label: "Janitor" },
];

const Staffs = () => {
  const { staff, getAllStaff } = useStaffStore();

  const [selectedExport, setSelectedExport] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [date, setDate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllStaff();
  }, [getAllStaff]);

  // Memoized filtered staff data
  const filteredStaff = useMemo(() => {
    return staff.filter((item) => {
      const matchesSearchTerm =
        searchTerm === "" ||
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        selectedGender === "" || item.gender === selectedGender;

      const matchesRole = selectedRole === "" || item.role === selectedRole;

      const matchesDate =
        !date || new Date(item.dob).toDateString() === date.toDateString();

      return matchesSearchTerm && matchesGender && matchesRole && matchesDate;
    });
  }, [staff, searchTerm, selectedGender, selectedRole, date]);

  // Handle format selection and trigger export
  const handleExportChange = (event) => {
    const value = event.target.value;
    setSelectedExport(value);
    if (value === "CSV") {
      exportToCSV();
    } else if (value === "PDF") {
      exportToPDF();
    }
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
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

  return (
    <section>
      <div className='max-w-full mx-auto'>
        <div className={`grid grid-cols-1 gap-4 ${selectedId ? 'lg:grid-cols-7 2xl:grid-cols-4 lg:gap-1' : 'pr-4'} transition-all duration-300`}>
          <div className='rounded-sm bg-card lg:col-span-5 2xl:col-span-3 p-3'>
            <div className="flex justify-evenly sm:justify-end border-b-2 p-3">
              <div className="flex gap-3 md:gap-4">
                <Button variant="print">
                  PRINT
                </Button>
                <Select
                  options={Exports}
                  selectedValue={selectedExport}
                  onChange={handleExportChange}
                  className="w-32 bg-white"
                />
                <Form />
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
                    options={Role}
                    selectedValue={selectedRole}
                    onChange={handleRoleChange}
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
                      {filteredStaff.length}
                    </span>
                  </a>
                </div>
              ))}
            </div>
            <div className="relative w-full overflow-x-auto shadow-md">
              <StaffTable
                title="Staff"
                user={filteredStaff}
                handleUserId={handleUserId}
              />

              {filteredStaff?.length === 0 && (
                <p className="text-center">Result Not Found</p>
              )}
            </div>
          </div>

          {/* Conditionally show the DetailsCard */}
          {selectedId && (
            <div className="lg:col-span-2 2xl:col-span-1 px-3 lg:pr-4">
              <DetailsCard
                title="Staff"
                selectedId={selectedId}
                user={filteredStaff}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Staffs;
