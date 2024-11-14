import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import EditStaffForm from "./StaffForm/EditStaffForm";


const DetailsCard = ({
   title,
   selectedId,
   handleDelete,
   content,
   userDetails,
   loading
}) => {

   // Helper function to access nested properties
   const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj) || "N/A";
   };


   return (
      <Card>
         <CardHeader className="flex items-center">
            <CardTitle className="text-2xl font-bold text-primary">
               {title} Details
            </CardTitle>
         </CardHeader>
         <CardContent>
            <img
               src={userDetails.profile.profilePicture || "/default-profile.png"}
               alt={`${title} profile`}
               className="w-16 h-16 rounded-full border-2 border-gray-300 mb-4"
            />
            {content.map((field, index) => (
               <div key={index} className="mb-4">
                  <p className="text-xs uppercase text-gray-500">
                     {field.label}
                  </p>
                  <p className="text-lg font-medium text-gray-800">
                     {getNestedValue(userDetails, field.key)}
                  </p>
               </div>
            ))}
         </CardContent>
         <CardFooter className="flex justify-end gap-2">
            <EditStaffForm user={title} id={selectedId} />
            <Button
               variant="destructive"
               onClick={() => handleDelete(selectedId)}
               disabled={loading}
            >
               {loading ? "Deleting..." : "Delete"}
            </Button>
         </CardFooter>

      </Card>
   );
};

export default DetailsCard;
