// src/ProfileCard.js
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";

const ProfileCard = ({ onEdit, onDelete, studentInfo }) => {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (studentInfo) {
      const keyArray = Object.keys(studentInfo);
      setKeys(keyArray);
    } else {
      setKeys([]);
    }
  }, [studentInfo]);

  return (
    <div className="border rounded-sm p-6 shadow-md justify-start gap-3 bg-white flex flex-col">
      <div className="border-b-2">
        <h2 className="font-bold text-xl text-[#233255CC] text-center">
          Student Details
        </h2>
      </div>
      <div className="mt-4">
        {keys?.length === 0 ? (
          <p>Please Select ID To view Details</p>
        ) : (
          keys.map((key) => (
            <div key={key}>
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
      <div className="flex space-x-2 mt-4">
        <Button type="edit" onClick={onEdit}>
          Edit
        </Button>
        <Button type="delete" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
