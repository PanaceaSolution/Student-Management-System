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
import StaffForm from './StaffForm';

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
            <StaffForm
               handleSubmit={handleSubmit}
               onSubmit={onSubmit}
               register={register}
               errors={errors}
               loading={loading}
               user={user}
               profilePic={profilePic}
               setProfilePic={setProfilePic}
               clearErrors={clearErrors}
               currentStep={currentStep}
               setCurrentStep={setCurrentStep}
               handleNext={handleNext}
               handlePrevious={handlePrevious}
               documents={documents}
               setDocuments={setDocuments}
               steps={steps}
            />
         </DialogContent>
      </Dialog>
   );
};

export default AddStaffForm;
