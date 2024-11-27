const URL = import.meta.env.VITE_API_URL;
// const URL = "http://localhost:8080";

export const getAllSubjectsService = async () => {
   const response = await fetch(`${URL}/course`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   return response.json();
}



export const createSubjectService = async (subjectData) => {
   const response = await fetch(`${URL}/course/create`, {
      method: "POST",
      body: subjectData,
      credentials: "include",
   });
   return response.json();
}


export const updateSubjectService = async (id, updatedSubjectData) => {
   try {
      const response = await fetch(`${URL}/subjects/${id}`, {
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
   const response = await fetch(`${URL}/course/delete/${id}`, {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   return response.json();

}
