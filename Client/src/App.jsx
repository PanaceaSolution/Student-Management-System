import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Loader from "./components/Loader/Loader";
import useAuthStore from "@/store/authStore.js";


// Lazy load components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Library = lazy(() => import("./pages/LibraryDashboard/Library"));
const Finance = lazy(() => import("./pages/admin/Finance"));
const Classes = lazy(() => import("./pages/admin/Classes"));
const Staffs = lazy(() => import("./pages/admin/Staffs"));
const Students = lazy(() => import("./pages/admin/Students"));
const Parents = lazy(() => import("./pages/admin/parents"));
const Subjects = lazy(() => import("./pages/admin/Subjects"));
const Teachers = lazy(() => import("./pages/admin/Teachers"));
const Logistics = lazy(() => import("./pages/admin/Logistics"));

const Portfolio = lazy(() => import("./pages/users/Portfolio"));
const Routine = lazy(() => import("./pages/users/Routine"));
const Resources = lazy(() => import("./pages/users/Resources"));
const Tasks = lazy(() => import("./pages/users/tasks/Tasks"));
const TaskDetails = lazy(() => import("./pages/users/tasks/TaskDetails"));
const Message = lazy(() => import("./pages/users/Message"));
const Report = lazy(() => import("./pages/users/Report"));
const Fees = lazy(() => import("./pages/users/Fees"));
const AttendanceDashboard = lazy(() => import('./pages/attendence/attendenceDashboard'))
const AttendanceTable = lazy(() => import('./pages/attendence/attendenceTable'))

// Define route configuration
const routeConfig = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    allowedRoles: [
      "ADMIN",
      "TEACHER",
      "STUDENT",
      "PARENT",
      "ACCOUNTANT",
      "LIBRARIAN",
    ],
  },
  {
    path: "/attendence",
    element: <AttendanceDashboard />,
    allowedRoles: ["ADMIN", "TEACHER"],
  },
  {
    path: `/attendence/:className/:section`,
    element: <AttendanceTable />,
    allowedRoles: ["ADMIN", "TEACHER"],
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
    allowedRoles: ["TEACHER", "STUDENT", "PARENT", "ACCOUNTANT", "LIBRARIAN"],
  },
  {
    path: "/finance",
    element: <Finance />,
    allowedRoles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    path: "/library",
    element: <Library />,
    allowedRoles: ["ADMIN", "LIBRARIAN", "STUDENT", "TEACHER"],
  },
  {
    path: "/message",
    element: <Message />,
    allowedRoles: ["TEACHER", "PARENT"],
  },
  {
    path: "/teachers",
    element: <Teachers />,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/students",
    element: <Students />,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/parents",
    element: <Parents />,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/staffs",
    element: <Staffs />,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/subjects",
    element: <Subjects />,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/classes",
    element: <Classes />,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/logistics",
    element: <Logistics />,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/routine",
    element: <Routine />,
    allowedRoles: ["STUDENT", "TEACHER"],
  },
  {
    path: "/resources",
    element: <Resources />,
    allowedRoles: ["STUDENT", "TEACHER"],
  },
  {
    path: "/tasks",
    element: <Tasks />,
    allowedRoles: ["STUDENT", "TEACHER"],
  },
  {
    path: "/task/:taskId",
    element: <TaskDetails />,
    allowedRoles: ["STUDENT", "TEACHER"],
  },
  {
    path: "/report",
    element: <Report />,
    allowedRoles: ["PARENT"],
  },
  {
    path: "/fees",
    element: <Fees />,
    allowedRoles: ["PARENT"],
  },
];

const App = () => {
  const { isAuthenticated } = useAuthStore()
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          {/* Private routes */}
          <Route element={<Layout />}>
            {routeConfig.map(({ path, element, allowedRoles }, index) => (
              <Route
                key={index}
                element={<PrivateRoute allowedRoles={allowedRoles} />}
              >
                <Route path={path} element={element} />
              </Route>
            ))}
          </Route>

          {/* Page not found */}
          <Route path="/pagenotfound" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Router>

  );
};

export default App;
