import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import Loadding from "./Loader/Loadding";
import Modal from "./common/Modal";
import AddStudentFormModal from "@/pages/admin/StudentForm/AddStudentFormModal";

const ProfileCard = ({ onEdit, onDelete, studentInfo, loading }) => {
  const [keys, setKeys] = useState([]);
  const [openModal, setOpenModal] = useState(-1);
  const [showAddStudentModal, setShowAddStudentModal] = useState(-1);
  useEffect(() => {
    if (studentInfo) {
      const keyArray = Object.keys(studentInfo);
      setKeys(keyArray);
    } else {
      setKeys([]);
    }
  }, [studentInfo]);

  const studentId = studentInfo?.id;

  const handleEdit = () => {
    if (studentId) {
      onEdit(studentId);
    }
  };

  const handleDelete = (id) => {
    if (id) {
      onDelete(id);
    }
  };

  return (
    <>
      <div className="border rounded-sm p-4 md:p-6 shadow-md flex flex-col bg-white">
        <div className="border-b-2">
          <h2 className="font-bold text-xl text-[#233255CC] text-center">
            Student Details
          </h2>
        </div>

        <div className="mt-4 flex-1 flex-wrap break-words">
          {keys?.length === 0 ? (
            <p className="text-center">Please Select ID To view Details</p>
          ) : (
            keys.map((key) => (
              <div key={key} className="mb-2">
                <p className="font-thin capitalize">{key}</p>
                <p className="font-semibold text-[#233255CC]">
                  {studentInfo[key] !== undefined
                    ? studentInfo[key].toString()
                    : "N/A"}
                </p>
              </div>
            ))
          )}
        </div>
        <Modal
          title={`Delete ${studentInfo?.firstName}`}
          desc="Are You Sure ?"
          actionName="Delete"
          dangerAction={(e) => handleDelete(studentInfo?.id)}
          showModal={openModal === studentInfo?.id}
          cancelOption={() => setOpenModal(-1)}
        />
        <AddStudentFormModal
          cancelOption={() => setShowAddStudentModal(false)}
          showModal={showAddStudentModal === studentInfo?.id}
          studentId={studentInfo?.id}
          initialData={studentInfo}
        />

        <div className="flex justify-center space-x-2 mt-4">
          <Button
            type="edit"
            className="flex-shrink-0"
            onClick={() => setShowAddStudentModal(studentInfo.id)}
          >
            Edit
          </Button>
          <Button
            isDisable={loading}
            type="delete"
            className="flex-shrink-0"
            onClick={() => setOpenModal(studentInfo.id)}
          >
            Delete
            {loading && <Loadding />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
