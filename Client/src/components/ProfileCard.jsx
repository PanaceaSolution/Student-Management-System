import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import Loadding from "./Loader/Loadding";
import Modal from "./common/Modal";
import AddStudentFormModal from "@/pages/admin/StudentForm/AddStudentFormModal";
import suk from "../assets/suk.jpg";

const ProfileCard = ({ onDelete, studentInfo, loading }) => {
  const [keys, setKeys] = useState([]);
  const [openModal, setOpenModal] = useState(-1);
  const [showAddStudentModal, setShowAddStudentModal] = useState(-1);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const additionalContentRef = useRef(null);

  useEffect(() => {
    if (studentInfo) {
      setKeys(Object.keys(studentInfo));
    } else {
      setKeys([]);
    }
  }, [studentInfo]);

  const handleDelete = (id) => {
    if (id) {
      onDelete(id);
    }
  };

  const limitedKeys = keys.slice(0, 6);

  useEffect(() => {
    if (showAllDetails && additionalContentRef.current) {
      additionalContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [showAllDetails]);

  return (
    <>
      <div className="border rounded-sm p-2 md:p-4 shadow-md flex flex-col bg-white">
        <div className="border-b-2">
          <h2 className="font-bold text-xl text-[#233255CC] text-center">
            Student Details
          </h2>
        </div>

        <div className="flex flex-col max-h-[530px] w-full overflow-y-auto scrollbar-thin">
          <div className="bg-red-300 mx-auto h-24 w-24 rounded-full flex items-center justify-center mt-1">
            <img
              src={suk}
              alt={`${studentInfo?.firstName}'s profile`}
              className="w-full h-full rounded-full border-2 object-cover"
            />
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

            {/* Additional content area for "View All" */}
            {showAllDetails && (
              <div ref={additionalContentRef}>
                {keys.slice(6).map((key) => (
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
            )}
          </div>

          <button
            className="mt-0 inline text-blue-700 hover:text-blue-800 hover:underline ml-auto p-2"
            onClick={() => setShowAllDetails((prev) => !prev)}
          >
            {showAllDetails ? "Show Less" : "View All"}
          </button>

          <Modal
            title={`Delete ${studentInfo?.firstName}`}
            desc="Are You Sure?"
            actionName="Delete"
            dangerAction={() => handleDelete(studentInfo?.id)}
            showModal={openModal === studentInfo?.id}
            cancelOption={() => setOpenModal(-1)}
          />

          <AddStudentFormModal
            cancelOption={() => setShowAddStudentModal(false)}
            showModal={showAddStudentModal === studentInfo?.id}
            studentId={studentInfo?.id}
            initialData={studentInfo}
          />
        </div>

        <div className="flex justify-center space-x-2 mt-2 sticky bottom-0">
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
