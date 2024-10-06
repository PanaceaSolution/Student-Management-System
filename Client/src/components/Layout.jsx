import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
   return (
      <div className="grid h-screen w-full md:grid-cols-[70px_1fr] lg:grid-cols-[280px_1fr] bg-background transition-all duration-300">
         {/* Left Sidebar */}
         <div className="flex-1 hidden md:block ">
            <Sidebar />
         </div>

         {/* Right Content */}
         <div className="flex flex-col">
            {/* Navbar */}
            <div className="sticky top-0 bg-background z-50">
               <Navbar />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default Layout;