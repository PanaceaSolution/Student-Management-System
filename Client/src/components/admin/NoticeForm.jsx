import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../common/ImageUpload";
import { useState } from "react";

const formFields = [
   {
      name: "title",
      label: "Title",
      required: "Title is required",
      placeholder: "Enter Title",
      type: "text",
      tag: "input",
   },
   {
      name: "description",
      label: "Description",
      required: "Description is required",
      placeholder: "Enter Description",
      type: "text",
      tag: "textarea",
   },
];

const NoticeForm = ({ formOpen, setFormOpen }) => {
   const [image, setImage] = useState(null);
   const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
      clearErrors
   } = useForm();

   const onSubmit = async (data) => {
      console.log(data);
      // Reset form and close dialog
      reset();
      setFormOpen(false);
   };

   return (
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
         <DialogContent className="bg-white overflow-y-auto sm:w-full sm:max-w-2xl">
            <DialogHeader>
               <DialogTitle>Add Notice</DialogTitle>
               <DialogDescription>Fill out the form below to add a new notice.</DialogDescription>
            </DialogHeader>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="grid gap-4 py-4">
                  {formFields.map(({ name, label, required, placeholder, tag }) => (
                     <div key={name} className="grid items-center">
                        <Label htmlFor={name} className="block text-base font-medium text-gray-900">{label}</Label>
                        <Controller
                           name={name}
                           control={control}
                           defaultValue=""
                           rules={required ? { required: required } : {}}
                           render={({ field }) =>
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
                           }
                        />
                        {errors[name] && (
                           <span className="text-red-500 text-xs">{errors[name].message}</span>
                        )}
                     </div>
                  ))}
               </div>
               <ImageUpload
                  label="Upload Notice Image"
                  image={image}
                  setImage={setImage}
                  errors={errors}
                  clearErrors={clearErrors}
               />
               <div className="flex justify-end gap-4 mt-4">
                  <button
                     type="button"
                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-sm"
                     onClick={() => setFormOpen(false)}
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-sm"
                  >
                     Submit
                  </button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default NoticeForm;
