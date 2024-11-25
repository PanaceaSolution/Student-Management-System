import {
  createStudentService,
  updateStudentService,
} from "@/services/studentService";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { getAllUserService, deleteUserService } from "@/services/userService";
import { flattenData } from "@/utilities/utilities";

const useStudentStore = create(
  devtools(
    persist(
      (set, get) => ({
        loading: false,
        error: null,
        students: [],
        studentById: {},
        deleteLoading: false,
        total: 0,
        totalPages: 0,

        // Get all students
        getAllStudents: async (role) => {
          set({ loading: true, error: null });
          try {
            const data = await getAllUserService(role);
            if (data && data.data) {
              set({
                students: flattenData(data.data),
                total: data.total,
                totalPages: data.totalPages,
                loading: false,
              });
            } else {
              set({ students: [], loading: false });
              toast.error("Failed to fetch data");
            }
            return data;
          } catch (error) {
            set({ error: error?.message || "An error occurred", loading: false });
            toast.error(error?.message || "An error occurred");
            return error;
          }
        },

        // Add a new student
        addStudent: async (studentData) => {
          set({ loading: true, error: null });
          try {
            const data = await createStudentService(studentData);
            if (data) {
              set((state) => ({
                students: [...state.students, data.data],
                loading: false,
              }));
              toast.success(data?.message || "Student added successfully");
            } else {
              set({ loading: false });
              toast.error("Failed to add student");
            }
            return data;
          } catch (error) {
            const errorMessage = error?.message || "An error occurred while adding the student";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            return error;
          }
        },

        // Update an existing student
        updateStudent: async (studentId, formData) => {
          set({ loading: true, error: null });
          try {
            const data = await updateStudentService(studentId, formData);
            if (data) {
              toast.success(data.message);
              set((state) => ({
                students: state.students.map((student) =>
                  student.id === studentId
                    ? { ...student, ...updatedStudentData }
                    : student
                ),
                loading: false,
              }));
              await get().getAllStudents();
            } else {
              toast.error("Failed to update student");
              set({ loading: false });
            }
            return data;
          } catch (error) {
            set({ error: error?.message || "An error occurred", loading: false });
            return error;
          }
        },

        // Delete an existing student
        deleteStudent: async (studentId) => {
          set({ deleteLoading: true, error: null });
          try {
            const data = await deleteUserService(studentId);
            if (data) {
              toast.success(data.message || "Student deleted successfully");
              set((state) => ({
                students: state.students.filter(
                  (student) => student?.user?.id !== studentId
                ),
                deleteLoading: false,
              }));
            } else {
              toast.error("Failed to delete student");
              set({ deleteLoading: false });
            }
            return data;
          } catch (error) {
            set({ error: error?.message || "An error occurred", deleteLoading: false });
            return error;
          }
        },
      }),
      { name: "students" }
    )
  )
);

export default useStudentStore;
