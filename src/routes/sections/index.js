import {
  Navigate,
  useRoutes,
  Outlet,
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";
//
import { mainRoutes, HomePage } from "./main";
import { authRoutes } from "./auth";
import { authDemoRoutes } from "./auth-demo";
import { dashboardRoutes } from "./dashboard";
import { componentsRoutes } from "./components";
import AuthClassicLayout from "../../layouts/auth/classic";
import LoginPage from "../../pages/auth/jwt/login";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: (
        <AuthClassicLayout>
          <LoginPage />
        </AuthClassicLayout>
      ),
    },

    ...dashboardRoutes,
    ...authRoutes,
    ...authDemoRoutes,
    ...mainRoutes,
    ...componentsRoutes,
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
