import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import useSubjectStore from "@/store/subjectStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const formFields = [
   {
      name: "courseName",
      label: "Course Name",
      required: "Course Name is required",
      placeholder: "Enter Course Name",
      type: "text",
   },
   {
      name: "courseDescription",
      label: "Course Description",
      required: "Course Description is required",
      placeholder: "Enter Course Description",
      type: "text",
   }
];

const SubjectForm = ({
   setIsModalOpen,
   isModalOpen,
   id,
   setId,
   isUpdating,
   setIsUpdating
}) => {

   const { addSubject, updateSubject } = useSubjectStore()

   // useEffect(() => {
   //    if (id) {
   //       getSubjectById(id).
   //          then(data => reset(data));
   //    }
   // }, [id]);

   const { control, handleSubmit, formState: { errors }, reset } = useForm({});


   const onSubmit = async (data) => {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("courseDescription", data.courseDescription);

      const res = isUpdating
         ? await updateSubject(id, formData)
         : await addSubject(formData);
      console.log("Response:", res);


      if (res.success) {
         toast.success(res.message);
         reset()
         setIsModalOpen(false);
         setId(null);
      }
   };

   return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogTrigger asChild>
            <Button
               variant="create"
               className="uppercase"
               onClick={() => {
                  reset({
                     name: "",
                  });
                  setIsUpdating(false);
                  setIsModalOpen(true);
                  setId(null);
               }}
            >
               Add Subjects
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  {isUpdating ? "Edit Subject" : "Add New Subject"}
               </DialogTitle>
               <DialogDescription>
                  Fill in the details below to {isUpdating ? "update" : "add"} subject.
               </DialogDescription>
            </DialogHeader>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)} >
               <div className="grid gap-4 mb-4">
                  {formFields.map(({ name, label, required, placeholder }) => (
                     <div key={name} className="grid items-center gap-2">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                           name={name}
                           control={control}
                           defaultValue=""
                           rules={required ? { required: required } : {}}
                           render={({ field }) => (
                              <Input
                                 {...field}
                                 id={name}
                                 type="text"
                                 placeholder={placeholder}
                                 className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""}`}
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
               <div className="flex justify-end mt-4">
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                     Submit
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog >
   );
};

export default SubjectForm;
