import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHamburger } from "react-icons/fa";
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { useAuth } from "@/context/AuthProvider";

const Navbar = () => {
   const { user } = useAuth()
   const [currentTime, setCurrentTime] = useState(dayjs());

   useEffect(() => {
      const timer = setInterval(() =>
         setCurrentTime(dayjs()), 1000
      );
      return () => clearInterval(timer);
   }, []);

   return (
      <header className="flex items-center justify-between gap-4 lg:gap-20 px-4 py-4 lg:px-6 border-b-2 border-black md:border-0 max-w-screen-2xl">
         {/* Drawer */}
         <Sheet>
            <SheetTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
               >
                  <FaHamburger className="w-8 h-8 text-primary" />
                  <span className="sr-only">Toggle navigation menu</span>
               </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden bg-primary">
               <Sidebar />
            </SheetContent>
         </Sheet>

         {/* User Information */}
         <div className=" hidden md:flex flex-col items-start md:items-center">
            <h1 className=" text-lg md:text-2xl font-bold">
               Welcome, {user?.userName}
            </h1>
            <p className="text-sm font-medium lg:text-right lg:mt-0 mt-1">
               {`${currentTime.format('HH:mm A')} - ${currentTime.format('D MMM, YYYY')}`}
            </p>
         </div>

         {/* Search Bar */}
         <form className="flex-1 md:flex-auto">
            <Input
               type="search"
               placeholder="Search...."
               className="w-full border border-black pl-8 shadow-none md:w-2/3 xl:w-1/3"
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
