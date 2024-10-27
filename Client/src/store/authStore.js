import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { login as loginService } from '@/services/authServices'

const useAuthStore = create(
   devtools(
      persist((set) => ({
         loading: false,
         isAuthenticated: true,
         loggedInUser: {
            username: "Aayush",
            role: "STUDENT",
         },

         // Login action
         login: async (userData) => {
            set({ loading: true });
            try {
               const data = await loginService(userData);
               set({ isAuthenticated: data.success, loggedInUser: data.payload });
               return data;
            } catch (error) {
               set({ isAuthenticated: false, loggedInUser: null });
            } finally {
               set({ loading: false });
            }
         },

         logout: () => {
            set({ loggedInUser: null, isAuthenticated: false });
            localStorage.removeItem('auth');
         },
      }),
         {
            name: 'auth',
            partialize: (state) => ({
               loggedInUser: state.loggedInUser,
               isAuthenticated: state.isAuthenticated,
            }),
         }
      ))
);

export default useAuthStore;
