import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import axios from "axios"
import { Pencil } from "react-bootstrap-icons"
import { Trash } from "lucide-react"

// Obtener token y estado autenticación
const token = localStorage.getItem("token") || ""
const isAuthenticated = !!token

const axiosAuth = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

interface Player {
  id: string
  name: string
  position: string
  age: number
  nationality: string
  team: string
  stats: {
    goals: number
    assists: number
    matches: number
  }
  description: string
  tarjetasAmarillas?: number
  tarjetasRojas?: number
}

const positions = ["Portero", "Defensa", "Centrocampista", "Delantero"]
const API_URL = "https://nestjs-cancha-backend-api.desarrollo-software.xyz/jugadores"

export default function Jugadores() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPosition, setFilterPosition] = useState("all")
  const [filterGoles, setFilterGoles] = useState(0)
  const [teamsMap, setTeamsMap] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    team: "",
    goals: "0",
    tarjetasAmarillas: "0",
    tarjetasRojas: "0",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      team: "",
      goals: "0",
      tarjetasAmarillas: "0",
      tarjetasRojas: "0",
    })
  }

  useEffect(() => {
    axiosAuth.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/jugadores")
      .then((res) => {
        const jugadores: Player[] = res.data.map((p: any) => ({
          id: p._id,
          name: p.nombre,
          position: p.posicion,
          age: p.edad || 0,
          nationality: "",
          team: p.equipoId,
          stats: {
            goals: p.goles || 0,
            assists: 0,
            matches: 0,
          },
          description: "",
          tarjetasAmarillas: p.tarjetasAmarillas || 0,
          tarjetasRojas: p.tarjetasRojas || 0,
        }))
        setPlayers(jugadores)
      })
      .catch((err) => {
        console.error("Error cargando jugadores:", err)
      })
  }, [])

  useEffect(() => {
  axiosAuth.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos")
    .then((res) => {
      const map: Record<string, string> = {}
      res.data.forEach((e: any) => {
        map[e._id] = e.nombre
      })
      setTeamsMap(map)
    })
    .catch((err) => {
      if (axios.isAxiosError(err)) {
        console.error("Error cargando equipos:", err.response?.status, err.response?.data)
      } else {
        console.error("Error cargando equipos:", err)
      }
    })
}, [])
  const handleOpenModalForAdd = () => {
    resetForm()
    setEditingPlayer(null)
    setIsModalOpen(true)
  }

  const handleOpenModalForEdit = (player: Player) => {
    setEditingPlayer(player)
    setFormData({
      name: player.name,
      position: player.position,
      team: player.team,
      goals: player.stats.goals.toString(),
      tarjetasAmarillas: (player.tarjetasAmarillas || 0).toString(),
      tarjetasRojas: (player.tarjetasRojas || 0).toString(),
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Eliminar jugador?")) {
      axiosAuth.delete(`${API_URL}/${id}`)
        .then(() => {
          setPlayers(players.filter((p) => p.id !== id))
          alert("Jugador eliminado")
        })
        .catch((err) => {
          console.error("Error eliminando jugador:", err)
          alert("No tienes permisos o el token expiró")
        })
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const data = {
      nombre: formData.name,
      posicion: formData.position,
      equipoId: formData.team,
      goles: Number(formData.goals),
      tarjetasAmarillas: Number(formData.tarjetasAmarillas),
      tarjetasRojas: Number(formData.tarjetasRojas),
    }

    if (editingPlayer) {
      axiosAuth.put(`${API_URL}/${editingPlayer.id}`, data)
        .then(() => {
          setPlayers(players.map((p) =>
            p.id === editingPlayer.id
              ? {
                  ...p,
                  name: data.nombre,
                  position: data.posicion,
                  team: data.equipoId,
                  stats: {
                    ...p.stats,
                    goals: data.goles,
                  },
                  tarjetasAmarillas: data.tarjetasAmarillas,
                  tarjetasRojas: data.tarjetasRojas,
                }
              : p
          ))
          alert("Jugador actualizado")
          setIsModalOpen(false)
          resetForm()
        })
        .catch((err) => {
          console.error("Error actualizando jugador:", err)
          alert("Error actualizando jugador o sin permisos")
        })
    } else {
      axiosAuth.post(API_URL, data)
        .then((res) => {
          const nuevo: Player = {
            id: res.data._id,
            name: res.data.nombre,
            position: res.data.posicion,
            age: 0,
            nationality: "",
            team: res.data.equipoId,
            stats: {
              goals: res.data.goles,
              assists: 0,
              matches: 0,
            },
            description: "",
            tarjetasAmarillas: res.data.tarjetasAmarillas || 0,
            tarjetasRojas: res.data.tarjetasRojas || 0,
          }
          setPlayers([...players, nuevo])
          alert("Jugador agregado")
          setIsModalOpen(false)
          resetForm()
        })
        .catch((err) => {
          console.error("Error agregando jugador:", err)
          alert("Error agregando jugador o sin permisos")
        })
    }
  }

  const filteredPlayers = players.filter((player) => {
    const matchSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teamsMap[player.team] || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchPosition = filterPosition === "all" || player.position === filterPosition
    const matchGoals = player.stats.goals >= filterGoles
    return matchSearch && matchPosition && matchGoals
  })

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Jugadores</h2>
        {isAuthenticated && (
          <button className="btn btn-success" onClick={handleOpenModalForAdd}>
            ➕ Agregar Jugador
          </button>
        )}
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar jugador"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="all">Todas las posiciones</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Goles mínimos"
            value={filterGoles}
            onChange={(e) => setFilterGoles(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="row">
        {filteredPlayers.map((player) => (
          <div className="col-md-4 mb-4" key={player.id}>
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title text-center">{player.name}</h5>
                <div className="d-flex justify-content-between">
                  <p><strong>Posición:</strong> {player.position}</p>
                  <p><strong>Equipo:</strong> {teamsMap[player.team] || "Sin equipo"}</p>
                </div>

                <div className="d-flex justify-content-center gap-3 mb-3">
                  <div className=" p-2 rounded text-center shadow-sm" style={{ minWidth: "90px", backgroundColor: "#d4edda", color: "#155724" }}>
                    <strong>Goles</strong>
                    <div>{player.stats.goals}</div>
                  </div>
                  <div className=" p-2 rounded text-center shadow-sm" style={{ minWidth: "90px", backgroundColor: "#fff3cd", color: "#856404" }}>
                    <strong>Amarillas</strong>
                    <div>{player.tarjetasAmarillas || 0}</div>
                  </div>
                  <div className=" p-2 rounded text-center shadow-sm" style={{ minWidth: "90px" , backgroundColor: "#f8d7da", color: "#721c24"}}>
                    <strong>Rojas</strong>
                    <div>{player.tarjetasRojas || 0}</div>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleOpenModalForEdit(player)}
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(player.id)}
                    >
                      <Trash size={16} /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && isAuthenticated && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "#00000088" }}>
          <div className="modal-dialog">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">{editingPlayer ? "Editar" : "Agregar"} Jugador</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <select
                    className="form-select mb-2"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  >
                    <option value="">Seleccione posición</option>
                    {positions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select mb-2"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    required
                  >
                    <option value="">Seleccione equipo</option>
                    {Object.entries(teamsMap).map(([id, nombre]) => (
                      <option key={id} value={id}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Goles"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    min="0"
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Tarjetas Amarillas"
                    value={formData.tarjetasAmarillas}
                    onChange={(e) => setFormData({ ...formData, tarjetasAmarillas: e.target.value })}
                    min="0"
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Tarjetas Rojas"
                    value={formData.tarjetasRojas}
                    onChange={(e) => setFormData({ ...formData, tarjetasRojas: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPlayer ? "Actualizar" : "Agregar"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

