import { useState, useEffect, useMemo } from "react";
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
import { flattenData } from "@/utilities/utilities";

const ParentsForm = ({ title, selectedData, setSelectedData, formOpen, setFormOpen }) => {
   const { students, getAllStudents } = useStudentStore();
   const { updateParent, addParent } = useParentStore();
   const [profilePic, setProfilePic] = useState(null);
   const [selectedStudentIds, setSelectedStudentIds] = useState([]);
   const formattedStudent = flattenData(students);

   const studentQuery = useMemo(() => {
      const params = new URLSearchParams();
      params.append("role", "STUDENT");
      params.append("page", 1);
      params.append("limit", 10);
      return `${params.toString()}`;
   }, [])

   useEffect(() => {
      const fetchData = async () => {
         if (studentQuery) {
            await getAllStudents(studentQuery);
         }
      }

      fetchData();
   }, [studentQuery]);

   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
      clearErrors,
      reset
   } = useForm({});

   useEffect(() => {
      if (selectedData) {
         setProfilePic(selectedData.profilePic || null);
         setValue("firstName", selectedData.firstName);
         setValue("lastName", selectedData.lastName);
         setValue("email", selectedData.email);
         setSelectedStudentIds(selectedData.studentId || []);
      }
   }, [selectedData, setValue]);

   const resetFormState = () => {
      reset({});
      setProfilePic(null);
   };

   const handleAddForm = () => {
      resetFormState();
      setSelectedData(null);
      setFormOpen(true);
   };

   const onSubmit = async (data) => {
      // const formattedData = {
      //    ...formData,
      //    profilePic: profilePic,
      //    studentId: selectedStudentIds,
      // };
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("role", "PARENT");
      formData.append("profile", JSON.stringify({
         fname: data.fname,
         lname: data.lname,
         gender: data.gender || "MALE",
      }));
      formData.append("contact", JSON.stringify({
         phoneNumber: data.phoneNumber,
      }));
      if (profilePic) {
         formData.append("profilePicture", profilePic);
      }
      console.log("Formatted data: ", formData);

      if (selectedData) {
         await updateParent(selectedData.id, formData);
      } else {
         await addParent(formData);
      }
      setIsOpen(false);
      clearErrors();
      setSelectedStudentIds([]);
   };

   const previewImage = (profilePic, id) => {
      if (profilePic) {
         return (
            <img key={id} src={profilePic} alt="Profile Pic" className="w-8 h-8 rounded-full object-cover" />
         )
      }
   }

   return (
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
         <DialogTrigger asChild>
            <Button
               variant="create"
               className="uppercase"
               onClick={() => handleAddForm()}
            >
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <FormInput
                     id="fname"
                     label="First Name"
                     register={register("fname", { required: "First Name is required" })}
                     error={errors.fname}
                     placeholder="Enter First Name"
                  />
                  <FormInput
                     id="lname"
                     label="Last Name"
                     register={register("lname", { required: "Last Name is required" })}
                     error={errors.lname}
                     placeholder="Enter Last Name"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <FormInput
                     id="email"
                     label="Email"
                     register={register("email", { required: "Email is required" })}
                     error={errors.email}
                     placeholder="Enter Email"
                  />
                  <FormInput
                     id="phoneNumber"
                     label="Phone Number"
                     register={register("phoneNumber", { required: "Phone Number is required" })}
                     error={errors.phoneNumber}
                     placeholder="Enter Phone Number"
                  />
               </div>
               {/* <FormInput
                  id="email"
                  label="Email"
                  register={register("email", { required: "Email is required" })}
                  error={errors.email}
                  placeholder="Enter Email"
               /> */}
               <div>
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
                        <MultiSelectorList className="bg-white h-60 border border-gray-300 focus:outline-none">
                           {formattedStudent.map((s) => (
                              <MultiSelectorItem
                                 key={s.studentId}
                                 value={previewImage(s.user_profile_profilePicture, s.studentId)}
                                 className="flex items-center space-x-2"
                              >
                                 <img
                                    src={s.user_profile_profilePicture || "/default-avatar.png"}
                                    alt={`${s.user_profile_fname} ${s.user_profile_lname}`}
                                    className="w-8 h-8 rounded-full object-cover"
                                 />
                                 <span>{s.user_profile_fname} {s.user_profile_lname}</span>
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

const FormInput = ({ id, label, register, error, ...props }) => (
   <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-900">
         {label}
      </Label>
      <Input
         id={id}
         {...register}
         {...props}
         className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${error ? "border-red-500" : ""
            }`}
      />
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
   </div>
);


export default ParentsForm;
