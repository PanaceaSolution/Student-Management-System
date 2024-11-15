const URL = import.meta.env.VITE_API_URL;

export const login = async (userData) => {
   try {
      const response = await fetch(`${URL}/auth/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         credentials: 'include',
         body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Login error:", error);
      throw error;
   }
}