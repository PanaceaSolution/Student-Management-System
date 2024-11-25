import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StepIndicator from "./StepIndicator";
import PersonalInfo from "./PersonalInfo";
import AddressInfo from "./AddressInfo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useStudentStore from "@/store/studentStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProfilePicUpload from "@/components/common/profilePicUpload";
import StaffDocumentUpload from "@/components/admin/StaffForm/StaffDocumentUpload";

const documentFields = [
  { name: "marksheet", label: "Marksheet (optional)" },
  { name: "birthCertificate", label: "Birth Certificate (optional)" },
  { name: "citizenship", label: "Citizenship Document (optional)" },
]

const AddStudentForm = ({ formOpen, setFormOpen, selectedData, setSelectedData, currentStep, setCurrentStep }) => {
  const steps = ["Personal Info", "Address Info", "Document Upload"];
  const { addStudent, updateStudent, loading } = useStudentStore();
  const [profilePic, setProfilePic] = useState('');
  const [documents, setDocuments] = useState({
    birthCertificate: null,
    marksheet: null,
    citizenship: null,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    clearErrors,
    setValue,
    getValues,
  } = useForm();

  const resetFormState = () => {
    reset({});
    setProfilePic(null);
    setDocuments({ birthCertificate: null, citizenship: null });
  };

  const handleAddForm = () => {
    resetFormState();
    setSelectedData(null);
    setCurrentStep(0);
    setFormOpen(true);
  };

  // Initialize form values with initialData if provided
  useEffect(() => {
    if (selectedData) {
      setValue("fname", selectedData.user_profile_fname);
      setValue("lname", selectedData.user_profile_lname);
      setValue("fatherName", selectedData.user_fatherName);
      setValue("motherName", selectedData.user_motherName);
      setValue("guardianName", selectedData.user_guardianName);
      setValue("gender", selectedData.user_profile_gender);
      setValue("dob", selectedData.user_profile_dob);
      setValue("rollNumber", selectedData.user_rollNumber);
      setValue("class", selectedData.user_class);
      setValue("section", selectedData.user_section);
      setValue("admissionDate", selectedData.user_profile_admissionDate);
      setValue("registrationNumber", selectedData.user_registrationNumber)
      setProfilePic(selectedData.user_profile_profilePicture);
      setValue("email", selectedData.user_email);
      setValue("phoneNumber", selectedData.user_contact_phoneNumber);
      setValue("alternatePhoneNumber", selectedData.user_contact_alternatePhoneNumber);
      setValue("telephoneNumber", selectedData.user_contact_telephoneNumber);
      setValue("wardNumber", selectedData.user_address_wardNumber);
      setValue("municipality", selectedData.user_address_municipality);
      setValue("province", selectedData.user_address_province);
      setValue("district", selectedData.user_address_district);
    }
  }, [selectedData, setValue]);


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("role", "STUDENT");
    formData.append("fatherName", data.fatherName);
    formData.append("motherName", data.motherName);
    formData.append("guardianName", data.guardianName);
    formData.append("rollNumber", data.rollNumber);
    formData.append("class", data.class);
    formData.append("section", data.section);
    formData.append("admissionDate", data.admissionDate);
    formData.append("religion", data.religion);
    formData.append("bloodType", data.bloodType);
    formData.append("transportationMode", data.transportationMode);
    formData.append("registrationNumber", data.registrationNumber);
    formData.append("previousSchool", data.previousSchool);

    //Profile info
    formData.append("profile", JSON.stringify({
      fname: data.fname,
      lname: data.lname,
      gender: data.gender,
      dob: data.dob,
    }));

    //Contact info
    formData.append("contact", JSON.stringify({
      phoneNumber: data.phoneNumber,
      alternatePhoneNumber: data.alternatePhoneNumber,
      telephoneNumber: data.telephoneNumber,
    }));

    // Address info
    formData.append("address", JSON.stringify([
      {
        wardNumber: data.wardNumber,
        municipality: data.municipality,
        province: data.province,
        district: data.district,
      }
    ]));
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
      formData.append("profilePicture", profilePic);
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
        formData.append("documents", documentFile);
      }
    });

    // Append the document metadata
    formData.append("document", JSON.stringify(documentData));

    try {
      const res = selectedData
        ? await updateStudent(selectedData.studentId, formData)
        : await addStudent(formData);

      if (res.success) {
        resetFormState();
        toast.success(res.message);
        setFormOpen(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Handle Next Step
  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }
  };
  // Handle Previous Step
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
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white overflow-y-auto sm:w-full sm:max-w-3xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center uppercase">
            {selectedData ? "Edit Student" : "Student Registration"}
          </DialogTitle>
          <DialogDescription>
            <StepIndicator steps={steps} currentStep={currentStep} />
          </DialogDescription>
        </DialogHeader>
        <form
          encType="multipart/form-data"
          onSubmit={
            currentStep === steps.length - 1
              ? handleSubmit(onSubmit)
              : (e) => e.preventDefault()
          }
        >
          {/* Step 1 - Personal Info */}
          {currentStep === 0 && (
            <div>
              <PersonalInfo
                register={register}
                errors={errors}
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

          {/* Step 2 - Address Info */}
          {currentStep === 1 && (
            <AddressInfo
              register={register}
              errors={errors}
              clearErrors={clearErrors}
            />
          )}

          {/* Step 3 - Document Upload */}
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
            {/* Back button */}
            {currentStep > 0 && (
              <div
                onClick={handlePrevious}
                className="bg-gray-300 cursor-pointer text-black py-2 px-4 rounded flex gap-1 justify-center items-center"
              >
                <ChevronLeft /> Back
              </div>
            )}

            {/* Next button or Submit button */}
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
                {selectedData ? "Update" : "Submit"}
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentForm;
