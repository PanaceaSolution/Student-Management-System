import { Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "./Modal";
import { IconLeft, IconRight } from "react-day-picker";
import Loader from "../common/Loader";
import useStudentStore from "@/store/studentStore";
import { flattenData } from "@/utilities/utilities";
import LoadingText from "./LoadingText";
const Tables = React.memo(({ items, setStudentInfo,loading }) => {
  const flattenedStudents = useMemo(() => flattenData(items), [items]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [headerValue, setHeaderValue] = useState([]);
  const [openModal, setOpenModal] = useState(-1);
  const [showAllKeys, setShowAllKeys] = useState(false);
  const { deleteStudent, deleteLoading } = useStudentStore();

  // Handle checkbox selection
  const handleCheckboxChange = useCallback((id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [id];
      }
    });
  }, []);

  // Set student info based on selected checkbox
  useEffect(() => {
    const studentDetails = flattenedStudents?.find(
      (item) => item?.user_id === selectedIds[0]
    );
    setStudentInfo(studentDetails || {});
  }, [selectedIds, flattenedStudents, setStudentInfo]);

  // Update headers based on flattenedStudents
  useEffect(() => {
    if (flattenedStudents?.length > 0) {
      const header = Object.keys(flattenedStudents[0]).filter(
        (key) => key !== "profilePicture"
      );
      setHeaderValue(header);
    }
  }, [flattenedStudents]);

  // Handle delete operation
  const handleDelete = async (id) => {
    await deleteStudent(id);
    // After deletion, reset the modal state to -1 (closed)
    setOpenModal(-1);
  };

  // Memoize displayed header values for performance optimization
  const displayedHeaderValue = useMemo(() => {
    return showAllKeys ? headerValue : headerValue.slice(0, 5);
  }, [headerValue, showAllKeys]);

  // Handle Select All functionality
  const isAllSelected = selectedIds.length === flattenedStudents.length;
  const handleSelectAllChange = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(flattenedStudents.map((item) => item.user_id));
    }
  };
  const studentStudent = flattenedStudents.filter(
    (item) => item?.user_id === openModal
  )[0]?.user_username;
  return (
    <>
      {deleteLoading ? (
        <Loader />
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                {headerValue?.length > 0 && (
                  <div className="flex flattenedStudents-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={isAllSelected}
                      onChange={handleSelectAllChange}
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">
                      Select All
                    </label>
                  </div>
                )}
              </th>
              {displayedHeaderValue?.map((key) => (
                <th key={key} scope="col" className="px-6 py-3">
                  {key}
                </th>
              ))}
              {headerValue?.length > 0 && (
                <th
                  scope="col"
                  className="px-6 py-3 flex justify-center flattenedStudents-center gap-2"
                >
                  Action
                  <span onClick={() => setShowAllKeys((prev) => !prev)}>
                    {showAllKeys ? (
                      <IconLeft
                        size={20}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                      />
                    ) : (
                      <IconRight
                        size={20}
                        className="text-blue-600 cursor-pointer"
                      />
                    )}
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && <span className="text-center flex justify-center items-center"><LoadingText/></span>}
            {flattenedStudents?.map((data) => (
              <tr
                key={data?.user_id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex flattenedStudents-center">
                    <input
                      id={`checkbox-table-search-${data?.user_id}`}
                      type="checkbox"
                      checked={selectedIds.includes(data?.user_id)}
                      onChange={() => handleCheckboxChange(data?.user_id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-search-${data?.user_id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                {displayedHeaderValue?.map((key) => (
                  <td key={key} className="px-2 py-1">
                    {data[key]}
                  </td>
                ))}
                <td className="flex flattenedStudents-center px-6 py-4">
                  <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    <Pencil size={20} color="#1ec859" />
                  </button>
                  <button
                    onClick={() => setOpenModal(data?.user_id)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Deleting */}
      <Modal
        title={`Delete ${studentStudent}`}
        desc="Are you sure?"
        actionName="Delete"
        dangerAction={() => handleDelete(openModal)}
        showModal={openModal !== -1}
        cancelOption={() => setOpenModal(-1)}
      />
    </>
  );
});

export default Tables;
