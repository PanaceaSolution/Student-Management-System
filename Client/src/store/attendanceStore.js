
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { saveAttendenceService } from "@/services/attendanceService";

const useAttendanceStore = create(
  devtools(
    persist(
      (set, get) => ({
        loading: false,
        isSubmitting: false,
        isDeleting: false,
        error: null,
        attendanceRecords: [],
        attendanceByClassAndSection: [],

        // Add a new attendance record
        saveAttendence: async (attendanceData) => {
          set({ isSubmitting: true, error: null });
          try {
            const res = await saveAttendenceService(attendanceData);
            if (res.success) {
              set((state) => ({
                attendanceRecords: [...state.attendanceRecords, res.data],
                isSubmitting: false,
              }));
              toast.success(res?.message || "Attendance added successfully");
            } else {
              set({ isSubmitting: false });
              toast.error("Failed to add attendance");
            }
            return res;
          } catch (error) {
            const errorMessage =
              error?.message || "An error occurred while adding the attendance";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            return error;
          }
        },
      }),
      { name: "attendence" }
    )
  )
);

export default useAttendanceStore;