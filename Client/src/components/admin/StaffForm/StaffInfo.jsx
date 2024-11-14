import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { AtSign, Calendar, CircleDollarSign, Phone, Smartphone, User } from 'lucide-react';

const StaffInfo = ({
   register,
   errors,
   clearErrors
}) => {
   const formFields = [
      {
         name: "fname",
         label: "First Name*",
         required: "First Name is required",
         placeholder: "Enter First Name",
         type: "text",
         condition: true,
         icon: <User size={18} />
      },
      {
         name: "lname",
         label: "Last Name*",
         required: "Last Name is required",
         placeholder: "Enter Last Name",
         type: "text",
         condition: true,
         icon: <User size={18} />
      },
      {
         name: "email",
         label: "Email*",
         required: "Email is required",
         placeholder: "Enter Email",
         type: "email",
         condition: true,
         icon: <AtSign size={18} />
      },
      {
         name: "salary",
         label: "Salary*",
         required: "Salary is required",
         placeholder: "Enter Salary",
         type: "number",
         condition: true,
         icon: <CircleDollarSign size={18} />
      },
      {
         name: "gender",
         label: "Gender*",
         required: "Gender is required",
         placeholder: "Select Gender",
         type: "select",
         options: ["MALE", "FEMALE", "OTHER"],
         condition: true,
      },
      {
         name: "staffRole",
         label: "Staff Role*",
         required: "Staff Role is required",
         placeholder: "Select a Role",
         type: "select",
         options: ["ACCOUNTANT", "LIBRARIAN", "TEACHER"],
         condition: true,
      },
      {
         name: "phoneNumber",
         label: "Phone*",
         required: "Phone is required",
         placeholder: "Enter Phone",
         type: "number",
         condition: true,
         icon: <Smartphone size={20} />
      },
      {
         name: "alternatePhoneNumber",
         label: "Alternate Phone Number",
         placeholder: "Enter Alternate Phone Number",
         type: "number",
         condition: true,
         icon: <Smartphone size={20} />
      },
      {
         name: 'telephoneNumber',
         label: 'Telephone Number',
         placeholder: 'Enter Telephone Number',
         type: 'number',
         condition: true,
         icon: <Phone size={20} />
      },
      {
         name: "dob",
         label: "Date of Birth*",
         required: "Date of Birth is required",
         type: "date",
         condition: true,
         icon: <Calendar size={20} />
      },
      {
         name: "hireDate",
         label: "Enrollment Date*",
         required: "Enrollment Date is required",
         type: "date",
         condition: true,
         icon: <Calendar size={20} />
      }

   ];
   return (
      <div className='space-y-6'>
         <div className="grid grid-cols-2 gap-4 mb-4">
            {formFields.map((field, index) =>
               field.condition && (
                  <div key={index}>
                     <Label htmlFor={field.name} className="block text-sm font-medium text-gray-900">{field.label}</Label>
                     <div className="relative">
                        {field.icon && (
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                              {field.icon}
                           </div>
                        )}
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
                                 } ${field.icon ? 'pl-10' : ''}`}
                           >
                              <option value="" disabled>
                                 {field.placeholder}
                              </option>
                              {field.options && field.options.map((option, idx) => (
                                 <option key={idx} value={option}>
                                    {option}
                                 </option>
                              ))}
                           </select>
                        ) : (
                           <Input
                              id={field.name}
                              type={field.type}
                              className={`w-full rounded-sm border border-gray-300 bg-transparent mt-1 shadow-sm py-2 px-3 text-gray-900 ${errors[field.name] ? "border-red-500" : ""} ${field.icon ? 'pl-10' : ''}`}
                              placeholder={field.placeholder}
                              {...register(field.name, {
                                 required: field.required,
                              })}
                           />
                        )}
                     </div>
                     {errors[field.name] && (
                        <p className="text-red-600 text-sm">{errors[field.name].message}</p>
                     )}
                  </div>
               )
            )}
         </div>
      </div>
   )
}

export default StaffInfo