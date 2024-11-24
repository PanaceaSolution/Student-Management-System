import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHamburger } from "react-icons/fa";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useAuthStore from "@/store/authStore";
import { LucideLogOut } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
   const navigate = useNavigate();
   const { loggedInUser, logout, refresh } = useAuthStore();
   const [currentTime, setCurrentTime] = useState(dayjs());
   const [hasShadow, setHasShadow] = useState(false);

   useEffect(() => {
      // Update the current time every second
      const timer = setInterval(() => setCurrentTime(dayjs()), 1000);

      // Detect scroll position for shadow effect
      const handleScroll = () => setHasShadow(window.scrollY > 0);
      window.addEventListener("scroll", handleScroll);

      return () => {
         clearInterval(timer);
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   const handleRefresh = async () => {
      try {
         await refresh();
      } catch (error) {
         console.error("Error refreshing session:", error);
      }
   };

   const logoutHandle = async () => {
      try {
         const res = await logout();
         if (res.success) navigate("/");
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   return (
      <div
         className={`sticky top-0 bg-background z-50 ${hasShadow ? "shadow-lg border-b border-gray-300" : ""
            }`}
      >
         <header className="flex items-center justify-between gap-4 lg:gap-20 px-4 py-4 lg:px-8 transition-all duration-300 ease-in-out">
            {/* Mobile Sidebar Drawer */}
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" aria-label="Toggle menu">
                     <FaHamburger className="w-8 h-8 text-primary" />
                  </Button>
               </SheetTrigger>
               <SheetContent side="left" className="lg:hidden bg-primary">
                  <Sidebar />
               </SheetContent>
            </Sheet>

            {/* User Welcome Section */}
            <div className="hidden md:flex flex-col items-start md:items-center">
               <h1 className="text-lg font-bold">
                  Welcome, {loggedInUser?.profile.fname} {loggedInUser?.profile.lname}
               </h1>
            </div>

            {/* Current Date and Time */}
            <p className="text-sm font-medium lg:text-right">
               {currentTime.format("HH:mm:ss A")} - {currentTime.format("D MMM, YYYY")}
            </p>

            {/* User Avatar and Dropdown */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 border border-black shadow-md cursor-pointer">
                     <AvatarImage
                        src={loggedInUser?.profile.profilePicture}
                        alt={`${loggedInUser?.profile.fname}'s Avatar`}
                        className="object-cover"
                     />
                     <AvatarFallback className="text-3xl font-bold">
                        {loggedInUser?.profile.fname?.[0]}
                     </AvatarFallback>
                  </Avatar>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary" />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem>
                     <Button
                        variant="destructive"
                        onClick={logoutHandle}
                        className="flex items-center justify-center gap-3 w-full"
                     >
                        <LucideLogOut />
                        <span>Logout</span>
                     </Button>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </header>
      </div>
   );
};

export default Navbar;
