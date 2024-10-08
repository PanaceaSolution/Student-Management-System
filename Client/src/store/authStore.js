import { login } from '@/services/authServices';
import { create } from 'zustand';

const useAuthStore = create((set) => {
   const storedUser = localStorage.getItem('user');
   return {
      loading: false,
      error: null,
      success: false,
      loggedInUser: storedUser ? JSON.parse(storedUser) : null,
      login: async (userData) => {
         set({ loading: true, error: null, success: false });
         try {
            const res = await login(userData);
            set({ success: true, loggedInUser: res.payload });
            localStorage.setItem('user', JSON.stringify(res.payload));
            return res;
         } catch (error) {
            set({ error: error.message });
         } finally {
            set({ loading: false });
         }
      },
      logout: () => {
         set({ loggedInUser: null, success: false });
         localStorage.removeItem('user');
      }
   };
});

export default useAuthStore;
