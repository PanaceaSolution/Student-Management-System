import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
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
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { useRefreshContext } from "@/context/RefreshProvider";


const Navbar = () => {
   const navigate = useNavigate();
   const { loggedInUser, logout } = useAuthStore();
   const [currentTime, setCurrentTime] = useState(dayjs());
   const [hasShadow, setHasShadow] = useState(false);
   const { timeLeft } = useRefreshContext();
   const minutes = Math.floor(timeLeft / 60);
   const seconds = String(timeLeft % 60).padStart(2, "0");

   const { refresh } = useAuthStore()

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

   const handleRefresh = async () => {
      // Refresh the session using the refresh token
      await refresh();
   }


   const logoutHandle = async () => {
      const res = await logout()
      if (res.success) navigate("/");
   }


   return (
      <div className={`sticky top-0 bg-background z-50 ${hasShadow ? "shadow-lg border-b border-gray-300" : ""}`}>
         <header
            className={`flex items-center justify-between gap-4 lg:gap-20 px-4 py-4 lg:px-8 mr-6 transition-all duration-300 ease-in-out`}
         >
            {/* Drawer */}
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 lg:hidden">
                     <FaHamburger className="w-8 h-8 text-primary" />
                     <span className="sr-only">Toggle navigation menu</span>
                  </Button>
               </SheetTrigger>
               <SheetContent side="left" className="lg:hidden bg-primary">
                  <SheetTitle />
                  <SheetDescription />
                  <Sidebar />
               </SheetContent>
            </Sheet>

            {/* User Information */}
            <div className="hidden md:flex flex-col items-start md:items-center">
               <h1 className="text-lg md:text-2xl font-bold">
                  Welcome, {loggedInUser?.profile.fname} {loggedInUser?.profile.lname}
               </h1>
               <p className="text-sm font-medium lg:text-right lg:mt-0 mt-1">
                  {`${currentTime.format("HH:mm A")} - ${currentTime.format(
                     "D MMM, YYYY"
                  )}`}
               </p>
            </div>

            <div>
               <Button onClick={handleRefresh}>
                  Refresh
               </Button>
               Refresh in: {minutes}:{seconds}
            </div>

            {/* Logout Button */}
            {/* <Button
               variant="destructive"
               // onClick={logoutHandle}
               className="flex items-center justify-center gap-5 py-7 md:mx-2 lg:mx-4 mb-6 md:mb-0"
            >
               <LucideLogOut className="w-6 h-6" />
               <span className="md:hidden lg:block font-semibold text-lg">Logout</span>
            </Button> */}

            {/* User Avatar */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 border border-black shadow-md cursor-pointer">
                     <AvatarImage src={loggedInUser?.profile.profilePicture} alt="Admin Avatar" className="object-cover" />
                     <AvatarFallback className="text-3xl font-bold">{loggedInUser?.profile.fname?.charAt(0)}</AvatarFallback>
                  </Avatar>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary" />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
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
