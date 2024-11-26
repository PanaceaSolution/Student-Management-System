const URL = import.meta.env.VITE_API_URL;

export const getAllClassesService = async () => {
   const response = await fetch(`${URL}/class`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   return response.json();
};

export const createClassService = async (classData) => {
   const response = await fetch(`${URL}/class/create`, {
      method: "POST",
      credentials: "include",
      body: classData,
   });
   return response.json();
};

export const updateClassService = async (id, updatedClassData) => {
   const response = await fetch(`${URL}/class/update/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: updatedClassData,
   });
   return response.json();
};

export const deleteClassService = async (id) => {
   const response = await fetch(`${URL}/class/${id}`, {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   return response.json();
};