import { createStaffService, deleteStaffService, getAllStaffService, getStaffByIdService, updateStaffService } from "@/services/staffServices";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useStaffStore = create(
   devtools(
      persist(
         (set, get) => ({
            loading: false,
            error: null,
            staff: [],
            staffById: {},

            // Get all staff
            getAllStaff: async () => {
               set({ loading: true, error: null });
               try {
                  const data = await getAllStaffService();
                  set({ staff: data, loading: false })
               } catch (error) {
                  set({ error: error.message, loading: false })
               }
            },

            // Get staff by ID
            getStaffById: async (staffId) => {
               set({ loading: true, error: null });
               try {
                  const data = await getStaffByIdService(staffId);
                  set({ staffById: data, loading: false });
               } catch (error) {
                  set({ error: error.message, loading: false });
               }
            },

            // Add a new staff member
            addStaff: async (staffData) => {
               set({ loading: true, error: null });
               try {
                  const data = await createStaffService(staffData);
                  set((state) => ({
                     staff: [...state.staff, data],
                     loading: false,
                  }))
               } catch (error) {
                  set({ error: error.message, loading: false });
                  toast.error(error.message || "Failed to add staff");
               }
            },

            // Update an existing staff member
            updateStaff: async (staffId, updatedStaffData) => {
               set({ loading: true, error: null });
               try {
                  const data = await updateStaffService(staffId, updatedStaffData);
                  set((state) => ({
                     staff: state.staff.map((staff) =>
                        staff.id === staffId ? { ...staff, ...updatedStaffData } : staff
                     ),
                     loading: false,
                  }))
               } catch (error) {
                  set({ error: error.message, loading: false });
                  toast.error(error.message || "Failed to update staff");
               }
            },

            // Delete an existing staff member
            deleteStaff: async (staffId) => {
               set({ loading: true, error: null });
               try {
                  const data = await deleteStaffService(staffId);
                  set({
                     staff: state.staff.filter((staff) => staff.id !== staffId),
                     loading: false,
                  })
               } catch (error) {
                  set({ error: error.message, loading: false });
                  toast.error(error.message || "Failed to delete staff");
               }
            },
         }),
         { name: "staffs" }
      )
   )
);

export default useStaffStore;
