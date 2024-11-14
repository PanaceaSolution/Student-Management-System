import { Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import useDeleteStudent from "@/hooks/useDeleteStudnet";
import { IconLeft, IconRight } from "react-day-picker";

const Tables = React.memo(({ items, setStudentInfo, loading }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [headerValue, setHeaderValue] = useState([]);
  const [openModal, setOpenModal] = useState(-1);
  const { deleteStudent } = useDeleteStudent();
  const [showAllKeys, setShowAllKeys] = useState(false);

  const handleCheckboxChange = useCallback(
    (id) => {
      setSelectedIds((prevSelectedIds) => {
        if (prevSelectedIds.includes(id)) {
         
          return prevSelectedIds.filter((selectedId) => selectedId !== id);
        } else {
      
          return [id];
        }
      });
    },
    []
  );

  useEffect(() => {
    const studentDetails = items?.find(
      (item) => item?.studentId === selectedIds[0] // Use the first selected ID to set student info
    );
    setStudentInfo(studentDetails || {});
  }, [selectedIds, items, setStudentInfo]);

  useEffect(() => {
    if (items?.length > 0) {
      const header = Object.keys(items[0]).filter(
        (key) => key !== "profilePicture"
      );
      setHeaderValue(header);
    }
  }, [items]);

  const handleDelete = async (id) => {
    await deleteStudent(id);
  };

  const displayedHeaderValue = showAllKeys
    ? headerValue
    : headerValue.slice(0, 5);

  return (
    <>
      {loading ? (
        <p className="text-center font-bold text-xl p-5">Loading....</p>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                {headerValue?.length > 0 && (
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      // Select all logic (optional, can be customized)
                      checked={selectedIds.length === items.length}
                      onChange={() => {
                        if (selectedIds.length === items.length) {
                          setSelectedIds([]);
                        } else {
                          setSelectedIds(items.map(item => item.studentId));
                        }
                      }}
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
                  className="px-6 py-3 flex justify-center items-center gap-2"
                >
                  Action{" "}
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
            {items?.map((data) => (
              <tr
                key={data?.studentId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${data?.studentId}`}
                      type="checkbox"
                      checked={selectedIds.includes(data?.studentId)}
                      onChange={() => handleCheckboxChange(data?.studentId)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-search-${data?.studentId}`}
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
                <td className="flex items-center px-6 py-4">
                  <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    <Pencil size={20} color="#1ec859" />
                  </button>
                  <button
                    onClick={() => setOpenModal(data?.studentId)}
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
        title={`Delete ${
          items.find((item) => item.studentId === openModal)?.fatherName
        }`}
        desc="Are you sure?"
        actionName="Delete"
        dangerAction={(e) => handleDelete(openModal)}
        showModal={openModal !== -1}
        cancelOption={() => setOpenModal(-1)}
      />
    </>
  );
});

export default Tables;
