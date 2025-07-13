"use client"

import type React from "react"
import { useState } from "react"

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      alert("¡Inicio de sesión exitoso!")
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden")
        return
      }
      alert("¡Registro exitoso!")
    }
    // Reset form
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-info text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h1>
              <p className="fs-5 mb-0">
                {isLogin
                  ? "Accede a tu cuenta para disfrutar de todos los beneficios de ser parte de Campo Verde FC"
                  : "Únete a la familia Campo Verde FC y accede a contenido exclusivo"}
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-circle p-4 d-inline-block">
                <i className="bi bi-person-circle" style={{ fontSize: "4rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login/Register Form */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  {/* Toggle Buttons */}
                  <div className="text-center mb-4">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn ${isLogin ? "btn-info" : "btn-outline-info"} px-4`}
                        onClick={() => setIsLogin(true)}
                      >
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </button>
                      <button
                        type="button"
                        className={`btn ${!isLogin ? "btn-info" : "btn-outline-info"} px-4`}
                        onClick={() => setIsLogin(false)}
                      >
                        <i className="bi bi-person-plus me-2"></i>
                        Registrarse
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Name field (only for register) */}
                      {!isLogin && (
                        <div className="col-12">
                          <label htmlFor="name" className="form-label fw-semibold">
                            <i className="bi bi-person me-2 text-info"></i>
                            Nombre Completo
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu nombre completo"
                            required={!isLogin}
                          />
                        </div>
                      )}

                      {/* Email field */}
                      <div className="col-12">
                        <label htmlFor="email" className="form-label fw-semibold">
                          <i className="bi bi-envelope me-2 text-info"></i>
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ejemplo@correo.com"
                          required
                        />
                      </div>

                      {/* Phone field (only for register) */}
                      {!isLogin && (
                        <div className="col-12">
                          <label htmlFor="phone" className="form-label fw-semibold">
                            <i className="bi bi-telephone me-2 text-info"></i>
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            className="form-control form-control-lg"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 234 567 8900"
                            required={!isLogin}
                          />
                        </div>
                      )}

                      {/* Password field */}
                      <div className="col-12">
                        <label htmlFor="password" className="form-label fw-semibold">
                          <i className="bi bi-lock me-2 text-info"></i>
                          Contraseña
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-lg"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu contraseña"
                            required
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password field (only for register) */}
                      {!isLogin && (
                        <div className="col-12">
                          <label htmlFor="confirmPassword" className="form-label fw-semibold">
                            <i className="bi bi-lock-fill me-2 text-info"></i>
                            Confirmar Contraseña
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirma tu contraseña"
                            required={!isLogin}
                          />
                        </div>
                      )}

                      {/* Remember me / Terms (conditional) */}
                      <div className="col-12">
                        {isLogin ? (
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember" />
                            <label className="form-check-label" htmlFor="remember">
                              Recordar mi sesión
                            </label>
                          </div>
                        ) : (
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="terms" required />
                            <label className="form-check-label" htmlFor="terms">
                              Acepto los{" "}
                              <a href="#" className="text-info text-decoration-none">
                                términos y condiciones
                              </a>{" "}
                              y la{" "}
                              <a href="#" className="text-info text-decoration-none">
                                política de privacidad
                              </a>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Submit button */}
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-info btn-lg w-100 fw-semibold"
                          style={{ transition: "all 0.3s ease" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(23, 162, 184, 0.3)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "none"
                          }}
                        >
                          <i className={`bi ${isLogin ? "bi-box-arrow-in-right" : "bi-person-plus"} me-2`}></i>
                          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                        </button>
                      </div>

                      {/* Forgot password link (only for login) */}
                      {isLogin && (
                        <div className="col-12 text-center">
                          <a href="#" className="text-info text-decoration-none">
                            ¿Olvidaste tu contraseña?
                          </a>
                        </div>
                      )}
                    </div>
                  </form>

                  {/* Social Login */}
                  <div className="text-center mt-4">
                    <p className="text-muted mb-3">O continúa con</p>
                    <div className="d-flex gap-3 justify-content-center">
                      {[
                        { name: "Google", icon: "bi-google", color: "#db4437" },
                        { name: "Facebook", icon: "bi-facebook", color: "#1877f2" },
                        { name: "Twitter", icon: "bi-twitter", color: "#1da1f2" },
                      ].map((social, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-outline-secondary rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = social.color
                            e.currentTarget.style.borderColor = social.color
                            e.currentTarget.style.color = "white"
                            e.currentTarget.style.transform = "scale(1.1)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                            e.currentTarget.style.borderColor = "#6c757d"
                            e.currentTarget.style.color = "#6c757d"
                            e.currentTarget.style.transform = "scale(1)"
                          }}
                        >
                          <i className={`bi ${social.icon}`}></i>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-4">Beneficios de ser Miembro</h2>
            <p className="fs-5 text-muted">Descubre todo lo que puedes obtener al unirte a Campo Verde FC</p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: "bi-ticket-perforated",
                title: "Descuentos Exclusivos",
                description: "Obtén descuentos especiales en entradas, merchandising y eventos del club",
                color: "success",
              },
              {
                icon: "bi-calendar-event",
                title: "Acceso Prioritario",
                description: "Reserva canchas y participa en eventos con prioridad sobre otros usuarios",
                color: "info",
              },
              {
                icon: "bi-trophy",
                title: "Torneos Exclusivos",
                description: "Participa en torneos y competencias exclusivas para miembros registrados",
                color: "warning",
              },
              {
                icon: "bi-newspaper",
                title: "Contenido Premium",
                description: "Accede a noticias, estadísticas y contenido exclusivo del club",
                color: "primary",
              },
            ].map((benefit, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div
                  className="card border-0 shadow-sm text-center h-100"
                  style={{
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className="card-body">
                    <div className={`text-${benefit.color} mb-3`}>
                      <i className={`bi ${benefit.icon}`} style={{ fontSize: "3rem" }}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{benefit.title}</h5>
                    <p className="text-muted">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
