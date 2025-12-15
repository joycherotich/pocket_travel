import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/organisms/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import Booking from "./pages/Customer/Booking";
import Profile from "./pages/Customer/Profile";
import Progress from "./pages/Customer/Progress";
import Bookings from "./pages/Staff/Bookings";
import Clients from "./pages/Staff/Clients";
import DashboardHome from "./pages/Staff/DashboardHome";
import Reports from "./pages/Staff/Reports";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import ManagePackages from "./pages/Admin/ManagePackages";
import Client from "./pages/Admin/Client";
import Payments from "./pages/Admin/Payments";
import Report from "./pages/Admin/Report";
import Users from "./pages/Admin/Users";
import ProfileCompany from "./pages/Admin/ProfileCompany";
import CommissionReport from "./pages/Admin/CommissionReport";
import Hotel from "./pages/Staff/Hotel";
import Roles from "./pages/Admin/Roles";

function PrivateRoute({ allowedRole, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            {/* === Public === */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* === Admin === */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            >
              {/* <Route index element={<DashboardAdmin />} /> */}
              <Route index element={<DashboardAdmin />} />

              <Route path="dashboardadmin" element={<DashboardAdmin />} />
              <Route path="managepackages" element={<ManagePackages />} />
              <Route path="client" element={<Client />} />
              <Route path="payments" element={<Payments />} />
              <Route path="report" element={<Report />} />
              <Route path="users" element={<Users />} />
              <Route path="commissionreport" element={<CommissionReport />} />
              <Route path="roles" element={<Roles />} />


              <Route path="profilecompany" element={<ProfileCompany />} />




              </Route>

            {/* === Staff === */}
            <Route
              path="/staff/*"
              element={
                <PrivateRoute allowedRole="staff">
                  <StaffDashboard />
                </PrivateRoute>
              }
            >
              <Route path="bookings" element={<Bookings />} />
              <Route index element={<DashboardHome />} />
              <Route path="clients" element={<Clients />} />
              <Route path="reports" element={<Reports />} />
              <Route path="hotel" element={<Hotel />} />


            </Route>

            {/* === Customer === */}
            <Route
              path="/customer/*"
              element={
                <PrivateRoute allowedRole="customer">
                  <CustomerDashboard />
                </PrivateRoute>
              }
            >
              <Route path="booking" element={<Booking />} />
              <Route path="progress" element={<Progress />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}
