import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./context/PrivateRoute";
import StudentDashboard from './dashboards/StudentDashboard'
import TeacherDashboard from './dashboards/StaffDashboard';
import OurCommitment from './pages/OurCommitment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy-policy" element={<OurCommitment />} />

          {/* Student-only routes */}
          <Route element={<PrivateRoute requiredGroup="student" />}>
            <Route path="/dashboard/student" element={<StudentDashboard />} />
          </Route>

          {/* Staff-only routes (teacher / teacher-admin / admin) */}
          <Route element={<PrivateRoute requiredGroup="staff" />}>
            <Route path="/dashboard/staff" element={<TeacherDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;