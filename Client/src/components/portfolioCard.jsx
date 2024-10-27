import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"


const infoHeader = ["Name", "Father's Name", "Mother's Name", "Gender", "Date of Birth", "Blood Type", "Email", "Admission Date", "Class", "Section", "Address"]


const PortfolioCard = ({ info }) => {
   return (
      <Card className="grid md:grid-cols-5 gap-2 items-start py-8 px-2">
         <CardHeader className="col-span-2">
            <img
               src="https://images.unsplash.com/photo-1630178836733-3d61d8974258?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
               alt="Profile"
               className="w-60 h-40 rounded-md "
            />
         </CardHeader>
         <CardContent className="col-span-3">
            <div className="grid grid-cols-2 items-start">
               <div className="col-span-1 space-y-10">
                  {infoHeader.map((info, index) => (
                     <h3
                        key={index}
                        className="font-semibold"
                     >
                        {info}
                     </h3>
                  ))}
               </div>
               <div className="col-span-1 space-y-10">
                  {info.map((info, index) => (
                     <p
                        key={index}
                     >
                        {info}
                     </p>
                  ))}
               </div>
            </div>
         </CardContent>
      </Card>

   );
};

export default PortfolioCard;