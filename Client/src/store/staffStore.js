
import { createStaffService, deleteStaffService, getAllStaffService, updateStaffService } from "@/services/staffServices";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useStaffStore = create(
   devtools(
      persist(
         (set, get) => ({
            loading: false,
            error: null,
            staff: [],

            // Get all staff
            getAllStaff: async () => {
               set({ loading: true, error: null });
               try {
                  const data = await getAllStaffService();
                  set({ staff: data.payload || data, loading: false });
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            // Add a new staff member
            addStaff: async (staffData) => {
               set({ loading: true, error: null, });
               try {
                  const data = await createStaffService(staffData);
                  set({
                     staff: [...state.staff, data.payload],
                     loading: false,
                  });
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            // Update an existing staff member
            updateStaff: async (staffId, updatedStaffData) => {
               set({ loading: true, error: null });
               try {
                  const data = await updateStaffService(staffId, updatedStaffData);
                  set({
                     staff: state.staff.map((staff) => (staff.id === staffId ? data.payload : staff)),
                     loading: false,
                  });
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
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
                  });
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },
         })
      )
   )
);

export default useStaffStore;
