import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useAuthStore from "@/store/authStore";
import Spinner from "./Loader/Spinner";

const Layout = () => {
   const { isLoggingOut } = useAuthStore();
   return (
      <div className="grid h-screen w-full lg:grid-cols-[280px_1fr] bg-background transition-all duration-300">
         {/* Left Sidebar */}
         <div className="flex-1 hidden lg:block ">
            <Sidebar />
         </div>

         {/* Right Content */}
         <div className="flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 py-2 lg:py-4 px-4">
               <Outlet />
            </main>
         </div>

         {isLoggingOut && (
            <div className="absolute top-1/2 left-1/2 z-[100] transform -translate-x-1/2 -translate-y-1/2 bg-black/70 w-full h-full flex flex-col items-center justify-center">
               <img className="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/491270/loading-spinner.svg" alt="Loading icon" />
               <p className="text-center text-white text-4xl font-bold">Logging out...</p>
            </div>
         )}
      </div>
   );
};

export default Layout;