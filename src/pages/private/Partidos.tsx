
import { useState, useEffect } from "react"
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

interface Equipo {
  id: string
  nombre: string
  escudo?: string
}

interface Partido {
  id?: string
  equipoLocalId: string
  equipoVisitanteId: string
  fecha: string
  lugar: string
  golesLocal: number
  golesVisitante: number
}

const API_BASE_URL = "https://nestjs-cancha-backend-api.desarrollo-software.xyz"

const ENDPOINTS = {
  partidos: `${API_BASE_URL}/partidos`,
  equipos: `${API_BASE_URL}/equipos`,
}

export default function PartidosApp() {
  const token = localStorage.getItem("token") || ""
  const isLoggedIn = !!token

  const axiosAuth = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const [partidos, setPartidos] = useState<Partido[]>([])
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingPartido, setEditingPartido] = useState<Partido | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<Partido>({
    equipoLocalId: "",
    equipoVisitanteId: "",
    fecha: "",
    lugar: "",
    golesLocal: 0,
    golesVisitante: 0,
  })

  useEffect(() => {
    loadPartidos()
    loadEquipos()
  }, [])

  const loadPartidos = async () => {
    try {
      setLoading(true)
      const res = await axiosAuth.get(ENDPOINTS.partidos)
      const partidosData: Partido[] = res.data.map((p: any) => ({
        id: p._id || p.id,
        equipoLocalId: p.equipoLocalId,
        equipoVisitanteId: p.equipoVisitanteId,
        fecha: p.fecha,
        lugar: p.lugar,
        golesLocal: p.golesLocal,
        golesVisitante: p.golesVisitante,
      }))
      setPartidos(partidosData)
    } catch (err) {
      console.error(err)
      setError("Error al cargar partidos")
    } finally {
      setLoading(false)
    }
  }

  const loadEquipos = async () => {
    try {
      const res = await axiosAuth.get(ENDPOINTS.equipos)
      const equiposTransformados = res.data.map((e: any) => ({
        id: e._id || e.id,
        nombre: e.nombre,
        escudo: e.escudo || "",
      }))
      setEquipos(equiposTransformados)
    } catch (err) {
      console.error("Error cargando equipos", err)
      setError("Error al cargar equipos")
    }
  }

  const savePartido = async () => {
    try {
      setLoading(true)
      if (!isLoggedIn) {
        setError("No autorizado. Por favor inicia sesión.")
        setLoading(false)
        return
      }

      // Preparo payload con fecha en formato ISO completo
      const payload = {
        equipoLocalId: formData.equipoLocalId,
        equipoVisitanteId: formData.equipoVisitanteId,
        fecha: new Date(formData.fecha).toISOString(),
        lugar: formData.lugar,
        golesLocal: formData.golesLocal,
        golesVisitante: formData.golesVisitante,
      }

      if (editingPartido?.id) {
        await axiosAuth.put(`/partidos/${editingPartido.id}`, payload)
      } else {
        await axiosAuth.post("/partidos", payload)
      }
      await loadPartidos()
      closeModal()
    } catch (err: any) {
      console.error("Error guardando partido", err)
      if (err.response && err.response.status === 401) {
        setError("No autorizado. Por favor inicia sesión.")
      } else {
        setError("Error al guardar partido")
      }
    } finally {
      setLoading(false)
    }
  }

  const deletePartido = async (id: string) => {
    if (!isLoggedIn) {
      setError("No autorizado. Por favor inicia sesión.")
      return
    }
    if (!confirm("¿Seguro que deseas eliminar este partido?")) return
    try {
      await axiosAuth.delete(`/partidos/${id}`)
      await loadPartidos()
    } catch (err: any) {
      console.error("Error eliminando partido", err)
      if (err.response && err.response.status === 401) {
        setError("No autorizado. Por favor inicia sesión.")
      } else {
        setError("Error al eliminar partido")
      }
    }
  }

  const openModal = (partido?: Partido) => {
    if (partido) {
      setEditingPartido(partido)
      setFormData({
        equipoLocalId: partido.equipoLocalId,
        equipoVisitanteId: partido.equipoVisitanteId,
        fecha: partido.fecha,
        lugar: partido.lugar,
        golesLocal: partido.golesLocal,
        golesVisitante: partido.golesVisitante,
      })
    } else {
      setEditingPartido(null)
      setFormData({
        equipoLocalId: "",
        equipoVisitanteId: "",
        fecha: "",
        lugar: "",
        golesLocal: 0,
        golesVisitante: 0,
      })
    }
    setShowModal(true)
    setError("")
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPartido(null)
    setError("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("goles") ? parseInt(value) || 0 : value,
    }))
  }

  const getEquipoNombre = (id: string) => {
    const equipo = equipos.find((e) => e.id === id)
    return equipo ? equipo.nombre : "Equipo no encontrado"
  }

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleString("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    })

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4 text-primary">
            <i className="bi bi-trophy me-3"></i>
            Gestión de Partidos
          </h1>
          <p className="lead text-muted">Administra los partidos de tu liga</p>
        </div>
        <div className="col-auto">
          {isLoggedIn && (
            <button className="btn btn-success btn-lg" onClick={() => openModal()}>
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Partido
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      <div className="row">
        {partidos.length === 0 && !loading ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <h4>No hay partidos registrados</h4>
              <p>Comienza creando tu primer partido</p>
            </div>
          </div>
        ) : (
          partidos.map((partido) => (
            <div className="col-lg-6 col-xl-4 mb-4" key={partido.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between">
                  <small>{formatFecha(partido.fecha)}</small>
                  {isLoggedIn && (
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-outline-light dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button className="dropdown-item" onClick={() => openModal(partido)}>
                            <i className="bi bi-pencil me-2"></i>Editar
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => deletePartido(partido.id!)}
                          >
                            <i className="bi bi-trash me-2"></i>Eliminar
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="card-body text-center">
                  <div className="row mb-3">
                    <div className="col-5">
                      <h6>{getEquipoNombre(partido.equipoLocalId)}</h6>
                      <span className="badge bg-primary fs-4">{partido.golesLocal}</span>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-center">
                      <span className="text-muted">VS</span>
                    </div>
                    <div className="col-5">
                      <h6>{getEquipoNombre(partido.equipoVisitanteId)}</h6>
                      <span className="badge bg-secondary fs-4">{partido.golesVisitante}</span>
                    </div>
                  </div>
                  <small className="text-muted">
                    <i className="bi bi-geo-alt me-1"></i>
                    {partido.lugar}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: "#00000088" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingPartido ? "Editar Partido" : "Nuevo Partido"}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Equipo Local</label>
                      <select
                        className="form-select"
                        name="equipoLocalId"
                        value={formData.equipoLocalId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar equipo...</option>
                        {equipos.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Equipo Visitante</label>
                      <select
                        className="form-select"
                        name="equipoVisitanteId"
                        value={formData.equipoVisitanteId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar equipo...</option>
                        {equipos.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha"
                        value={formData.fecha.slice(0, 16)}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Lugar</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lugar"
                        value={formData.lugar}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Goles Local</label>
                      <input
                        type="number"
                        className="form-control"
                        name="golesLocal"
                        value={formData.golesLocal}
                        onChange={handleInputChange}
                        min={0}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Goles Visitante</label>
                      <input
                        type="number"
                        className="form-control"
                        name="golesVisitante"
                        value={formData.golesVisitante}
                        onChange={handleInputChange}
                        min={0}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={savePartido} disabled={loading}>
                  {loading ? "Guardando..." : editingPartido ? "Actualizar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
