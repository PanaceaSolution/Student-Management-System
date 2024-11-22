import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
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
            <main className="flex-1 py-2 lg:py-4 mr-4">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default Layout;