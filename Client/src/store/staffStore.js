
import { getAllStaffService } from "@/services/staffServices";
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
                  const data = await addStaffService(staffData);
                  const currentStaff = get().staff;
                  set({
                     staff: [...currentStaff, data.payload],
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
                  const currentStaff = get().staff;
                  set({
                     staff: currentStaff.map((staff) =>
                        staff.id === staffId ? { ...staff, ...updatedStaffData } : staff
                     ),
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
                  const currentStaff = get().staff;
                  set({
                     staff: currentStaff.filter((staff) => staff.id !== staffId),
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
