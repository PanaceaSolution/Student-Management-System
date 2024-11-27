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
import ImageUpload from '@/components/common/ImageUpload';
import StaffDocumentUpload from './StaffDocumentUpload';
import Spinner from '@/components/Loader/Spinner';

const documentFields = [
   { name: "cv", label: "CV (optional)" },
   { name: "citizenship", label: "Citizenship Document (optional)" },
];

const AddStaffForm = ({ formOpen, setFormOpen, selectedData, setSelectedData, currentStep, setCurrentStep }) => {
   const { addStaff, updateStaff, isSubmitting } = useStaffStore();
   const steps = ["Personal Info", "Address Info", "Document Upload"];
   const [profilePic, setProfilePic] = useState('');
   const [documents, setDocuments] = useState({
      cv: null,
      citizenship: null,
   });


   const {
      register,
      handleSubmit,
      formState: { errors },
      trigger,
      clearErrors,
      reset,
      setValue,
   } = useForm({
   });

   useEffect(() => {
      if (selectedData) {
         setValue("fname", selectedData.user_profile_fname);
         setValue("lname", selectedData.user_profile_lname);
         setValue("gender", selectedData.user_profile_gender);
         setValue("dob", selectedData.user_profile_dob);
         setProfilePic(selectedData.user_profile_profilePicture);
         setValue("email", selectedData.user_email);
         setValue("staffRole", selectedData.user_staffRole);
         setValue("salary", selectedData.user_salary);
         setValue("hireDate", selectedData.user_hireDate);
         setValue("wardNumber", selectedData.user_address_0_wardNumber);
         setValue("municipality", selectedData.user_address_0_municipality);
         setValue("province", selectedData.user_address_0_province);
         setValue("district", selectedData.user_address_0_district);
         setValue("phoneNumber", selectedData.user_contact_phoneNumber);
         setValue("alternatePhoneNumber", selectedData.user_contact_alternatePhoneNumber);
         setValue("telephoneNumber", selectedData.user_contact_telephoneNumber);
         setDocuments({
            cv: selectedData.user_documents_0_documentFile,
            citizenship: selectedData.user_documents_1_documentFile,
         })
      }
   }, [selectedData, setValue])

   const resetFormState = () => {
      reset({});
      setProfilePic(null);
      setDocuments({ cv: null, citizenship: null });
   };

   const handleAddForm = () => {
      resetFormState();
      setCurrentStep(0);
      setSelectedData(null);
      setFormOpen(true);
   };

   const onSubmit = async (data) => {
      const formattedData = new FormData();

      // Append the fields to FormData
      formattedData.append("email", data.email);
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

      // Function to check if the value is a URL
      const isUrl = (value) => {
         try {
            new URL(value);
            return true;
         } catch {
            return false;
         }
      };

      // Append the profile picture if not a URL
      if (profilePic && !isUrl(profilePic)) {
         formattedData.append("profilePicture", profilePic);
      }

      // Append documents info and files
      const documentData = [];
      documentFields.forEach((field) => {
         const documentFile = documents[field.name];
         const isDocumentUrl = isUrl(documentFile);

         documentData.push({
            documentName: field.label,
            documentFile: isDocumentUrl ? documentFile : null,
         });

         // Append the file if it is not a URL
         if (!isDocumentUrl && documentFile) {
            formattedData.append("documents", documentFile);
         }
      });

      // Append the document metadata
      formattedData.append("document", JSON.stringify(documentData));

      try {
         const res = selectedData
            ? await updateStaff(selectedData.user_staffId, formattedData)
            : await addStaff(formattedData);

         if (res.success) {
            console.log(res);
            setFormOpen(false);
            reset();
            setCurrentStep(0);
            setProfilePic(null);
            setDocuments({
               cv: null,
               citizenship: null,
            });
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
               onClick={() => handleAddForm()}
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
                        clearErrors={clearErrors}
                     />
                     <ImageUpload
                        label="Profile Picture"
                        image={profilePic}
                        setImage={setProfilePic}
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
                  <div className='grid gap-4'>
                     {documentFields.map((field, index) => (
                        <ImageUpload
                           key={index}
                           label={field.label}
                           image={documents[field.name]}
                           setImage={(image) =>
                              setDocuments((prev) => ({ ...prev, [field.name]: image }))
                           }
                           clearErrors={clearErrors}
                           errors={errors}
                        />
                     ))}
                  </div>
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
                        disabled={isSubmitting}
                        aria-label="Submit Form"
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
                     </button>
                  )}
               </div>

            </form>
         </DialogContent>
      </Dialog>
   );
};

export default AddStaffForm;
