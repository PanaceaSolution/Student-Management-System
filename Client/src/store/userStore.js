import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { deleteUserService, getAllUserService } from "@/services/userService";


const useUserStore = create(
   devtools(
      persist(
         (set) => ({
            loading: false,
            error: null,
            allUsers: [],
            totalUsers: 0,
            pages: 0,

            getAllUser: async (role) => {
               set({ loading: true, error: null });
               try {
                  const data = await getAllUserService(role);
                  if (data.status === 200) {
                     set({
                        allUsers: data.data,
                        totalUsers: data.total,
                        pages: data.totalPages,
                        loading: false
                     })
                  } else {
                     set({ loading: false })
                  }
               } catch (error) {
                  set({ error: error.message, loading: false })
               }
            },

            deleteUser: async (id) => {
               set({ loading: true, error: null });
               try {
                  const data = await deleteUserService(id);
                  if (data.status === 200) {
                     set((state) => ({
                        allUsers: state.allUsers.filter((user) => user.id !== id),
                        loading: false
                     }));
                     toast.success('User deleted successfully')
                  } else {
                     toast.error('Failed to delete user')
                     set({ loading: false })
                  }
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return false;
               }
            },
         }),
         {
            name: "users"
         }
      )
   )
)

export default useUserStore;