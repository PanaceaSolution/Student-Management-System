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

const tableHead = ["", "Username", "First Name", "Last Name", "Gender", "Role"];
const ITEMS_PER_PAGE = 10;

const StaffTable = ({ user, handleUserId, title }) => {
   console.log(user);

   const userContent =
      title === "Staff"
         ? user.filter((staffMember) => staffMember.role !== "Teacher")
         : title === "Teacher"
            ? user.filter((staffMember) => staffMember.role === "Teacher")
            : user;

   const [selectedUserId, setSelectedUserId] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);

   const handleCheckboxChange = (id) => {
      const newSelectedId = selectedUserId === id ? null : id;
      setSelectedUserId(newSelectedId);
      handleUserId(newSelectedId);
   };

   const totalPages = Math.ceil(userContent.length / ITEMS_PER_PAGE);
   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
   const currentPageData = userContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);

   // Calculate the range of results being displayed
   const startResult = startIndex + 1;
   const endResult = Math.min(startIndex + ITEMS_PER_PAGE, userContent.length);
   const totalResults = userContent.length;

   return (
      <>
         {/* Display results range */}
         <div className="p-4 font-semibold">
            <span className="mr-2 font-normal text-sm">Showing</span>
            {totalResults > 0
               ? `${startResult}  to ${endResult}`
               : "0"
            }
            <span className="mr-2 ml-2 font-normal text-sm">of</span>
            {totalResults}
            <span className="ml-2 font-normal text-sm">results</span>
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  {tableHead.map((head) => (
                     <TableHead key={head} className="uppercase text-base">
                        {head}
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>
            <TableBody>
               {currentPageData.map((staffMember) => (
                  <TableRow key={staffMember.id} className="cursor-pointer">
                     <TableCell>
                        <input
                           type="checkbox"
                           onChange={() => handleCheckboxChange(staffMember.id)}
                           checked={selectedUserId === staffMember.id}
                        />
                     </TableCell>
                     <TableCell>{staffMember.username}</TableCell>
                     <TableCell className="font-medium">{staffMember.fname}</TableCell>
                     <TableCell className="font-medium">{staffMember.lname}</TableCell>
                     <TableCell>{staffMember.sex}</TableCell>
                     <TableCell>{staffMember.role}</TableCell>
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
