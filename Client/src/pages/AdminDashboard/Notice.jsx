import { Plus, RefreshCcw, X } from "lucide-react";
import React, { useState } from "react";
import NoticeForm from "./NoticeForm";

// List of Tailwind CSS text color classes
const tailwindColors = [
  "text-red-700",
  "text-blue-700",
  "text-green-700",
  "text-yellow-700",
  "text-purple-700",
  "text-pink-700",
  "text-indigo-700",
  "text-teal-700",
];

const getRandomColorClass = () => {
  const randomIndex = Math.floor(Math.random() * tailwindColors.length);
  return tailwindColors[randomIndex];
};

const Notice = () => {
  const [showModal, setShowModal] = useState(false); 
  const [editNotice, setEditNotice] = useState(null); 
  const [notices, setNotices] = useState([]);

  const handleEditNotice = (notice) => {
    setEditNotice(notice); 
    setShowModal(true); 
    };

  const handleCreateNotice = () => {
    setEditNotice(null); 
    setShowModal(true); 
  };

  const handleSubmit = (data) => {
    if (editNotice) {e
      const updatedNotices = notices.map((notice) =>
        notice.id === editNotice.id ? { ...notice, ...data } : notice
      );
      setNotices(updatedNotices);
    } else {
      const newNotice = { ...data, id: notices.length + 1, createdAt: new Date().toDateString() };
      setNotices([...notices, newNotice]);
    }
    setShowModal(false); 
  };

  return (
    <>
      {/* Notice Board */}
      <div className="relative h-96 bg-white">
        <div className="flex justify-between px-4 p-2 border-b-2">
          <p className="text-lg text-black font-semibold">Notice Board</p>
          <div className="flex space-x-2 cursor-pointer">
            <Plus size={20} className="cursor-pointer" onClick={handleCreateNotice} />
            <RefreshCcw size={20} className="text-green-600" />
            <X size={20} className="text-red-700" />
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="px-2 border-b-2 p-3 cursor-pointer"
              onClick={() => handleEditNotice(notice)}
            >
              <span className="text-xs font-semibold">{notice.createdAt}</span>
              <p className="text-sm flex gap-2">
                <span className={getRandomColorClass()}>{notice.title}</span>
                <span>5 min ago</span>
              </p>
              <p>{notice.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Form Modal */}
      {showModal && (
        <NoticeForm
          notice={editNotice}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Notice;
