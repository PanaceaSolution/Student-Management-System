import React from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import useStaffStore from '@/store/staffStore';

const Form = ({ title, staffData, user }) => {
   const { addStaff, updateStaff, loading, error } = useStaffStore();
   const defaultDob = staffData?.dob ? new Date(staffData.dob).toISOString().split('T')[0] : '';

   const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
         fname: staffData?.fname || '',
         lname: staffData?.lname || '',
         email: staffData?.email || '',
         phoneNumber: staffData?.phoneNumber || '',
         sex: staffData?.sex || '',
         role: staffData?.role || '',
         dob: defaultDob,
         bloodType: staffData?.bloodType || '',
         salary: staffData?.salary || '',
         address: staffData?.address || '',
      }
   })

   const onSubmit = async (data) => {
      const formattedData = {
         ...data,
         salary: Number(data.salary),
      };

      if (title === "Create") {
         await addStaff(formattedData);
      } else {
         await updateStaff(staffData.id, formattedData);
      }
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            {title === "Create" ? (
               <Button
                  variant="create"
                  className="uppercase"
               >
                  {title} {user}
               </Button>
            ) : (
               <Button
                  variant="edit"
                  className="uppercase"
               >
                  Edit
               </Button>
            )}
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>
                  {title} Staff
               </DialogTitle>
               <DialogDescription>
                  Enter Staff Information Here...
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                     <Label htmlFor="fname">First Name</Label>
                     <Input
                        id="fname"
                        type="text"
                        placeholder="Enter First Name"
                        {...register("fname", { required: "First Name is required" })}
                     />
                     {errors.fname && <p className="text-red-600">{errors.fname.message}</p>}
                  </div>
                  <div>
                     <Label htmlFor="lname">Last Name</Label>
                     <Input
                        id="lname"
                        type="text"
                        placeholder="Enter Last Name"
                        {...register("lname", { required: "Last Name is required" })}
                     />
                     {errors.lname && <p className="text-red-600">{errors.lname.message}</p>}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="Enter Email"
                        {...register("email", { required: "Email is required" })}
                     />
                     {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                     <Label htmlFor="phoneNumber">Phone</Label>
                     <Input
                        id="phoneNumber"
                        type="number"
                        placeholder="Enter Phone"
                        {...register("phoneNumber", { required: "Phone is required" })}
                     />
                     {errors.phoneNumber && <p className="text-red-600">{errors.phoneNumber.message}</p>}
                  </div>
               </div>

               <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                     <Label htmlFor="sex">Gender</Label>
                     <Input
                        id="sex"
                        type="text"
                        placeholder="Enter Gender"
                        {...register("sex", { required: "Gender is required" })}
                     />
                     {errors.sex && <p className="text-red-600">{errors.sex.message}</p>}
                  </div>
                  <div>
                     <Label htmlFor="role">Role</Label>
                     <Input
                        id="role"
                        type="text"
                        placeholder="Enter Role"
                        {...register("role", { required: "Role is required" })}
                     />
                     {errors.role && <p className="text-red-600">{errors.role.message}</p>}
                  </div>
               </div>

               <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                     id="dob"
                     type="date"
                     placeholder="Enter Date of Birth"
                     {...register("dob", { required: "Date of Birth is required" })}
                  />
                  {errors.dob && <p className="text-red-600">{errors.dob.message}</p>}
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                     <Label htmlFor="bloodType">Blood Type</Label>
                     <Input
                        id="bloodType"
                        type="text"
                        placeholder="Enter Blood Type"
                        {...register("bloodType", { required: "Blood Type is required" })}
                     />
                     {errors.bloodType && <p className="text-red-600">{errors.bloodType.message}</p>}
                  </div>
                  <div>
                     <Label htmlFor="salary">Salary</Label>
                     <Input
                        id="salary"
                        type="number"
                        placeholder="Enter Salary"
                        {...register("salary", { required: "Salary is required" })}
                     />
                     {errors.salary && <p className="text-red-600">{errors.salary.message}</p>}
                  </div>
               </div>

               <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                     id="address"
                     type="text"
                     placeholder="Enter Address"
                     {...register("address", { required: "Address is required" })}
                  />
                  {errors.address && <p className="text-red-600">{errors.address.message}</p>}
               </div>

               <Button
                  variant="create"
                  className="uppercase mt-4"
                  type="submit"
                  disabled={loading}
               >
                  {loading ? (title === "Create" ? "Creating..." : "Updating...") : `${title}`}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default Form;
