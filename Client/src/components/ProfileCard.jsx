import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import Loadding from "./Loader/Loadding";

const ProfileCard = ({ onEdit, onDelete, studentInfo, loading }) => {
  const [keys, setKeys] = useState([]);

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

  const handleDelete = () => {
    if (studentId) {
      onDelete(studentId);
    }
  };

  return (
    <div className="border rounded-sm p-4 md:p-6 shadow-md flex flex-col bg-white">
      <div className="border-b-2">
        <h2 className="font-bold text-xl text-[#233255CC] text-center">
          Student Details
        </h2>
      </div>

      <div className="mt-4 flex-1 flex-wrap">
        {keys?.length === 0 ? (
          <p className="text-center">Please Select ID To view Details</p>
        ) : (
          keys.map((key) => (
            <div key={key} className="mb-2">
              <p className="font-thin capitalize">{key}</p>
              <p className="font-semibold text-[#233255CC]">
                {studentInfo[key] !== undefined
                  ? studentInfo[key]
                  : "N/A"}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <Button type="edit" className="flex-shrink-0" onClick={handleEdit}>
          Edit
        </Button>
        <Button isDisable={loading} type="delete" className="flex-shrink-0" onClick={handleDelete}>
          Delete
          {loading && <Loadding />}
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
