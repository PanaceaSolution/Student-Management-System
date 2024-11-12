import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import useStudentStore from "@/store/studentStore";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectGroup,
} from "@/components/ui/select";
import ProfilePicUpload from "../common/profilePicUpload";
import useParentStore from "@/store/parentsStore";

const ParentsForm = ({ title, data }) => {
   const { students, getAllStudents } = useStudentStore();
   const { updateParent, addParent } = useParentStore()

   const [isOpen, setIsOpen] = useState(false);
   const [profilePic, setProfilePic] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedStudentIds, setSelectedStudentIds] = useState(data?.studentId || []);

   const {
      register,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
      clearErrors,
   } = useForm({
      defaultValues: {
         fname: data?.firstName || "",
         lname: data?.lastName || "",
         email: data?.email || "",
         studentId: data?.studentId || [],
      },
   });

   useEffect(() => {
      getAllStudents();
   }, [getAllStudents]);

   useEffect(() => {
      if (data) {
         setProfilePic(data.profilePic || null);
         setValue("firstname", data.firstName);
         setValue("lastname", data.lastName);
         setValue("email", data.email);
         setSelectedStudentIds(data.studentId || []);
      }
   }, [data, setValue]);

   const onSubmit = async (formData) => {
      const formattedData = {
         ...formData,
         profilePic: profilePic,
      }
      console.log(formattedData);


      if (data) {
         await updateParent(data.id, formattedData);
      } else {
         await addParent(formattedData);
      }
      setIsOpen(false);
      clearErrors();
      setSelectedStudentIds([]);
   };

   const handleStudentSelect = id => {
      const updatedSelection = selectedStudentIds.includes(id)
         ? selectedStudentIds.filter(studentId => studentId !== id)
         : [...selectedStudentIds, id];
      setSelectedStudentIds(updatedSelection);
      setValue("studentId", updatedSelection);
      clearErrors("studentId");
   };

   const filteredOptions = students.filter(student =>
      `${student.firstName}`.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button variant="create" className="uppercase">
               {title}
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  Parents Registration
               </DialogTitle>
               <DialogDescription>
                  Fill the form below to create a new parent
               </DialogDescription>
            </DialogHeader>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="grid grid-cols-2 gap-4">
                  {/* First Name Field */}
                  <div>
                     <Label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                        First Name
                     </Label>
                     <Input
                        id="firstName"
                        type="text"
                        {...register("firstName", { required: "First Name is required" })}
                        className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors.fname ? "border-red-500" : ""}`}
                        placeholder="Enter First Name"
                     />
                     {errors.fname && <p className="text-red-600 text-sm">{errors.fname.message}</p>}
                  </div>

                  {/* Last Name Field */}
                  <div>
                     <Label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                        Last Name
                     </Label>
                     <Input
                        id="lastName"
                        type="text"
                        {...register("lastName", { required: "Last Name is required" })}
                        className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors.lname ? "border-red-500" : ""}`}
                        placeholder="Enter Last Name"
                     />
                     {errors.lname && <p className="text-red-600 text-sm">{errors.lname.message}</p>}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 py-4">
                  {/* Email Field */}
                  <div>
                     <Label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Email
                     </Label>
                     <Input
                        id="email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors.email ? "border-red-500" : ""}`}
                        placeholder="Enter Email"
                     />
                     {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                  </div>
               </div>

               {/* Student Selection */}
               <div>
                  <Label htmlFor="studentId" className="block text-sm font-medium text-gray-900">
                     Student
                  </Label>
                  <Select>
                     <SelectTrigger className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors.studentId ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select Student(s)" />
                     </SelectTrigger>
                     <SelectContent className="max-h-60 overflow-y-auto">
                        <SelectGroup>
                           <Input
                              type="text"
                              placeholder="Search Student..."
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="mb-2 border border-gray-300 bg-transparent"
                           />
                           {filteredOptions.map(student => (
                              <div
                                 key={student.id}
                                 className="flex items-center px-2 py-1 cursor-pointer"
                                 onClick={() => handleStudentSelect(student.id)}
                              >
                                 <input
                                    type="checkbox"
                                    checked={selectedStudentIds.includes(student.id)}
                                    onChange={() => handleStudentSelect(student.id)}
                                    className="mr-2"
                                 />
                                 {student.firstName} {student.lastName} -
                              </div>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
                  {errors.studentId && <p className="text-red-600 text-sm">{errors.studentId.message}</p>}
               </div>

               {/* Profile Picture Upload */}
               <ProfilePicUpload
                  profilePic={profilePic}
                  setProfilePic={setProfilePic}
                  clearErrors={clearErrors}
                  errors={errors}
               />

               <Button type="submit" className="w-full mt-4">
                  Submit
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default ParentsForm;
