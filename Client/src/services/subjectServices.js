// const URL = import.meta.env.VITE_API_URL;
const URL = "http://localhost:8080";

export const getAllSubjectsService = async () => {
   try {
      const response = await fetch(`${URL}/subjects`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting all subjects:", error);
      throw error;
   }
}


export const getSubjectByIdService = async (id) => {
   try {
      const response = await fetch(`${URL}/subjects/${id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting subject by id:", error);
      throw error;
   }
}


export const createSubjectService = async (subjectData) => {
   console.log(subjectData);

   try {
      const response = await fetch(`${URL}/subjects/create`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(subjectData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while creating subject:", error);
      throw error;
   }
}


export const updateSubjectService = async (id, updatedSubjectData) => {
   try {
      const response = await fetch(`${URL}/subjects/update/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedSubjectData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while updating subject:", error);
      throw error;
   }
}


export const deleteSubjectService = async (id) => {
   try {
      const response = await fetch(`${URL}/subjects/delete/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while deleting subject:", error);
      throw error;
   }
}
