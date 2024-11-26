import { createClassService, deleteClassService, getAllClassesService, updateClassService } from "@/services/classServices";
import { flattenData, flattenNestedData } from "@/utilities/utilities";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";


const useClassStore = create(
   devtools(
      persist(
         (set) => ({
            isSubmitting: false,
            isDeleting: false,
            isLoading: false,
            error: null,
            classes: [],

            // Get all classes
            getAllClasses: async () => {
               set({ isLoading: true, error: null });
               try {
                  const res = await getAllClassesService();
                  if (res.success) {
                     set({
                        classes: flattenData(res.data),
                        totalClasses: res.total,
                        pages: res.totalPages,
                        isLoading: false,
                     });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isLoading: false });
                  toast.error(error.message || "Failed to fetch class data");
               }
            },

            // Add a new class
            addClass: async (classData) => {
               set({ isSubmitting: true, error: null });
               try {
                  const res = await createClassService(classData);
                  if (res.success) {
                     toast.success(res.message);
                     set((state) => ({
                        classes: [flattenNestedData(res.data), ...state.classes],
                        isSubmitting: false,
                     }));
                  } else {
                     toast.error(res.message);
                     set({ isSubmitting: false });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  toast.error(error.message || "An unexpected error occurred");
                  return error;
               }
            },

            // Update an existing class
            updateClass: async (classId, updatedClassData) => {
               set({ isSubmitting: true, error: null });
               try {
                  const res = await updateClassService(classId, updatedClassData);
                  if (res.success) {
                     const formattedStaff = flattenNestedData(res.data);
                     toast.success(res.message);
                     set((state) => ({
                        classes: state.classes.map((classItem) =>
                           classItem.id === classId ? { ...classItem, ...formattedStaff } : classItem
                        ),
                        isSubmitting: false,
                     }));
                  } else {
                     toast.error(res.message);
                     set({ isSubmitting: false });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  toast.error(error.message || "Failed to update class");
                  return error;
               }
            },

            // Delete an existing class
            deleteClass: async (classId) => {
               set({ isDeleting: true, error: null });
               try {
                  const res = await deleteClassService(classId);
                  if (res.success) {
                     toast.success(res.message);
                     set((state) => ({
                        classes: state.classes.filter((classItem) => classItem.id !== classId),
                        isDeleting: false,
                     }));
                  } else {
                     toast.error(res.message);
                     set({ isDeleting: false });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isDeleting: false });
                  return error;
               }
            },
         }),
         {
            name: 'classes',
            partialize: (state) => ({ classes: state.classes }),
         }
      )
   )
)

export default useClassStore;