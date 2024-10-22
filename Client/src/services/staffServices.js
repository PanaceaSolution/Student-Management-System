const URL = import.meta.env.VITE_API_URL;
// const URL = "http://localhost:8080";

export const getAllStaffService = async () => {
   try {
      const response = await fetch(`${URL}/staff`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting all staff:", error);
      throw error;
   }
}

export const getStaffByIdService = async (id) => {
   try {
      const response = await fetch(`${URL}/staff/${id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while getting staff by id:", error);
      throw error;
   }
}

export const createStaffService = async (staffData) => {
   console.log(staffData);

   try {
      const response = await fetch(`${URL}/staff/create`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(staffData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while creating staff:", error);
      throw error;
   }
}

export const updateStaffService = async (id, staffData) => {
   try {
      const response = await fetch(`${URL}/staff/update/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(staffData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while updating staff:", error);
      throw error;
   }
}

export const deleteStaffService = async (id) => {
   try {
      const response = await fetch(`${URL}/staff/delete/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error while deleting staff:", error);
      throw error;
   }
}