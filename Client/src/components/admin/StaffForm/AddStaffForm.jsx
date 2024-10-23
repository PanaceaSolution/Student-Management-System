import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../../ui/button';
import useStaffStore from '@/store/staffStore';
import Form from './Form';

const AddStaffForm = ({ user }) => {
   const { addStaff, loading, error } = useStaffStore();
   const [profilePic, setProfilePic] = useState(null);

   const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({});

   const onSubmit = async (data) => {
      if (user === "Teacher") {
         data.role = "Teacher";
      }
      const formattedData = {
         ...data,
         salary: Number(data.salary),
      };
      console.log(formattedData);

      await addStaff(formattedData);
   };

   const handleFileChange = (e) => {
      setProfilePic(e.target.files[0]);
      clearErrors("profilePic");
   };

   const removeFile = () => {
      setProfilePic(null);
      clearErrors("profilePic");
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button
               variant="create"
               className="uppercase"
            >
               Create {user}
            </Button>
         </DialogTrigger>
         <DialogContent className="bg-white">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  {user} Registration
               </DialogTitle>
               <DialogDescription>
                  Enter {user} Information Here...
               </DialogDescription>
            </DialogHeader>
            <hr />
            <Form
               handleSubmit={handleSubmit(onSubmit)}
               register={register}
               errors={errors}
               loading={loading}
               user={user}
               handleFileChange={handleFileChange}
               profilePic={profilePic}
               removeFile={removeFile}
               clearErrors={clearErrors}
            />
         </DialogContent>
      </Dialog>
   );
};

export default AddStaffForm;
