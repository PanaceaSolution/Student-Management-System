import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Pagination } from "./Pagination";
import ResultShowing from "../common/ResultShowing";


const ITEMS_PER_PAGE = 10;

const StaffTable = ({ user, handleUserId, tableHead, tableFields }) => {
   const [selectedUserId, setSelectedUserId] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);

   const handleCheckboxChange = (id) => {
      const newSelectedId = selectedUserId === id ? null : id;
      setSelectedUserId(newSelectedId);
      handleUserId(newSelectedId);
   };

   const totalPages = Math.ceil(user.length / ITEMS_PER_PAGE);
   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
   const currentPageData = user.slice(startIndex, startIndex + ITEMS_PER_PAGE);

   // Calculate the range of results being displayed
   const startResult = startIndex + 1;
   const endResult = Math.min(startIndex + ITEMS_PER_PAGE, user.length);
   const totalResults = user.length;

   return (
      <>
         {/* Display results range */}
         <ResultShowing
            start={startResult}
            end={endResult}
            total={totalResults}
         />

         <Table>
            <TableHeader>
               <TableRow>
                  {tableHead.map((head) => (
                     <TableHead key={head}>
                        {head}
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>
            <TableBody>
               {currentPageData.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer">
                     <TableCell>
                        <input
                           type="checkbox"
                           onChange={() => handleCheckboxChange(user.id)}
                           checked={selectedUserId === user.id}
                        />
                     </TableCell>
                     {tableFields.map((field, index) => (
                        <TableCell key={index}>
                           {user[field]}
                        </TableCell>
                     ))}
                  </TableRow>
               ))}
            </TableBody>
         </Table>

         {/* Pagination Controls */}
         <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
         />
      </>
   );
};

export default StaffTable;
