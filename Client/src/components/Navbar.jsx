import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHamburger, FaSync } from "react-icons/fa";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useAuthStore from "@/store/authStore";
import { LucideLogOut, RefreshCw } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "@/context/RefreshProvider";
import default_user from "../assets/default_user.jpg"

const Navbar = () => {
   const navigate = useNavigate();
   const { loggedInUser, logout } = useAuthStore();
   const { refreshWithRetry, isRefreshing } = useRefresh()
   const [currentTime, setCurrentTime] = useState(dayjs());
   const [hasShadow, setHasShadow] = useState(false);

   // Update current time
   useEffect(() => {
      const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
      return () => clearInterval(timer);
   }, []);

   // Detect scroll position
   useEffect(() => {
      const handleScroll = () => setHasShadow(window.scrollY > 0);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);


   const logoutHandle = async () => {
      try {
         const res = await logout();
         if (res.success) navigate("/");
      } catch (error) {
         toast.error("Logout failed. Please try again.");
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
            <p className="hidden md:block text-sm font-medium lg:text-right">
               {currentTime.format("HH:mm:ss A")} - {currentTime.format("D MMM, YYYY")}
            </p>
            {/* Refresh Button */}
            {/* <Button onClick={refreshWithRetry} className="hidden md:block">
               <FaSync className="w-6 h-6 text-primary" />
            </Button> */}

            {/* User Avatar and Dropdown */}
            <div className="flex items-center gap-4">
               <RefreshCw
                  onClick={refreshWithRetry}
                  aria-label="Refresh content"
                  className={`w-6 h-6 text-primary cursor-pointer ${isRefreshing ? "animate-spin" : ""}`}
               />
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Avatar className="w-10 h-10 border border-black shadow-md cursor-pointer">
                        <AvatarImage
                           src={loggedInUser?.profile?.profilePicture || default_user}
                           alt={`${loggedInUser?.profile?.fname || 'User'}'s Avatar`}
                           className="object-cover"
                        />
                     </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
                     <DropdownMenuSeparator className="bg-primary" />
                     <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                     <DropdownMenuItem asChild>
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
            </div>
         </header>
      </div>
   );
};

export default Navbar;
