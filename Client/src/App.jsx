import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Loader from "./components/Loader/Loader";

// Lazy load components
const Dashboard = lazy(() => import("./pages/AdminDashboard/Dashboard"));
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
    allowedRoles: [
      "Admin",
      "Teacher",
      "Student",
      "Parent",
      "Accountant",
      "Librarian",
    ],
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
    allowedRoles: ["Teacher", "Student", "Parent", "Accountant", "Librarian"],
  },
  {
    path: "/finance",
    element: <Finance />,
    allowedRoles: ["Admin", "Accountant"],
  },
  {
    path: "/library",
    element: <Library />,
    allowedRoles: ["Admin", "Librarian", "Student", "Teacher"],
  },
  {
    path: "/message",
    element: <Message />,
    allowedRoles: ["Teacher", "Parent"],
  },
  {
    path: "/teachers",
    element: <Teachers />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/students",
    element: <Students />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/staffs",
    element: <Staffs />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/subjects",
    element: <Subjects />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/classes",
    element: <Classes />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/logistics",
    element: <Logistics />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/routine",
    element: <Routine />,
    allowedRoles: ["Student", "Teacher"],
  },
  {
    path: "/resources",
    element: <Resources />,
    allowedRoles: ["Student", "Teacher"],
  },
  {
    path: "/tasks",
    element: <Tasks />,
    allowedRoles: ["Student", "Teacher"],
  },
  {
    path: "/report",
    element: <Report />,
    allowedRoles: ["Parent"],
  },
  {
    path: "/fees",
    element: <Fees />,
    allowedRoles: ["Parent"],
  },
];

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LoginPage />} />

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
