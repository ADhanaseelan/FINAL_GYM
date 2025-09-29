// Packages
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import Layout from "./Components/Shared/Layout";
import Login from "./Login/Login";
import NewUser from "./Components/pages/NewUser";
import Progress from "./Components/pages/progress";
import UserList from "./Components/pages/UserList";
import Report from "./Components/pages/Report";
import DashboardContent from "./Components/pages/Dashboard";
import MembershipDetails from "./Components/pages/MembershipDetails";
import UserOverview from "./Components/pages/UserOverview";
import ProgressTracking from "./Components/pages/Addprogress";

// CSS
import "react-toastify/dist/ReactToastify.css";

// Authentication
import { useAuthStore } from "./store/authStore";
import Membership from "./Components/pages/Membership";
import Settings from "./Components/pages/settings";

const ProtectedRoute: React.FC<{
  isAuth: boolean;
  children: React.ReactNode;
}> = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isLoggedIn, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuth={isLoggedIn}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="new-member" element={<NewUser />} />
          <Route path="member-list" element={<UserList />} />
          <Route path="progress/:id" element={<Progress />} />
          <Route path="report" element={<Report />} />
          <Route path="settings" element={<Settings />} />
          <Route path="membership-update/:id" element={<Membership />} />
          <Route path="user-overview/:id" element={<UserOverview />} />
          <Route
            path="membership-details/:id"
            element={<MembershipDetails />}
          />
          <Route path="Addprogress/:id" element={<ProgressTracking />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
