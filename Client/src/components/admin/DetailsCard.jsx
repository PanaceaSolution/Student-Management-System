import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

const staffContent = [
   { label: "Username", key: "username" },
   { label: "First Name", key: "fname" },
   { label: "Last Name", key: "lname" },
   { label: "Gender", key: "sex" },
   { label: "Blood Type", key: "bloodType" },
   { label: "Date of Birth", key: "dob" },
   { label: "Address", key: "address" },
   { label: "Email", key: "email" },
   { label: "Phone", key: "phoneNumber" },
   { label: "Role", key: "role" },
];

const teacherContent = [
   { label: "Username", key: "username" },
   { label: "First Name", key: "fname" },
   { label: "Last Name", key: "lname" },
   { label: "Gender", key: "sex" },
   { label: "Blood Type", key: "bloodType" },
   { label: "Date of Birth", key: "dob" },
   { label: "Address", key: "address" },
   { label: "Email", key: "email" },
   { label: "Phone", key: "phoneNumber" },
   
];

const studentContent = [
   { label: "Username", key: "username" },
   { label: "First Name", key: "fname" },
   { label: "Last Name", key: "lname" },
   { label: "Gender", key: "sex" },
   { label: "Date of Birth", key: "dob" },
   { label: "Address", key: "address" },
   { label: "Email", key: "email" },
   { label: "Phone", key: "phoneNumber" },
   { label: "Enrollment Date", key: "enrollmentDate" },
];

const DetailsCard = ({ title, selectedId, user }) => {
   const userDetails = user.find((staff) => staff.id === selectedId);

   let content;
   switch (title.toLowerCase()) {
      case "staff":
         content = staffContent;
         break;
      case "teacher":
         content = teacherContent;
         break;
      case "student":
         content = studentContent;
         break;
      default:
         content = [];
         break;
   }

   return (
      <Card>
         <CardHeader className="flex items-center">
            <CardTitle className="text-2xl font-bold text-primary">{title} Details</CardTitle>
         </CardHeader>
         {userDetails ? (
            <>
               <CardContent>
                  <img
                     src={userDetails.image}
                     alt={`${title} profile`}
                     className="w-16 h-16 rounded-full border-2 border-gray-300 mb-4"
                  />
                  {content.map((field, index) => (
                     <div key={index} className="mb-4">
                        <p className="text-xs uppercase text-gray-500">{field.label}</p>
                        <p className="text-lg font-medium text-gray-800">{userDetails[field.key] || "N/A"}</p>
                     </div>
                  ))}
               </CardContent>
               <CardFooter className="flex justify-end gap-2">
                  <Button variant="edit">Edit</Button>
                  <Button variant="destructive">Delete</Button>
               </CardFooter>
            </>
         ) : (
            <p className="px-4 py-2 text-center text-gray-600">
               Please select a {title} to view details.
            </p>
         )}
      </Card>
   );
};

export default DetailsCard;
