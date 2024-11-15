import { Button } from "../ui/button";
import EditStaffForm from "./StaffForm/EditStaffForm";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"

const DetailsCard = ({
   title,
   personalInfo,
   userDetails,
   cardOpen,
   setCardOpen,
}) => {

   const getNestedValue = (obj, path) =>
      path.split('.').reduce((acc, part) => acc && acc[part], obj) || "N/A";

   const renderDocument = (url, label) => {
      const isImage = /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
      const isPDF = /\.pdf$/i.test(url);

      if (isImage) {
         return <img src={url} alt={`${label} document`} className="w-36 h-auto rounded border-2 border-gray-300" />;
      } else if (isPDF) {
         return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
               View {label} (PDF)
            </a>
         );
      } else {
         return <p className="text-gray-500">Unsupported file format</p>;
      }
   };

   return (
      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
         <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold text-primary">
                  {title} Details
               </DialogTitle>
               <DialogDescription />
               <hr className="border-black" />
            </DialogHeader>
            <img
               src={userDetails.user.profile?.profilePicture || '/default-profile.png'}
               alt={`${title}'s profile picture`}
               className="w-36 h-36 rounded-xl border-2 border-gray-300"
            />

            {/* Personal Info Accordion */}
            <Accordion type="single" collapsible>
               <AccordionItem value="personal-info">
                  <AccordionTrigger>Personal Info</AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2 gap-2">
                     {personalInfo.map((field, index) => (
                        <div key={index} className="mb-4">
                           <p className="text-xs uppercase text-gray-500">{field.label}</p>
                           <p className="text-lg font-medium text-gray-800">
                              {getNestedValue(userDetails, field.key)}
                           </p>
                        </div>
                     ))}
                  </AccordionContent>
               </AccordionItem>
            </Accordion>

            {/* Documents Accordion */}
            <Accordion type="single" collapsible>
               <AccordionItem value="documents">
                  <AccordionTrigger>Documents</AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2 gap-2">
                     {userDetails.user.documents.map((field, index) => (
                        <div key={index} className="mb-4">
                           <p className="text-xs uppercase text-gray-500">{field.documentName}</p>
                           <div className="mt-2">
                              {renderDocument(field.documentFile, field.documentName)}
                           </div>
                        </div>
                     ))}
                  </AccordionContent>
               </AccordionItem>
            </Accordion>

            {/* Login Credentials Accordion */}
            <Accordion type="single" collapsible>
               <AccordionItem value="login-credentials">
                  <AccordionTrigger>Login Credentials</AccordionTrigger>
                  <AccordionContent>
                     <div className="mb-4">
                        <p className="text-xs uppercase text-gray-500">Username</p>
                        <p className="text-lg font-medium text-gray-800">
                           {userDetails.user?.username || "N/A"}
                        </p>
                     </div>
                     <div className="mb-4">
                        <p className="text-xs uppercase text-gray-500">Password</p>
                        <p className="text-lg font-medium text-gray-800">
                           {userDetails.user?.password ? "******" : "Not available"}
                        </p>
                     </div>
                  </AccordionContent>
               </AccordionItem>
            </Accordion>

         </DialogContent>
      </Dialog>
   );
};

export default DetailsCard;

