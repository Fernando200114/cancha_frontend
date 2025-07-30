// import { useState, useEffect } from "react"
// import axios from "axios"
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// interface Equipo {
//   id: string
//   nombre: string
//   escudo?: string
// }

// interface Partido {
//   id?: string
//   equipoLocalId: string
//   equipoVisitanteId: string
//   fecha: string
//   lugar: string
//   golesLocal: number
//   golesVisitante: number
// }

// const API_BASE_URL = "https://nestjs-cancha-backend-api.desarrollo-software.xyz"

// const ENDPOINTS = {
//   partidos: `${API_BASE_URL}/partidos`,
//   equipos: `${API_BASE_URL}/equipos`,
// }

// export default function PartidosPublic() {
//   const [partidos, setPartidos] = useState<Partido[]>([])
//   const [equipos, setEquipos] = useState<Equipo[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     loadPartidos()
//     loadEquipos()
//   }, [])

//   const loadPartidos = async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get(ENDPOINTS.partidos)
//       const partidosData: Partido[] = res.data.map((p: any) => ({
//         id: p._id || p.id,
//         equipoLocalId: p.equipoLocalId,
//         equipoVisitanteId: p.equipoVisitanteId,
//         fecha: p.fecha,
//         lugar: p.lugar,
//         golesLocal: p.golesLocal,
//         golesVisitante: p.golesVisitante,
//       }))
//       setPartidos(partidosData)
//     } catch (err) {
//       console.error(err)
//       setError("Error al cargar partidos")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadEquipos = async () => {
//     try {
//       const res = await axios.get(ENDPOINTS.equipos)
//       const equiposTransformados = res.data.map((e: any) => ({
//         id: e._id || e.id,
//         nombre: e.nombre,
//         escudo: e.escudo || "",
//       }))
//       setEquipos(equiposTransformados)
//     } catch (err) {
//       console.error("Error cargando equipos", err)
//     }
//   }

//   const getEquipoNombre = (id: string) => {
//     const equipo = equipos.find((e) => e.id === id)
//     return equipo ? equipo.nombre : "Equipo no encontrado"
//   }

//   const formatFecha = (fecha: string) =>
//     new Date(fecha).toLocaleString("es-ES", {
//       dateStyle: "short",
//       timeStyle: "short",
//     })

//   return (
//     <div className="container-fluid py-4">
//       <div className="row mb-4">
//         <div className="col">
//           <h1 className="display-4 text-primary">
//             <i className="bi bi-trophy me-3"></i>
//             Partidos Públicos
//           </h1>
//           <p className="lead text-muted">Consulta los partidos registrados</p>
//         </div>
//       </div>

//       {error && (
//         <div className="alert alert-danger alert-dismissible fade show">
//           {error}
//           <button type="button" className="btn-close" onClick={() => setError("")}></button>
//         </div>
//       )}

//       {loading && (
//         <div className="text-center py-4">
//           <div className="spinner-border text-primary"></div>
//         </div>
//       )}

//       <div className="row">
//         {partidos.length === 0 && !loading ? (
//           <div className="col-12">
//             <div className="alert alert-info text-center">
//               <h4>No hay partidos registrados</h4>
//               <p>Aún no se han cargado partidos</p>
//             </div>
//           </div>
//         ) : (
//           partidos.map((partido) => (
//             <div className="col-lg-6 col-xl-4 mb-4" key={partido.id}>
//               <div className="card h-100 shadow-sm">
//                 <div className="card-header bg-primary text-white d-flex justify-content-between">
//                   <small>{formatFecha(partido.fecha)}</small>
//                 </div>
//                 <div className="card-body text-center">
//                   <div className="row mb-3">
//                     <div className="col-5">
//                       <h6>{getEquipoNombre(partido.equipoLocalId)}</h6>
//                       <span className="badge bg-primary fs-4">{partido.golesLocal}</span>
//                     </div>
//                     <div className="col-2 d-flex align-items-center justify-content-center">
//                       <span className="text-muted">VS</span>
//                     </div>
//                     <div className="col-5">
//                       <h6>{getEquipoNombre(partido.equipoVisitanteId)}</h6>
//                       <span className="badge bg-secondary fs-4">{partido.golesVisitante}</span>
//                     </div>
//                   </div>
//                   <small className="text-muted">
//                     <i className="bi bi-geo-alt me-1"></i>
//                     {partido.lugar}
//                   </small>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }




