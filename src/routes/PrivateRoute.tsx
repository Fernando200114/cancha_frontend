import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.rol !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
