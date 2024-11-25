import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
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
   personalDocuments,
   userDetails,
   cardOpen,
   setCardOpen,
}) => {

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
               src={userDetails?.user_profile_profilePicture}
               alt={`${title}'s profile picture`}
               className="w-36 h-36 rounded-xl border-2 border-gray-300"
            />

            {/* Personal Info Accordion */}
            <Accordion type="multiple" collapsible="true">
               <AccordionItem value="personal-info">
                  <AccordionTrigger>Personal Info</AccordionTrigger>
                  <AccordionContent>
                     <div className="grid grid-cols-2 gap-4">
                        {personalInfo.map(({ label, key }, index) => (
                           <div key={index} className="space-y-1">
                              <p className="text-xs uppercase text-gray-500">{label}</p>
                              <p className="text-base font-medium text-gray-800">
                                 {userDetails?.[key] || "N/A"}
                              </p>
                           </div>
                        ))}
                     </div>
                  </AccordionContent>
               </AccordionItem>
            </Accordion>


            {/* Documents Accordion */}
            <Accordion type="single" collapsible="true">
               <AccordionItem value="documents">
                  <AccordionTrigger>Documents</AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2 gap-2">
                     {personalDocuments.map((field, index) =>
                        <div className="mb-4" key={index}>
                           <p className="text-xs uppercase text-gray-500">{field.label}</p>
                           <div className="mt-2">
                              {renderDocument(userDetails?.[field.key], field.label)}
                           </div>
                        </div>
                     )}
                  </AccordionContent>
               </AccordionItem>
            </Accordion>

            {/* Login Credentials Accordion */}
            <Accordion type="single" collapsible="true">
               <AccordionItem value="login-credentials">
                  <AccordionTrigger>Login Credentials</AccordionTrigger>
                  <AccordionContent>
                     <div className="mb-4">
                        <p className="text-xs uppercase text-gray-500">Username</p>
                        <p className="text-base font-medium text-gray-800">
                           {userDetails.user_username || "N/A"}
                        </p>
                     </div>
                     <div className="mb-4">
                        <p className="text-xs uppercase text-gray-500">Password</p>
                        <p className="text-base font-medium text-gray-800">
                           {userDetails.user_password ? "******" : "Not available"}
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

