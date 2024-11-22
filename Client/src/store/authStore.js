import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { login as loginService, logout as logoutService, refreshService } from '@/services/authServices';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

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
                  const res = await loginService(userData);
                  if (res.success) {
                     // Set role based on username if role is 'STAFF'
                     const data = res.user;
                     const decodedData = jwtDecode(data.accessToken);

                     const finalRole = decodedData.role === 'STAFF'
                        ? getRoleFromUsername(decodedData.username || userData.username)
                        : decodedData.role;

                     set({
                        isAuthenticated: res.success,
                        loggedInUser: {
                           profile: data.profile,
                           role: finalRole,
                           id: decodedData.id,
                           username: decodedData.username
                        }
                     });
                     toast.success("Login successful");
                  } else {
                     toast.error(res.message);
                  }
                  return res;
               } catch (error) {
                  set({ isAuthenticated: false, loggedInUser: null });
                  toast.error(error.message);
               } finally {
                  set({ loading: false });
               }
            },

            logout: async () => {
               set({ loading: true });
               try {
                  const res = await logoutService();
                  if (res.success) {
                     set({
                        isAuthenticated: false,
                        loggedInUser: null,
                     });
                     localStorage.removeItem("auth");
                     toast.success("Logout successful");
                  }
                  return res;
               } catch (error) {
                  console.error("Error during logout:", error);
                  toast.error(error.message);
               } finally {
                  set({ loading: false });
               }
            },

            // Refresh token action
            refresh: async () => {
               try {
                  const res = await refreshService();
                  if (res.success) {
                     set({
                        isAuthenticated: true,
                     });
                     return res;
                  }
               } catch (error) {
                  console.error("Error during token refresh:", error);
                  set({
                     isAuthenticated: false,
                     loggedInUser: null,
                  });
               }
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
