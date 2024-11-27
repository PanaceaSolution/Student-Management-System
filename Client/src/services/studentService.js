import toast from "react-hot-toast";

// const URL = import.meta.env.VITE_API_URL;
const URL = "http://localhost:3000";

export const getAllStudentsService = async (query) => {
  try {
    const response = await fetch(`${URL}/auth/users/role?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const error = await response.json();
        errorMessage = error.message || "Something went wrong.";
      } catch (err) {
        errorMessage = response.statusText || "Failed to fetch students.";
      }
      toast.error(errorMessage);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching students:", error);
    toast.error("An error occurred while fetching students.");
    throw error;
  }
};

export const getStudentByIdService = async (id) => {
  try {
    const response = await fetch(`${URL}/student/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while getting student by id:", error);
    throw error;
  }
};

export const getStudentsByClassAndSectionService = async (
  className,
  section,
) => {
  try {
    const response = await fetch(
      `${URL}/student/by-class?className=${encodeURIComponent(
        className
      )}&section=${encodeURIComponent(section)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("data", data);
    return data;

  } catch (error) {
  
    console.error("Error while getting students by class and section:", error);
    throw error;
  }
};

export const createStudentService = async (studentData) => {
  try {
    const response = await fetch(`${URL}/student/create`, {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
      },
      body: studentData,
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
export const deleteStudentService = async (id) => {
  try {
    const response = await fetch(`${URL}/auth/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds: [`${id}`] }),
    });
    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const error = await response.json();
        errorMessage = error.message || "Something went wrong.";
      } catch (err) {
        errorMessage = response.statusText || "Failed to Delete student.";
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
