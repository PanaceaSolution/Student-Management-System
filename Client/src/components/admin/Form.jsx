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

const Form = ({ formFields, register, errors, clearErrors, handleSubmit, onSubmit }) => {
   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button
               variant="create"
               className="uppercase"
            >
               Add Class
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  Create Class
               </DialogTitle>
               <DialogDescription>
                  Create a new class by filling out the fields below.
               </DialogDescription>
            </DialogHeader>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)} >
               <div className="grid gap-4 mb-4">
                  {formFields.map((field, index) => (
                     <div key={index}>
                        <Label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
                           {field.label}
                        </Label>
                        {field.type === "select" ? (
                           <select
                              id={field.name}
                              defaultValue=""
                              {...register(field.name, {
                                 required: field.required,
                                 validate: (value) => value !== "" || "This field is required",
                                 onChange: () => clearErrors(field.name),
                              })}
                              className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""
                                 }`}
                           >
                              <option value="" disabled>
                                 {field.placeholder}
                              </option>
                              {field.options?.map((option, idx) => (
                                 <option key={idx} value={option}>
                                    {option}
                                 </option>
                              ))}
                           </select>
                        ) : (
                           <Input
                              id={field.name}
                              type={field.type}
                              className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""}`}
                              placeholder={field.placeholder}
                              {...register(field.name, {
                                 required: field.required,
                              })}
                           />
                        )}
                        {errors[field.name] && (
                           <p className="text-red-600 text-sm">{errors[field.name]?.message}</p>
                        )}
                     </div>
                  ))}
               </div>
               <div className="flex justify-end mt-4">
                  <Button type="submit">
                     Submit
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default Form;
