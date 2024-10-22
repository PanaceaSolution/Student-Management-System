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
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      />
      <div className="fixed inset-0 z-10 w-screen h-screen overflow-scroll scrollbar-none">
        <div className="flex min-h-full items-center justify-center p-2 text-center sm:p-0 ">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
          >
            <AddStudentForm studentId={studentId} initialData={initialData} />

            <div className="absolute top-0 right-0">
              <button
                type="button"
                data-autofocus
                onClick={handleClose}
                className="h-8 w-8 flex items-center justify-center text-white rounded-full bg-red-500 hover:text-red-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <X />
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddStudentFormModal;
