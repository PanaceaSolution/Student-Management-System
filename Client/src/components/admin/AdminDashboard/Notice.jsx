import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import NoticeForm from "../NoticeForm";
import useNoticeStore from "@/store/noticeStore";
import NoticeCard from "./NoticeCard";
import useAuthStore from "@/store/authStore";



const Notice = () => {
  const [formOpen, setFormOpen] = useState(false);
  const { loggedInUser } = useAuthStore()
  const role = loggedInUser.role
  const { notices, getNotices } = useNoticeStore();
  const { deleteNotice } = useNoticeStore()

  useEffect(() => {
    const fetchNotices = async () => {
      await getNotices();
    }
    fetchNotices();
  }, []);

  const handleDelete = async (noticeID) => {
    await deleteNotice(noticeID);
  }

  return (
    <>
      {/* Notice Board */}
      <div className="relative h-full bg-white p-4 rounded-lg shadow-md border lg:col-span-2">
        <div className="flex justify-between px-4 p-2 border-b-2">
          <p className="text-lg text-black font-semibold">Notice Board</p>
          {role === "ADMIN" && <div className="flex space-x-2 cursor-pointer">
            <Plus
              size={20}
              className="cursor-pointer"
              onClick={() => setFormOpen(true)}
            />
          </div>}
        </div>
        <NoticeCard notices={notices} handleDelete={handleDelete} role={role} />
      </div>

      <NoticeForm formOpen={formOpen} setFormOpen={setFormOpen} />
    </>
  );
};

export default Notice;
