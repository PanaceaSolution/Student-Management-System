import { createParentService, deleteParentService, getAllParentsService, getParentsByIdService, updateParentService } from "@/services/parentsServices";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useParentStore = create(
   devtools(
      persist(
         (set, get) => ({
            loading: false,
            error: null,
            parents: [],
            parentById: {},

            // Get all parents
            getAllParents: async () => {
               set({ loading: true, error: null });
               try {
                  const data = await getAllParentsService();
                  set({ parents: data, loading: false });
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            getParentsById: async (parentId) => {
               set({ loading: true, error: null });
               try {
                  const data = await getParentsByIdService(parentId);
                  set({ parentById: data, loading: false });
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            addParent: async (parentData) => {
               set({ loading: true, error: null });
               try {
                  const data = await createParentService(parentData);
                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        parents: [...state.parents, data],
                        loading: false,
                     }));
                     await get().getAllParents();
                  } else {
                     toast.error("Failed to add");
                     set({ loading: false });
                  }
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            updateParent: async (parentId, updatedParentData) => {
               set({ loading: true, error: null });
               try {
                  const data = await updateParentService(parentId, updatedParentData);
                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        parents: state.parents.map((parent) =>
                           parent.id === parentId ? { ...parent, ...updatedParentData } : parent
                        ),
                        loading: false,
                     }));
                     await get().getAllParents();
                  } else {
                     toast.error("Failed to update");
                     set({ loading: false });
                  }
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            deleteParent: async (parentId) => {
               set({ loading: true, error: null });
               try {
                  const data = await deleteParentService(parentId);
                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        parents: state.parents.filter((parent) => parent.id !== parentId),
                        loading: false,
                     }));
                     await get().getAllParents();
                  } else {
                     toast.error("Failed to delete");
                     set({ loading: false });
                  }
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
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