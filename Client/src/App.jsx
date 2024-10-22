import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Loader from "./components/Loader/Loader";

// Lazy load components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Library = lazy(() => import("./pages/Library"));
const Finance = lazy(() => import("./pages/admin/Finance"));
const Classes = lazy(() => import("./pages/admin/Classes"));
const Staffs = lazy(() => import("./pages/admin/Staffs"));
const Students = lazy(() => import("./pages/admin/Students"));
const Subjects = lazy(() => import("./pages/admin/Subjects"));
const Teachers = lazy(() => import("./pages/admin/Teachers"));
const Logistics = lazy(() => import("./pages/admin/Logistics"));

const Portfolio = lazy(() => import("./pages/users/Portfolio"));
const Routine = lazy(() => import("./pages/users/Routine"));
const Resources = lazy(() => import("./pages/users/Resources"));
const Tasks = lazy(() => import("./pages/users/Tasks"));
const Message = lazy(() => import("./pages/users/Message"));
const Report = lazy(() => import("./pages/users/Report"));
const Fees = lazy(() => import("./pages/users/Fees"));

// Define route configuration
const routeConfig = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    allowedRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'LIBRARIAN']
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
    allowedRoles: ['TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'LIBRARIAN']
  },
  {
    path: "/finance",
    element: <Finance />,
    allowedRoles: ['ADMIN', 'ACCOUNTANT']
  },
  {
    path: "/library",
    element: <Library />,
    allowedRoles: ['ADMIN', 'LIBRARIAN', 'STUDENT', 'TEACHER']
  },
  {
    path: "/message",
    element: <Message />,
    allowedRoles: ['TEACHER', 'PARENT']
  },
  {
    path: "/teachers",
    element: <Teachers />,
    allowedRoles: ['ADMIN']
  },
  {
    path: "/students",
    element: <Students />,
    allowedRoles: ['ADMIN']
  },
  {
    path: "/staffs",
    element: <Staffs />,
    allowedRoles: ['ADMIN']
  },
  {
    path: "/subjects",
    element: <Subjects />,
    allowedRoles: ['ADMIN']
  },
  {
    path: "/classes",
    element: <Classes />,
    allowedRoles: ['ADMIN']
  },
  {
    path: "/logistics",
    element: <Logistics />,
    allowedRoles: ['ADMIN']
  },
  {
    path: "/routine",
    element: <Routine />,
    allowedRoles: ['STUDENT', 'TEACHER']
  },
  {
    path: "/resources",
    element: <Resources />,
    allowedRoles: ['STUDENT', 'TEACHER']
  },
  {
    path: "/tasks",
    element: <Tasks />,
    allowedRoles: ['STUDENT', 'TEACHER']
  },
  {
    path: "/report",
    element: <Report />,
    allowedRoles: ['PARENT']
  },
  {
    path: "/fees",
    element: <Fees />,
    allowedRoles: ['PARENT']
  }
];

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />

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
