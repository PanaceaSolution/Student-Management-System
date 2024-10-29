import { ChevronLeft, ChevronRight } from 'lucide-react';
import StaffInfo from './StaffInfo';
import AddressInfo from '@/pages/admin/StudentForm/AddressInfo';
import DocumentUpload from '@/pages/admin/StudentForm/DocumentUpload';

const StaffForm = ({
   handleSubmit,
   register,
   errors,
   user,
   loading,
   profilePic,
   setProfilePic,
   clearErrors,
   currentStep,
   documents,
   setDocuments,
   handleNext,
   handlePrevious,
   steps,
   onSubmit
}) => {

   return (
      <form
         onSubmit={
            currentStep === steps.length - 1
               ? handleSubmit(onSubmit)
               : (e) => e.preventDefault()
         }>

         {currentStep === 0 && (
            <StaffInfo
               register={register}
               errors={errors}
               user={user}
               profilePic={profilePic}
               setProfilePic={setProfilePic}
               clearErrors={clearErrors}
            />
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
   );
};

export default StaffForm;
