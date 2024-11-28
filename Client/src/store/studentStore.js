import {
  createStudentService,
  updateStudentService,
  getStudentsByClassAndSectionService,
} from "@/services/studentService";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { getAllUserService, deleteUserService } from "@/services/userService";
import { flattenData } from "@/utilities/utilities";

const useStudentStore = create(
  devtools(
    persist(
      (set) => ({
        loading: false,
        isSubmitting: false,
        isDeleting: false,
        error: null,
        students: [],
        studentById: {},
        studentByClassAndSection: [],
        total: 0,
        totalPages: 0,

        // Get all students
        getAllStudents: async (role) => {
          set({ loading: true, error: null });
          try {
            const res = await getAllUserService(role);
            if (res.success) {
              set({
                students: flattenData(res.data),
                total: res.total,
                totalPages: res.totalPages,
                loading: false,
              });
            }
          } catch (error) {
            set({
              error: error?.message || "An error occurred",
              loading: false,
            });
            toast.error(error?.message || "An error occurred");
            return error;
          }
        },

        // Get student by ID
        getStudentById: async (studentId) => {
          set({ loading: true, error: null });
          try {
            const data = await getStudentByIdService(studentId);
            set({ studentById: data, loading: false });
            return data;
          } catch (error) {
            set({
              error: error?.message || "An error occurred",
              loading: false,
            });
            toast.error(error?.message || "An error occurred");
            return error;
          }
        },

        getStudentsByClassAndSection: async (
          className,
          section,

        ) => {
          set({ loading: true, error: null });
          try {
            const data = await getStudentsByClassAndSectionService(
              className,
              section,

            );
            set({
              studentByClassAndSection: data.students,
              total: data.total,
              loading: false,
            });
            return data;
          } catch (error) {
            set({
              error: error?.message || "An error occurred",
              loading: false,
            });
            toast.error(error?.message || "An error occurred");
            return error;
          }
        },

        // Add a new student
        addStudent: async (studentData) => {
          set({ isSubmitting: true, error: null });
          try {
            const res = await createStudentService(studentData);
            if (res.success) {
              set((state) => ({
                students: [...state.students, res.data],
                isSubmitting: false,
              }));
              toast.success(res?.message || "Student added successfully");
            } else {
              set({ isSubmitting: false });
              toast.error("Failed to add student");
            }
            return res;
          } catch (error) {
            const errorMessage =
              error?.message || "An error occurred while adding the student";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            return error;
          }
        },

        // Update an existing student
        updateStudent: async (studentId, formData) => {
          set({ isSubmitting: true, error: null });
          try {
            const res = await updateStudentService(studentId, formData);
            if (res.success) {
              toast.success(res.message);
              set((state) => ({
                students: state.students.map((student) =>
                  student.id === studentId
                    ? { ...student, ...updatedStudentData }
                    : student
                ),
                isSubmitting: false,
              }));
            } else {
              toast.error("Failed to update student");
              set({ isSubmitting: false });
            }
            return res;
          } catch (error) {
            set({
              error: error?.message || "An error occurred",
              loading: false,
            });
            return error;
          }
        },

        // Delete an existing student
        deleteStudent: async (studentId) => {
          set({ isDeleting: true, error: null });
          try {
            const res = await deleteUserService(studentId);
            if (res.success) {
              toast.success("Student deleted successfully");
              set((state) => ({
                students: state.students.filter(
                  (student) => student?.user_id !== studentId
                ),
                isDeleting: false,
              }));
            } else {
              toast.error("Failed to delete student");
              set({ isDeleting: false });
            }
            return res;
          } catch (error) {
            set({
              error: error?.message || "An error occurred",
              isDeleting: false,
            });
            return error;
          }
        },
      }),
      {
        name: "students",
        partialize: (state) => ({
          students: state.students,
          studentByClassAndSection: state.studentByClassAndSection,
          total: state.total,
          totalPages: state.totalPages
        })

      }
    )
  )
);

export default useStudentStore;
