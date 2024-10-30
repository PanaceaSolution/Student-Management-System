import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHamburger } from "react-icons/fa";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useAuthStore from "@/store/authStore";

const Navbar = () => {
   const { loggedInUser } = useAuthStore();
   const [currentTime, setCurrentTime] = useState(dayjs());
   const [hasShadow, setHasShadow] = useState(false);

   useEffect(() => {
      // Update time every second
      const timer = setInterval(() => setCurrentTime(dayjs()), 1000);

      // Detect scroll position
      const handleScroll = () => {
         setHasShadow(window.scrollY > 0);
      };
      window.addEventListener("scroll", handleScroll);

      // Cleanup both the interval and the scroll listener
      return () => {
         clearInterval(timer);
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);


   return (
      <div className={`sticky top-0 bg-background z-50 ${hasShadow ? "shadow-lg border-b border-gray-300" : ""}`}>
         <header
            className={`flex items-center justify-between gap-4 lg:gap-20 px-4 py-4 lg:px-6 transition-all duration-300`}
         >
            {/* Drawer */}
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                     <FaHamburger className="w-8 h-8 text-primary" />
                     <span className="sr-only">Toggle navigation menu</span>
                  </Button>
               </SheetTrigger>
               <SheetContent side="left" className="md:hidden bg-primary">
                  <Sidebar />
               </SheetContent>
            </Sheet>

            {/* User Information */}
            <div className="hidden md:flex flex-col items-start md:items-center">
               <h1 className="text-lg md:text-2xl font-bold">
                  Welcome, {loggedInUser?.username}
               </h1>
               <p className="text-sm font-medium lg:text-right lg:mt-0 mt-1">
                  {`${currentTime.format("HH:mm A")} - ${currentTime.format(
                     "D MMM, YYYY"
                  )}`}
               </p>
            </div>

            {/* Search Bar */}
            {/* <form className="flex-1 md:flex-auto">
               <Input
                  type="search"
                  placeholder="Search...."
                  className="w-full border border-black pl-8 shadow-none md:w-2/3 xl:w-1/3"
                  aria-label="Search"
               />
            </form> */}

            {/* User Avatar */}
            <Avatar className="w-12 h-12">
               <AvatarImage src="https://images.unsplash.com/photo-1726809448984-2e7f60cc6e97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Admin Avatar" className="object-cover" />
               <AvatarFallback>{loggedInUser?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
         </header>
      </div>
   );
};

export default Navbar;