import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StepIndicator from "./StepIndicator";
import PersonalInfo from "./PersonalInfo";
import AddressInfo from "./AddressInfo";
import DocumentUpload from "./DocumentUpload";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useStudentStore from "@/store/studentStore";
import Loader from "@/components/common/Loader";

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
  const { addStudent, loading } = useStudentStore();
  // Initialize form values with initialData if provided
  useEffect(() => {
    if (initialData) {
      // Use setValue to populate fields, handle nested objects (like address, contact)
      if (initialData.email) setValue("email", initialData.email);
      if (initialData.password) setValue("password", initialData.password);
      if (initialData.role) setValue("role", initialData.role);
      if (initialData.studentClass)
        setValue("studentClass", initialData.studentClass);
      if (initialData.section) setValue("section", initialData.section);
      if (initialData.rollNumber)
        setValue("rollNumber", initialData.rollNumber);
      if (initialData.fatherName)
        setValue("fatherName", initialData.fatherName);
      if (initialData.motherName)
        setValue("motherName", initialData.motherName);
      if (initialData.guardianName)
        setValue("guardianName", initialData.guardianName);
      if (initialData.religion) setValue("religion", initialData.religion);
      if (initialData.bloodType) setValue("bloodType", initialData.bloodType);
      if (initialData.transportationMode)
        setValue("transportationMode", initialData.transportationMode);
      if (initialData.admissionDate)
        setValue("admissionDate", initialData.admissionDate);
      if (initialData.registrationNumber)
        setValue("registrationNumber", initialData.registrationNumber);
      if (initialData.previousSchool)
        setValue("previousSchool", initialData.previousSchool);
      if (initialData.profilePicture)
        setValue("profilePicture", initialData.profilePicture);

      // Handle nested objects (e.g., address, contact, documents)
      if (initialData.address) {
        const address = JSON.parse(initialData.address); // Assuming it's a stringified array
        if (address && address[0]) {
          setValue("permanentAddress", address[0].permanentAddress);
          setValue("temporaryAddress", address[0].temporaryAddress);
          setValue("villageName", address[0].villageName);
          setValue("nationality", address[0].nationality);
          setValue("province", address[0].province);
          setValue("district", address[0].district);
          setValue("municipality", address[0].municipality);
        }
      }

      if (initialData.contact) {
        const contact = JSON.parse(initialData.contact);
        if (contact) {
          setValue("phoneNumber", contact.phoneNumber);
          setValue("alternatePhoneNumber", contact.alternatePhoneNumber);
          setValue("telephoneNumber", contact.telephoneNumber);
        }
      }

      // Handle documents (if needed, based on uploaded document names)
      if (initialData.document) {
        const documentList = JSON.parse(initialData.document);
        documentList.forEach((doc) => {
          if (doc.documentName === "Birth Certificate") {
            setDocuments((prevState) => ({
              ...prevState,
              birthCertificate: true,
            }));
          }
          if (doc.documentName === "Citizenship") {
            setDocuments((prevState) => ({ ...prevState, citizenship: true }));
          }
          if (doc.documentName === "Marksheet") {
            setDocuments((prevState) => ({ ...prevState, marksheet: true }));
          }
        });
      }
    }
  }, [initialData, setValue]);
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

  const onSubmit = async (data) => {
    const formData = new FormData();
    const newData = { ...data };
    // **Profile Information**
    const profileInfo = {
      fname: newData.fname,
      lname: newData.lname,
      dob: newData.dob,
      gender: newData.gender,
    };
    formData.append("profile", JSON.stringify(profileInfo));
    delete newData["fname"];
    delete newData["lname"];
    delete newData["dob"];
    delete newData["gender"];
    // **Address Information**
    const addressObj = {
      wardNumber: newData.wardNumber,
      municipality: newData.municipality,
      province: newData.province,
      district: newData.district,
    };
    formData.append("address", JSON.stringify([addressObj]));
    delete newData["wardNumber"];
    delete newData["municipality"];
    delete newData["province"];
    delete newData["district"];
    delete newData["permanentAddress"];
    delete newData["temporaryAddress"];
    delete newData["villageName"];
    // **Contact Information**
    const contactObj = {
      phoneNumber: newData.phoneNumber,
      alternatePhoneNumber: newData.alternatePhoneNumber,
      telephoneNumber: newData.telephoneNumber,
    };
    formData.append("contact", JSON.stringify(contactObj));
    // Remove contact fields after appending
    delete newData["phoneNumber"];
    delete newData["alternatePhoneNumber"];
    delete newData["telephoneNumber"];
    // **Documents**
    const documentArray = [];
    if (newData.birthCertificate) {
      documentArray.push({ documentName: "Birth Certificate" });
    }
    if (newData.citizenship) {
      documentArray.push({ documentName: "Citizenship" });
    }
    if (newData.marksheet) {
      documentArray.push({ documentName: "Marksheet" });
    }
    if (newData.profilePicture) {
      formData.append("profilePicture", newData?.profilePicture[0]);
    }
    formData.append("document", JSON.stringify(documentArray));
    // Check if there are document files to append
    if (newData.birthCertificate || newData.citizenship || newData.marksheet) {
      formData.append("documents", newData.birthCertificate[0]);
      formData.append("documents", newData.citizenship[0]);
      formData.append("documents", newData.marksheet[0]);
    }
    // Remove document fields after appending
    delete newData["birthCertificate"];
    delete newData["citizenship"];
    delete newData["marksheet"];
    // **Remaining Data**
    for (let key in newData) {
      formData.append(key, newData[key]);
    }
    formData.append("password", "Password@123");
    formData.append("role", "STUDENT");
    try {
      if (studentId) {
        console.log("Edit student logic");
      } else {
        await addStudent(formData);
      }
    } catch (error) {
      console.error("Error submitting data: ", error);
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <form
        encType="multipart/form-data"
        className="bg-white shadow-md py-5 p-4"
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

        {/* Step 1 - Personal Info */}
        {currentStep === 0 && (
          <div>
            <PersonalInfo
              register={register}
              errors={errors}
              clearErrors={clearErrors}
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
          <DocumentUpload
            register={register}
            errors={errors}
            clearErrors={clearErrors}
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
              {studentId ? "Update" : "Submit"}
            </button>
          )}
        </div>
      </form>

      {/* Loading state */}
      {loading && <Loader />}
    </section>
  );
};

export default AddStudentForm;
