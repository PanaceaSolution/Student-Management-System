import { Plus } from "lucide-react";
import { useState } from "react";
import NoticeForm from "../NoticeForm";
import dayjs from 'dayjs';
import { FaTrash } from "react-icons/fa";
import useNoticeStore from "@/store/noticeStore";

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
  const [formOpen, setFormOpen] = useState(false);
  const notices = useNoticeStore((state) => state.notices);
  const {deleteNotice} = useNoticeStore()

  const handleDelete = async (noticeID)=>{
    console.log("id is this", noticeID);
    await deleteNotice(noticeID);

  }

  return (
    <>
      {/* Notice Board */}
      <div className="relative h-full bg-white p-4 rounded-lg shadow-md border lg:col-span-2">
        <div className="flex justify-between px-4 p-2 border-b-2">
          <p className="text-lg text-black font-semibold">Notice Board</p>
          <div className="flex space-x-2 cursor-pointer">
            <Plus
              size={20}
              className="cursor-pointer"
              onClick={() => setFormOpen(true)}
            />
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin">
          {notices.map((notice) => (
            <div key={notice.id} className="px-2 border-b-2 p-3 cursor-pointer">
              <div className="flex justify-end">
                <button
                onClick={()=>handleDelete(notice.noticeID)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={18} />
                </button>
              </div>
              <span className="text-xs font-semibold">
                {dayjs(notice.createdAt).format("YY-MM-DD")}
              </span>
              <p className="text-sm flex gap-2">
                <span className={getRandomColorClass()}>{notice.title}</span>
              </p>
              <p>{notice.description}</p>
            </div>
          ))}
        </div>
      </div>

      <NoticeForm formOpen={formOpen} setFormOpen={setFormOpen} />
    </>
  );
};

export default Notice;
