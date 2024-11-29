import { createParentService, updateParentService } from "@/services/parentsServices";
import { deleteUserService, getAllUserService } from "@/services/userService";
import { flattenData, flattenNestedData } from "@/utilities/utilities";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useParentStore = create(
   devtools(
      persist(
         (set, get) => ({
            isLoading: false,
            isSubmitting: false,
            isDeleting: false,
            error: null,
            parents: [],
            totalUsers: 0,
            pages: 0,

            // Get all parents
            getAllParents: async (role) => {
               set({ isLoading: true, error: null });
               try {
                  const res = await getAllUserService(role);
                  if (res.success) {
                     set({
                        parents: flattenData(res.data),
                        isLoading: false
                     });
                  } else {
                     toast.error("Failed to get parents");
                     set({ parents: [], isLoading: false });
                  }
               } catch (error) {
                  set({ error: error.message, isLoading: false });
                  return error;
               }
            },

            addParent: async (parentData) => {
               set({ isSubmitting: true, error: null });
               try {
                  const res = await createParentService(parentData);
                  console.log("Response:", res);
                  if (res.success) {
                     toast.success(data.message);
                     set((state) => ({
                        parents: [...state.parents, data],
                        isSubmitting: false,
                     }));
                  } else {
                     toast.error("Failed to add");
                     set({ isSubmitting: false });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  return error;
               }
            },

            updateParent: async (parentId, updatedParentData) => {
               set({ isSubmitting: true, error: null });
               try {
                  const data = await updateParentService(parentId, updatedParentData);
                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        parents: state.parents.map((parent) =>
                           parent.id === parentId ? { ...parent, ...updatedParentData } : parent
                        ),
                        isSubmitting: false,
                     }));
                     await get().getAllParents();
                  } else {
                     toast.error("Failed to update");
                     set({ isSubmitting: false });
                  }
                  return data;
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  return error;
               }
            },

            deleteParent: async (parentId) => {
               set({ isDeleting: true, error: null });
               try {
                  const res = await deleteUserService(parentId);
                  if (res.success) {
                     set((state) => ({
                        parents: state.parents.filter((parent) => parent.user_id !== parentId),
                        isDeleting: false,
                     }));
                     toast.success('User deleted successfully');
                  } else {
                     toast.error("Failed to delete");
                     set({ isDeleting: false });
                  }
               } catch (error) {
                  set({ error: error.message, isDeleting: false });
                  return error;
               }
            },
         }),
         {
            name: "parents",
         }
      )
   )
)

export default useParentStore