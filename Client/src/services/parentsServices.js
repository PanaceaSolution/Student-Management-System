// const URL = import.meta.env.VITE_API_URL;
const URL = "http://localhost:8080";

export const getAllParentsService = async () => {
   try {
      const response = await fetch(`${URL}/parents`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting all parents:", error);
      throw error;
   }
}

export const getParentsByIdService = async (parentId) => {
   try {
      const response = await fetch(`${URL}/parents/${parentId}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting parent by id:", error);
      throw error;
   }
}

export const createParentService = async (parentData) => {
   try {
      const response = await fetch(`${URL}/parents`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(parentData),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while creating parent:", error);
      throw error;
   }
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


export const deleteParentService = async (parentId) => {
   try {
      const response = await fetch(`${URL}/parents/${parentId}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
      });
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while deleting parent:", error);
      throw error;
   }
}