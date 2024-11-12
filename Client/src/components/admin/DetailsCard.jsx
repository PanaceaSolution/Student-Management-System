import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useEffect } from "react";
import useStaffStore from "@/store/staffStore";
import EditStaffForm from "./StaffForm/EditStaffForm";


const DetailsCard = ({
   title,
   selectedId,
   handleDelete,
   content,
   userDetails
}) => {

   return (
      <Card>
         <CardHeader className="flex items-center">
            <CardTitle className="text-2xl font-bold text-primary">
               {title} Details
            </CardTitle>
         </CardHeader>
         {userDetails ? (
            <>
               <CardContent>
                  <img
                     src={userDetails.profilePic || "/default-profile.png"}
                     alt={`${title} profile`}
                     className="w-16 h-16 rounded-full border-2 border-gray-300 mb-4"
                  />
                  {content.map((field, index) => (
                     <div key={index} className="mb-4">
                        <p className="text-xs uppercase text-gray-500">
                           {field.label}
                        </p>
                        <p className="text-lg font-medium text-gray-800">
                           {userDetails[field.key] || "N/A"}
                        </p>
                     </div>
                  ))}
               </CardContent>
               <CardFooter className="flex justify-end gap-2">
                  <EditStaffForm user={title} id={selectedId} />
                  <Button
                     variant="destructive"
                     onClick={() => handleDelete(selectedId)}
                  >
                     Delete</Button>
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
