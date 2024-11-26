import React, { createContext, useContext, useEffect, useCallback } from "react";
import { useStore } from "zustand";

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
   const refresh = useStore((state) => state.refresh);

   const refreshWithRetry = useCallback(() => {
      let retryCount = 0;
      const maxRetries = 3;

      const attemptRefresh = async () => {
         const res = await refresh();
         if (!res.success && retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying token refresh... Attempt ${retryCount}`);
            setTimeout(attemptRefresh, 30000); // Retry after 30 seconds
         } else if (!res.success) {
            console.error("Token refresh failed after 3 attempts.");
         } else {
            retryCount = 0; // Reset retry count on success
         }
      };

      attemptRefresh();
   }, [refresh]);

   useEffect(() => {
      const intervalId = setInterval(refreshWithRetry, 10 * 60 * 1000); // Every 10 mins
      return () => clearInterval(intervalId);
   }, [refreshWithRetry]);

   return (
      <RefreshContext.Provider value={{ refreshWithRetry }}>
         {children}
      </RefreshContext.Provider>
   );
};

export const useRefresh = () => useContext(RefreshContext);
