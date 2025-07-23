import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes";
import type { JSX } from "react";
import { AuthProvider } from "./context/AuthContext";

export default function App(): JSX.Element {
  const routes = useRoutes(appRoutes);
   return <AuthProvider>
      {routes}
     </AuthProvider>;
}





















// import { useRoutes } from "react-router-dom";
// import { publicRoutes } from "./routes/publicRoutes";  // Importa tus rutas públicas
// import { privateRoutes } from "./routes/privateRoutes"; // Importa tus rutas privadas
// import type { JSX } from "react";
// import { AuthProvider } from "./context/AuthContext";

// export const appRoutes = [publicRoutes, privateRoutes];

// export default function App(): JSX.Element {
//   const routes = useRoutes(appRoutes);

//   return <AuthProvider>{routes}</AuthProvider>;
// }
