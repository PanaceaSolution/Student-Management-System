import { createStudentService, deleteStudentService, getAllStudentsService, getStudentByIdService, updateStudentService } from '@/services/studentService'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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
                  if (data) {
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
               set({ loading: true, error: null })
               try {
                  const data = await createStudentService(studentData)
                  if (data) {
                     toast.success(data.message)
                     set((state) => ({
                        students: [...state.students, data],
                        loading: false
                     }))
                     await get().getAllStudents()
                  } else {
                     set({ loading: false })
                     toast.error('Failed to add student')
                  }
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
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