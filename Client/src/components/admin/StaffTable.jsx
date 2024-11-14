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
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Loadding from "../Loader/Loadding";

const ITEMS_PER_PAGE = 10;

const StaffTable = ({ user, handleUserData, tableHead, tableFields, setCardOpen, handleDelete, handleEdit, loading }) => {
   const [currentPage, setCurrentPage] = useState(1);

   const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
   };

   const handleCheckboxChange = (data) => {
      handleUserData(data);
      setCardOpen(true)
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
               {user.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={tableHead.length}>
                        <div className="text-center py-4">No Staff Found</div>
                     </TableCell>
                  </TableRow>
               ) : (
                  currentPageData.map((user) => (
                     <TableRow key={user.user.id} className="cursor-pointer" >
                        <TableCell>
                           <input
                              type="checkbox"
                           />
                        </TableCell>
                        {tableFields.map((field, index) => (
                           <TableCell key={index} onClick={() => handleCheckboxChange(user)}>
                              {getNestedValue(user, field)}
                           </TableCell>
                        ))}
                        <TableCell className="flex justify-center gap-2">
                           <Button
                              variant="edit"
                              size="icon"
                              className="uppercase mr-2"
                              onClick={() => handleEdit(user)}
                           >
                              <Pencil />
                           </Button>
                           <Button
                              variant="destructive"
                              size="icon"
                              className="uppercase"
                              onClick={() => handleDelete(user.user.id)}
                              disabled={loading}
                           >
                              {loading ? <Loadding /> : <Trash2 />}
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>

         {/* Pagination Controls */}
         {user.length > 10 && <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
         />}
      </>
   );
};

export default StaffTable;
