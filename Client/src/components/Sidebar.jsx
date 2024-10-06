import { ChartColumn, House } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChalkboardTeacher, FaNetworkWired, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { SiGoogleclassroom, SiStorybook } from 'react-icons/si';
import { IoLibrary } from 'react-icons/io5';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';
import { LogOut } from "lucide-react";
import logo from '../assets/logo.png'

// Sidebar Links Configuration
const links = [
   {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <House className="h-6 w-6" />,
   },
   {
      name: 'Students',
      href: '/students',
      icon: <FaUserGraduate className="h-6 w-6" />,
   },
   {
      name: 'Teachers',
      href: '/teachers',
      icon: <FaChalkboardTeacher className="h-6 w-6" />,
   },
   {
      name: 'Staff',
      href: '/staffs',
      icon: <FaUserTie className="h-6 w-6" />,
   },
   {
      name: 'Subjects',
      href: '/subjects',
      icon: <SiStorybook className="h-6 w-6" />,
   },
   {
      name: 'Classes',
      href: '/classes',
      icon: <SiGoogleclassroom className="h-6 w-6" />,
   },
   {
      name: 'Library',
      href: '/library',
      icon: <IoLibrary className="h-6 w-6" />,
   },
   {
      name: 'Logistics',
      href: '/logistics',
      icon: <FaNetworkWired className="h-6 w-6" />,
   },
   {
      name: 'Finance',
      href: '/finance',
      icon: <ChartColumn className="h-6 w-6" />,
   },
];

const Sidebar = () => {
   const location = useLocation();

   const isActive = (path) => location.pathname === path;

   return (
      <aside className="sticky top-0 md:border-r bg-primary text-white  lg:rounded-tr-lg lg:rounded-br-lg h-screen overflow-scroll py-3">
         <div className="relative flex min-h-screen md:h-full flex-col">
            {/* Logo Section */}
            <div className="flex h-32 items-center justify-center px-1 lg:px-4">
               <Link to="/" className="flex items-center gap-2 font-bold text-white">
                  <img src={logo} alt="Logo" className="w-40 h-40 md:w-16 md:h-16 lg:w-40 lg:h-40" />
               </Link>
            </div>

            {/* Sidebar Content */}
            <nav className="flex-1 px-2">
               <TooltipProvider>
                  <nav className="grid items-start gap-4 text-sm font-medium lg:px-4" role="navigation">
                     {links.map((link, index) => (
                        <Link
                           key={index}
                           to={link.href}
                           aria-current={isActive(link.href) ? 'page' : undefined}
                           aria-label={link.name}
                           className={`flex items-center gap-8 rounded-lg p-4 md:p-3 lg:p-4 transition-all hover:bg-background hover:text-primary ${isActive(link.href) ? 'bg-background text-primary border-l-4 border-primary' : 'text-white'
                              }`}
                        >
                           <Tooltip>
                              <TooltipTrigger className="md:block">
                                 <span className="flex items-center">{link.icon}</span>
                              </TooltipTrigger>
                              <TooltipContent className="hidden md:block lg:hidden">
                                 <p>{link.name}</p>
                              </TooltipContent>
                           </Tooltip>

                           <span className="font-semibold text-lg md:hidden lg:block">{link.name}</span>
                        </Link>
                     ))}
                  </nav>
               </TooltipProvider>
            </nav>

            {/* Logout Button */}
            <Link
               to="/logout"
               className=" flex items-center justify-center gap-3 rounded-lg bg-red-500 p-4 m-4 text-white transition-all hover:bg-red-600"
            >
               <span className=" h-6 w-6">
                  <LogOut />
               </span>
               <span className="hidden lg:block font-semibold text-base">Logout</span>
            </Link>
         </div>
      </aside>
   );
};


export default Sidebar;
