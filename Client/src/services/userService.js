const URL = import.meta.env.VITE_API_URL;

export const getAllUserService = async (role) => {
   const response = await fetch(`${URL}/auth/users/role?role=${role}&page=1&limit=10`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   return await response.json();
}

export const getStatsService = async () => {
   const response = await fetch(`${URL}/auth/user-statistics`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
   });
   return await response.json();
}

export const deleteUserService = async (id) => {
   const response = await fetch(`${URL}/auth/delete`, {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds: id }),
   });
   if (!response.ok) throw new Error("Failed to delete user");
   return await response.json();
};