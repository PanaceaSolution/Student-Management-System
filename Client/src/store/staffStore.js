import { createStaffService, updateStaffService } from "@/services/staffServices";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { deleteUserService, getAllUserService } from "@/services/userService";

const useStaffStore = create(
   devtools(
      persist(
         (set) => ({
            loading: false,
            error: null,
            staff: [],
            teacher: [],
            totalUsers: 0,
            pages: 0,

            // Get all staff
            getStaff: async (role) => {
               set({ loading: true, error: null });
               try {
                  const res = await getAllUserService(role);
                  if (res.status === 200) {
                     set({
                        staff: res.data.filter(staff => staff.staffRole !== "TEACHER"),
                        teacher: res.data.filter(teacher => teacher.staffRole === "TEACHER"),
                        totalUsers: res.total,
                        pages: res.totalPages,
                        loading: false
                     })
                  } else {
                     set({ loading: false })
                  }
               } catch (error) {
                  set({ error: error.message, loading: false })
               }
            },

            // Add a new staff member
            addStaff: async (staffData) => {
               set({ loading: true, error: null });
               try {
                  const data = await createStaffService(staffData);
                  if (data.status === 201) {
                     set((state) => ({
                        staff: [...state.staff, data.staff],
                        loading: false,
                     }));
                     toast.success(data.message);
                  } else {
                     toast.error(data.message);
                     set({ loading: false });
                  }
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  toast.error("Failed to add staff");
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
                  }));
               } catch (error) {
                  set({ error: error.message, loading: false });
                  toast.error(error.message || "Failed to update staff");
               }
            },

            // Delete an existing staff member
            deleteStaff: async (id) => {
               set({ loading: true, error: null });
               try {
                  const data = await deleteUserService(id);
                  if (data.status === 200) {
                     set((state) => ({
                        staff: state.staff.filter((user) => user.user.id !== id),
                        loading: false
                     }));
                     toast.success('User deleted successfully');
                  } else {
                     toast.error('Failed to delete user');
                     set({ loading: false });
                  }
                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  toast.error("Failed to delete user");
               }
            },
         }),
         { name: "staffs" }
      )
   )
);

export default useStaffStore;
