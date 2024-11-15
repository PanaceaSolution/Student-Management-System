import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { login as loginService } from '@/services/authServices';

// Utility function to determine role based on username
const getRoleFromUsername = (username) => {
   if (username.includes('TR')) return 'TEACHER';
   if (username.includes('AC')) return 'ACCOUNTANT';
   if (username.includes('LB')) return 'LIBRARIAN';
   return 'UNKNOWN';
};

const useAuthStore = create(
   devtools(
      persist(
         (set) => ({
            loading: false,
            isAuthenticated: false,
            loggedInUser: null,

            // Login action
            login: async (userData) => {
               set({ loading: true });
               try {
                  const data = await loginService(userData);

                  // Set role based on username if role is 'STAFF'
                  const { username, role } = data.payload;
                  const finalRole = role === 'STAFF' ? getRoleFromUsername(username) : role;

                  set({
                     isAuthenticated: data.success,
                     loggedInUser: { ...data.payload, role: finalRole }
                  });
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
      )
   )
);

export default useAuthStore;
