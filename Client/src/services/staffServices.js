// const URL = import.meta.env.VITE_API_URL;
const URL = "http://localhost:8080";

export const getAllStaffService = async () => {
   try {
      const response = await fetch(`${URL}/staff`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });

      if (!response.ok) {
         throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting all staff:", error);
      throw error;
   }
}