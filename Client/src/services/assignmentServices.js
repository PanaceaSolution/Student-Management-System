const URL = import.meta.env.VITE_API_URL;

export const getAllAssignmentsService = async () => {
   const response = await fetch(`${URL}/assignments`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   return response.json();
};