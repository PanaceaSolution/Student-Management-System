const URL = import.meta.env.VITE_API_URL;
// const URL = "http://localhost:8080";

export const getAllStaffService = async () => {
   const response = await fetch(`${URL}/auth/search?search=STAFF&searchBy=role`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   if (!response.ok) throw new Error("Failed to fetch staff data");
   return await response.json();
}

export const getStaffByIdService = async (id) => {
   const response = await fetch(`${URL}/staff/${id}`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });
   if (!response.ok) throw new Error("Failed to fetch staff data");
   return await response.json();
}


export const createStaffService = async (staffData) => {
   const response = await fetch(`${URL}/staff/create`, {
      method: "POST",
      credentials: "include",
      body: staffData,
   });
   if (!response.ok) throw new Error("Failed to create staff");
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

export const deleteStaffService = async (id) => {
   const response = await fetch(`${URL}/staff/${id}`, {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json",
      },
   });
   if (!response.ok) throw new Error("Failed to delete staff");
   return await response.json();
}