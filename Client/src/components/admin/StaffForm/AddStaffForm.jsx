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
import StaffForm from './StaffForm';

const AddStaffForm = ({ user }) => {
   const { addStaff, loading, error } = useStaffStore();
   const steps = ["Personal Info", "Address Info", "Document Upload"];
   const [isOpen, setIsOpen] = useState(false);
   const [currentStep, setCurrentStep] = useState(0);
   const [profilePic, setProfilePic] = useState(null);
   const [documents, setDocuments] = useState({
      birthCertificate: null,
      citizenship: null,
      marksheet: null,
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
      const formattedData = {
         ...data,
         profilePic: profilePic,
         role: user === 'Teacher' ? 'Teacher' : data.role || 'DefaultRole',
         documents: {
            birthCertificate: documents.birthCertificate,
            citizenship: documents.citizenship,
            marksheet: documents.marksheet,
         }
      };
      try {
         const res = await addStaff(formattedData);
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
               variant="create"
               className="uppercase"
            >
               Create {user}
            </Button>
         </DialogTrigger>
         <DialogContent className="bg-white overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center uppercase">
                  {user} Registration
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
