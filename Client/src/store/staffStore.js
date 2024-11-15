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
               try {
                  const res = await getAllUserService(role);
                  if (res.status === 200) {
                     set({
                        // staff: res.data.filter(staff => staff.staffRole !== "TEACHER"),
                        // teacher: res.data.filter(teacher => teacher.staffRole === "TEACHER"),
                        staff: res.data,
                        totalUsers: res.total,
                        pages: res.totalPages,
                     })
                  }
               } catch (error) {
                  set({ error: error.message })
               }
            },

            // Add a new staff member
            addStaff: async (staffData) => {
               set({ loading: true, error: null });
               try {
                  const res = await createStaffService(staffData);
                  if (res.status === 201) {
                     const formattedStaff = {
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
                     console.log(formattedStaff);


                     // Add the formatted staff to the state
                     set((state) => ({
                        staff: [...state.staff, formattedStaff],
                        loading: false,
                     }));

                     toast.success(res.message);
                  } else {
                     toast.error(res.message);
                     set({ loading: false });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, loading: false });
                  toast.error(error.message);
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
