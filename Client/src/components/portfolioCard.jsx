import {
   Card,
   CardContent,
   CardHeader,
} from "@/components/ui/card";

const PortfolioCard = ({ info, role }) => {
   const infoHeader = [
      { name: "First Name", condition: true },
      { name: "Last Name", condition: true },
      { name: "Father's Name", condition: role === "STUDENT" },
      { name: "Mother's Name", condition: role === "STUDENT" },
      { name: "Gender", condition: true },
      { name: "Date of Birth", condition: true },
      { name: "Blood Type", condition: true },
      { name: "Email", condition: true },
      { name: "Admission Date", condition: role === "STUDENT" },
      { name: "Enrollment Date", condition: role !== "STUDENT" },
      { name: "Class", condition: role === "STUDENT" },
      { name: "Section", condition: role === "STUDENT" },
      { name: "Address", condition: true }
   ];

   return (
      <Card className="grid md:grid-cols-5 gap-2 items-start py-8 px-2 lg:h-[700px] md:mr-4 lg:mr-0">
         <CardHeader className="col-span-2">
            <img
               src="https://images.unsplash.com/photo-1630178836733-3d61d8974258?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
               alt="Profile"
               className="w-60 h-40 rounded-md object-cover"
            />
         </CardHeader>
         <CardContent className="col-span-3">
            <div className="grid grid-cols-2 items-start">
               <div className="col-span-1 space-y-8">
                  {infoHeader.map((headerItem, index) => (
                     headerItem.condition && (
                        <h3 key={index} className="font-semibold">
                           {headerItem.name}
                        </h3>
                     )
                  ))}
               </div>
               <div className="col-span-1 space-y-8">
                  {infoHeader.map((headerItem, index) => (
                     headerItem.condition && (
                        <p key={index}>
                           {info.find(item => item.name === headerItem.name)?.value || "N/A"}
                        </p>
                     )
                  ))}
               </div>
            </div>
         </CardContent>
      </Card>
   );
};

export default PortfolioCard;
