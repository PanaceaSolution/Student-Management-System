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
            totalUsers: 0,
            pages: 0,

            // Get all staff
            getStaff: async (role) => {
               set({ isloading: true, error: null });
               try {
                  const res = await getAllUserService(role);
                  if (res.status === 200) {
                     set({
                        // staff: res.data.filter(staff => staff.staffRole !== "TEACHER"),
                        // teacher: res.data.filter(teacher => teacher.staffRole === "TEACHER"),
                        staff: flattenData(res.data),
                        totalUsers: res.total,
                        pages: res.totalPages,
                     })
                     set({ isloading: false });
                  }
               } catch (error) {
                  set({ error: error.message, isloading: false });
               }
            },

            // Add a new staff member
            addStaff: async (staffData) => {
               set({ isSubmitting: true, error: null });
               try {
                  const res = await createStaffService(staffData);
                  if (res.status === 201) {
                     const formattedStaff = flattenNestedData(formattedData(res));
                     set((state) => ({
                        staff: [formattedStaff, ...state.staff],
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
                     const formattedStaff = flattenData(res);
                     set((state) => ({
                        staff: state.staff.map((staff) =>
                           staff.staffId === staffId ? { ...staff, ...formattedStaff } : staff
                        ),
                        isSubmitting: false,
                     }));
                     toast.success(res.message);
                  } else {
                     toast.error(res.message);
                     set({ isSubmitting: false });
                  }
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  toast.error(error.message || "Failed to update staff");
               }
            },

            // Delete an existing staff member
            deleteStaff: async (id) => {
               set({ isDeleting: true, error: null });
               try {
                  const res = await deleteUserService(id);
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
         { name: "staffs" }
      )
   )
);

const formattedData = (res) => {
   return {
      user: {
         id: res.staff.user.userId,
         email: res.staff.user.email,
         username: res.staff.user.username,
         role: res.staff.user.role,
         isActivated: res.staff.user.isActivated,
         createdAt: res.staff.user.createdAt,
         profile: {
            fname: res.user.user.profile.fname,
            lname: res.user.user.profile.lname,
            gender: res.user.user.profile.gender,
            dob: res.user.user.profile.dob,
            profilePicture: res.user.user.profile.profilePicture,
         },
         contact: {
            phoneNumber: res.user.user.contact.phoneNumber,
            alternatePhoneNumber: res.user.user.contact.alternatePhoneNumber,
            telephoneNumber: res.user.user.contact.telephoneNumber,
         },
         address: res.user.user.address.map((address) => ({
            addressType: address.addressType,
            wardNumber: address.wardNumber,
            municipality: address.municipality,
            district: address.district,
            province: address.province,
         })),
         documents: res.user.user.documents.map((doc) => ({
            documentName: doc.documentName,
            documentFile: doc.documentFile,
         })),
      },
      staffId: res.staff.staffId,
      hireDate: res.staff.hireDate,
      salary: res.staff.salary,
      staffRole: res.staff.staffRole,
   };
}

export default useStaffStore;
