import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"


const AddTasks = ({ isFormOpen, setIsFormOpen }) => {
   return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} >
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Are you absolutely sure?</DialogTitle>
               <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
               </DialogDescription>
            </DialogHeader>
         </DialogContent>
      </Dialog>
   )
}

export default AddTasks