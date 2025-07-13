"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"

interface Equipo {
  id: number
  nombre: string
  ciudad: string
  fundacion: string
  estadio: string
  jugadores: Jugador[]
}

interface Jugador {
  id: number
  nombre: string
  posicion: string
  numero: number
  edad: number
  equipoId: number
}

interface Partido {
  id: number
  equipoLocalId: number
  equipoVisitanteId: number
  golesLocal: number
  golesVisitante: number
  fecha: string
  equipoLocal?: Equipo
  equipoVisitante?: Equipo
}

interface TablaEquipo {
  equipo: Equipo
  partidos: number
  ganados: number
  empatados: number
  perdidos: number
  golesFavor: number
  golesContra: number
  diferencia: number
  puntos: number
}

const Equipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [tablaposiciones, setTablaPosiciones] = useState<TablaEquipo[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Estados para formularios
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    ciudad: "",
    fundacion: "",
    estadio: "",
  })

  const [nuevoJugador, setNuevoJugador] = useState({
    nombre: "",
    posicion: "",
    numero: 0,
    edad: 0,
    equipoId: 0,
  })

  const [nuevoPartido, setNuevoPartido] = useState({
    equipoLocalId: 0,
    equipoVisitanteId: 0,
    golesLocal: 0,
    golesVisitante: 0,
    fecha: "",
  })

  const [activeTab, setActiveTab] = useState<string>("equipos")

  // API Base URL - Cambia por tu URL
  const API_BASE = "http://localhost:3000/api" // Ajusta según tu API

  // Cargar datos iniciales
  useEffect(() => {
    cargarEquipos()
    cargarPartidos()
  }, [])

  // Recalcular tabla cuando cambien partidos o equipos
  useEffect(() => {
    calcularTablaPosiciones()
  }, [equipos, partidos])

  // Funciones API
  const cargarEquipos = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/equipos`)
      if (response.ok) {
        const data = await response.json()
        setEquipos(data)
      }
    } catch (error) {
      console.error("Error cargando equipos:", error)
    } finally {
      setLoading(false)
    }
  }

  const cargarPartidos = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/partidos`)
      if (response.ok) {
        const data = await response.json()
        setPartidos(data)
      }
    } catch (error) {
      console.error("Error cargando partidos:", error)
    }
  }

  const agregarEquipo = async (): Promise<void> => {
    if (!nuevoEquipo.nombre.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/equipos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoEquipo),
      })

      if (response.ok) {
        const equipoCreado = await response.json()
        setEquipos((prev) => [...prev, { ...equipoCreado, jugadores: [] }])
        setNuevoEquipo({ nombre: "", ciudad: "", fundacion: "", estadio: "" })
      }
    } catch (error) {
      console.error("Error agregando equipo:", error)
    } finally {
      setLoading(false)
    }
  }

  const agregarJugador = async (): Promise<void> => {
    if (!nuevoJugador.nombre.trim() || nuevoJugador.equipoId === 0) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/jugadores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoJugador),
      })

      if (response.ok) {
        const jugadorCreado = await response.json()
        setEquipos((prev) =>
          prev.map((equipo) =>
            equipo.id === nuevoJugador.equipoId
              ? { ...equipo, jugadores: [...equipo.jugadores, jugadorCreado] }
              : equipo,
          ),
        )
        setNuevoJugador({ nombre: "", posicion: "", numero: 0, edad: 0, equipoId: 0 })
      }
    } catch (error) {
      console.error("Error agregando jugador:", error)
    } finally {
      setLoading(false)
    }
  }

  const agregarPartido = async (): Promise<void> => {
    if (nuevoPartido.equipoLocalId === 0 || nuevoPartido.equipoVisitanteId === 0) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/partidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoPartido),
      })

      if (response.ok) {
        const partidoCreado = await response.json()
        setPartidos((prev) => [...prev, partidoCreado])
        setNuevoPartido({ equipoLocalId: 0, equipoVisitanteId: 0, golesLocal: 0, golesVisitante: 0, fecha: "" })
      }
    } catch (error) {
      console.error("Error agregando partido:", error)
    } finally {
      setLoading(false)
    }
  }

  const calcularTablaPosiciones = (): void => {
    const tabla: TablaEquipo[] = equipos.map((equipo) => {
      const partidosEquipo = partidos.filter(
        (partido) => partido.equipoLocalId === equipo.id || partido.equipoVisitanteId === equipo.id,
      )

      let ganados = 0
      let empatados = 0
      let perdidos = 0
      let golesFavor = 0
      let golesContra = 0

      partidosEquipo.forEach((partido) => {
        if (partido.equipoLocalId === equipo.id) {
          golesFavor += partido.golesLocal
          golesContra += partido.golesVisitante
          if (partido.golesLocal > partido.golesVisitante) ganados++
          else if (partido.golesLocal === partido.golesVisitante) empatados++
          else perdidos++
        } else {
          golesFavor += partido.golesVisitante
          golesContra += partido.golesLocal
          if (partido.golesVisitante > partido.golesLocal) ganados++
          else if (partido.golesVisitante === partido.golesLocal) empatados++
          else perdidos++
        }
      })

      return {
        equipo,
        partidos: partidosEquipo.length,
        ganados,
        empatados,
        perdidos,
        golesFavor,
        golesContra,
        diferencia: golesFavor - golesContra,
        puntos: ganados * 3 + empatados,
      }
    })

    tabla.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos
      if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia
      return b.golesFavor - a.golesFavor
    })

    setTablaPosiciones(tabla)
  }

  const obtenerNombreEquipo = (id: number): string => {
    const equipo = equipos.find((e) => e.id === id)
    return equipo ? equipo.nombre : "Equipo no encontrado"
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4">⚽ Gestión de Equipos y Liga</h2>

          {/* Navegación por pestañas */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "equipos" ? "active" : ""}`}
                onClick={() => setActiveTab("equipos")}
              >
                🏆 Equipos
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "jugadores" ? "active" : ""}`}
                onClick={() => setActiveTab("jugadores")}
              >
                👤 Jugadores
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "partidos" ? "active" : ""}`}
                onClick={() => setActiveTab("partidos")}
              >
                ⚽ Partidos
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "tabla" ? "active" : ""}`}
                onClick={() => setActiveTab("tabla")}
              >
                📊 Tabla de Posiciones
              </button>
            </li>
          </ul>

          {/* Contenido de pestañas */}
          {activeTab === "equipos" && (
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">➕ Agregar Equipo</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre del Equipo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoEquipo.nombre}
                        onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
                        placeholder="Por favor ingrese el nombre de su equipo"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ciudad</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoEquipo.ciudad}
                        onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, ciudad: e.target.value })}
                        placeholder="De sector es su equipo?"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Año de Fundación</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoEquipo.fundacion}
                        onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, fundacion: e.target.value })}
                        placeholder="En que año se funod su equipo"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estadio</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoEquipo.estadio}
                        onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, estadio: e.target.value })}
                        placeholder="Complejo Deportivo la Pelotita"
                      />
                    </div>
                    <button className="btn btn-primary w-100" onClick={agregarEquipo} disabled={loading}>
                      {loading ? "Agregando..." : "Agregar Equipo"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">📋 Lista de Equipos ({equipos.length})</h5>
                  </div>
                  <div className="card-body">
                    {equipos.length === 0 ? (
                      <p className="text-muted text-center">No hay equipos registrados</p>
                    ) : (
                      <div className="row">
                        {equipos.map((equipo) => (
                          <div key={equipo.id} className="col-md-6 mb-3">
                            <div className="card border-left-primary">
                              <div className="card-body">
                                <h6 className="card-title">{equipo.nombre}</h6>
                                <p className="card-text small">
                                  📍 {equipo.ciudad} | 📅 {equipo.fundacion}
                                  <br />
                                  🏟️ {equipo.estadio}
                                  <br />👥 {equipo.jugadores?.length || 0} jugadores
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "jugadores" && (
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">👤 Agregar Jugador</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Equipo</label>
                      <select
                        className="form-select"
                        value={nuevoJugador.equipoId}
                        onChange={(e) =>
                          setNuevoJugador({ ...nuevoJugador, equipoId: Number.parseInt(e.target.value) })
                        }
                      >
                        <option value={0}>Seleccionar equipo</option>
                        {equipos.map((equipo) => (
                          <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoJugador.nombre}
                        onChange={(e) => setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })}
                        placeholder="Por favor  ingrese su nombre "
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Posición</label>
                      <select
                        className="form-select"
                        value={nuevoJugador.posicion}
                        onChange={(e) => setNuevoJugador({ ...nuevoJugador, posicion: e.target.value })}
                      >
                        <option value="">Seleccionar posición</option>
                        <option value="Portero">Portero</option>
                        <option value="Defensa">Defensa</option>
                        <option value="Mediocampista">Mediocampista</option>
                        <option value="Delantero">Delantero</option>
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className="form-label">Número</label>
                        <input
                          type="number"
                          className="form-control"
                          value={nuevoJugador.numero}
                          onChange={(e) =>
                            setNuevoJugador({ ...nuevoJugador, numero: Number.parseInt(e.target.value) })
                          }
                          min="1"
                          max="99"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Edad</label>
                        <input
                          type="number"
                          className="form-control"
                          value={nuevoJugador.edad}
                          onChange={(e) => setNuevoJugador({ ...nuevoJugador, edad: Number.parseInt(e.target.value) })}
                          min="16"
                          max="45"
                        />
                      </div>
                    </div>
                    <button className="btn btn-info w-100 mt-3" onClick={agregarJugador} disabled={loading}>
                      {loading ? "Agregando..." : "Agregar Jugador"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">👥 Jugadores por Equipo</h5>
                  </div>
                  <div className="card-body">
                    {equipos.map((equipo) => (
                      <div key={equipo.id} className="mb-4">
                        <h6 className="text-primary">{equipo.nombre}</h6>
                        {equipo.jugadores && equipo.jugadores.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Nombre</th>
                                  <th>Posición</th>
                                  <th>Edad</th>
                                </tr>
                              </thead>
                              <tbody>
                                {equipo.jugadores.map((jugador) => (
                                  <tr key={jugador.id}>
                                    <td>
                                      <span className="badge bg-secondary">{jugador.numero}</span>
                                    </td>
                                    <td>{jugador.nombre}</td>
                                    <td>{jugador.posicion}</td>
                                    <td>{jugador.edad}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-muted small">No hay jugadores registrados</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "partidos" && (
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">⚽ Registrar Partido</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Equipo Local</label>
                      <select
                        className="form-select"
                        value={nuevoPartido.equipoLocalId}
                        onChange={(e) =>
                          setNuevoPartido({ ...nuevoPartido, equipoLocalId: Number.parseInt(e.target.value) })
                        }
                      >
                        <option value={0}>Seleccionar equipo local</option>
                        {equipos.map((equipo) => (
                          <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Equipo Visitante</label>
                      <select
                        className="form-select"
                        value={nuevoPartido.equipoVisitanteId}
                        onChange={(e) =>
                          setNuevoPartido({ ...nuevoPartido, equipoVisitanteId: Number.parseInt(e.target.value) })
                        }
                      >
                        <option value={0}>Seleccionar equipo visitante</option>
                        {equipos
                          .filter((equipo) => equipo.id !== nuevoPartido.equipoLocalId)
                          .map((equipo) => (
                            <option key={equipo.id} value={equipo.id}>
                              {equipo.nombre}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className="form-label">Goles Local</label>
                        <input
                          type="number"
                          className="form-control"
                          value={nuevoPartido.golesLocal}
                          onChange={(e) =>
                            setNuevoPartido({ ...nuevoPartido, golesLocal: Number.parseInt(e.target.value) })
                          }
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Goles Visitante</label>
                        <input
                          type="number"
                          className="form-control"
                          value={nuevoPartido.golesVisitante}
                          onChange={(e) =>
                            setNuevoPartido({ ...nuevoPartido, golesVisitante: Number.parseInt(e.target.value) })
                          }
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        value={nuevoPartido.fecha}
                        onChange={(e) => setNuevoPartido({ ...nuevoPartido, fecha: e.target.value })}
                      />
                    </div>
                    <button className="btn btn-danger w-100" onClick={agregarPartido} disabled={loading}>
                      {loading ? "Registrando..." : "Registrar Partido"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">📅 Historial de Partidos ({partidos.length})</h5>
                  </div>
                  <div className="card-body">
                    {partidos.length === 0 ? (
                      <p className="text-muted text-center">No hay partidos registrados</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Local</th>
                              <th>Resultado</th>
                              <th>Visitante</th>
                            </tr>
                          </thead>
                          <tbody>
                            {partidos.map((partido) => (
                              <tr key={partido.id}>
                                <td>{new Date(partido.fecha).toLocaleDateString()}</td>
                                <td>{obtenerNombreEquipo(partido.equipoLocalId)}</td>
                                <td className="text-center">
                                  <span className="badge bg-primary">
                                    {partido.golesLocal} - {partido.golesVisitante}
                                  </span>
                                </td>
                                <td>{obtenerNombreEquipo(partido.equipoVisitanteId)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tabla" && (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">🏆 Tabla de Posiciones</h5>
                  </div>
                  <div className="card-body">
                    {tablaposiciones.length === 0 ? (
                      <p className="text-muted text-center">No hay datos para mostrar la tabla</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead className="table-dark">
                            <tr>
                              <th>Pos</th>
                              <th>Equipo</th>
                              <th>PJ</th>
                              <th>G</th>
                              <th>E</th>
                              <th>P</th>
                              <th>GF</th>
                              <th>GC</th>
                              <th>DG</th>
                              <th>Pts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tablaposiciones.map((fila, index) => (
                              <tr key={fila.equipo.id} className={index < 3 ? "table-success" : ""}>
                                <td>
                                  <strong>{index + 1}</strong>
                                </td>
                                <td>
                                  <strong>{fila.equipo.nombre}</strong>
                                  <br />
                                  <small className="text-muted">{fila.equipo.ciudad}</small>
                                </td>
                                <td>{fila.partidos}</td>
                                <td>{fila.ganados}</td>
                                <td>{fila.empatados}</td>
                                <td>{fila.perdidos}</td>
                                <td>{fila.golesFavor}</td>
                                <td>{fila.golesContra}</td>
                                <td
                                  className={
                                    fila.diferencia > 0 ? "text-success" : fila.diferencia < 0 ? "text-danger" : ""
                                  }
                                >
                                  {fila.diferencia > 0 ? "+" : ""}
                                  {fila.diferencia}
                                </td>
                                <td>
                                  <strong className="text-primary">{fila.puntos}</strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Equipos
