import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Button from "@/components/Button";
import Loadding from "./Loader/Spinner";
import Modal from "./common/Modal";
import AddStudentFormModal from "@/pages/admin/StudentForm/AddStudentFormModal";
import suk from "../assets/suk.jpg";
import useStudentStore from "@/store/studentStore";
import Loader from "./common/Loader";

const ProfileImage = React.memo(({ imageUrl, altText }) => (
  <div className="bg-red-300 mx-auto h-24 w-24 rounded-full flex items-center justify-center mt-1">
    <img
      src={imageUrl || suk}
      alt={altText}
      className="w-full h-full rounded-full border-2 object-cover"
    />
  </div>
));

const EditDeleteButtons = React.memo(({ onEdit, onDelete, isDisabled }) => (
  <div className="flex justify-center space-x-2 mt-2">
    <Button type="edit" className="flex-shrink-0" onClick={onEdit}>
      Edit
    </Button>
    <Button
      type="delete"
      className="flex-shrink-0"
      onClick={onDelete}
      disabled={isDisabled}
    >
      Delete
    </Button>
  </div>
));

const ProfileCard = ({ studentInfo }) => {
  const [keys, setKeys] = useState([]);
  const [openModal, setOpenModal] = useState(-1);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const additionalContentRef = useRef(null);
  const { deleteStudent, deleteLoading } = useStudentStore();

  useEffect(() => {
    if (studentInfo) {
      setKeys(Object.keys(studentInfo));
    } else {
      setKeys([]);
    }
  }, [studentInfo]);

  // Handle delete logic
  const handleDelete = async (id) => {
    if (id) {
      await deleteStudent(id);
    }
  };

  const limitedKeys = useMemo(() => keys.slice(0, 4), [keys]);


  const handleShowAllDetailsToggle = useCallback(() => {
    setShowAllDetails((prev) => !prev);
  }, []);

  // Scroll to additional content when "View All" is clicked
  useEffect(() => {
    if (showAllDetails && additionalContentRef.current) {
      additionalContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [showAllDetails]);

  const studentProfileImage = studentInfo?.user_profile_profilePicture || suk;
  const studentFirstName = studentInfo?.user_username || "Unknown";
  return (
    <>
      {deleteLoading && <Loader />}
      <div className="border rounded-sm p-2 md:p-4 shadow-md flex flex-col bg-white">
        <div className="border-b-2">
          <h2 className="font-bold text-xl text-[#233255CC] text-center">
            Student Details
          </h2>
        </div>

        <div className="flex flex-col max-h-[530px] w-full overflow-y-auto scrollbar-thin">
          <ProfileImage
            imageUrl={studentProfileImage}
            altText={`${studentFirstName}'s profile`}
          />

          <div className="mt-4 flex-1 flex-wrap break-words">
            {limitedKeys.length === 0 ? (
              <p className="text-center">Please Select ID To view Details</p>
            ) : (
              limitedKeys.map((key) => {
                const value = studentInfo[key];
                if (value || value === 0 || value === false) {
                  return (
                    <div key={key} className="mb-2 pt-1">
                      <p className="font-thin capitalize">{key}</p>
                      <p className="font-semibold text-[#233255CC]">
                        {value !== undefined ? value.toString() : "N/A"}
                      </p>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            )}


            {showAllDetails && (
              <div ref={additionalContentRef}>
                {keys.slice(6).map((key) => {
                  const value = studentInfo[key];
                  if (value || value === 0 || value === false) {
                    return (
                      <div key={key} className="mb-2 pt-1">
                        <p className="font-thin capitalize">{key}</p>
                        <p className="font-semibold text-[#233255CC]">
                          {value !== undefined ? value.toString() : "N/A"}
                        </p>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            )}
          </div>

          <button
            className="mt-0 inline text-blue-700 hover:text-blue-800 hover:underline ml-auto p-2"
            onClick={handleShowAllDetailsToggle}
          >
            {showAllDetails ? "Show Less" : "View All"}
          </button>

          {/* Modal for Delete Confirmation */}
          <Modal
            title={`Delete ${studentInfo?.user_username}`}
            desc="Are You Sure?"
            actionName="Delete"
            dangerAction={() => handleDelete(studentInfo?.user_id)}
            showModal={openModal === studentInfo?.user_id}
            cancelOption={() => setOpenModal(-1)}
          />

          {/* Modal for Adding/Editing Student */}
          <AddStudentFormModal
            cancelOption={() => setShowAddStudentModal(false)}
            showModal={showAddStudentModal}
            studentId={studentInfo?.user_id}
            initialData={studentInfo}
          />
        </div>

        {/* Edit/Delete Buttons */}
        <EditDeleteButtons
          onEdit={() => setShowAddStudentModal(true)}
          onDelete={() => setOpenModal(studentInfo?.user_id)}
          isDisabled={deleteLoading}
        />
      </div>
    </>
  );
};

export default ProfileCard;
