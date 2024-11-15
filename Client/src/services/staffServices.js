const URL = import.meta.env.VITE_API_URL;
// const URL = "http://localhost:8080";


export const createStaffService = async (staffData) => {
   const response = await fetch(`${URL}/staff/create`, {
      method: "POST",
      credentials: "include",
      body: staffData,
   });
   return await response.json();
}

export const updateStaffService = async (id, staffData) => {
   const response = await fetch(`${URL}/staff/${id}`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
   });
   if (!response.ok) throw new Error("Failed to update staff");
   return await response.json();
}