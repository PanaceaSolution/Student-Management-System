import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const tableHead = ["Select", "Username", "First Name", "Last Name", "Gender", "Role"];

const StaffTable = ({ user, handleUserId, title }) => {
   // Apply filtering based on the title (Staff, Teacher, or Student)
   const userContent =
      title === "Staff"
         ? user.filter((staffMember) => staffMember.role !== "Teacher")
         : title === "Teacher"
            ? user.filter((staffMember) => staffMember.role === "Teacher")
            : user; // No filtering if the title is "Student"

   const [selectedUserId, setSelectedUserId] = useState(null);

   const handleCheckboxChange = (id) => {
      const newSelectedId = selectedUserId === id ? null : id;
      setSelectedUserId(newSelectedId);
      handleUserId(newSelectedId);
   };

   return (
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
            {userContent.map((staffMember) => (
               <TableRow key={staffMember.id} className="cursor-pointer">
                  <TableCell>
                     <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(staffMember.id)}
                        checked={selectedUserId === staffMember.id}
                     />
                  </TableCell>
                  <TableCell>{staffMember.userName}</TableCell>
                  <TableCell className="font-medium">{staffMember.firstName}</TableCell>
                  <TableCell className="font-medium">{staffMember.lastName}</TableCell>
                  <TableCell>{staffMember.gender}</TableCell>
                  <TableCell>{staffMember.role}</TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
};

export default StaffTable;
