import { createSubjectService, deleteSubjectService, getAllSubjectsService, updateSubjectService } from '@/services/subjectServices'
import toast from 'react-hot-toast'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useSubjectStore = create(
   devtools(
      persist(
         (set) => ({
            isSubmitting: false,
            isDeleting: false,
            isLoading: false,
            error: null,
            subjects: [],

            // Get all subjects
            getAllSubjects: async () => {
               set({ isLoading: true, error: null })
               try {
                  const res = await getAllSubjectsService()
                  if (res.success) {
                     set({
                        subjects: res.data,
                        isLoading: false
                     })
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isLoading: false })
                  return error
               }
            },


            // Add a new subject
            addSubject: async (subjectData) => {
               set({ isSubmitting: true, error: null })
               try {
                  const res = await createSubjectService(subjectData)
                  if (res.success) {
                     toast.success(res.message)
                     set((state) => ({
                        subjects: [...state.subjects, res.data],
                        isSubmitting: false
                     }))
                  } else {
                     toast.error(res.message)
                     set({ isSubmitting: false })
                  }
                  return res
               } catch (error) {
                  set({ error: error.message, isSubmitting: false })
                  return error
               }
            },

            // Update an existing subject
            updateSubject: async (subjectId, updatedSubjectData) => {
               set({ isSubmitting: true, error: null });

               try {
                  const data = await updateSubjectService(subjectId, updatedSubjectData);

                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        subjects: state.subjects.map((subject) =>
                           subject.id === subjectId ? { ...subject, ...updatedSubjectData } : subject
                        ),
                        isSubmitting: false,
                     }));
                  } else {
                     toast.error('Failed to update');
                     set({ isSubmitting: false });
                  }

                  return data;
               } catch (error) {
                  set({ error: error.message, isSubmitting: false });
                  toast.error(`Error: ${error.message}`); // Show error message to user
                  return error; // Consider returning an object instead for better error handling
               }
            },


            // Delete an existing subject
            deleteSubject: async (subjectId) => {
               set({ loading: true, error: null })
               try {
                  const res = await deleteSubjectService(subjectId)
                  if (res.success) {
                     toast.success(res.message)
                     set((state) => ({
                        subjects: state.subjects.filter((subject) => subject.courseId !== subjectId),
                        loading: false
                     }))
                  }
                  return res
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            }
         }),
         {
            name: 'subjects',
            partialize: (state) => ({ subjects: state.subjects }),
         }
      )
   )
)

export default useSubjectStore;