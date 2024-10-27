import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";

const StudentResult = ({ title, result }) => {
   const tableHeader = [
      { name: "Class", condition: true },
      { name: "Subject", condition: true },
      { name: "On Time", condition: title === "Assignment" },
      { name: "Marks", condition: title === "Exam Result" },
      { name: "Date", condition: true }
   ];

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-primary">
               {title}
            </CardTitle>
            <CardDescription>
               <Input placeholder="Search..." className="w-40 shadow-md border-none rounded-full text-black" />
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     {tableHeader
                        .filter(header => header.condition)
                        .map((header, index) => (
                           <TableHead key={index}>{header.name}</TableHead>
                        ))
                     }
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {result.map((item, index) => (
                     <TableRow key={index} className="bg-card">
                        {tableHeader
                           .filter(header => header.condition)
                           .map((header, idx) => (
                              <TableCell key={idx}>
                                 {header.name === "Class" && item.class}
                                 {header.name === "Subject" && item.subject}
                                 {header.name === "On Time" && item.onTime}
                                 {header.name === "Marks" && item.marks}
                                 {header.name === "Date" && item.date}
                              </TableCell>
                           ))
                        }
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
};

export default StudentResult;
