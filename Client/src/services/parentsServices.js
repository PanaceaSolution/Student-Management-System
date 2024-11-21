// const URL = import.meta.env.VITE_API_URL;
const URL = "http://localhost:8080";

export const createParentService = async (parentData) => {
   const response = await fetch(`${URL}/parent/create`, {
      method: "POST",
      credentials: "include",
      body: parentData,
   });
   return response.json();
}


export const updateParentService = async (parentId, updatedParentData) => {
   try {
      const response = await fetch(`${URL}/parents/${parentId}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedParentData),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while updating parent:", error);
      throw error;
   }
}