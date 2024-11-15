import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../../ui/button';
import useStaffStore from '@/store/staffStore';
import StepIndicator from '@/pages/admin/StudentForm/StepIndicator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StaffInfo from './StaffInfo';
import AddressInfo from '@/pages/admin/StudentForm/AddressInfo';
import ProfilePicUpload from '@/components/common/profilePicUpload';
import StaffDocumentUpload from './StaffDocumentUpload';

const documentFields = [
   { name: "birthCertificate", label: "Birth Certificate (optional)" },
   { name: "citizenship", label: "Citizenship Document (optional)" },
]

const AddStaffForm = ({ formOpen, setFormOpen, setLoading }) => {
   const { addStaff, loading } = useStaffStore();
   const steps = ["Personal Info", "Address Info", "Document Upload"];
   const [currentStep, setCurrentStep] = useState(0);
   const [profilePic, setProfilePic] = useState('');
   const [documents, setDocuments] = useState({
      birthCertificate: null,
      citizenship: null,
   });

   const {
      register,
      handleSubmit,
      formState: { errors },
      trigger,
      clearErrors,
      reset
   } = useForm({});

   const onSubmit = async (data) => {
      const formattedData = new FormData();

      // Append the fields to FormData
      formattedData.append("email", data.email);
      formattedData.append("password", data.password || 'ijijisj');
      formattedData.append("role", "STAFF");
      formattedData.append("staffRole", data.staffRole);
      formattedData.append("salary", data.salary);
      formattedData.append("hireDate", data.hireDate);

      // Address info
      formattedData.append("address", JSON.stringify([
         {
            wardNumber: data.wardNumber,
            municipality: data.municipality,
            province: data.province,
            district: data.district,
         }
      ]));

      // Profile info
      formattedData.append("profile", JSON.stringify({
         fname: data.fname,
         lname: data.lname,
         gender: data.gender,
         dob: data.dob,
      }));

      // Contact info
      formattedData.append("contact", JSON.stringify({
         phoneNumber: data.phoneNumber,
         alternatePhoneNumber: data.alternatePhoneNumber,
         telephoneNumber: data.telephoneNumber,
      }));

      // Document info
      formattedData.append("document", JSON.stringify([
         { documentName: "Birth Certificate" },
         { documentName: "Citizenship" }
      ]));

      // Append the profile picture (if any)
      if (profilePic) {
         formattedData.append("profilePicture", profilePic);
      }

      // Append documents (if any)
      if (documents.birthCertificate) {
         formattedData.append("documents", documents.birthCertificate);
      }
      if (documents.citizenship) {
         formattedData.append("documents", documents.citizenship);
      }

      try {
         const res = await addStaff(formattedData);
         if (res.status === 201) {
            setFormOpen(false);
            reset();
            setCurrentStep(0);
            setProfilePic(null);
            setDocuments({
               birthCertificate: null,
               citizenship: null,
               marksheet: null,
            })
         }
      } catch (error) {
         console.error("Error adding staff:", error);
      }
   };

   const handleNext = async () => {
      const isValid = await trigger();
      if (isValid) {
         setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
      }
   };

   const handlePrevious = () => {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
   };

   return (
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
         <DialogTrigger asChild>
            <Button
               variant="create"
               className="uppercase"
            >
               Add Staff
            </Button>
         </DialogTrigger>
         <DialogContent className="bg-white overflow-y-auto sm:w-full sm:max-w-3xl">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  Staff Registration
               </DialogTitle>
               <DialogDescription>
                  <StepIndicator steps={steps} currentStep={currentStep} />
               </DialogDescription>
            </DialogHeader>
            <hr />
            <form
               encType='multipart/form-data'
               onSubmit={
                  currentStep === steps.length - 1
                     ? handleSubmit(onSubmit)
                     : (e) => e.preventDefault()
               }>
               {currentStep === 0 && (
                  <div>
                     <StaffInfo
                        register={register}
                        errors={errors}
                        profilePic={profilePic}
                        setProfilePic={setProfilePic}
                        clearErrors={clearErrors}
                     />
                     <ProfilePicUpload
                        profilePic={profilePic}
                        setProfilePic={setProfilePic}
                        clearErrors={clearErrors}
                        errors={errors}
                     />
                  </div>
               )}
               {currentStep === 1 && (
                  <AddressInfo
                     register={register}
                     errors={errors}
                     clearErrors={clearErrors}
                  />
               )}
               {currentStep === 2 && (
                  <StaffDocumentUpload
                     register={register}
                     setDocuments={setDocuments}
                     documents={documents}
                     errors={errors}
                     clearErrors={clearErrors}
                     documentFields={documentFields}
                  />
               )}
               <div className="mt-6 flex justify-between">
                  {currentStep > 0 && (
                     <div
                        onClick={handlePrevious}
                        className="bg-gray-300 cursor-pointer text-black py-2 px-4 rounded flex gap-1 justify-center items-center"
                     >
                        <ChevronLeft /> Back
                     </div>
                  )}
                  {currentStep < steps.length - 1 ? (
                     <div
                        onClick={handleNext}
                        className="bg-blue-600 cursor-pointer text-white py-2 px-4 rounded flex gap-1 justify-center items-center"
                     >
                        Next <ChevronRight />
                     </div>
                  ) : (
                     <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded disabled:cursor-not-allowed disabled:bg-blue-300"
                        disabled={loading}
                        aria-label="Submit Form"
                     >
                        Submit
                     </button>
                  )}
               </div>

            </form>
         </DialogContent>
      </Dialog>
   );
};

export default AddStaffForm;
