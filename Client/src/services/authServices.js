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

      if (response.status !== 200) {
         throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Registration error:", error);
      throw error;
   }
}