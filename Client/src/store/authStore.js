import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { login as loginService } from '@/services/authServices'

const useAuthStore = create(
   devtools(
      persist((set) => ({
         loading: false,
         success: false,
         loggedInUser: null,

         // Login action
         login: async (userData) => {
            set({ loading: true });
            try {
               const data = await loginService(userData);
               set({ success: data.success, loggedInUser: data.payload });
               return data;
            } catch (error) {
               set({ success: false, loggedInUser: null });
            } finally {
               set({ loading: false });
            }
         },

         logout: () => {
            set({ loggedInUser: null, success: false });
            localStorage.removeItem('auth');
         },
      }),
         {
            name: 'auth',
            getStorage: () => localStorage,
            partialize: (state) => ({
               loggedInUser: state.loggedInUser,
               success: state.success,
            }),
         }
      ))
);

export default useAuthStore;
