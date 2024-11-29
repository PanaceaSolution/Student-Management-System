import { createStaffService, updateStaffService } from "@/services/staffServices";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { deleteUserService, getAllUserService } from "@/services/userService";
import { flattenData, flattenNestedData } from "@/utilities/utilities";


const useStaffStore = create(
   devtools(
      persist(
         (set) => ({
            isloading: false,
            isDeleting: false,
            isSubmitting: false,
            error: null,
            staff: [],
            teacher: [],
            total: 0,
            totalPages: 0,

            // Get all staff
            getStaff: async (role) => {
               set({ isloading: true, error: null });
               try {
                  const res = await getAllUserService(role);
                  if (res.success) {
                     set({
                        staff: flattenData(res.data),
                        total: res.total,
                        totalPages: res.totalPages,
                        isloading: false,
                     });
                  }
               } catch (error) {
                  set({ error: error.message, isloading: false });
                  toast.error(error.message || "Failed to fetch staff data");
               }
            },

            // getTeacher: async (query) => {
            //    set({ isloading: true, error: null });
            //    try {
            //       const res = await getAllUserService(query);
            //       if (res.success) {
            //          set({
            //             teacher: flattenData(res.data),
            //             totalUsers: res.total,
            //             pages: res.totalPages,
            //             isloading: false,
            //          });
            //       }
            //    } catch (error) {
            //       set({ error: error.message, isloading: false });
            //       toast.error(error.message || "Failed to fetch staff data");
            //    }
            // },

            // Add a new staff member
            addStaff: async (staffData) => {
               set({ isSubmitting: true, error: null });
               try {
                  const res = await createStaffService(staffData);
                  console.log("Response:", res);

                  if (res.success) {
                     const formattedStaff = flattenNestedData(addedStaff(res));
                     set((state) => ({
                        staff: [...state.staff, formattedStaff],
                        isSubmitting: false,
                     }));
                     toast.success(res.message);
                  } else {
                     toast.error(res.message);
                     set({ isSubmitting: false });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  toast.error(error.message);
               }
            },


            // Update an existing staff member
            updateStaff: async (staffId, updatedStaffData) => {
               set({ isSubmitting: true, error: null });
               try {
                  const res = await updateStaffService(staffId, updatedStaffData);
                  if (res.success) {
                     const formattedStaff = flattenNestedData(updatedStaffFormattedData(res));
                     console.log("Formatted Staff:", formattedStaff);

                     set((state) => ({
                        staff: state.staff.map((staff) =>
                           staff.user_staffId === staffId ? { ...staff, formattedStaff } : staff
                        ),
                        isSubmitting: false,
                     }));
                     toast.success(res.message);
                  } else {
                     toast.error(res.message);
                     set({ isSubmitting: false });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  toast.error(error.message || "Failed to update staff");
               }
            },

            // Delete an existing staff member
            deleteStaff: async (id) => {
               set({ isDeleting: true, error: null });
               try {
                  const res = await deleteUserService([id]);
                  if (res.success) {
                     set((state) => ({
                        staff: state.staff.filter((user) => user.user_id !== id),
                        isDeleting: false
                     }));
                     toast.success('User deleted successfully');
                  } else {
                     toast.error('Failed to delete user');
                     set({ isDeleting: false });
                  }
               } catch (error) {
                  set({ error: error.message, isDeleting: false });
                  toast.error("Failed to delete user");
               }
            },
         }),
         {
            name: "staffs",
            partialize: (state) => ({
               staff: state.staff,
               totalPages: state.totalPages,
               total: state.total
            }),
         }
      )
   )
);

const addedStaff = (res) => {
   return {
      user: {
         ...res.staff.user,
         staffId: res.staff.staffId,
         hireDate: res.staff.hireDate,
         salary: res.staff.salary,
         staffRole: res.staff.staffRole,
      },

   };
}
const updatedStaffFormattedData = (res) => {
   return {
      user: {
         ...res.updateUser.user,
         staffId: res.updatedStaff.staffId,
         hireDate: res.updatedStaff.hireDate,
         salary: res.updatedStaff.salary,
         staffRole: res.updatedStaff.staffRole,
      },
   };
}

export default useStaffStore;
