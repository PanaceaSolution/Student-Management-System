import useAuthStore from "@/store/authStore";
import { createContext, useEffect } from "react"

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
   const { refresh } = useAuthStore()
   useEffect(() => {
      const interval = setInterval(() => {
         refresh();
      }, 14 * 60 * 1000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
   }, []);

   return (
      <RefreshContext.Provider value={{ refresh }}>
         {children}
      </RefreshContext.Provider>
   );
}