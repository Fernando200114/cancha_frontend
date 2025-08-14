import type React from "react"
import { useState, useEffect, useRef } from "react"

interface Slide {
  id: number
  image: string
  title: string
  description: string
  cta: string
}

interface InfoCard {
  id: number
  icon: string
  title: string
  description: string
  color: string
  delay: number
}

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [scrollY, setScrollY] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [] = useState({
    name: "",
    email: "",
    message: "",
  })

  const carouselRef = useRef<HTMLDivElement>(null)

  const slides: Slide[] = [
    {
      id: 1,
      image: "/imagenes/imagen4.jpg",
      title: "Bienvenidos a el Complejo Deportivo la Pelotita",
      description: "Donde los sueños futbolísticos se hacen realidad con pasión y dedicación",
      cta: "Únete Ahora",
    },
    {
      id: 2,
      image: "/imagenes/imagen3.jpg",
      title: "Entrenamientos de Elite",
      description: "Programas especializados con tecnología de vanguardia y entrenadores profesionales",
      cta: "Ver Programas",
    },
    {
      id: 3,
      image: "/imagenes/video.mp4",
      title: "Torneos Emocionantes",
      description: "Competencias que desafían tus límites y celebran el espíritu deportivo",
      cta: "Inscribirse",
    },
  ]

  const infoCards: InfoCard[] = [
    {
      id: 1,
      icon: "👥",
      title: "Entrenamientos Polifuncionales",
      description: "Ven y preparate de la manera mas divertida posible",
      color: "primary",
      delay: 0,
    },
    {
      id: 2,
      icon: "🏆",
      title: "Excelencia Deportiva",
      description: "6 campeonatos ganados en los últimos 4 años",
      color: "warning",
      delay: 200,
    },
    {
      id: 3,
      icon: "🛡",
      title: "Instalaciones",
      description: "Instalaciones muy comodas a tu servicio",
      color: "info",
      delay: 400,
    },
    {
      id: 4,
      icon: "🎯",
      title: "Formación Integral",
      description: "Desarrollo técnico, táctico y personal de cada jugador",
      color: "secondary",
      delay: 600,
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])


  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-info">
        <div className="text-center text-white">
          <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h3 className="fw-bold">Campo Deportivo la Pelotita</h3>
          <p>Cargando experiencia futbolística...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Carousel */}
      <section className="position-relative overflow-hidden" style={{ height: "100vh" }}>
        <div ref={carouselRef} className="position-relative h-100">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`position-absolute w-100 h-100 transition-all ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translateY(${scrollY * 0.5}px)`,
                transition: "opacity 1s ease-in-out",
              }}
            >
              {slide.image.endsWith(".mp4") ? (
                <video
                  src={slide.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}


              <div className="position-absolute w-100 h-100 bg-dark bg-opacity-50"></div>
              <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-4">
                <div className="container">
                  <h1
                    className="display-1 fw-bold mb-4"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      animation: index === currentSlide ? "fadeInUp 1s ease-out" : "none",
                    }}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className="fs-3 mb-5 text-light"
                    style={{
                      maxWidth: "800px",
                      margin: "0 auto",
                      animation: index === currentSlide ? "fadeInUp 1s ease-out 0.3s both" : "none",
                    }}
                  >
                    {slide.description}
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    {/* Botones comentados para futura funcionalidad */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-4 shadow-sm border-bottom">
        <div className="container">
          <div className="row text-center">
            {[
              { icon: "👥", number: "100", label: "Jugadores Activos" },
              { icon: "🏆", number: "2", label: "Torneos Anuales" },
              { icon: "⭐", number: "4", label: "Años de Experiencia" },
              { icon: "🏟", number: "1", label: "Campos Premium" },
            ].map((stat, index) => (
              <div key={index} className="col-6 col-md-3 mb-3 mb-md-0">
                <div
                  className="p-3 rounded-3 h-100 transition-all"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa"
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div className="fs-2 mb-2">{stat.icon}</div>
                  <div className="fs-2 fw-bold text-info">{stat.number}</div>
                  <div className="text-muted small">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-4">
              ¿Por qué elegir el <span className="text-info">Complejo Deportivo la Pelotita</span>?
            </h2>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Descubre la experiencia única que ofrecemos en cada entrenamiento y partido
            </p>
          </div>

          <div className="row g-4">
            {infoCards.map((card) => (
              <div key={card.id} className="col-lg-3 col-md-6">
                <div
                  className={`card h-100 border-0 shadow-sm bg-${card.color} bg-opacity-10 position-relative overflow-hidden`}
                  style={{
                    transition: "all 0.4s ease",
                    animationDelay: `${card.delay}ms`,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px) rotate(1deg)"
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) rotate(0deg)"
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className="card-body text-center p-4">
                    <div className="fs-1 mb-3">{card.icon}</div>
                    <h5 className={`card-title fw-bold text-${card.color} mb-3`}>{card.title}</h5>
                    <p className="card-text text-muted">{card.description}</p>
                  </div>
                  <div
                    className={`position-absolute bottom-0 start-0 w-100 bg-${card.color} opacity-75`}
                    style={{ height: "4px" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 bg-info text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-4 fw-bold mb-4">¡Únete a Nosotros!</h2>
              <p className="fs-5 mb-4">
                ¿Listo para formar parte de la familia Campo Deportivo la Pelotita? Contáctanos y comienza tu aventura futbolística.
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-telephone-fill fs-4 me-3"></i>
                    <div>
                      <div className="fw-semibold">Teléfono</div>
                      <div>0988825960</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-envelope-fill fs-4 me-3"></i>
                    <div>
                      <div className="fw-semibold">Email</div>
                      <div>fernandojosellullunacuichan@gmail.com</div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo-alt-fill fs-4 me-3"></i>
                    <div>
                      <div className="fw-semibold">Dirección</div>
                      <div>Via Pintag Barrio San Juan de la Tola</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-white rounded-4 p-4 shadow-lg">
                <form
                  action="https://formsubmit.co/fernandojosellullunacuichan@gmail.com"
                  method="POST"
                >
                  <h4 className="text-dark mb-4 fw-bold">Envíanos un Mensaje</h4>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Tu email"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="message"
                      className="form-control form-control-lg"
                      rows={4}
                      placeholder="Tu mensaje"
                      required
                    ></textarea>
                  </div>
                  <input type="hidden" name="_next" value="http://localhost:5173/" />
                  <input type="hidden" name="_captcha" value="false" />
                  <button
                    type="submit"
                    className="btn btn-info btn-lg w-100 fw-semibold"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <i className="bi bi-send me-2"></i>
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
