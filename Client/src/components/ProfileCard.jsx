import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import Loadding from "./Loader/Loadding";
import Modal from "./common/Modal";
import AddStudentFormModal from "@/pages/admin/StudentForm/AddStudentFormModal";
import { User2Icon } from "lucide-react";
import suk from "../assets/suk.jpg"
const ProfileCard = ({ onDelete, studentInfo, loading }) => {
  const [keys, setKeys] = useState([]);
  const [openModal, setOpenModal] = useState(-1);
  const [showAddStudentModal, setShowAddStudentModal] = useState(-1);
  const [showAllDetails, setShowAllDetails] = useState(false);

  useEffect(() => {
    if (studentInfo) {
      const keyArray = Object.keys(studentInfo);
      setKeys(keyArray);
    } else {
      setKeys([]);
    }
  }, [studentInfo]);


  const handleDelete = (id) => {
    if (id) {
      onDelete(id);
    }
  };

  const limitedKeys = keys.slice(0, 5);

  return (
    <>
      <div className="border rounded-sm p-4 md:p-6 shadow-md flex flex-col bg-white">
        <div className="border-b-2">
          <h2 className="font-bold text-xl text-[#233255CC] text-center">
            Student Details
          </h2>
        </div>

        <div className="bg-red-300 mx-auto h-24 w-24 rounded-full flex items-center justify-center mt-4">
          {/* {studentInfo?.profilePicUrl ? ( */}
            <img
              src={suk}
              alt={`${studentInfo.firstName}'s profile`}
              className="w-full h-full rounded-full border-2 object-cover"
            />
          {/* ) : (
            <User2Icon className="w-16 h-16 text-[#233255CC]" />
          )} */}
        </div>

        <div className="mt-4 flex-1 flex-wrap break-words">
          {limitedKeys.length === 0 ? (
            <p className="text-center">Please Select ID To view Details</p>
          ) : (
            limitedKeys.map((key) => (
              <div key={key} className="mb-2 pt-1">
                <p className="font-thin capitalize">{key}</p>
                <p className="font-semibold text-[#233255CC]">
                  {studentInfo[key] !== undefined
                    ? studentInfo[key].toString()
                    : "N/A"}
                </p>
              </div>
            ))
          )}
          {showAllDetails &&
            keys.length > limitedKeys.length &&
            keys.slice(3).map((key) => (
              <div key={key} className="mb-2 pt-1">
                <p className="font-thin capitalize">{key}</p>
                <p className="font-semibold text-[#233255CC]">
                  {studentInfo[key] !== undefined
                    ? studentInfo[key].toString()
                    : "N/A"}
                </p>
              </div>
            ))}
        </div>

        <button
          className="mt-0 inline text-blue-700 hover:text-blue-800 hover:underline ml-auto"
          onClick={() => setShowAllDetails((prev) => !prev)}
        >
          {showAllDetails ? "Show Less" : "View All"}
        </button>

        <Modal
          title={`Delete ${studentInfo?.firstName}`}
          desc="Are You Sure?"
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

        <div className="flex justify-center space-x-2 mt-2">
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
