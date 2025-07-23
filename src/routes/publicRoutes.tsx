import { PublicLayout } from "../layouts/PublicLayout";
import type { RouteObject } from "react-router-dom";
import Login from "../pages/public/Login";
import Home from "../pages/public/Home";
;


import TablaPosiciones from "../pages/private/TablaPosiciones";
import JugadoresPublic from "../pages/public/Jugadorespublic";
import EquiposPublic from "../pages/public/Equipospublic";
import Partidospublic from "../pages/public/Partidospublic";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "equipos", element: <EquiposPublic/>},
    { path: "jugadores", element: <JugadoresPublic/> },
    { path: "partidos", element: <Partidospublic/>},
    { path: "tabla-posiciones", element: <TablaPosiciones/>}
  ],
};