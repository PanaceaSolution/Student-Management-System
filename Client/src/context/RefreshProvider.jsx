import useAuthStore from "@/store/authStore";
import React, { createContext, useContext, useEffect, useCallback } from "react";

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
   const { refresh, isAuthenticated } = useAuthStore();

   const refreshWithRetry = useCallback(() => {
      let retryCount = 0;
      const maxRetries = 3;

      const attemptRefresh = async () => {
         const res = await refresh();
         if (!res.success && retryCount < maxRetries) {
            retryCount++;
            setTimeout(attemptRefresh, 30000);
         } else if (!res.success) {
            console.error("Token refresh failed after 3 attempts.");
         } else {
            retryCount = 0;
            localStorage.setItem("lastRefreshTime", Date.now());
         }
      };

      attemptRefresh();
   }, [refresh]);

   useEffect(() => {
      if (!isAuthenticated) return; // Do not start the timer if the user is not authenticated

      const lastRefreshTime = localStorage.getItem("lastRefreshTime");
      const refreshInterval = 10 * 60 * 1000; // 10 minutes

      let remainingTime = refreshInterval;

      if (lastRefreshTime) {
         const elapsedTime = Date.now() - Number(lastRefreshTime);
         remainingTime = Math.max(refreshInterval - elapsedTime, 0);
      }

      const startTimer = () => {
         refreshWithRetry();
         localStorage.setItem("lastRefreshTime", Date.now());
         return setInterval(() => {
            refreshWithRetry();
            localStorage.setItem("lastRefreshTime", Date.now());
         }, refreshInterval);
      };

      const timerId = setTimeout(() => {
         clearInterval(timerId);
         startTimer();
      }, remainingTime);

      return () => clearInterval(timerId);
   }, [isAuthenticated, refreshWithRetry]);

   return (
      <RefreshContext.Provider value={{ refreshWithRetry }}>
         {children}
      </RefreshContext.Provider>
   );
};

export const useRefresh = () => useContext(RefreshContext);
