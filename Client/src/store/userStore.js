import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { deleteUserService, getAllUserService, getStatsService, getUserByIdService } from "@/services/userService";
import { flattenNestedData } from "@/utilities/utilities";


const useUserStore = create(
   devtools(
      persist(
         (set) => ({
            isLoading: false,
            isDeleting: false,
            error: null,
            allUsers: [],
            userById: {},
            stats: [],
            totalUsers: 0,
            pages: 0,

            getAllUser: async (role) => {
               set({ isLoading: true, error: null });
               try {
                  const res = await getAllUserService(role);
                  if (res.success) {
                     set({
                        allUsers: res.data,
                        totalUsers: res.total,
                        pages: res.totalPages,
                        isLoading: false
                     })
                  } else {
                     set({ isLoading: false })
                  }
               } catch (error) {
                  set({ error: error.message, isLoading: false })
               }
            },

            getUserById: async (id) => {
               set({ isLoading: true, error: null });
               try {
                  const res = await getUserByIdService(id);
                  if (res.success) {
                     set({
                        userById: flattenNestedData(res.user),
                        isLoading: false
                     })
                  } else {
                     set({ isLoading: false })
                  }
               } catch (error) {
                  set({ error: error.message, isLoading: false })
               }
            },

            getStats: async () => {
               set({ isLoading: true, error: null });
               try {
                  const res = await getStatsService();
                  if (res.success) {
                     set({
                        stats: res.data,
                        isLoading: false
                     })
                  } else {
                     set({ isLoading: false })
                  }
               } catch (error) {
                  set({ error: error.message, isLoading: false })
               }
            },

            deleteUser: async (id) => {
               set({ isDeleting: true, error: null });
               try {
                  const res = await deleteUserService(id);
                  if (res.success) {
                     set((state) => ({
                        allUsers: state.allUsers.filter((user) => user.user_Id !== id),
                        isDeleting: false
                     }));
                     toast.success('User deleted successfully')
                  } else {
                     toast.error('Failed to delete user')
                     set({ isDeleting: false })
                  }
               } catch (error) {
                  set({ error: error.message, isDeleting: false });
                  return false;
               }
            },
         }),
         {
            name: "users",
            partialize: (state) => ({
               allUsers: state.allUsers,
               userById: state.userById,
               pages: state.pages,
               totalUsers: state.totalUsers,
               stats: state.stats
            })
         }
      )
   )
)

export default useUserStore;