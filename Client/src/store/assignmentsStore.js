
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getAllAssignmentsService } from "@/services/assignmentServices";

const useAssignmentStore = create(
   devtools(
      persist(
         (set) => ({
            isLoading: false,
            isDeleting: false,
            error: null,
            assignments: [],

            getAllAssignments: async () => {
               set({ isLoading: true, error: null });
               try {
                  const res = await getAllAssignmentsService();
                  if (res.success) {
                     set({
                        assignments: res.data,
                        isLoading: false,
                     });
                  }
                  return res;
               } catch (error) {
                  set({ error: error.message, isLoading: false });
                  return error;
               }
            },
         }),
         {
            name: "assignmentStore",
         }
      )
   )
);
export default useAssignmentStore