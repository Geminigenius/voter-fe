import { Routes, Route, Outlet } from "react-router-dom";
import { RegisterPage } from "./voter/pages/registration/registration.page";
import { LoginPage } from "./voter/pages/login/login.page";
import { DashboardPage } from "./voter/pages/dashboard/dashboard.page";
import { AdminLoginPage } from "admin/pages/login/login.page";
import { AdminDashboard } from "admin/pages/dashboard/dashboard.component";
import { ResultsPage } from "shared/pages/results/results.page";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Outlet />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="/" element={<Outlet />}>
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
export default App;
