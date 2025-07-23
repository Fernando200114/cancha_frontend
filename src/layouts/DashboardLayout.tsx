import { useState, type JSX } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface MenuItemType {
  text: string;
  path: string;
}

const menuItems: MenuItemType[] = [
  { text: "Equipos", path: "/dashboard/equipos" },
  { text: "Jugadores", path: "/dashboard/jugadores" },
  { text: "Partido", path: "/dashboard/partidos" },
  { text: "Tabla posiciones", path: "/dashboard/tabla-Posiciones" },
];

export default function DashboardLayout(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

 

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-light border-end vh-100" style={{ width: 200 }}>
        <div className="p-3 border-bottom">
          <strong>Panel</strong>
        </div>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.text} className="nav-item">
              <button
                onClick={() => navigate(item.path)}
                className="nav-link text-dark text-start w-100"
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content area */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <nav className="navbar navbar-dark bg-info px-3">
          <div className="navbar-brand d-flex align-items-center gap-2 m-0">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/022/791/223/small/blog-site-blogger-png.png"
              alt="logo"
              width="32"
              height="32"
            />
            <span>BlogApp Admin</span>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-dark d-flex align-items-center gap-2"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img
                src="/imagenes/mono.png?height=50&width=50"
                alt="avatar"
                className="rounded-circle"
                width={32}
                height={32}
              />
              <span>{user?.username || "Usuario"}</span>
            </button>

            {showMenu && (
              <div
                className="dropdown-menu dropdown-menu-end show mt-2"
                style={{ position: "absolute", right: 16 }}
              >
                <button className="dropdown-item" onClick={handleLogout}>
                  Salir
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
