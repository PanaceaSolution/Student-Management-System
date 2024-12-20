import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import ResultShowing from "../common/ResultShowing";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Paginations from "../common/Paginations";
import Spinner from "../Loader/Spinner";

const ITEMS_PER_PAGE = 10;

const AdminTable = ({ title, user, handleUserData, tableHead, tableFields, handleDelete, handleEdit, loading }) => {
   const [currentPage, setCurrentPage] = useState(1);

   const handleCheckboxChange = (data) => {
      handleUserData(data);
   };

   const totalPages = Math.ceil(user.length / ITEMS_PER_PAGE);
   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
   const currentPageData = useMemo(
      () => user.slice(startIndex, startIndex + ITEMS_PER_PAGE),
      [user, currentPage]
   );

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
                  {tableHead.map((head, index) => (
                     <TableHead key={`${head}-${index}`}>
                        {head}
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>
            <TableBody>
               {user.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={tableHead.length}>
                        <div className="text-center py-4">No {title || "Records"} Found</div>
                     </TableCell>
                  </TableRow>
               ) : (
                  currentPageData.map((user, index) => (
                     <TableRow key={user.user_id || `row-${index}`} className="cursor-pointer capitalize">
                        <TableCell>
                           <input type="checkbox" />
                        </TableCell>
                        {tableFields.map((field, fieldIndex) => (
                           <TableCell
                              key={`${user.user_id}-${fieldIndex}`}
                              onClick={() => handleCheckboxChange(user)}
                           >
                              {user[field]}
                           </TableCell>
                        ))}
                        <TableCell className="flex justify-center gap-2">
                           <Button
                              variant="edit"
                              size="icon"
                              className="mr-2"
                              onClick={() => handleEdit(user)}
                           >
                              <Pencil />
                           </Button>
                           <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(user)}
                              disabled={loading}
                           >
                              {loading ? <Spinner /> : <Trash2 />}
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>

         {/* Pagination Controls */}
         <Paginations
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
         />
      </>
   );
};

export default AdminTable;
