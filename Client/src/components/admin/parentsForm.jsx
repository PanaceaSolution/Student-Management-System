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
   MultiSelector,
   MultiSelectorTrigger,
   MultiSelectorInput,
   MultiSelectorContent,
   MultiSelectorList,
   MultiSelectorItem,
} from "@/components/ui/multi-select";
import ProfilePicUpload from "../common/profilePicUpload";
import useParentStore from "@/store/parentsStore";

const ParentsForm = ({ title, data }) => {
   const { students, getAllStudents } = useStudentStore();
   const { updateParent, addParent } = useParentStore();

   const [isOpen, setIsOpen] = useState(false);
   const [profilePic, setProfilePic] = useState(null);
   const [selectedStudentIds, setSelectedStudentIds] = useState([]);

   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
      clearErrors,
   } = useForm({
      defaultValues: {
         firstName: data?.firstName || "",
         lastName: data?.lastName || "",
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
         setValue("firstName", data.firstName);
         setValue("lastName", data.lastName);
         setValue("email", data.email);
         setSelectedStudentIds(data.studentId || []);
      }
   }, [data, setValue]);

   const onSubmit = async (formData) => {
      const formattedData = {
         ...formData,
         profilePic: profilePic,
         studentId: selectedStudentIds,
      };
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
                  <div>
                     <Label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                        First Name
                     </Label>
                     <Input
                        id="firstName"
                        type="text"
                        {...register("firstName", { required: "First Name is required" })}
                        className={`w - full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors.firstName ? "border-red-500" : ""}`}
                        placeholder="Enter First Name"
                     />
                     {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
                  </div>
                  <div>
                     <Label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                        Last Name
                     </Label>
                     <Input
                        id="lastName"
                        type="text"
                        {...register("lastName", { required: "Last Name is required" })}
                        className={`w - full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors.lastName ? "border-red-500" : ""}`}
                        placeholder="Enter Last Name"
                     />
                     {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
                  </div>
               </div>
               <div className="py-4">
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-900">
                     Email
                  </Label>
                  <Input
                     id="email"
                     type="email"
                     {...register("email", { required: "Email is required" })}
                     className={`w - full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors.email ? "border-red-500" : ""}`}
                     placeholder="Enter Email"
                  />
                  {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
               </div>
               <div className="mb-4">
                  <Label htmlFor="studentId" className="block text-sm font-medium text-gray-900">
                     Student(s)
                  </Label>
                  <MultiSelector
                     values={selectedStudentIds}
                     onValuesChange={setSelectedStudentIds}
                     id="studentId"
                  >
                     <MultiSelectorTrigger className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm text-sm text-gray-900 focus:outline-none ${errors.studentId ? "border-red-500" : ""}`}>
                        <MultiSelectorInput placeholder="Select Student(s)" />
                     </MultiSelectorTrigger>
                     <MultiSelectorContent>
                        <MultiSelectorList className="bg-white border border-gray-300 focus:outline-none">
                           {students.map((s) => (
                              <MultiSelectorItem key={s.id} value={s.id}>
                                 {s.firstName} {s.lastName}
                              </MultiSelectorItem>
                           ))}
                        </MultiSelectorList>
                     </MultiSelectorContent>
                  </MultiSelector>
                  {errors.studentId && <p className="text-red-600 text-sm">{errors.studentId.message}</p>}
               </div>
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
