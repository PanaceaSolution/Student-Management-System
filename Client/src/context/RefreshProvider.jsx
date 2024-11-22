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

   const REFRESH_INTERVAL = 10 * 60; // 13 minutes (in seconds)
   const [timeLeft, setTimeLeft] = useState(() => {
      const savedTime = localStorage.getItem("refreshTimer");
      return savedTime ? parseInt(savedTime, 10) : REFRESH_INTERVAL;
   });

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

      const triggerRefresh = async () => {
         if (isAuthenticated && !isRefreshing.current) {
            try {
               isRefreshing.current = true;
               await refresh();
               setTimeLeft(REFRESH_INTERVAL); // Reset the timer after a successful refresh
               saveTimeToStorage(REFRESH_INTERVAL);
            } catch (error) {
               console.error("Error during token refresh:", error);
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
