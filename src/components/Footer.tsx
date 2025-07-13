import type React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-0 mt-3">
      <div className="container">
        <div className="row g-10000">
          {/* Logo and Description */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-info rounded-circle p-2 me-3">
                <span className="fs-4">⚽</span>
              </div>
              <div>
                <h4 className="fw-bold mb-0">Campo Deportivo la Pelotita</h4>
                <small className="text-muted">Excellence in Football</small>
              </div>
            </div>
            <p className="text-muted mb-4">
              Más que un club, somos una familia que vive y respira fútbol. Únete a nosotros y descubre tu potencial.
            </p>
            <div className="d-flex gap-3">
              {[
                { icon: "bi-facebook", color: "#1877f2", name: "Facebook" },
                { icon: "bi-instagram", color: "#e4405f", name: "Instagram" },
                { icon: "bi-twitter", color: "#1da1f2", name: "Twitter" },
                { icon: "bi-youtube", color: "#ff0000", name: "YouTube" },
                { icon: "bi-tiktok", color: "#000000", name: "TikTok" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    transition: "all 0.3s ease",
                  }}
                  title={social.name}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color
                    e.currentTarget.style.borderColor = social.color
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.borderColor = "#6c757d"
                    e.currentTarget.style.transform = "translateY(0) scale(1)"
                  }}
                >
                  <i className={`bi ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-info">Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              {[
                { name: "Inicio", href: "/" },
                { name: "Jugadores", href: "/jugadores" },
                { name: "Equipos", href: "/equipos" },
                { name: "Tabla de Posiciones", href: "/tabla-posiciones" },
                { name: "Login", href: "/login" },
              ].map((link, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={link.href}
                    className="text-muted text-decoration-none"
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#17a2b8"
                      e.currentTarget.style.paddingLeft = "10px"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6c757d"
                      e.currentTarget.style.paddingLeft = "0"
                    }}
                  >
                    <i className="bi bi-chevron-right me-2"></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-info">Servicios</h5>
            <ul className="list-unstyled">
              {["Entrenamientos", "Torneos", "Alquiler de Cancha", "Escuela de Fútbol", "Eventos Corporativos"].map(
                (service, index) => (
                  <li key={index} className="mb-2">
                    <a
                      href="#"
                      className="text-muted text-decoration-none"
                      style={{ transition: "all 0.3s ease" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#17a2b8"
                        e.currentTarget.style.paddingLeft = "10px"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#6c757d"
                        e.currentTarget.style.paddingLeft = "0"
                      }}
                    >
                      <i className="bi bi-chevron-right me-2"></i>
                      {service}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Información de Contacto */}
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3 text-info">Información de Contacto</h5>
            <div className="mb-4">
              {[
                {
                  icon: "bi-geo-alt-fill",
                  text: "Via Pintag Barrio San Juan de la Tola",
                  color: "text-warning",
                },
                { icon: "bi-telephone-fill", text: "0988825960", color: "text-info" },
                { icon: "bi-envelope-fill", text: "lapelotita@outlok.com", color: "text-success" },
                { icon: "bi-clock-fill", text: "Lun - Dom: 6:00 AM - 10:00 PM", color: "text-primary" },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center mb-3 p-2 rounded"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"
                    e.currentTarget.style.transform = "translateX(5px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.transform = "translateX(0)"
                  }}
                >
                  <div className={`${contact.color} me-3 fs-5`}>
                    <i className={`bi ${contact.icon}`}></i>
                  </div>
                  <div>
                    <span className="text-light">{contact.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="bg-info bg-opacity-10 p-3 rounded-3">
              <h6 className="fw-bold mb-2 text-info">
                <i className="bi bi-envelope-heart me-2"></i>
                Newsletter
              </h6>
              <p className="text-muted mb-3 small">Recibe noticias y ofertas exclusivas</p>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Tu email" />
                <button className="btn btn-info" type="button">
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              <i className="bi bi-c-circle me-1"></i>
              2024 La Pelotita. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex flex-wrap justify-content-md-end gap-3 mt-2 mt-md-0">
              {[
                { name: "Política de Privacidad", icon: "bi-shield-check" },
                { name: "Términos de Servicio", icon: "bi-file-text" },
                { name: "Cookies", icon: "bi-cookie" },
              ].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-muted text-decoration-none small d-flex align-items-center"
                  style={{ transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#17a2b8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6c757d")}
                >
                  <i className={`bi ${link.icon} me-1`}></i>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
