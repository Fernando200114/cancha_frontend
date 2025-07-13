import React, { useState } from "react"
import { NavLink } from "react-router-dom"

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Jugadores", path: "/jugadores" },
    { name: "Equipos", path: "/equipos" },
    { name: "Tabla de Posiciones", path: "/tabla-posiciones" },
  ]

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info fixed-top shadow-lg" style={{ backdropFilter: "blur(10px)" }}>
      <div className="container">
        {/* Logo */}
        <NavLink to="/" className="navbar-brand fw-bold d-flex align-items-center" onClick={() => setIsMenuOpen(false)}>

          <div className="bg-white rounded-circle p-1 me-2 shadow" style={{ width: "48px", height: "48px" }}>
            <img
            src="imagenes/mono.png" alt="Logo" className="img-fluid rounded-circle" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="d-flex flex-column">
    <div className="fs-4 text-white">Campo Deportivo La Pelotita</div>
    <small className="text-light opacity-75">Tu pasión, nuestro compromiso</small>
  </div>
        </NavLink>

        {/* Botón hamburguesa (mobile) */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ boxShadow: "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item mx-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link fw-semibold position-relative overflow-hidden px-3 py-2 rounded ${
                      isActive ? "active bg-white bg-opacity-25 text-dark" : "text-white"
                    }`
                  }
                  style={{
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    if (!e.currentTarget.classList.contains("active")) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    if (!e.currentTarget.classList.contains("active")) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            {/* Botón Login */}
            <li className="nav-item ms-3">
              <NavLink
                to="/login"
                className="btn btn-outline-light btn-sm px-4 fw-semibold shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="bi bi-person-circle me-2"></i>
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
