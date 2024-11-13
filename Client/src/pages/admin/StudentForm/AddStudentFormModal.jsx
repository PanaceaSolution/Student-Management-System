import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import AddStudentForm from "./AddStudentForm";
import { X } from "lucide-react";

const AddStudentFormModal = ({
  cancelOption,
  showModal,
  studentId,
  initialData,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(showModal);
  }, [showModal]);

  const handleClose = () => {
    setOpen(false);
    cancelOption();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50 ">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      />
      <div className="fixed inset-0 z-10 w-screen h-screen overflow-scroll scrollbar-none">
        <div className="flex min-h-full items-center justify-center  text-center sm:p-1 ">
          <div className="p-2 md:w-[735px] ">
            <DialogPanel
              transition
              className=" relative transform overflow-hidden rounded-lg  text-left shadow-xl transition-all  sm:my-8 sm:w-full sm:max-w-4xl"
            >
              <AddStudentForm studentId={studentId} initialData={initialData} />

              <div className="absolute top-1 right-2">
                <button
                  type="button"
                  data-autofocus
                  onClick={handleClose}
                  
                >
                  <X className="animate-pulse bg-blue-700 rounded-full text-white  font-bold text-2xl" />
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddStudentFormModal;
