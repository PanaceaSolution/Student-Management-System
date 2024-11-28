import { createNoticeService } from "@/services/noticeService";
import { flattenData, flattenNestedData } from "@/utilities/utilities";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useNoticeStore = create(
  devtools(
    persist((set) => ({
      isSubmitting: false,
      isDeleting: false,
      isLoading: false,
      error: null,
      notices: [],

      // Create new notice
      addNotice: async (noticeData) => {
        set({ isSubmitting: true, error: null });
        try {
          const res = await createNoticeService(noticeData);
          if (res.success) {
            toast.success(res.message);
            set((state) => ({
              notices: [flattenNestedData(res.data), ...state.notices],
              isSubmitting: false,
            }));
          } else {
            toast.error(res.message);
            set({ isSubmitting: false });
          }
          return res;
        } catch (error) {
          set({ error: error.message, isSubmitting: false });
          toast.error(error.message || "An unexpected error occurred");
          return error;
        }
      },
    }))
  )
);

export default useNoticeStore;
