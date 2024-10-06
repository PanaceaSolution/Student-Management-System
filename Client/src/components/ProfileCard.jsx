// src/ProfileCard.js
import React from "react";
import Button from "@/components/Button";

const ProfileCard = ({
  refId,
  firstName,
  lastName,
  gender,
  email,
  address,
  department,
  className,
  dateCreated,
  staffStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded-sm p-6 shadow-md justify-start gap-3 bg-white flex flex-col">
      <div className="border-b-2">
        <h2 className="font-bold text-xl text-[#233255CC] text-center">Students Details</h2>
      </div>
      <div>
        <p className="font-thin">REF ID</p>
        <p className="font-semibold text-[#233255CC]">{refId}</p>
      </div>
      <div>
        <p className="font-thin">FIRST NAME</p>
        <p className="font-semibold text-[#233255CC]">{firstName}</p>
      </div>
      <div>
        <p className="font-thin">LAST NAME</p>
        <p className="font-semibold text-[#233255CC]">{lastName}</p>
      </div>
      <div>
        <p className="font-thin">GENDER</p>
        <p className="font-semibold text-[#233255CC] ">{gender}</p>
      </div>
      <div>
        <p className="font-thin">EMAIL</p>
        <p className="font-semibold text-[#233255CC] text-blue-700">{email}</p>
      </div>
      <div>
        <p className="font-thin">ADDRESS</p>
        <p className="font-semibold text-[#233255CC] text-blue-700">{address}</p>
      </div>
      <div>
        <p className="font-thin">DEPARTMENT</p>
        <p className="font-semibold text-[#233255CC]">{department}</p>
      </div>
      <div>
        <p className="font-thin">CLASS</p>
        <p className="font-semibold text-[#233255CC]">{className}</p>
      </div>
      <div>
        <p className="font-thin">DATE CREATED</p>
        <p className="font-semibold text-[#233255CC]">{dateCreated}</p>
      </div>
      <div>
        <p className="font-thin">STUDENT STATUS</p>
        <p className="font-semibold text-[#233255CC]">{staffStatus}</p>
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
