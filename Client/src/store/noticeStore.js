import {
  createNoticeService,
  deleteNoticeService,
  getNoticeService,
} from "@/services/noticeService";
import { flattenNestedData } from "@/utilities/utilities";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useNoticeStore = create(
  devtools(
    persist(
      (set) => ({
        isSubmitting: false,
        isDeleting: false,
        isLoading: false,
        error: null,
        notices: [],

        // Get all notices
        getNotices: async () => {
          set({ isLoading: true, error: null });
          try {
            const res = await getNoticeService();
            if (res.success) {
              set({
                notices: res.data,
                isLoading: false,
              });
            }
          } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message || "An unexpected error occurred");
          }
        },

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

        deleteNotice: async (noticeID) => {
          set({ isDeleting: true, error: null });
          try {
            const res = await deleteNoticeService(noticeID);
            if (res.success) {
              toast.success(res.message);
              set((state) => ({
                notices: state.notices.filter(
                  (notice) => notice.noticeID !== noticeID
                ),
                isDeleting: false
              }));
            } else {
              toast.error(res.message);
              set({ isDeleting: false });
            }
            return res;
          } catch (error) {
            set({ error: error.message, isDeleting: false });
            return error;
          }
        },
      }),

      {
        name: "notices",
        partialize: (state) => ({ notices: state.notices }),
      }
    )
  )
);


export default useNoticeStore;
