import { createStudentService, deleteStudentService, getAllStudentsService, getStudentByIdService, updateStudentService } from '@/services/studentService'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
const useStudentStore = create(
   devtools(
      persist(
         (set) => ({
            loading: false,
            error: null,
            students: [],
            studentById: {},

            // Get all students
            getAllStudents: async () => {
               set({ loading: true, error: null })
               try {
                  const data = await getAllStudentsService()
                  if (data?.status) {
                     set({ students: data, loading: false })
                  } else {
                     set({ students: [], loading: false })
                     toast.error('Failed to fetch data')
                  }
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Get student by ID
            getStudentById: async (studentId) => {
               set({ loading: true, error: null })
               try {
                  const data = await getStudentByIdService(studentId)
                  set({ studentById: data, loading: false })
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Add a new student
            addStudent: async (studentData) => {
               set({ loading: true, error: null });
               try {
                  const data = await createStudentService(studentData);
                  if (data) {
                     set((state) => ({
                        students: [...state.students, data],
                        loading: false
                     }));
                     toast.success(data?.message)
                  } else {
                     // Handle the case where the student could not be added
                     set({ loading: false });
                     toast.error('Failed to add student');
                  }
            
                  return data;
            
               } catch (error) {
                  const errorMessage = error.message || 'An error occurred while adding the student';
                  set({ error: errorMessage, loading: false });
                  toast.error(errorMessage);  
                  return error;
               }
            },
            
            // Update an existing student
            updateStudent: async (studentId, updatedStudentData) => {
               set({ loading: true, error: null })
               try {
                  const data = await updateStudentService(studentId, updatedStudentData)
                  if (data) {
                     toast.success(data.message)
                     set((state) => ({
                        students: state.students.map((student) =>
                           student.id === studentId ? { ...student, ...updatedStudentData } : student
                        ),
                        loading: false
                     }))
                     await get().getAllStudents()
                  } else {
                     toast.error('Failed to update student')
                     set({ loading: false })
                  }
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Delete an existing student
            deleteStudent: async (studentId) => {
               set({ loading: true, error: null })
               try {
                  const data = await deleteStudentService(studentId)
                  if (data) {
                     toast.success(data.message)
                     set((state) => ({
                        students: state.students.filter((student) => student.id !== studentId),
                        loading: false
                     }))
                     await get().getAllStudents()
                  } else {
                     toast.error('Failed to delete student')
                     set({ loading: false })
                  }
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },
         }),
         { name: "students" }
      )
   )
)

export default useStudentStore