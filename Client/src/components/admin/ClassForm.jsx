import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Controller, useForm } from "react-hook-form"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useClassStore from "@/store/classStore";
import Spinner from "../Loader/Spinner";
import { useState } from "react";
import ImageUpload from "../common/ImageUpload";

const formFields = [
   {
      name: "className",
      label: "Class Name",
      required: "Class Name is required",
      placeholder: "Enter Class Name",
      type: "text",
   },
   {
      name: "section",
      label: "Section",
      required: "Section is required",
      placeholder: "Enter Section",
      type: "text",
   },

]
const ClassForm = ({ isOpen, setIsOpen, selectedData }) => {

   const [routine, setRoutine] = useState('');
   const { addClass, isSubmitting } = useClassStore();

   const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
      clearErrors
   } = useForm();

   const onSubmit = async (data) => {
      const formData = new FormData();
      formData.append("className", data.className);
      formData.append("section", data.section);
      console.log("Form Data:", formData);

      const res = await addClass(formData);
      if (res.success) {
         reset();
         setIsOpen(false);
      }
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogContent className="bg-white overflow-y-auto sm:w-full sm:max-w-3xl">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  Add Class
               </DialogTitle>
               <DialogDescription />
            </DialogHeader>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="grid grid-cols-2 gap-4 mb-4">
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
               <ImageUpload
                  label="Routine(Optional)"
                  image={routine}
                  setImage={setRoutine}
                  errors={errors}
                  clearErrors={clearErrors}
               />
               <div className="flex justify-end mt-6">
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
      </Dialog>

   )
}

export default ClassForm