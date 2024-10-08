import useAuthStore from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
   const { loggedInUser } = useAuthStore();

   // Check if the user is logged in
   if (!loggedInUser?.username) {
      return <Navigate to="/" replace />;
   }

   // Check if the user role is allowed
   const userRole = loggedInUser.role;
   if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/pagenotfound" replace />;
   }

   return <Outlet />;
};

export default PrivateRoute;
