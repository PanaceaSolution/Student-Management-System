import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { deleteUserService, getAllUserService } from "@/services/userService";


const useUserStore = create(
   devtools(
      persist(
         (set) => ({
            isLoading: false,
            isDeleting: false,
            error: null,
            allUsers: [],
            totalUsers: 0,
            pages: 0,

            getAllUser: async (role) => {
               set({ isLoading: true, error: null });
               try {
                  const data = await getAllUserService(role);
                  if (data.status === 200) {
                     set({
                        allUsers: data.data,
                        totalUsers: data.total,
                        pages: data.totalPages,
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
                  const data = await deleteUserService(id);
                  if (data.status === 200) {
                     set((state) => ({
                        allUsers: state.allUsers.filter((user) => user.id !== id),
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
               pages: state.pages,
               totalUsers: state.totalUsers
            })
         }
      )
   )
)

export default useUserStore;