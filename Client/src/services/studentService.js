// const URL = import.meta.env.VITE_API_URL;
const URL = "http://localhost:8080";

export const getAllStudentsService = async () => {
   try {
      const response = await fetch(`${URL}/student`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting all students:", error);
      throw error;
   }
}


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
}


export const createStudentService = async (studentData) => {
   try {
      const response = await fetch(`${URL}/student`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(studentData),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while creating student:", error);
      throw error;
   }
}


export const updateStudentService = async (id, updatedStudentData) => {
   try {
      const response = await fetch(`${URL}/student/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedStudentData),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while updating student:", error);
      throw error;
   }
}


export const deleteStudentService = async (id) => {
   try {
      const response = await fetch(`${URL}/student/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while deleting student:", error);
      throw error;
   }
}