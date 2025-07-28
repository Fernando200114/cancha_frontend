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

export default function PartidosPublic() {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPartidos()
    loadEquipos()
  }, [])

  const loadPartidos = async () => {
    try {
      setLoading(true)
      const res = await axios.get(ENDPOINTS.partidos)
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
      const res = await axios.get(ENDPOINTS.equipos)
      const equiposTransformados = res.data.map((e: any) => ({
        id: e._id || e.id,
        nombre: e.nombre,
        escudo: e.escudo || "",
      }))
      setEquipos(equiposTransformados)
    } catch (err) {
      console.error("Error cargando equipos", err)
    }
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
            Partidos Públicos
          </h1>
          <p className="lead text-muted">Consulta los partidos registrados</p>
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
              <p>Aún no se han cargado partidos</p>
            </div>
          </div>
        ) : (
          partidos.map((partido) => (
            <div className="col-lg-6 col-xl-4 mb-4" key={partido.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between">
                  <small>{formatFecha(partido.fecha)}</small>
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
    </div>
  )
}
