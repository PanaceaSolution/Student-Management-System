import { createSubjectService, deleteSubjectService, getAllSubjectsService, updateSubjectService } from '@/services/subjectServices'
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

            // Get all subjects
            getAllSubjects: async () => {
               set({ loading: true, error: null })
               try {
                  const res = await getAllSubjectsService()
                  if (res.success) {
                     set({
                        subjects: res.data,
                        loading: false
                     })
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },


            // Add a new subject
            addSubject: async (subjectData) => {
               set({ loading: true, error: null })
               try {
                  const res = await createSubjectService(subjectData)
                  console.log("Subject", subjectData);

                  console.log("Response:", res);

                  if (res.success) {
                     toast.success(res.message)
                     set((state) => ({
                        subjects: [...state.subjects, res.data],
                        loading: false
                     }))
                  }
                  return res
               } catch (error) {
                  set({ error: error.message, loading: false })
                  return error
               }
            },

            // Update an existing subject
            updateSubject: async (subjectId, updatedSubjectData) => {
               set({ loading: true, error: null });

               try {
                  const data = await updateSubjectService(subjectId, updatedSubjectData);

                  if (data) {
                     toast.success(data.message);
                     set((state) => ({
                        subjects: state.subjects.map((subject) =>
                           subject.id === subjectId ? { ...subject, ...updatedSubjectData } : subject
                        ),
                        loading: false,
                     }));

                     await get().getAllSubjects();
                  } else {
                     toast.error('Failed to update');
                     set({ loading: false });
                  }

                  return data;
               } catch (error) {
                  set({ error: error.message, loading: false });
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
         { name: 'subjects' }
      )
   )
)

export default useSubjectStore;