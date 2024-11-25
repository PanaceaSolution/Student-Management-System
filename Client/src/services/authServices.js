const URL = import.meta.env.VITE_API_URL;

export const login = async (userData) => {
   const response = await fetch(`${URL}/auth/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
   });
   return response.json();
}

export const logout = async () => {
   const response = await fetch(`${URL}/auth/logout`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      credentials: 'include',
   });
   return response.json();
}

export const refreshService = async () => {
   const response = await fetch(`${URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      credentials: 'include',
   });
   return response.json();
}