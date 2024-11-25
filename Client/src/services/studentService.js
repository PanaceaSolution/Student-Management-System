import toast from "react-hot-toast";

// const URL = import.meta.env.VITE_API_URL;
const URL = "http://localhost:3000";

export const createStudentService = async (studentData) => {
  try {
    const response = await fetch(`${URL}/student/create`, {
      method: "POST",
      body: studentData,
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const error = await response.json();
        errorMessage = error.message || "Something went wrong.";
      } catch (err) {
        errorMessage = response.statusText || "Failed to create student.";
      }
      toast.error(errorMessage);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while creating student:", error);
    toast.error("An error occurred while creating the student.");
    throw error;
  }
};

export const updateStudentService = async ({ studentId, formData }) => {
  try {
    const response = await fetch(`${URL}/student/update/${studentId}`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const error = await response.json();
        errorMessage = error.message || "Something went wrong.";
      } catch (err) {
        errorMessage = response.statusText || "Failed to update student.";
      }

      toast.error(errorMessage);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {

    console.error("Error while updating student:", error);
    toast.error("An error occurred while updating the student.");
    throw error;
  }
};
