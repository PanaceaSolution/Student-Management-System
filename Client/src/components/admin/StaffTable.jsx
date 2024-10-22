import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"

const tableHead = ["Username", "First Name", "Last Name", "Gender", "Role"];

const StaffTable = ({ staff, handleStaffId }) => {
   return (
      <Table>
         <TableHeader>
            <TableRow>
               {tableHead.map((head) => (
                  <TableHead key={head} className="uppercase text-base">{head}</TableHead>
               ))}
            </TableRow>
         </TableHeader>
         <TableBody>
            {staff
               .filter((staffMember) => staffMember.role !== "Teacher")
               .map((staffMember) => (
                  <TableRow
                     key={staffMember.id}
                     onClick={() => handleStaffId(staffMember.id)}
                     className="cursor-pointer"
                  >
                     <TableCell>{staffMember.userName}</TableCell>
                     <TableCell className="font-medium">
                        {staffMember.firstName}
                     </TableCell>
                     <TableCell className="font-medium">
                        {staffMember.lastName}</TableCell>
                     <TableCell>{staffMember.gender}</TableCell>
                     <TableCell>{staffMember.role}</TableCell>
                  </TableRow>
               ))}
         </TableBody>
      </Table>
   );
};

export default StaffTable;
