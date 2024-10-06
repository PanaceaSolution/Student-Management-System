import { Pencil, Trash2 } from "lucide-react";
import React from "react";

const Tables = ({ items }) => {
  return (
    <>
      {/* table */}

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
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
            <th scope="col" className="px-6 py-3">
              REF ID
            </th>
            <th scope="col" className="px-6 py-3">
              FIRST NAME
            </th>
            <th scope="col" className="px-6 py-3">
              LAST NAME
            </th>
            <th scope="col" className="px-6 py-3">
              GENDER
            </th>
            <th scope="col" className="px-6 py-3">
              DEPARTMENT
            </th>
            <th scope="col" className="px-6 py-3">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {items?.map((data, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${index}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`checkbox-table-search-${index}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {data.id}
              </th>
              <td className="px-6 py-4">{data.firstName}</td>
              <td className="px-6 py-4">{data.lastName}</td>
              <td className="px-6 py-4">{data.gender}</td>
              <td className="px-6 py-4">{data.department}</td>

              <td className="flex items-center px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  <Pencil size={20} color="#1ec859" />
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                >
                 <Trash2 size={20} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Tables;
