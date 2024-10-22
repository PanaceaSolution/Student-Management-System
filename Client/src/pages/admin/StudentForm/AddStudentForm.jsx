import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StepIndicator from "./StepIndicator";
import PersonalInfo from "./PersonalInfo";
import AddressInfo from "./AddressInfo";
import DocumentUpload from "./DocumentUpload";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useAddStudent from "@/hooks/useAddStudent";

const AddStudentForm = ({ studentId, initialData }) => {
  const steps = ["Personal Info", "Address Info", "Document Upload"];
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    clearErrors,
    setValue,
  } = useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [documents, setDocuments] = useState({
    birthCertificate: null,
    citizenship: null,
    marksheet: null,
  });

  const { addStudent, updateStudent } = useAddStudent();

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    Object.entries(documents).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    try {
      if (studentId) {
        // await updateStudent.mutateAsync({ studentId, formData });
        console.log("Student updated:", formData);
      } else {
        await addStudent(formData);
        console.log("Student added:", formData);
      }
      reset();
      setProfilePic(null);
      setDocuments({ birthCertificate: null, citizenship: null, marksheet: null });
    } catch (error) {
      console.error("Submission error:", error);
    }
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
    <section className="max-w-7xl mx-auto">
      <form
        className=" bg-white shadow-md py-5 p-4"
        onSubmit={
          currentStep === steps.length - 1
            ? handleSubmit(onSubmit)
            : (e) => e.preventDefault()
        }
      >
        <h1 className="text-xl font-bold mb-4 text-center uppercase">
          {studentId ? "Edit Student" : "Student Registration"}
        </h1>
        <StepIndicator steps={steps} currentStep={currentStep} />

        {currentStep === 0 && (
          <PersonalInfo
            register={register}
            errors={errors}
            handleFileChange={handleFileChange}
            profilePic={profilePic}
            removeFile={removeFile}
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
              {studentId ? "Update" : "Submit"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AddStudentForm;
