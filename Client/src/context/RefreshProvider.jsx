import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import useAuthStore from "@/store/authStore";

const RefreshContext = createContext();

// Custom hook to use the RefreshContext
export const useRefreshContext = () => {
   return useContext(RefreshContext);
};

export const RefreshProvider = ({ children }) => {
   const { refresh, isAuthenticated } = useAuthStore();
   const isRefreshing = useRef(false);

   const REFRESH_INTERVAL = 10 * 60; // 10 minutes (in seconds)
   const [timeLeft, setTimeLeft] = useState(() => {
      const savedTime = localStorage.getItem("refreshTimer");
      return savedTime ? parseInt(savedTime, 10) : REFRESH_INTERVAL;
   });

   const MAX_RETRIES = 3; // Max number of retry attempts
   const RETRY_DELAY = 30; // Retry delay in seconds

   useEffect(() => {
      const saveTimeToStorage = (time) => {
         localStorage.setItem("refreshTimer", time);
      };

      const startCountdown = () => {
         let timer = timeLeft;
         const countdown = setInterval(() => {
            timer -= 1;
            setTimeLeft(timer);
            saveTimeToStorage(timer);

            if (timer <= 0) {
               clearInterval(countdown);
               triggerRefresh(); // Trigger refresh when timer hits 0
            }
         }, 1000); // Update every second

         return countdown;
      };

      const triggerRefresh = async (retryCount = 0) => {
         if (isAuthenticated && !isRefreshing.current) {
            try {
               isRefreshing.current = true;
               const res = await refresh();

               if (res.success) {
                  setTimeLeft(REFRESH_INTERVAL);
                  saveTimeToStorage(REFRESH_INTERVAL);
               } else if (retryCount < MAX_RETRIES) {
                  console.log(`Retrying refresh in ${RETRY_DELAY} seconds... Attempt #${retryCount + 1}`);
                  setTimeout(() => {
                     triggerRefresh(retryCount + 1);
                  }, RETRY_DELAY * 1000);
               } else {
                  console.error("Max retry attempts reached. Refresh failed.");
               }
            } catch (error) {
               console.error("Error during token refresh:", error);
               if (retryCount < MAX_RETRIES) {
                  console.log(`Retrying refresh in ${RETRY_DELAY} seconds... Attempt #${retryCount + 1}`);
                  setTimeout(() => {
                     triggerRefresh(retryCount + 1);
                  }, RETRY_DELAY * 1000);
               } else {
                  console.error("Max retry attempts reached. Refresh failed.");
               }
            } finally {
               isRefreshing.current = false;
            }
         }
      };

      let interval;
      if (isAuthenticated) {
         interval = startCountdown();
      }

      return () => clearInterval(interval); // Cleanup on unmount or logout
   }, [refresh, isAuthenticated, timeLeft]);

   // Clear timer on logout or session expiration
   useEffect(() => {
      if (!isAuthenticated) {
         localStorage.removeItem("refreshTimer");
         setTimeLeft(REFRESH_INTERVAL);
      }
   }, [isAuthenticated]);

   return (
      <RefreshContext.Provider value={{ timeLeft }}>
         {children}
      </RefreshContext.Provider>
   );
};
