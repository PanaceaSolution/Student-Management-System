import { useAuth } from "@/context/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
   const { user, staff } = useAuth();

   // Check if the user is authenticated
   if (!user) {
      return <Navigate to="/" replace />;
   }

   // Check if the user has a primary role that is allowed
   if (!allowedRoles.includes(user.role)) {
      // If the user is a staff member, check their sub-role
      if (user.role === 'Staff' && staff) {
         const staffRole = staff.role;

         if (!allowedRoles.includes(staffRole)) {
            return <Navigate to="/pagenotfound" replace />;
         }
      } else {
         return <Navigate to="/pagenotfound" replace />;
      }
   }

   // Render the child routes
   return <Outlet />;
};

export default PrivateRoute;
