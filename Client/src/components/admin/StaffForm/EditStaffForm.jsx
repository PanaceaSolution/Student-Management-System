import React, { useEffect } from 'react';
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

const EditStaffForm = ({ user, staffData }) => {
   const { updateStaff, loading, error } = useStaffStore();

   const { register, handleSubmit, formState: { errors }, reset } = useForm();
   const defaultDob = staffData?.dob ? new Date(staffData.dob).toISOString().split('T')[0] : '';

   useEffect(() => {
      if (staffData) {
         reset({
            fname: staffData.fname,
            lname: staffData.lname,
            username: staffData.username,
            email: staffData.email,
            phoneNumber: staffData.phoneNumber,
            address: staffData.address,
            role: staffData.role,
            salary: staffData.salary,
            dob: defaultDob,
            sex: staffData.sex,
            bloodType: staffData.bloodType,
         });
      }
   }, [staffData, reset]);

   const onSubmit = async (data) => {
      const formattedData = {
         ...data,
         salary: Number(data.salary),
      };
      await updateStaff(staffData.id, formattedData);
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button
               variant="create"
               className="uppercase"
            >
               Edit
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>
                  Update {user}
               </DialogTitle>
               <DialogDescription>
                  Enter Staff Information Here...
               </DialogDescription>
            </DialogHeader>
            <Form
               handleSubmit={handleSubmit}
               register={register}
               errors={errors}
               onSubmit={onSubmit}
               loading={loading}
               user={user}
            />
         </DialogContent>
      </Dialog>
   );
};

export default EditStaffForm;