import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Plus, Edit, Trash, Filter, Calendar, Trophy, Clock, CheckCircle } from "lucide-react"

// ==================== INTERFACES TYPESCRIPT ====================
interface Equipo {
  _id: string
  nombre: string
  escudo?: string
}

interface Partido {
  _id: string
  equipoLocalId: string
  equipoVisitanteId: string
  fecha: string
  hora: string
  lugar: string
  golesLocal?: number
  golesVisitante?: number
  estado: "programado" | "jugado" | "cancelado"
  liga: string
  arbitro?: string
}

interface FiltrosPartido {
  fecha: string
  fechaInicio: string
  fechaFin: string
  estado: string
  liga: string
  busqueda: string
  tipoFiltro: "todos" | "por-jugar" | "jugados"
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ==================== CONFIGURACIÓN AXIOS ====================
const API_BASE_URL = "https://nestjs-cancha-backend-api.desarrollo-software.xyz/"
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en API:", error)
    return Promise.reject(error)
  },
)

// ==================== COMPONENTE PRINCIPAL ====================
const Partidospublic: React.FC = () => {
  // Estados
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [partidosFiltrados, setPartidosFiltrados] = useState<Partido[]>([])
  const [showModal, setShowModal] = useState(false)
  const [partidoEditando, setPartidoEditando] = useState<Partido | null>(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ show: boolean; message: string; variant: string }>({
    show: false,
    message: "",
    variant: "success",
  })

  // Formulario: corregido para usar "lugar" en vez de "estadio"
  const [formData, setFormData] = useState<Omit<Partido, "_id">>({
    equipoLocalId: "",
    equipoVisitanteId: "",
    fecha: "",
    hora: "",
    lugar: "",
    golesLocal: undefined,
    golesVisitante: undefined,
    estado: "programado",
    liga: "",
    arbitro: "",
  })

  // Estados filtros
  const [filtros, setFiltros] = useState<FiltrosPartido>({
    fecha: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "",
    liga: "",
    busqueda: "",
    tipoFiltro: "todos",
  })

  // API con axios - corregido para manejar _id de MongoDB
  const api = {
    obtenerEquipos: async (): Promise<ApiResponse<Equipo[]>> => {
      setLoading(true)
      try {
        const response = await apiClient.get("/equipos")
        // Mantenemos la estructura original con _id
        const equiposData = response.data.data || response.data || []
        setEquipos(equiposData)
        return { success: true, data: equiposData }
      } catch (error) {
        return {
          success: false,
          error: axios.isAxiosError(error) ? error.message : "Error al obtener equipos",
        }
      } finally {
        setLoading(false)
      }
    },

    obtenerPartidos: async (): Promise<ApiResponse<Partido[]>> => {
      setLoading(true)
      try {
        const response = await apiClient.get("/partidos")
        const partidosData = response.data.data || response.data || []
        setPartidos(partidosData)
        return { success: true, data: partidosData }
      } catch (error) {
        return {
          success: false,
          error: axios.isAxiosError(error) ? error.message : "Error al obtener partidos",
        }
      } finally {
        setLoading(false)
      }
    },

    crearPartido: async (partido: Omit<Partido, "_id">): Promise<ApiResponse<Partido>> => {
      setLoading(true)
      try {
        const response = await apiClient.post("/partidos", partido)
        const nuevoPartido = response.data
        setPartidos((prev) => [...prev, nuevoPartido])
        return { success: true, data: nuevoPartido, message: "Partido creado correctamente" }
      } catch (error) {
        return {
          success: false,
          error: axios.isAxiosError(error) ? error.message : "Error al crear partido",
        }
      } finally {
        setLoading(false)
      }
    },

    actualizarPartido: async (id: string, partido: Omit<Partido, "_id">): Promise<ApiResponse<Partido>> => {
      setLoading(true)
      try {
        const response = await apiClient.put(`/partidos/${id}`, partido)
        const partidoActualizado = response.data
        setPartidos((prev) => prev.map((p) => (p._id === id ? partidoActualizado : p)))
        return {
          success: true,
          data: partidoActualizado,
          message: "Partido actualizado correctamente",
        }
      } catch (error) {
        return {
          success: false,
          error: axios.isAxiosError(error) ? error.message : "Error al actualizar partido",
        }
      } finally {
        setLoading(false)
      }
    },

    eliminarPartido: async (id: string): Promise<ApiResponse<void>> => {
      setLoading(true)
      try {
        await apiClient.delete(`/partidos/${id}`)
        setPartidos((prev) => prev.filter((p) => p._id !== id))
        return { success: true, message: "Partido eliminado correctamente" }
      } catch (error) {
        return {
          success: false,
          error: axios.isAxiosError(error) ? error.message : "Error al eliminar partido",
        }
      } finally {
        setLoading(false)
      }
    },
  }

  // Efectos
  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [partidos, filtros])

  // Funciones
  const cargarDatos = async () => {
    await api.obtenerEquipos()
    await api.obtenerPartidos()
  }

  const aplicarFiltros = () => {
    let filtrados = [...partidos]

    switch (filtros.tipoFiltro) {
      case "por-jugar":
        filtrados = filtrados.filter((p) => p.estado === "programado")
        break
      case "jugados":
        filtrados = filtrados.filter((p) => p.estado === "jugado")
        break
    }

    if (filtros.fecha) {
      filtrados = filtrados.filter((p) => p.fecha === filtros.fecha)
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      filtrados = filtrados.filter((p) => {
        const fPartido = new Date(p.fecha)
        const fInicio = new Date(filtros.fechaInicio)
        const fFin = new Date(filtros.fechaFin)
        return fPartido >= fInicio && fPartido <= fFin
      })
    }

    if (filtros.estado) {
      filtrados = filtrados.filter((p) => p.estado === filtros.estado)
    }

    if (filtros.liga) {
      filtrados = filtrados.filter((p) => p.liga.toLowerCase().includes(filtros.liga.toLowerCase()))
    }

    if (filtros.busqueda) {
      const busq = filtros.busqueda.toLowerCase()
      filtrados = filtrados.filter((p) => {
        const equipoLocal = equipos.find((e) => e._id === p.equipoLocalId)?.nombre.toLowerCase() ?? ""
        const equipoVisitante = equipos.find((e) => e._id === p.equipoVisitanteId)?.nombre.toLowerCase() ?? ""
        return (
          equipoLocal.includes(busq) ||
          equipoVisitante.includes(busq) ||
          p.lugar.toLowerCase().includes(busq) ||
          p.liga.toLowerCase().includes(busq) ||
          (p.arbitro && p.arbitro.toLowerCase().includes(busq))
        )
      })
    }

    setPartidosFiltrados(filtrados)
  }

  const abrirModal = (partido?: Partido) => {
    if (partido) {
      setPartidoEditando(partido)
      setFormData({
        equipoLocalId: partido.equipoLocalId,
        equipoVisitanteId: partido.equipoVisitanteId,
        fecha: partido.fecha,
        hora: partido.hora,
        lugar: partido.lugar,
        golesLocal: partido.golesLocal,
        golesVisitante: partido.golesVisitante,
        estado: partido.estado,
        liga: partido.liga,
        arbitro: partido.arbitro || "",
      })
    } else {
      setPartidoEditando(null)
      setFormData({
        equipoLocalId: "",
        equipoVisitanteId: "",
        fecha: "",
        hora: "",
        lugar: "",
        golesLocal: undefined,
        golesVisitante: undefined,
        estado: "programado",
        liga: "",
        arbitro: "",
      })
    }
    setShowModal(true)
  }

  const cerrarModal = () => {
    setShowModal(false)
    setPartidoEditando(null)
  }

  const guardarPartido = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let response: ApiResponse<Partido>
      if (partidoEditando) {
        response = await api.actualizarPartido(partidoEditando._id, formData)
      } else {
        response = await api.crearPartido(formData)
      }

      if (response.success) {
        mostrarAlert(response.message || "Operación exitosa", "success")
        cerrarModal()
      } else {
        mostrarAlert(response.error || "Error en la operación", "danger")
      }
    } catch (error) {
      mostrarAlert("Error inesperado", "danger")
    }
  }

  const eliminarPartido = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este partido?")) {
      try {
        const response = await api.eliminarPartido(id)
        if (response.success) {
          mostrarAlert(response.message || "Partido eliminado", "success")
        } else {
          mostrarAlert(response.error || "Error al eliminar", "danger")
        }
      } catch (error) {
        mostrarAlert("Error inesperado al eliminar", "danger")
      }
    }
  }

  const mostrarAlert = (message: string, variant: string) => {
    setAlert({ show: true, message, variant })
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" })
    }, 4000)
  }

  const obtenerBadgeEstado = (estado: string) => {
    switch (estado) {
      case "programado":
        return (
          <span className="badge bg-primary">
            <Clock size={12} className="me-1" />
            Programado
          </span>
        )
      case "jugado":
        return (
          <span className="badge bg-success">
            <CheckCircle size={12} className="me-1" />
            Jugado
          </span>
        )
      case "cancelado":
        return (
          <span className="badge bg-danger">
            <Trash size={12} className="me-1" />
            Cancelado
          </span>
        )
      default:
        return <span className="badge bg-secondary">{estado}</span>
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const obtenerEstadisticas = () => {
    const total = partidos.length
    const jugados = partidos.filter((p) => p.estado === "jugado").length
    const programados = partidos.filter((p) => p.estado === "programado").length
    const cancelados = partidos.filter((p) => p.estado === "cancelado").length
    return { total, jugados, programados, cancelados }
  }

  const stats = obtenerEstadisticas()

  // Función para obtener nombre de equipo por _id (corregido)
  const obtenerNombreEquipo = (id: string) => {
    const equipo = equipos.find((e) => e._id === id)
    if (!equipo) {
      console.warn(`No se encontró equipo con id ${id}`)
      return "Desconocido"
    }
    return equipo.nombre
  }

  // ==================== RENDER ====================
  return (
    <div className="container-fluid py-4">
      {/* Alert */}
      {alert.show && (
        <div className={`alert alert-${alert.variant} alert-dismissible fade show mb-4`} role="alert">
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert({ show: false, message: "", variant: "success" })}
          ></button>
        </div>
      )}

      {/* Header con Estadísticas */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2 mb-3">
            <Trophy className="me-2" />
            Gestión de Partidos
          </h1>
          <div className="row">
            <div className="col-md-3">
              <div className="card text-center border-primary">
                <div className="card-body">
                  <h5 className="text-primary">{stats.total}</h5>
                  <small className="text-muted">Total Partidos</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-success">
                <div className="card-body">
                  <h5 className="text-success">{stats.jugados}</h5>
                  <small className="text-muted">Jugados</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-warning">
                <div className="card-body">
                  <h5 className="text-warning">{stats.programados}</h5>
                  <small className="text-muted">Programados</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-danger">
                <div className="card-body">
                  <h5 className="text-danger">{stats.cancelados}</h5>
                  <small className="text-muted">Cancelados</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-auto d-flex align-items-start">
          <button className="btn btn-primary btn-lg" onClick={() => abrirModal()}>
            <Plus size={20} className="me-2" />
            Nuevo Partido
          </button>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <Filter size={16} className="me-2" />
            Filtros Avanzados
          </h5>
        </div>
        <div className="card-body">
          {/* Filtros Rápidos */}
          <div className="row mb-3">
            <div className="col">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${filtros.tipoFiltro === "todos" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFiltros({ ...filtros, tipoFiltro: "todos" })}
                >
                  Todos los Partidos
                </button>
                <button
                  type="button"
                  className={`btn ${filtros.tipoFiltro === "por-jugar" ? "btn-warning" : "btn-outline-warning"}`}
                  onClick={() => setFiltros({ ...filtros, tipoFiltro: "por-jugar" })}
                >
                  <Clock size={16} className="me-1" />
                  Por Jugar
                </button>
                <button
                  type="button"
                  className={`btn ${filtros.tipoFiltro === "jugados" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => setFiltros({ ...filtros, tipoFiltro: "jugados" })}
                >
                  <CheckCircle size={16} className="me-1" />
                  Jugados
                </button>
              </div>
            </div>
          </div>

          {/* Filtros Detallados */}
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Búsqueda General</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Equipos, lugar, árbitro..."
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Fecha Específica</label>
                <input
                  type="date"
                  className="form-control"
                  value={filtros.fecha}
                  onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Desde</label>
                <input
                  type="date"
                  className="form-control"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Hasta</label>
                <input
                  type="date"
                  className="form-control"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Liga</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filtrar por liga"
                  value={filtros.liga}
                  onChange={(e) => setFiltros({ ...filtros, liga: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                setFiltros({
                  fecha: "",
                  fechaInicio: "",
                  fechaFin: "",
                  estado: "",
                  liga: "",
                  busqueda: "",
                  tipoFiltro: "todos",
                })
              }
            >
              Limpiar Filtros
            </button>
            <span className="badge bg-info d-flex align-items-center">
              {partidosFiltrados.length} partidos encontrados
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de Partidos */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <Calendar size={16} className="me-2" />
            Lista de Partidos ({partidosFiltrados.length})
          </h5>
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Acciones
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => window.print()}>
                  Imprimir Lista
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => window.alert("Función de exportar próximamente")}>
                  Exportar CSV
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando partidos...</span>
              </div>
              <p className="mt-2 text-muted">Cargando partidos...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Fecha & Hora</th>
                    <th>Partido</th>
                    <th>Lugar</th>
                    <th>Liga</th>
                    <th>Resultado</th>
                    <th>Estado</th>
                    <th>Árbitro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {partidosFiltrados.map((partido) => (
                    <tr key={partido._id}>
                      <td>
                        <span className="badge bg-dark text-white px-3 py-2">
                          {obtenerNombreEquipo(partido.equipoLocalId)} vs{" "}
                          {obtenerNombreEquipo(partido.equipoVisitanteId)}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{formatearFecha(partido.fecha)}</div>
                          <small className="text-muted">
                            <Clock size={12} className="me-1" />
                            {partido.hora}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong className="text-primary">{obtenerNombreEquipo(partido.equipoLocalId)}</strong>
                          <div className="text-center my-1">
                            <small className="text-muted">vs</small>
                          </div>
                          <strong className="text-danger">{obtenerNombreEquipo(partido.equipoVisitanteId)}</strong>
                        </div>
                      </td>
                      <td>{partido.lugar}</td>
                      <td>
                        <span className="badge bg-info">{partido.liga}</span>
                      </td>
                      <td>
                        {partido.estado === "jugado" &&
                        partido.golesLocal !== undefined &&
                        partido.golesVisitante !== undefined ? (
                          <div className="text-center">
                            <span className="fw-bold fs-5">
                              {partido.golesLocal} - {partido.golesVisitante}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>{obtenerBadgeEstado(partido.estado)}</td>
                      <td>
                        <small className="text-muted">{partido.arbitro || "-"}</small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => abrirModal(partido)}
                            title="Editar partido"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => eliminarPartido(partido._id)}
                            title="Eliminar partido"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {partidosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        <div>
                          <Search size={48} className="mb-3 opacity-50" />
                          <h5>No se encontraron partidos</h5>
                          <p>Intenta ajustar los filtros o crear un nuevo partido</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear/Editar Partido */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {partidoEditando ? (
                      <>
                        <Edit size={20} className="me-2" />
                        Editar Partido #{partidoEditando._id}
                      </>
                    ) : (
                      <>
                        <Plus size={20} className="me-2" />
                        Nuevo Partido
                      </>
                    )}
                  </h5>
                  <button type="button" className="btn-close" onClick={cerrarModal}></button>
                </div>
                <form onSubmit={guardarPartido}>
                  <div className="modal-body">
                    <div className="row">
                      {/* Información Básica */}
                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-header">
                            <h6 className="mb-0">Información del Partido</h6>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Equipo Local *</label>
                                  <select
                                    className="form-select"
                                    required
                                    value={formData.equipoLocalId}
                                    onChange={(e) => setFormData({ ...formData, equipoLocalId: e.target.value })}
                                  >
                                    <option value="">Seleccione equipo local</option>
                                    {equipos.map((equipo) => (
                                      <option key={equipo._id} value={equipo._id}>
                                        {equipo.nombre}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Equipo Visitante *</label>
                                  <select
                                    className="form-select"
                                    required
                                    value={formData.equipoVisitanteId}
                                    onChange={(e) => setFormData({ ...formData, equipoVisitanteId: e.target.value })}
                                  >
                                    <option value="">Seleccione equipo visitante</option>
                                    {equipos.map((equipo) => (
                                      <option key={equipo._id} value={equipo._id}>
                                        {equipo.nombre}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Fecha *</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    required
                                    value={formData.fecha}
                                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Hora *</label>
                                  <input
                                    type="time"
                                    className="form-control"
                                    required
                                    value={formData.hora}
                                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Lugar *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.lugar}
                                    onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                                    placeholder="Nombre del lugar"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Liga *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.liga}
                                    onChange={(e) => setFormData({ ...formData, liga: e.target.value })}
                                    placeholder="Nombre de la liga"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Estado y Resultado */}
                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-header">
                            <h6 className="mb-0">Estado y Resultado</h6>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">Estado del Partido</label>
                              <select
                                className="form-select"
                                value={formData.estado}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    estado: e.target.value as "programado" | "jugado" | "cancelado",
                                  })
                                }
                              >
                                <option value="programado">Programado</option>
                                <option value="jugado">Jugado</option>
                                <option value="cancelado">Cancelado</option>
                              </select>
                            </div>
                            {formData.estado === "jugado" && (
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Goles Equipo Local</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      min="0"
                                      max="20"
                                      value={formData.golesLocal || ""}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          golesLocal: e.target.value ? Number.parseInt(e.target.value) : undefined,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Goles Equipo Visitante</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      min="0"
                                      max="20"
                                      value={formData.golesVisitante || ""}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          golesVisitante: e.target.value ? Number.parseInt(e.target.value) : undefined,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="mb-3">
                              <label className="form-label">Árbitro</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.arbitro || ""}
                                onChange={(e) => setFormData({ ...formData, arbitro: e.target.value })}
                                placeholder="Nombre del árbitro principal"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {partidoEditando ? "Actualizando..." : "Creando..."}
                        </>
                      ) : partidoEditando ? (
                        <>
                          <Edit size={16} className="me-2" />
                          Actualizar Partido
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="me-2" />
                          Crear Partido
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Partidospublic
