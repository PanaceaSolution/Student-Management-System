import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from './DatePicker'; // Import your custom DatePicker

const StudentForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Student</Button>
      </DialogTrigger>
      <DialogContent className="p-2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Students</DialogTitle>
          <DialogDescription>
            Enter Student Information Here:
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 py-2">

          {/* First Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'First Name is required' }}
              render={({ field }) => (
                <Input {...field} id="firstName" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
          </div>

          {/* Last Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Last Name</Label>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Last Name is required' }}
              render={({ field }) => (
                <Input {...field} id="lastName" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
          </div>

          {/* Address */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Address</Label>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <Input {...field} id="address" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.address && <span className="text-red-500">{errors.address.message}</span>}
          </div>

          {/* Gender */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">Gender</Label>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <Input {...field} id="gender" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.gender && <span className="text-red-500">{errors.gender.message}</span>}
          </div>

          {/* Blood Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bloodType" className="text-right">Blood Type</Label>
            <Controller
              name="bloodType"
              control={control}
              defaultValue=""
              rules={{ required: 'Blood Type is required' }}
              render={({ field }) => (
                <Input {...field} id="bloodType" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.bloodType && <span className="text-red-500">{errors.bloodType.message}</span>}
          </div>

          {/* DOB */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">DOB</Label>
            <Controller
              name="dob"
              control={control}
              defaultValue={null}
              rules={{ required: 'DOB is required' }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selected={value}
                  onChange={(date) => onChange(date)} // Set the selected date in the input
                  placeholderText="Select DOB"
                  className="border border-gray-600 rounded col-span-3"
                />
              )}
            />
            {errors.dob && <span className="text-red-500">{errors.dob.message}</span>}
          </div>

          {/* Class */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">Class</Label>
            <Controller
              name="class"
              control={control}
              defaultValue=""
              rules={{ required: 'Class is required' }}
              render={({ field }) => (
                <Input {...field} id="class" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.class && <span className="text-red-500">{errors.class.message}</span>}
          </div>

          {/* Father Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fatherName" className="text-right">Father Name</Label>
            <Controller
              name="fatherName"
              control={control}
              defaultValue=""
              rules={{ required: 'Father Name is required' }}
              render={({ field }) => (
                <Input {...field} id="fatherName" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.fatherName && <span className="text-red-500">{errors.fatherName.message}</span>}
          </div>

          {/* Mother Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="motherName" className="text-right">Mother Name</Label>
            <Controller
              name="motherName"
              control={control}
              defaultValue=""
              rules={{ required: 'Mother Name is required' }}
              render={({ field }) => (
                <Input {...field} id="motherName" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.motherName && <span className="text-red-500">{errors.motherName.message}</span>}
          </div>

          {/* Admission Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="admissionDate" className="text-right">Admission Date</Label>
            <Controller
              name="admissionDate"
              control={control}
              defaultValue={null}
              rules={{ required: 'Admission Date is required' }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selected={value}
                  onChange={(date) => onChange(date)} // Set the selected date in the input
                  placeholderText="Select Admission Date"
                  className="border border-gray-600 rounded col-span-3"
                />
              )}
            />
            {errors.admissionDate && <span className="text-red-500">{errors.admissionDate.message}</span>}
          </div>

          {/* User Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">User Name</Label>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: 'User Name is required' }}
              render={({ field }) => (
                <Input {...field} id="username" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.username && <span className="text-red-500">{errors.username.message}</span>}
          </div>

          {/* Password */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Password</Label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <Input {...field} id="password" className="border border-gray-600 rounded col-span-3" />
              )}
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
