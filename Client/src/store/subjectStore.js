import { createSubjectService, deleteSubjectService, getAllSubjectsService, getSubjectByIdService, updateSubjectService } from '@/services/subjectServices'
import toast from 'react-hot-toast'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useSubjectStore = create(
   devtools(
      persist(
         (set, get) => ({
            loading: false,
            error: null,
            subjects: [],
            subjectById: {},

            // Get all subjects
            getAllSubjects: async () => {
               set({ loading: true, error: null })
               try {
                  const data = await getAllSubjectsService()
                  if (data) {
                     set({ subjects: data, loading: false })
                  } else {
                     set({ subjects: [], loading: false })
                     toast.error('Failed to fetch data')
                  }
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Get subject by ID
            getSubjectById: async (subjectId) => {
               set({ loading: true, error: null })
               try {
                  const data = await getSubjectByIdService(subjectId)
                  set({ subjectById: data, loading: false })
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Add a new subject
            addSubject: async (subjectData) => {
               set({ loading: true, error: null })
               try {
                  const data = await createSubjectService(subjectData)
                  if (data.status === 200) {
                     toast.success(data.message)
                     const currentSubjects = get().subjects
                     set({
                        subjects: [...currentSubjects, data],
                        loading: false
                     })
                     await get().getAllSubjects()
                  } else {
                     toast.error('Failed to add')
                     set({ loading: false })
                  }
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Update an existing subject
            updateSubject: async (subjectId, updatedSubjectData) => {
               set({ loading: true, error: null })
               try {
                  const data = await updateSubjectService(subjectId, updatedSubjectData)
                  if (data.status === 200) {
                     toast.success(data.message)
                     const currentSubjects = get().subjects
                     set({
                        subjects: currentSubjects.map((subject) =>
                           subject.id === subjectId ? data : subject
                        ),
                        loading: false
                     })
                     await get().getAllSubjects()
                  } else {
                     toast.error('Failed to update')
                     set({ loading: false })
                  }
                  return data
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Delete an existing subject
            deleteSubject: async (subjectId) => {
               set({ loading: true, error: null })
               try {
                  const data = await deleteSubjectService(subjectId)
                  if (data.status === 200) {
                     toast.success(data.message)
                     const currentSubjects = get().subjects
                     set({
                        subjects: currentSubjects.filter((subject) => subject.id !== subjectId),
                        loading: false
                     })
                     await get().getAllSubjects()
                     return data
                  } else {
                     toast.error('Failed to delete')
                     set({ loading: false })
                  }

               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            }
         }),
         { name: 'subjects' }
      )
   )
)

export default useSubjectStore;