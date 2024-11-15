import React, { useEffect, useState } from 'react';
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
import DocumentUpload from '@/pages/admin/StudentForm/DocumentUpload';
import ProfilePicUpload from '@/components/common/profilePicUpload';

const AddStaffForm = ({ user, id }) => {
   const { staffById, getStaffById, updateStaff, loading } = useStaffStore();
   const steps = ["Personal Info", "Address Info", "Document Upload"];
   const [isOpen, setIsOpen] = useState(false);
   const [currentStep, setCurrentStep] = useState(0);
   const [profilePic, setProfilePic] = useState(null);
   const [documents, setDocuments] = useState({
      birthCertificate: null,
      citizenship: null,
      marksheet: null,
   });


   useEffect(() => {
      if (id) {
         getStaffById(id);
      }
   }, [id, getStaffById]);

   const {
      register,
      handleSubmit,
      formState: { errors },
      trigger,
      clearErrors,
      reset
   } = useForm({});

   const onSubmit = async (data) => {
      try {
         const res = await updateStaff(id, data);
         if (res) {
            setIsOpen(false);
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button
               variant="edit"
               className="uppercase"
               onClick={() => {
                  reset({
                     ...staffById,
                  });
               }}
            >
               Edit
            </Button>
         </DialogTrigger>
         <DialogContent className="bg-white overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  Update {user}
               </DialogTitle>
               <DialogDescription>
                  <StepIndicator steps={steps} currentStep={currentStep} />
               </DialogDescription>
            </DialogHeader>
            <hr />
            <form
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
                        user={user}
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
                  <DocumentUpload
                     register={register}
                     setDocuments={setDocuments}
                     documents={documents}
                     errors={errors}
                     clearErrors={clearErrors}
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
                        className="bg-blue-600 text-white py-2 px-4 rounded"
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
