import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import Sidebar from "./Sidebar";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHamburger } from "react-icons/fa";
import { useState, useEffect } from "react";

const Navbar = () => {
   const [currentTime, setCurrentTime] = useState(new Date());

   // Update time every second
   useEffect(() => {
      const timer = setInterval(() =>
         setCurrentTime(new Date()), 1000
      );
      return () => clearInterval(timer);
   }, []);

   const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   };

   const formatDate = (date) => {
      return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
   };

   return (
      <header className="flex items-center justify-between gap-4 lg:gap-20 px-4 py-4 lg:py-10 lg:px-6 border-b-2 border-black md:border-0 max-w-screen-2xl">
         {/* Drawer */}
         <Sheet>
            <SheetTrigger asChild>
               <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
               >
                  <FaHamburger className="w-8 h-8" />
                  <span className="sr-only">Toggle navigation menu</span>
               </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 flex flex-col bg-primary">
               <div className="relative flex h-full min-h-screen flex-col gap-2">
                  <div className="flex h-28 items-center justify-center px-4 lg:px-6">
                     {/* Logo */}
                     <Link to="/" className="flex items-center gap-2 font-semibold">
                        <span className="text-3xl font-bold text-white">SMS</span>
                     </Link>
                  </div>
                  {/* Sidebar */}
                  <div className="flex-1">
                     <Sidebar />
                  </div>
                  <Link
                     to="/logout"
                     className="absolute bottom-10 left-4 right-4 flex items-center gap-3 rounded-lg bg-red-500 px-4 py-4 text-white transition-all hover:bg-red-600"
                  >
                     <LogOut className="h-6 w-6" />
                     <span className="md:hidden lg:block font-semibold text-base">Logout</span>
                  </Link>
               </div>
            </SheetContent>
         </Sheet>

         {/* User Information */}
         <div className="flex flex-col items-center px-4">
            <h1 className="text-xl md:text-2xl font-bold">
               Welcome, Admin
            </h1>
            <p className="text-sm font-medium">
               {`${formatTime(currentTime)} - ${formatDate(currentTime)}`}
            </p>
         </div>

         {/* Search Bar */}
         <form className="flex-1 md:flex-auto">
            <Input
               type="search"
               placeholder="Search...."
               className="w-full border border-black pl-8 shadow-none md:w-2/3 lg:w-1/3"
               aria-label="Search"
            />
         </form>

         {/* User Avatar */}
         <Avatar className="w-12 h-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="Admin Avatar" />
            <AvatarFallback>AD</AvatarFallback>
         </Avatar>
      </header>
   );
};

export default Navbar;
