
import type { RouteObject } from "react-router-dom";
import PrivateRoute  from "./PrivateRoute";
import Equipos from "../pages/private/Equipos";
import Jugadores from "../pages/private/Jugadores";
import PartidosApp from "../pages/private/Partidos";
import TablaPosiciones from "../pages/private/TablaPosiciones";
import DashboardLayout from "../layouts/DashboardLayout";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { path: "equipos", element: <Equipos /> },
    { path: "jugadores", element: <Jugadores /> },
    { path: "partidos", element: <PartidosApp /> },
    { path: "tabla-posiciones", element: <TablaPosiciones /> },
  ],
};