// import { Pencil, Trash2 } from "lucide-react";
// import React, { useState, useEffect, useCallback } from "react";
// import Modal from "./Modal";
// import useDeleteStudent from "@/hooks/useDeleteStudnet";
// const Tables = React.memo(({ items, setStudentInfo }) => {
//   const [selectedId, setSelectedId] = useState(null);
//   const [headerValue, setHeaderValue] = useState([]);
//   const [OpenModal, setOpenModal] = useState(-1);
//   const { deleteStudent } = useDeleteStudent();
//   const handleCheckboxChange = useCallback(
//     (id) => {
//       const newSelectedId = selectedId === id ? null : id;
//       setSelectedId(newSelectedId);
//     },
//     [selectedId]
//   );

//   useEffect(() => {
//     const studentDetails = items?.find((item) => item?.id === selectedId);
//     setStudentInfo(studentDetails || {});
//   }, [selectedId, items, setStudentInfo]);

//   useEffect(() => {
//     if (items?.length > 0) {
//       const header = Object.keys(items[0]);
//       setHeaderValue(header);
//       setSelectedId(items[0]?.id);
//     }
//   }, [items]);
//   const handleDelete = async (id) => {
//     await deleteStudent(id);
//   };
//   return (
//     <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//       <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//         <tr>
//           <th scope="col" className="p-4">
//             {headerValue?.length > 0 && (
//               <div className="flex items-center">
//                 <input
//                   id="checkbox-all-search"
//                   type="checkbox"
//                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                 />
//                 <label htmlFor="checkbox-all-search" className="sr-only">
//                   checkbox
//                 </label>
//               </div>
//             )}
//           </th>
//           {headerValue?.map((key) => (
//             <th key={key} scope="col" className="px-6 py-3">
//               {key}
//             </th>
//           ))}
//           {headerValue?.length > 0 && (
//             <th scope="col" className="px-6 py-3">
//               Action
//             </th>
//           )}
//         </tr>
//       </thead>
//       <tbody>
//         {items?.map((data) => (
//           <tr
//             key={data?.id}
//             className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
//           >
//             <td className="w-4 p-4">
//               <div className="flex items-center">
//                 <input
//                   id={`checkbox-table-search-${data?.id}`}
//                   type="checkbox"
//                   checked={selectedId === data?.id}
//                   onChange={() => handleCheckboxChange(data?.id)}
//                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                 />
//                 <label
//                   htmlFor={`checkbox-table-search-${data?.id}`}
//                   className="sr-only"
//                 >
//                   checkbox
//                 </label>
//               </div>
//             </td>
//             {headerValue?.map((key) => (
//               <td key={key} className="px-6 py-4">
//                 {data[key]} {/* Accessing the value dynamically */}
//               </td>
//             ))}
//             <Modal
//               title={`Delete ${data?.firstName}`}
//               desc="Are You Sure ?"
//               actionName="Delete"
//               dangerAction={(e) => handleDelete(data?.id)}
//               showModal={OpenModal===data?.id}
//               cancelOption={()=>setOpenModal(-1)}
//             />
//             <td className="flex items-center px-6 py-4">
//               <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
//                 <Pencil size={20} color="#1ec859" />
//               </button>
//               <button
//                 onClick={() => setOpenModal(data?.id)}
//                 className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
//               >
//                 <Trash2 size={20} />
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// });

// export default Tables;
import { Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import useDeleteStudent from "@/hooks/useDeleteStudnet";
import { IconLeft, IconRight } from "react-day-picker";

const Tables = React.memo(({ items, setStudentInfo }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [headerValue, setHeaderValue] = useState([]);
  const [openModal, setOpenModal] = useState(-1);
  const { deleteStudent } = useDeleteStudent();
  const [showAllKeys, setShowAllKeys] = useState(false); // New state for expanding keys

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

  const handleDelete = async (id) => {
    await deleteStudent(id);
  };

  const displayedHeaderValue = showAllKeys
    ? headerValue
    : headerValue.slice(0, 6);

  return (
    <>
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
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
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
              <th scope="col" className="px-6 py-3 flex justify-center items-center gap-2">
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
              {displayedHeaderValue?.map((key) => (
                <td key={key} className="px-6 py-4">
                  {data[key]} {/* Accessing the value dynamically */}
                </td>
              ))}
              <td className="flex items-center px-6 py-4">
                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                  <Pencil size={20} color="#1ec859" />
                </button>
                <button
                  onClick={() => setOpenModal(data?.id)}
                  className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Deleting */}
      <Modal
        title={`Delete ${
          items.find((item) => item.id === openModal)?.firstName
        }`}
        desc="Are You Sure?"
        actionName="Delete"
        dangerAction={(e) => handleDelete(openModal)}
        showModal={openModal !== -1}
        cancelOption={() => setOpenModal(-1)}
      />
    </>
  );
});

export default Tables;
