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
                  if (data) {
                     set({ staff: data, loading: false });
                  } else {
                     set({ staff: [], loading: false });
                     toast.error("Failed to fetch data");
                  }
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            // Get staff by ID
            getStaffById: async (staffId) => {
               set({ loading: true, error: null });
               try {
                  const data = await getStaffByIdService(staffId);
                  set({ staffById: data, loading: false });
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  return error;
               }
            },

            // Add a new staff member
            addStaff: async (staffData) => {
               set({ loading: true, error: null });
               try {
                  const data = await createStaffService(staffData);
                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        staff: [...state.staff, data],
                        loading: false,
                     }))
                     await get().getAllStaff();
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

            // Update an existing staff member
            updateStaff: async (staffId, updatedStaffData) => {
               set({ loading: true, error: null });
               try {
                  const data = await updateStaffService(staffId, updatedStaffData);
                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        staff: state.staff.map((staff) =>
                           staff.id === staffId ? { ...staff, ...updatedStaffData } : staff
                        ),
                        loading: false,
                     }))
                     // Refresh the staff list
                     await get().getAllStaff();
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

            // Delete an existing staff member
            deleteStaff: async (staffId) => {
               set({ loading: true, error: null });
               try {
                  const data = await deleteStaffService(staffId);
                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        staff: state.staff.filter((staff) => staff.id !== staffId),
                        loading: false,
                     }));
                     // Refresh the staff list
                     await get().getAllStaff();
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
         { name: "staffs" }
      )
   )
);

export default useStaffStore;
