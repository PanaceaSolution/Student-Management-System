import React from 'react';
import { useForm, Controller } from 'react-hook-form';

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
import { DatePicker } from './DatePicker';
import Button from './Button';

const StudentForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="create">Add New Student</Button>
      </DialogTrigger>
      <DialogContent className="p-2 max-w-[400px]  sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Students</DialogTitle>
          <DialogDescription>
            Enter Student Information Here:
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2 px-4">

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="grid items-center gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: 'First Name is required' }}
                render={({ field }) => (
                  <Input {...field} id="firstName" type="text" />
                )}
              />
              {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
            </div>

            {/* Last Name */}
            <div className="grid items-center gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{ required: 'Last Name is required' }}
                render={({ field }) => (
                  <Input {...field} id="lastName" type="text" />
                )}
              />
              {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className='grid grid-cols-2 items-center gap-4'>
            {/* Father Name */}
            <div className="grid items-center gap-2">
              <Label htmlFor="fatherName">Father Name</Label>
              <Controller
                name="fatherName"
                control={control}
                defaultValue=""
                rules={{ required: 'Father Name is required' }}
                render={({ field }) => (
                  <Input {...field} id="fatherName" type="text" />
                )}
              />
              {errors.fatherName && <span className="text-red-500">{errors.fatherName.message}</span>}
            </div>

            {/* Mother Name */}
            <div className="grid items-center gap-2">
              <Label htmlFor="motherName" >Mother Name</Label>
              <Controller
                name="motherName"
                control={control}
                defaultValue=""
                rules={{ required: 'Mother Name is required' }}
                render={({ field }) => (
                  <Input {...field} id="motherName" type="text" />
                )}
              />
              {errors.motherName && <span className="text-red-500">{errors.motherName.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Gender */}
            <div className="grid items-center gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <Input {...field} id="gender" type="text" />
                )}
              />
              {errors.gender && <span className="text-red-500">{errors.gender.message}</span>}
            </div>

            {/* Blood Type */}
            <div className="grid items-center gap-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Controller
                name="bloodType"
                control={control}
                defaultValue=""
                rules={{ required: 'Blood Type is required' }}
                render={({ field }) => (
                  <Input {...field} id="bloodType" type="text" />
                )}
              />
              {errors.bloodType && <span className="text-red-500">{errors.bloodType.message}</span>}
            </div>
          </div>

          {/* Address */}
          <div className="grid items-center gap-2">
            <Label htmlFor="address">Address</Label>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <Input {...field} id="address" type="text" />
              )}
            />
            {errors.address && <span className="text-red-500">{errors.address.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DOB */}
            {/* <div className="grid items-center gap-2">
              <Label htmlFor="dob">DOB</Label>
              <Controller
                name="dob"
                control={control}
                defaultValue={null}
                rules={{ required: 'DOB is required' }}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    placeholder="Select DOB"
                  />
                )}
              />
              {errors.dob && <span className="text-red-500">{errors.dob.message}</span>}
            </div> */}

            {/* Admission Date
            <div className="grid items-center gap-2">
              <Label htmlFor="admissionDate">Admission Date</Label>
              <Controller
                name="admissionDate"
                control={control}
                defaultValue={null}
                rules={{ required: 'Admission Date is required' }}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    selected={value}
                    onChange={(date) => onChange(date)}
                    placeholder="Select Admission Date"
                  />
                )}
              />
              {errors.admissionDate && <span className="text-red-500">{errors.admissionDate.message}</span>}
            </div> */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Class */}
            <div className="grid  items-center gap-2">
              <Label htmlFor="class" >Class</Label>
              <Controller
                name="class"
                control={control}
                defaultValue=""
                rules={{ required: 'Class is required' }}
                render={({ field }) => (
                  <Input {...field} id="class" type="text" />
                )}
              />
              {errors.class && <span className="text-red-500">{errors.class.message}</span>}
            </div>

            {/* Email */}
            <div className="grid  items-center gap-2">
              <Label htmlFor="email" >Email</Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <Input {...field} id="email" type="text" />
                )}
              />
              {errors.class && <span className="text-red-500">{errors.class.message}</span>}
            </div>
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
