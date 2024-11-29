import {
  createNoticeService,
  deleteNoticeService,
} from "@/services/noticeService";
import { flattenNestedData } from "@/utilities/utilities";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {useEffect} from 'react'

const useNoticeStore = create(
  devtools(
    persist(
      (set) => ({
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

        deleteNotice: async (noticeID) => {
          set({ isDeleting: true, error: null });
          try {
            console.log("id", noticeID);
            const res = await deleteNoticeService(noticeID);
            
            if (res.success) {
              toast.success(res.message);
               set((state) => {
                 const updatedNotices = state.notices.filter(
                   (noticeItem) => noticeItem.id !== noticeID
                 );
                 return {
                   notices: updatedNotices,
                   isDeleting: false,
                 };
               });
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
