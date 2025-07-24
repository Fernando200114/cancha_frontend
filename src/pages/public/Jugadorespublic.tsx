
import { useState, useEffect } from "react"
import axios from "axios"

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

export default function JugadoresPublic() {
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPosition, setFilterPosition] = useState("all")
  const [filterGoles, setFilterGoles] = useState(0)
  const [teamsMap, setTeamsMap] = useState<Record<string, string>>({})

  useEffect(() => {
    axios.get(API_URL)
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
    axios.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos")
      .then((res) => {
        const map: Record<string, string> = {}
        res.data.forEach((e: any) => {
          map[e._id] = e.nombre
        })
        setTeamsMap(map)
      })
      .catch((err) => {
        console.error("Error cargando equipos:", err)
      })
  }, [])

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
                  <div className=" p-2 rounded text-center shadow-sm" style={{ minWidth: "90px", backgroundColor: "#f8d7da", color: "#721c24" }}>
                    <strong>Rojas</strong>
                    <div>{player.tarjetasRojas || 0}</div>
                  </div>
                </div>
                {/* Se eliminan los botones de editar y eliminar */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
