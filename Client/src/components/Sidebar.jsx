import { ChartColumn, House } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChalkboardTeacher, FaNetworkWired, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { SiGoogleclassroom, SiStorybook } from 'react-icons/si';
import { IoLibrary } from 'react-icons/io5';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

// Sidebar Links Configuration
const links = [
   {
      name: 'Dashboard',
      href: '/',
      icon: <House className="h-6 w-6" />,
   },
   {
      name: 'Students',
      href: '/students',
      role:"Admin",
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
      role:"admin",
      icon: <ChartColumn className="h-6 w-6" />,
   },
];


const Sidebar = () => {
   const location = useLocation();
   // Determine if the current link is active
   const isActive = (path) => location.pathname === path;

   return (
      <TooltipProvider>
         <nav className="grid overflow-hidden items-start gap-4 text-sm font-medium lg:px-4">
            {links.map((link, index) => (
               <Link
                  key={index}
                  to={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`flex items-center gap-8 rounded-lg px-4 py-3 m-1 transition-all hover:bg-background hover:text-primary ${isActive(link.href) ? 'bg-background text-primary ' : 'text-white'
                     }`}
               >
                  {/* Tooltip on medium devices */}
                  <Tooltip>
                     <TooltipTrigger className="md:block">
                        <span className="flex items-center">{link.icon}</span>
                     </TooltipTrigger>
                     <TooltipContent className="hidden md:block lg:hidden">
                        <p>{link.name}</p>
                     </TooltipContent>
                  </Tooltip>
                  {/* Link name for lg screens */}
                  <span className="font-semibold text-lg md:hidden lg:block">{link.name}</span>
               </Link>
            ))}
         </nav>
      </TooltipProvider>
   );
};

export default Sidebar;
