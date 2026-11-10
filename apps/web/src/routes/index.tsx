import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Admin from "../pages/admin";
import AdminLogin from "../pages/admin-login";
import Home from "../pages/home";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<AdminLogin />} path="/admin/login" />
      <Route element={<Navigate replace to="/admin/cms" />} path="/admin" />
      <Route element={<Admin />} path="/admin/cms" />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
