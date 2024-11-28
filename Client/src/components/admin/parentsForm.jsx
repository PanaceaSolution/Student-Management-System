import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ProfilePicUpload from "../common/ImageUpload";
import useParentStore from "@/store/parentsStore";

const ParentsForm = ({ selectedData, setSelectedData, formOpen, setFormOpen }) => {
   const { updateParent } = useParentStore();
   const [profilePic, setProfilePic] = useState(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
      clearErrors,
      setValue,
      reset
   } = useForm({});

   useEffect(() => {
      if (selectedData) {
         setValue("fname", selectedData.user_profile_fname);
         setValue("lname", selectedData.user_profile_lname);
         setValue("gender", selectedData.user_profile_gender);
         setValue("email", selectedData.user_email);
         setProfilePic(selectedData.user_profile_profilePicture);
      }
   }, [selectedData]);

   const onSubmit = async (data) => {
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

      const res = await updateParent(selectedData.id, formData);
      if (res.success) {
         reset();
         setIsOpen(false);
         clearErrors();
         setSelectedData(null);
      }
   };

   return (
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
         {/* <DialogTrigger asChild>
            <Button
               variant="create"
               className="uppercase"
               onClick={() => handleAddForm()}
            >
               {title}
            </Button>
         </DialogTrigger> */}
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
               {/* <div>
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
               </div> */}
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
