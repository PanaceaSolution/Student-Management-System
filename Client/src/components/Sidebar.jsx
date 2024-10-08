
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';

import { FaChalkboardTeacher, FaChartBar, FaNetworkWired, FaTasks, FaUserGraduate, FaUserTie, SiGoogleclassroom, SiGooglemessages, SiStorybook, IoLibrary, IoMdCalendar, GrResources, TbReportAnalytics, RiMoneyRupeeCircleLine, LuLogOut, MdDashboard } from '../components/Icons'

import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider
} from './ui/tooltip';

import logo from '../assets/logo.png';


// Sidebar Links Configuration
const links = [
   {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <MdDashboard className="h-6 w-6" />,
      roles: ["Admin", "Teacher", "Student", "Parent", "Accountant", "Librarian"],
   },
   {
      name: 'Students',
      href: '/students',
      icon: <FaUserGraduate className="h-6 w-6" />,
      roles: ["Admin"],
   },
   {
      name: 'Teachers',
      href: '/teachers',
      icon: <FaChalkboardTeacher className="h-6 w-6" />,
      roles: ["Admin"],
   },
   {
      name: 'Staff',
      href: '/staffs',
      icon: <FaUserTie className="h-6 w-6" />,
      roles: ["Admin"],
   },
   {
      name: 'Subjects',
      href: '/subjects',
      icon: <SiStorybook className="h-6 w-6" />,
      roles: ["Admin"],
   },
   {
      name: 'Classes',
      href: '/classes',
      icon: <SiGoogleclassroom className="h-6 w-6" />,
      roles: ["Admin"],
   },
   {
      name: 'Logistics',
      href: '/logistics',
      icon: <FaNetworkWired className="h-6 w-6" />,
      roles: ["Admin"],
   },
   {
      name: 'Portfolio',
      href: '/portfolio',
      icon: <FaUserGraduate className="h-6 w-6" />,
      roles: ["Teacher", "Student", "Parent", "Accountant", "Librarian"],
   },
   {
      name: 'Finance',
      href: '/finance',
      icon: <FaChartBar className="h-6 w-6" />,
      roles: ["Admin", "Accountant"],
   },
   {
      name: 'Routine',
      href: '/routine',
      icon: <IoMdCalendar className="h-6 w-6" />,
      roles: ["Teacher", "Student"],
   },
   {
      name: 'Resources',
      href: '/resources',
      icon: <GrResources className="h-6 w-6" />,
      roles: ["Teacher", "Student"],
   },
   {
      name: 'Tasks',
      href: '/tasks',
      icon: <FaTasks className="h-6 w-6" />,
      roles: ["Teacher", "Student"],
   },
   {
      name: 'Report',
      href: '/report',
      icon: <TbReportAnalytics className="h-6 w-6" />,
      roles: ["Parent"],
   },
   {
      name: 'Fees',
      href: '/fees',
      icon: <RiMoneyRupeeCircleLine className="h-6 w-6" />,
      roles: ["Parent"],
   },
   {
      name: 'Message',
      href: '/message',
      icon: <SiGooglemessages className="h-6 w-6" />,
      roles: ["Teacher", "Parent"],
   },
   {
      name: 'Library',
      href: '/library',
      icon: <IoLibrary className="h-6 w-6" />,
      roles: ["Admin", "Teacher", "Student", "Librarian"],
   },
];

const Sidebar = () => {
   const location = useLocation();
   const { user, staff } = useAuth();
   const userRole = user?.role;
   const staffRole = staff.role;

   const isActive = (path) => location.pathname === path;

   // Filter links based on user and staff roles
   const filteredLinks = links.filter(link => {
      if (userRole === 'Staff' && staffRole) {
         return link.roles.includes(staffRole);
      } else {
         return link.roles.includes(userRole);
      }

   });

   return (
      <aside className="sticky top-0 md:border-r bg-primary text-white lg:rounded-tr-lg lg:rounded-br-lg h-screen overflow-y-auto scrollbar-none">
         <div className="flex flex-col min-h-screen">

            {/* Logo Section */}
            <div className="flex items-center justify-center">
               <img src={logo} alt="Logo" className="h-[120px]  md:h-[80px] lg:h-[150px]" />
            </div>

            {/* Sidebar Content */}
            <TooltipProvider>
               <nav className="flex flex-col justify-center gap-2 text-sm font-medium px-2 lg:px-4" role="navigation">
                  {filteredLinks.map((link, index) => (
                     <Link
                        key={index}
                        to={link.href}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                        aria-label={link.name}
                        className={`flex items-center gap-8 rounded-lg p-4 md:p-3 lg:p-4 transition-all hover:bg-background hover:text-primary 
                              ${isActive(link.href)
                              ? 'bg-background text-primary border-l-4 border-primary'
                              : 'text-white'
                           }
                           `}
                     >
                        <Tooltip className="flex flex-row">
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


            {/* Logout Button */}
            <Link
               to="/logout"
               className=" flex items-center justify-center gap-3 rounded-lg bg-red-500 p-4 m-4 md:m-1 md:mt-4 lg:m-4 mb-6 text-white transition-all hover:bg-red-600"
            >
               <span >
                  <LuLogOut className="h-6 w-6" />
               </span>
               <span className="md:hidden lg:block font-semibold text-base">Logout</span>
            </Link>
         </div>
      </aside>
   );
};

export default Sidebar;
