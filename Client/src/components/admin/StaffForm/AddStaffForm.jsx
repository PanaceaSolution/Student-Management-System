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
      const formData = {
         ...data,
         profilePic
      };
      console.log(formData);


      // if (user === "Teacher") {
      //    data.role = "Teacher";
      // }
      // const formattedData = {
      //    ...data,
      //    salary: Number(data.salary),
      // };
      // console.log(formattedData);

      // const res = await addStaff(formattedData);
      // if (res.statusCode === 200) {
      //    reset()
      // }
   };

   const handleFileChange = (e) => {
      setProfilePic(e.target.files[0]);
      clearErrors("profilePic");
   };

   const removeFile = () => {
      setProfilePic(null);
      clearErrors("profilePic");
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
      <Dialog>
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
               handleFileChange={handleFileChange}
               profilePic={profilePic}
               removeFile={removeFile}
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
