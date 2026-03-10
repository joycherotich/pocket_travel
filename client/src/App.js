import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/organisms/Header";

import Home           from "./pages/Home";
import Login          from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";

import ClientsPage  from "./pages/shared/ClientsPage";
import BookingsPage from "./pages/shared/BookingsPage";
import ReportsPage  from "./pages/shared/ReportsPage";
import HotelPage    from "./pages/shared/HotelPage";

import AdminDashboard   from "./pages/Admin/AdminDashboard";
import DashboardAdmin   from "./pages/Admin/DashboardAdmin";
import ManagePackages   from "./pages/Admin/ManagePackages";
import Payments         from "./pages/Admin/Payments";
import Users            from "./pages/Admin/Users";
import Roles            from "./pages/Admin/Roles";
import CommissionReport from "./pages/Admin/CommissionReport";
import ProfileCompany   from "./pages/Admin/ProfileCompany";
import Client           from "./pages/Admin/Client";
import Report           from "./pages/Admin/Report";

import StaffDashboard from "./pages/Staff/StaffDashboard";
import DashboardStaff from "./pages/Staff/DashboardStaff";

import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import Booking           from "./pages/Customer/Booking";
import Profile           from "./pages/Customer/Profile";
import Progress          from "./pages/Customer/Progress";

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

            <Route path="/"               element={<Home />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/changepassword" element={<ChangePassword />} />

            {/* ADMIN */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            >
              <Route index                   element={<DashboardAdmin />} />
              <Route path="dashboard"        element={<DashboardAdmin />} />
              <Route path="managepackages"   element={<ManagePackages />} />
              <Route path="payments"         element={<Payments />} />
              <Route path="users"            element={<Users />} />
              <Route path="roles"            element={<Roles />} />
              <Route path="commissionreport" element={<CommissionReport />} />
              <Route path="profilecompany"   element={<ProfileCompany />} />
              <Route path="client"           element={<Client />} />
              <Route path="report"           element={<Report />} />
              <Route path="clients"          element={<ClientsPage />} />
              <Route path="bookings"         element={<BookingsPage />} />
              <Route path="reports"          element={<ReportsPage />} />
              <Route path="hotel"            element={<HotelPage />} />
            </Route>

            {/* STAFF */}
            <Route
              path="/staff/*"
              element={
                <PrivateRoute allowedRole="staff">
                  <StaffDashboard />
                </PrivateRoute>
              }
            >
              <Route index              element={<DashboardStaff />} />
              <Route path="dashboard"   element={<DashboardStaff />} />
              <Route path="clients"     element={<ClientsPage />} />
              <Route path="bookings"    element={<BookingsPage />} />
              <Route path="reports"     element={<ReportsPage />} />
              <Route path="hotel"       element={<HotelPage />} />
            </Route>

            {/* CUSTOMER */}
            <Route
              path="/customer/*"
              element={
                <PrivateRoute allowedRole="customer">
                  <CustomerDashboard />
                </PrivateRoute>
              }
            >
              <Route path="booking"  element={<Booking />} />
              <Route path="progress" element={<Progress />} />
              <Route path="profile"  element={<Profile />} />
            </Route>

          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}