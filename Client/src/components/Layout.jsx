import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { LogOut } from "lucide-react";

const Layout = () => {
   return (
      <div className="grid min-h-screen w-full md:grid-cols-[80px_1fr] lg:grid-cols-[280px_1fr] bg-background transition-all duration-300">
         {/* Left Sidebar */}
         <aside className="hidden border-r bg-primary text-white md:block rounded-tr-lg rounded-br-lg">
            <div className="relative flex h-full min-h-screen flex-col">
               {/* Logo Section */}
               <div className="flex h-28 items-center justify-center px-4 lg:px-6">
                  <Link to="/" className="flex items-center gap-2 font-bold text-white">
                     <span className="text-3xl">SMS</span>
                  </Link>
               </div>

               {/* Sidebar Content */}
               <nav className="flex-1 px-2">
                  <Sidebar />
               </nav>

               {/* Logout Button */}
               <Link
                  to="/logout"
                  className="absolute bottom-6 left-4 right-4 flex items-center gap-3 rounded-lg bg-red-500 px-4 py-4 text-white transition-all hover:bg-red-600"
               >
                  <LogOut className="h-6 w-6" />
                  <span className="hidden lg:block font-semibold text-base">Logout</span>
               </Link>
            </div>
         </aside>

         {/* Right Content */}
         <div className="flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default Layout;
