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
import ImageUpload from "../common/ImageUpload";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import Spinner from "../Loader/Spinner";

const formFields = [
   {
      name: "courseName",
      label: "Course Name",
      required: "Course Name is required",
      placeholder: "Enter Course Name",
      type: "text",
      tag: "input",
   },
   {
      name: "courseDescription",
      label: "Course Description",
      required: "Course Description is required",
      placeholder: "Enter Course Description",
      type: "text",
      tag: "textarea",
   },
   {
      name: "fname",
      label: " Teacher's First Name*",
      required: " Teacher's First Name is required",
      placeholder: "Enter Teacher's First Name",
      type: "text",
      tag: "input",
   },
   {
      name: "lname",
      label: " Teacher's Last Name*",
      required: " Teacher's Last Name is required",
      placeholder: "Enter Teacher's Last Name",
      type: "text",
      tag: "input",
   }
];

const SubjectForm = ({ setIsFormOpen, isFormOpen, selectedData, setSelectedData }) => {

   const [file, setFile] = useState('');

   const { addSubject, isSubmitting } = useSubjectStore()

   const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      reset,
      clearErrors
   } = useForm({});

   useEffect(() => {
      if (selectedData) {
         setValue("courseName", selectedData.courseName);
         setValue("courseDescription", selectedData.courseDescription);
         setValue("fname", selectedData.fname);
         setValue("lname", selectedData.lname);
         setFile(selectedData.file);
      }
   })


   const onSubmit = async (data) => {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("courseDescription", data.courseDescription);
      formData.append("fname", data.fname);
      formData.append("lname", data.lname);

      if (image) {
         formData.append("file", file);
      }
      console.log("Form Data:", formData);


      const res = await addSubject(formData);

      if (res.success) {
         setSelectedData(null);
         setIsFormOpen(false);
         clearErrors();
         setImage('');
      }
   };

   return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
         <DialogTrigger>
            <Button
               variant="create"
               className="uppercase"
               onClick={() => {
                  reset({});
                  setIsFormOpen(true);
                  setSelectedData(null);
               }}
            >
               Add Subjects
            </Button>
         </DialogTrigger>
         <DialogContent className="bg-white overflow-y-auto sm:w-full sm:max-w-3xl">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  Add Subject
               </DialogTitle>
               <DialogDescription />
            </DialogHeader>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)} >
               <div className="grid gap-4 mb-4">
                  {formFields.map(({ name, label, required, placeholder, tag }) => (
                     <div key={name} className="grid items-center gap-2">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                           name={name}
                           control={control}
                           defaultValue=""
                           rules={required ? { required: required } : {}}
                           render={({ field }) => (
                              tag === "textarea" ? (
                                 <Textarea
                                    {...field}
                                    id={name}
                                    placeholder={placeholder}
                                    className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[name] ? "border-red-500" : ""
                                       }`}
                                 />
                              ) : (
                                 <Input
                                    {...field}
                                    id={name}
                                    type="text"
                                    placeholder={placeholder}
                                    className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[name] ? "border-red-500" : ""
                                       }`}
                                 />
                              )
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
               <ImageUpload
                  label="Upload Course Image"
                  image={file}
                  setImage={setFile}
                  errors={errors}
                  clearErrors={clearErrors}
               />
               <div className="flex justify-end mt-4">
                  <Button
                     type="submit"
                     className="bg-blue-500 hover:bg-blue-600 text-white"
                     disabled={isSubmitting}
                  >
                     {isSubmitting
                        ? (
                           <div className='flex items-center gap-2'>
                              <Spinner />
                              <span>Submitting...</span>
                           </div>
                        )
                        : "Submit"
                     }
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog >
   );
};

export default SubjectForm;
