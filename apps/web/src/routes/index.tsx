import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "../pages/admin";
import AdminLogin from "../pages/admin-login";
import Home from "../pages/home";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<AdminLogin />} path="/admin/login" />
      <Route element={<Admin />} path="/admin" />
      <Route element={<Admin />} path="/admin/*" />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
