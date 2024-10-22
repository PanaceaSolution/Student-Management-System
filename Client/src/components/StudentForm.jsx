import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import useAddStudent from "@/hooks/useAddStudent";
import Loadding from "./Loader/Loadding";
import Alert from "./Alert";

const formFields = [
  {
    name: "fname",
    label: "First Name",
    required: true,
    placeholder: "Enter First Name",
  },
  {
    name: "lname",
    label: "Last Name",
    required: true,
    placeholder: "Enter Last Name",
  },
  {
    name: "father_name",
    label: "Father Name",
    required: true,
    placeholder: "Enter Father's Name",
  },
  {
    name: "mother_name",
    label: "Mother Name",
    required: true,
    placeholder: "Enter Mother's Name",
  },
  {
    name: "sex",
    label: "Gender",
    required: true,
    placeholder: "Enter Gender",
  },
  {
    name: "bloodtype",
    label: "Blood Type",
    required: true,
    placeholder: "Enter Blood Type",
  },
  {
    name: "address",
    label: "Address",
    required: true,
    placeholder: "Enter Address",
  },
  { name: "class", label: "Class", required: true, placeholder: "Enter Class" },
];

const StudentForm = () => {
  const { addStudent, loading, success, error } = useAddStudent();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const onSubmit = async (data) => {
    try {
      if (data.dob) {
        data.dob = new Date(data.dob).toISOString();
      }
      if (data.admission_date) {
        data.admission_date = new Date(data.admission_date).toISOString();
      }

      // Call the addStudent function
      await addStudent(data);

      console.log(data);


      // reset();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (success) {
      setShowAlert(true);

    }
  }, [success]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} className="p-4">
      <DialogTrigger asChild>
        <Button variant="create">
          ADD STUDENT
        </Button>
      </DialogTrigger>
      <DialogContent className="p-1 md:p-2 w-11/12">
        <DialogHeader className="border-b-2 border-separate">
          <DialogTitle className="font-bold">Add Students:</DialogTitle>
          <DialogDescription className="text-lg font-bold text-primary">
            Enter Student Information Here..
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-2 px-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {formFields.map(({ name, label, required, placeholder }) => (
              <div key={name} className="grid items-center gap-2">
                <Label htmlFor={name}>{label}</Label>
                <Controller
                  name={name}
                  control={control}
                  defaultValue=""
                  rules={required ? { required: `${label} is required` } : {}}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id={name}
                      type="text"
                      placeholder={placeholder}
                      className="bg-gray-100 focus:border-blue-500 rounded-sm"
                    />
                  )}
                />
                {errors[name] && (
                  <span className="text-red-500 text-xs">
                    {errors[name].message}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DOB */}
            <div className="grid items-center gap-2">
              <Label htmlFor="dob">DOB</Label>
              <Controller
                name="dob"
                control={control}
                defaultValue=""
                rules={{
                  required: "DOB is required",
                  validate: (value) => {
                    const date = new Date(value);
                    return !isNaN(date) || "Please enter a valid date";
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dob"
                    type="date"
                    className="bg-gray-100 focus:border-blue-500 rounded-sm"
                  />
                )}
              />
              {errors.dob && (
                <span className="text-red-500 text-xs">
                  {errors.dob.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="grid items-center gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email is not valid",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="text"
                    placeholder="Enter Email"
                    className="bg-gray-100 focus:border-blue-500 rounded-sm"
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid items-center gap-2">
            <Label htmlFor="admission_date">Admission Date</Label>
            <Controller
              name="admission_date"
              control={control}
              defaultValue=""
              rules={{
                required: "Admission Date is required",
                validate: (value) => {
                  const date = new Date(value);
                  return !isNaN(date) || "Please enter a valid date";
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="dob"
                  type="date"
                  className="bg-gray-100 focus:border-blue-500 rounded-sm"
                />
              )}
            />
            {errors.dob && (
              <span className="text-red-500 text-xs">
                {errors.dob.message}
              </span>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              type="submit"
              className="bg-[#233255CC] text-[#FFFFFF] text-base px-4 py-1 sm:py-2"
              disabled={loading}
            >
              {loading ? <Loadding /> : "Add"}
            </Button>
          </DialogFooter>
        </form>

        {/* Alert Component */}
        {showAlert && (
          <Alert
            title="Success!"
            message="Student added successfully!"
            variant="success"
            position="top-center"
            onDismiss={() => setShowAlert(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
