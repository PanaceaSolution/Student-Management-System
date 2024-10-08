import { Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

const Tables = React.memo(({ items, setStudentInfo }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [headerValue, setHeaderValue] = useState([]);

  const handleCheckboxChange = useCallback(
    (id) => {
      const newSelectedId = selectedId === id ? null : id;
      setSelectedId(newSelectedId);
    },
    [selectedId]
  );

  useEffect(() => {
    const studentDetails = items?.find((item) => item?.id === selectedId);
    setStudentInfo(studentDetails || {});
  }, [selectedId, items, setStudentInfo]);

  useEffect(() => {
    if (items?.length > 0) {
      const header = Object.keys(items[0]);
      setHeaderValue(header);
      setSelectedId(items[0]?.id);
    }
  }, [items]);

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input
                id="checkbox-all-search"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="checkbox-all-search" className="sr-only">
                checkbox
              </label>
            </div>
          </th>
          {headerValue?.map((key) => (
            <th key={key} scope="col" className="px-6 py-3">
              {key}
            </th>
          ))}
          <th scope="col" className="px-6 py-3">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {items?.map((data) => (
          <tr
            key={data?.id}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <td className="w-4 p-4">
              <div className="flex items-center">
                <input
                  id={`checkbox-table-search-${data?.id}`}
                  type="checkbox"
                  checked={selectedId === data?.id}
                  onChange={() => handleCheckboxChange(data?.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`checkbox-table-search-${data?.id}`}
                  className="sr-only"
                >
                  checkbox
                </label>
              </div>
            </td>
            {headerValue?.map((key) => (
              <td key={key} className="px-6 py-4">
                {data[key]} {/* Accessing the value dynamically */}
              </td>
            ))}
            <td className="flex items-center px-6 py-4">
              <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                <Pencil size={20} color="#1ec859" />
              </button>
              <button className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">
                <Trash2 size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default Tables;