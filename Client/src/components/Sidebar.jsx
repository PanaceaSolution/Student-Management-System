
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { FaChalkboardTeacher, FaChartBar, FaNetworkWired, FaTasks, FaUserGraduate, FaUserTie, SiGoogleclassroom, SiGooglemessages, SiStorybook, IoLibrary, IoMdCalendar, GrResources, TbReportAnalytics, RiMoneyRupeeCircleLine, LuLogOut, MdDashboard } from '../components/Icons'

import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider
} from './ui/tooltip';

import logo from '../assets/logo.png';
import useAuthStore from '@/store/authStore';
import { Button } from './ui/button';


// Sidebar Links Configuration
const links = [
   {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <MdDashboard className="h-6 w-6" />,
      roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "ACCOUNTANT", "LIBRARIAN"],
   },
   {
      name: 'Students',
      href: '/students',
      icon: <FaUserGraduate className="h-6 w-6" />,
      roles: ["ADMIN"],
   },
   {
      name: 'Teachers',
      href: '/teachers',
      icon: <FaChalkboardTeacher className="h-6 w-6" />,
      roles: ["ADMIN"],
   },
   {
      name: 'Staff',
      href: '/staffs',
      icon: <FaUserTie className="h-6 w-6" />,
      roles: ["ADMIN"],
   },
   {
      name: 'Subjects',
      href: '/subjects',
      icon: <SiStorybook className="h-6 w-6" />,
      roles: ["ADMIN"],
   },
   {
      name: 'Classes',
      href: '/classes',
      icon: <SiGoogleclassroom className="h-6 w-6" />,
      roles: ["ADMIN"],
   },
   {
      name: 'Logistics',
      href: '/logistics',
      icon: <FaNetworkWired className="h-6 w-6" />,
      roles: ["ADMIN"],
   },
   {
      name: 'Portfolio',
      href: '/portfolio',
      icon: <FaUserGraduate className="h-6 w-6" />,
      roles: ["TEACHER", "STUDENT", "PARENT", "ACCOUNTANT", "LIBRARIAN"],
   },
   {
      name: 'Finance',
      href: '/finance',
      icon: <FaChartBar className="h-6 w-6" />,
      roles: ["ADMIN", "ACCOUNTANT"],
   },
   {
      name: 'Routine',
      href: '/routine',
      icon: <IoMdCalendar className="h-6 w-6" />,
      roles: ["TEACHER", "STUDENT"],
   },
   {
      name: 'Resources',
      href: '/resources',
      icon: <GrResources className="h-6 w-6" />,
      roles: ["TEACHER", "STUDENT"],
   },
   {
      name: 'Tasks',
      href: '/tasks',
      icon: <FaTasks className="h-6 w-6" />,
      roles: ["TEACHER", "STUDENT"],
   },
   {
      name: 'Report',
      href: '/report',
      icon: <TbReportAnalytics className="h-6 w-6" />,
      roles: ["PARENT"],
   },
   {
      name: 'Fees',
      href: '/fees',
      icon: <RiMoneyRupeeCircleLine className="h-6 w-6" />,
      roles: ["PARENT"],
   },
   {
      name: 'Message',
      href: '/message',
      icon: <SiGooglemessages className="h-6 w-6" />,
      roles: ["TEACHER", "PARENT"],
   },
   {
      name: 'Library',
      href: '/library',
      icon: <IoLibrary className="h-6 w-6" />,
      roles: ["ADMIN", "TEACHER", "STUDENT", "LIBRARIAN"],
   },
];

const Sidebar = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { loggedInUser, logout } = useAuthStore();
   const userRole = loggedInUser?.role || 'ADMIN';

   const isActive = (path) => location.pathname === path;

   const filteredLinks = links.filter(link => link.roles.includes(userRole));

   const logoutHandle = async () => {
      await logout()
      navigate('/');
   }

   return (
      <aside className="sticky top-0 md:border-r bg-primary text-white lg:rounded-tr-lg lg:rounded-br-lg h-screen overflow-y-auto scrollbar-none">
         <div className="flex flex-col h-screen justify-between">

            <div className="flex flex-col">
               {/* Logo Section */}
               <div className="flex items-center justify-center">
                  <img src={logo} alt="Logo" className="h-[120px]" />
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
                           className={`flex items-center gap-8 rounded-lg p-[14px] transition-all hover:bg-background hover:text-primary 
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

                           <span className="font-semibold text-lg">{link.name}</span>
                        </Link>
                     ))}
                  </nav>
               </TooltipProvider>
            </div>


            {/* Logout Button */}
            <Button
               variant="destructive"
               onClick={logoutHandle}
               className="flex items-center justify-center gap-5 py-7 md:mx-1 lg:mx-4 mb-10 md:mb-4"
            >
               <LuLogOut className="w-6 h-6" />
               <span className="md:hidden lg:block font-semibold text-lg">Logout</span>
            </Button>
         </div>
      </aside>
   );
};

export default Sidebar;
