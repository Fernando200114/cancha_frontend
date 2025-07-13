import type React from "react"
import { useState } from "react"

// Interfaces
interface Player {
  id: string
  name: string
  position: string
  age: number
  nationality: string
  team: string
  image: string
  stats: {
    goals: number
    assists: number
    matches: number
    
  }
  description: string
  isFavorite: boolean
  marketValue: number
  contract: string
}

export default function JugadoresManagement() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Fernando Jose",
      position: "Delantero",
      age: 36,
      nationality: "Ecuatoriano",
      team: "Amazonas",
      image: "",
      stats: { goals: 15, assists: 12, matches: 25},
      description: "Destaaaca",
      isFavorite: true,
      marketValue: 50000000,
      contract: "2025-12-31",
    },
    {
      id: "2",
      name: "Stiven morales",
      position: "Delantero",
      age: 39,
      nationality: "Ecuatoriano",
      team: "Andes",
      image: "",
      stats: { goals: 22, assists: 8, matches: 28},
      description: "Malo con la pelota",
      isFavorite: false,
      marketValue: 25000000,
      contract: "2025-06-30",
    },
    {
      id: "3",
      name: "Robinson morocho",
      position: "Arquero",
      age: 25,
      nationality: "Ecuatoriano",
      team: "Racing",
      image: "",
      stats: { goals: 18, assists: 10, matches: 22 },
      description: "El manos Seguras",
      isFavorite: true,
      marketValue: 180000000,
      contract: "2029-06-30",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPosition, setFilterPosition] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    age: "",
    nationality: "",
    team: "",
    image: "",
    goals: "",
    assists: "",
    matches: "",
    rating: "",
    speed: "",
    strength: "",
    technique: "",
    description: "",
    marketValue: "",
    contract: "",
  })

  const positions = ["Portero", "Defensa", "Centrocampista", "Delantero"]
  const sortOptions = [
    { value: "name", label: "Nombre" },
    { value: "age", label: "Edad" },
    { value: "rating", label: "Valoración" },
    { value: "goals", label: "Goles" },
    { value: "marketValue", label: "Valor de mercado" },
  ]

  // Toast notification
  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setShowToast({ show: true, message, type })
    setTimeout(() => {
      setShowToast({ show: false, message: "", type: "success" })
    }, 3000)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      age: "",
      nationality: "",
      team: "",
      image: "",
      goals: "",
      assists: "",
      matches: "",
      rating: "",
      speed: "",
      strength: "",
      technique: "",
      description: "",
      marketValue: "",
      contract: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.position || !formData.age) {
      showNotification("Por favor completa los campos obligatorios", "error")
      return
    }

    const playerData: Player = {
      id: editingPlayer ? editingPlayer.id : Date.now().toString(),
      name: formData.name,
      position: formData.position,
      age: Number.parseInt(formData.age),
      nationality: formData.nationality,
      team: formData.team,
      image:
        formData.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      stats: {
        goals: Number.parseInt(formData.goals) || 0,
        assists: Number.parseInt(formData.assists) || 0,
        matches: Number.parseInt(formData.matches) || 0,
       
      },
      description: formData.description,
      isFavorite: editingPlayer?.isFavorite || false,
      marketValue: Number.parseInt(formData.marketValue) || 0,
      contract: formData.contract,
    }

    if (editingPlayer) {
      setPlayers(players.map((p) => (p.id === editingPlayer.id ? playerData : p)))
      showNotification(`¡Jugador ${playerData.name} actualizado! ⚽`)
    } else {
      setPlayers([...players, playerData])
      showNotification(`¡Nuevo jugador ${playerData.name} agregado! 🎉`)
    }

    resetForm()
    setEditingPlayer(null)
    setIsModalOpen(false)
  }

  const handleEdit = (player: Player) => {
    setEditingPlayer(player)
    setFormData({
      name: player.name,
      position: player.position,
      age: player.age.toString(),
      nationality: player.nationality,
      team: player.team,
      image: player.image,
      goals: player.stats.goals.toString(),
      assists: player.stats.assists.toString(),
      matches: player.stats.matches.toString(),
      rating: player.stats.rating.toString(),
      speed: player.stats.speed.toString(),
      strength: player.stats.strength.toString(),
      technique: player.stats.technique.toString(),
      description: player.description,
      marketValue: player.marketValue.toString(),
      contract: player.contract,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const player = players.find((p) => p.id === id)
    if (window.confirm(`¿Estás seguro de eliminar a ${player?.name}?`)) {
      setPlayers(players.filter((p) => p.id !== id))
      showNotification(`Jugador ${player?.name} eliminado 👋`)
    }
  }

  const toggleFavorite = (id: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)))
    const player = players.find((p) => p.id === id)
    showNotification(
      player?.isFavorite ? `${player?.name} eliminado de favoritos 💔` : `¡${player?.name} agregado a favoritos! ⭐`,
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleCompareSelection = (playerId: string) => {
    if (selectedForComparison.includes(playerId)) {
      setSelectedForComparison(selectedForComparison.filter((id) => id !== playerId))
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, playerId])
    } else {
      showNotification("Solo puedes comparar hasta 3 jugadores", "error")
    }
  }

  const shufflePlayers = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    setPlayers(shuffled)
    showNotification("¡Jugadores mezclados! 🎲")
  }

  const filteredAndSortedPlayers = players
    .filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterPosition === "all" || player.position === filterPosition
      const matchesFavorites = !showFavoritesOnly || player.isFavorite
      return matchesSearch && matchesFilter && matchesFavorites
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      switch (sortBy) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "age":
          aValue = a.age
          bValue = b.age
          break
        case "rating":
          aValue = a.stats.rating
          bValue = b.stats.rating
          break
        case "goals":
          aValue = a.stats.goals
          bValue = b.stats.goals
          break
        case "marketValue":
          aValue = a.marketValue
          bValue = b.marketValue
          break
        default:
          return 0
      }
      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
    })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 9) return "text-success"
    if (rating >= 8) return "text-primary"
    if (rating >= 7) return "text-warning"
    return "text-danger"
  }

  const getProgressBarColor = (value: number) => {
    if (value >= 90) return "bg-success"
    if (value >= 80) return "bg-primary"
    if (value >= 70) return "bg-warning"
    return "bg-danger"
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />

      <div
        className="container-fluid py-4"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh" }}
      >
        {/* Toast Notification */}
        {showToast.show && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
            <div
              className={`toast show align-items-center text-white bg-${showToast.type === "success" ? "success" : "danger"} border-0`}
            >
              <div className="d-flex">
                <div className="toast-body">{showToast.message}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setShowToast({ show: false, message: "", type: "success" })}
                ></button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h1
                      className="display-4 fw-bold mb-2"
                      style={{
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ⚽ Gestión de Jugadores
                    </h1>
                    <p className="text-muted"></p>
                  </div>
                  <button
                    className="btn btn-lg shadow-sm"
                    style={{
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      border: "none",
                      color: "white",
                    }}
                    onClick={() => {
                      resetForm()
                      setEditingPlayer(null)
                      setIsModalOpen(true)
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Fichar Jugador
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div
              className="card h-100 shadow border-0"
              style={{ background: "linear-gradient(45deg, #4facfe, #00f2fe)" }}
            >
              <div className="card-body text-center text-white">
                <i className="bi bi-people-fill display-4 mb-2"></i>
                <h2 className="fw-bold">{players.length}</h2>
                <p className="mb-0">Total Jugadores</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="card h-100 shadow border-0"
              style={{ background: "linear-gradient(45deg, #43e97b, #38f9d7)" }}
            >
              <div className="card-body text-center text-white">
                <i className="bi bi-star-fill display-4 mb-2"></i>
                <h2 className="fw-bold">{players.filter((p) => p.isFavorite).length}</h2>
                <p className="mb-0">Favoritos</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="card h-100 shadow border-0"
              style={{ background: "linear-gradient(45deg, #fa709a, #fee140)" }}
            >
              <div className="card-body text-center text-white">
                <i className="bi bi-trophy-fill display-4 mb-2"></i>
                <h2 className="fw-bold">{players.reduce((sum, p) => sum + p.stats.goals, 0)}</h2>
                <p className="mb-0">Total Goles</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="card h-100 shadow border-0"
              style={{ background: "linear-gradient(45deg, #a8edea, #fed6e3)" }}
            >
              <div className="card-body text-center text-dark">
                <i className="bi bi-award-fill display-4 mb-2"></i>
                <h2 className="fw-bold">
                  {players.length > 0
                    ? (players.reduce((sum, p) => sum + p.stats.rating, 0) / players.length).toFixed(1)
                    : "0.0"}
                </h2>
                <p className="mb-0">Valoración Media</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow border-0" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Buscar jugadores, equipos, países..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={filterPosition}
                      onChange={(e) => setFilterPosition(e.target.value)}
                    >
                      <option value="all">Todas las posiciones</option>
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <div className="btn-group w-100" role="group">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        <i className={`bi bi-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      </button>
                      <button className="btn btn-outline-secondary" onClick={shufflePlayers}>
                        <i className="bi bi-shuffle"></i>
                      </button>
                      <button
                        className={`btn ${showFavoritesOnly ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      >
                        <i className="bi bi-star-fill"></i>
                      </button>
                      <button
                        className={`btn ${compareMode ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => setCompareMode(!compareMode)}
                      >
                        <i className="bi bi-arrow-left-right"></i>
                      </button>
                      <button
                        className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setViewMode("grid")}
                      >
                        <i className="bi bi-grid-3x3-gap"></i>
                      </button>
                      <button
                        className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setViewMode("list")}
                      >
                        <i className="bi bi-list"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Mode */}
        {compareMode && selectedForComparison.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow border-0 border-info" style={{ background: "rgba(13, 202, 240, 0.1)" }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      <i className="bi bi-arrow-left-right me-2"></i>
                      Comparando {selectedForComparison.length} jugador(es)
                    </h5>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedForComparison([])}>
                      Limpiar selección
                    </button>
                  </div>
                  {selectedForComparison.length >= 2 && (
                    <div className="row">
                      {selectedForComparison.map((playerId) => {
                        const player = players.find((p) => p.id === playerId)
                        if (!player) return null
                        return (
                          <div key={playerId} className="col-md-4 mb-3">
                            <div className="card h-100">
                              <div className="card-body p-3">
                                <div className="d-flex align-items-center mb-2">
                                  <img
                                    src={player.image || "/placeholder.svg"}
                                    alt={player.name}
                                    className="rounded-circle me-2"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                  />
                                  <small className="fw-bold">{player.name}</small>
                                </div>
                                <div className="small">
                                  <div className="d-flex justify-content-between">
                                    <span>Valoración:</span>
                                    <span className={`fw-bold ${getPerformanceColor(player.stats.rating)}`}>
                                      {player.stats.rating}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span>Goles:</span>
                                    <span className="fw-bold">{player.stats.goals}</span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span>Velocidad:</span>
                                    <span className="fw-bold">{player.stats.speed}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Players Grid/List */}
        <div className={viewMode === "grid" ? "row" : ""}>
          {filteredAndSortedPlayers.map((player) => (
            <div key={player.id} className={viewMode === "grid" ? "col-lg-4 col-md-6 mb-4" : "mb-3"}>
              <div
                className={`card h-100 shadow border-0 ${
                  compareMode && selectedForComparison.includes(player.id) ? "border-info border-3" : ""
                } ${player.isFavorite ? "border-warning border-2" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  transform: "scale(1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="card-header border-0 bg-transparent">
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3">
                          <img
                            src={player.image || "/placeholder.svg"}
                            alt={player.name}
                            className="rounded-circle border border-3 border-light shadow"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          />
                          {player.isFavorite && (
                            <i className="bi bi-star-fill text-warning position-absolute top-0 end-0"></i>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-1 d-flex align-items-center">
                            {player.name}
                            {compareMode && (
                              <button
                                className={`btn btn-sm ms-auto ${
                                  selectedForComparison.includes(player.id) ? "btn-info" : "btn-outline-info"
                                }`}
                                onClick={() => toggleCompareSelection(player.id)}
                              >
                                <i className="bi bi-arrow-left-right"></i>
                              </button>
                            )}
                          </h5>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-secondary">{player.position}</span>
                            <small className="text-muted">{player.age} años</small>
                            <small className={`fw-bold ${getPerformanceColor(player.stats.rating)}`}>
                              ⭐ {player.stats.rating}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3 small">
                        <div className="col-6">
                          <strong>Equipo:</strong> {player.team}
                        </div>
                        <div className="col-6">
                          <strong>País:</strong> {player.nationality}
                        </div>
                      </div>

                      {/* Progress bars */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span>Velocidad</span>
                          <span>{player.stats.speed}/100</span>
                        </div>
                        <div className="progress mb-2" style={{ height: "6px" }}>
                          <div
                            className={`progress-bar ${getProgressBarColor(player.stats.speed)}`}
                            style={{ width: `${player.stats.speed}%` }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span>Fuerza</span>
                          <span>{player.stats.strength}/100</span>
                        </div>
                        <div className="progress mb-2" style={{ height: "6px" }}>
                          <div
                            className={`progress-bar ${getProgressBarColor(player.stats.strength)}`}
                            style={{ width: `${player.stats.strength}%` }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span>Técnica</span>
                          <span>{player.stats.technique}/100</span>
                        </div>
                        <div className="progress mb-3" style={{ height: "6px" }}>
                          <div
                            className={`progress-bar ${getProgressBarColor(player.stats.technique)}`}
                            style={{ width: `${player.stats.technique}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <div
                            className="p-2 rounded"
                            style={{ background: "linear-gradient(45deg, #43e97b, #38f9d7)" }}
                          >
                            <div className="fw-bold text-white">{player.stats.goals}</div>
                            <small className="text-white">Goles</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div
                            className="p-2 rounded"
                            style={{ background: "linear-gradient(45deg, #4facfe, #00f2fe)" }}
                          >
                            <div className="fw-bold text-white">{player.stats.assists}</div>
                            <small className="text-white">Asistencias</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div
                            className="p-2 rounded"
                            style={{ background: "linear-gradient(45deg, #fa709a, #fee140)" }}
                          >
                            <div className="fw-bold text-white">{player.stats.matches}</div>
                            <small className="text-white">Partidos</small>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-3">
                        <strong className="text-success">💰 {formatCurrency(player.marketValue)}</strong>
                      </div>

                      {/* Action buttons */}
                      <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setViewingPlayer(player)}>
                          <i className="bi bi-eye me-1"></i>Ver
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(player)}>
                          <i className="bi bi-pencil me-1"></i>Editar
                        </button>
                        <button
                          className={`btn btn-sm ${player.isFavorite ? "btn-warning" : "btn-outline-warning"}`}
                          onClick={() => toggleFavorite(player.id)}
                        >
                          <i className={`bi bi-star${player.isFavorite ? "-fill" : ""}`}></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(player.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img
                          src={player.image || "/placeholder.svg"}
                          alt={player.name}
                          className="rounded-circle me-3"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                        <div>
                          <h6 className="mb-1 d-flex align-items-center">
                            {player.name}
                            {player.isFavorite && <i className="bi bi-star-fill text-warning ms-2"></i>}
                          </h6>
                          <small className="text-muted">
                            {player.position} • {player.team} • ⭐ {player.stats.rating}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success">{player.stats.goals}G</span>
                        <span className="badge bg-primary">{player.stats.assists}A</span>
                        <small className="text-success fw-bold">{formatCurrency(player.marketValue)}</small>
                        <div className="btn-group">
                          <button className="btn btn-outline-primary btn-sm" onClick={() => setViewingPlayer(player)}>
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(player)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className={`btn btn-sm ${player.isFavorite ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => toggleFavorite(player.id)}
                          >
                            <i className={`bi bi-star${player.isFavorite ? "-fill" : ""}`}></i>
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(player.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedPlayers.length === 0 && (
          <div className="text-center py-5">
            <div className="display-1 mb-3">⚽</div>
            <h3 className="text-white mb-2">No se encontraron jugadores</h3>
            <p className="text-white-50">Intenta ajustar los filtros o agregar nuevos jugadores</p>
          </div>
        )}

        {/* Add/Edit Player Modal */}
        {isModalOpen && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingPlayer ? "✏️ Editar Jugador" : "⭐ Fichar Nuevo Jugador"}</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                      <a className="nav-link active" data-bs-toggle="tab" href="#basic-tab">
                        📋 Datos Básicos
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="tab" href="#stats-tab">
                        📊 Estadísticas
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="tab" href="#contract-tab">
                        💼 Contrato
                      </a>
                    </li>
                  </ul>

                  <form onSubmit={handleSubmit}>
                    <div className="tab-content">
                      {/* Basic Info Tab */}
                      <div className="tab-pane fade show active" id="basic-tab">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Nombre Completo *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Ej: Lionel Andrés Messi"
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Posición *</label>
                            <select
                              className="form-select"
                              value={formData.position}
                              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                              required
                            >
                              <option value="">Selecciona posición</option>
                              {positions.map((pos) => (
                                <option key={pos} value={pos}>
                                  {pos}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">Edad *</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.age}
                              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                              min="16"
                              max="50"
                              required
                            />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">Nacionalidad</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.nationality}
                              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                              placeholder="País de origen"
                            />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">Equipo Actual</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.team}
                              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                              placeholder="Nombre del equipo"
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label">Foto del Jugador</label>
                            <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
                            {formData.image && (
                              <div className="mt-2 text-center">
                                <img
                                  src={formData.image || "/placeholder.svg"}
                                  alt="Preview"
                                  className="rounded-circle border border-3 border-primary shadow"
                                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label">Descripción del Jugador</label>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="Describe las características, fortalezas y estilo de juego..."
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* Stats Tab */}
                      <div className="tab-pane fade" id="stats-tab">
                        <div className="row">
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              <i className="bi bi-bullseye me-1"></i>Goles
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.goals}
                              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                              min="0"
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              <i className="bi bi-people me-1"></i>Asistencias
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.assists}
                              onChange={(e) => setFormData({ ...formData, assists: e.target.value })}
                              min="0"
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              <i className="bi bi-activity me-1"></i>Partidos
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.matches}
                              onChange={(e) => setFormData({ ...formData, matches: e.target.value })}
                              min="0"
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              <i className="bi bi-star me-1"></i>Valoración
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              className="form-control"
                              value={formData.rating}
                              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                              min="0"
                              max="10"
                            />
                          </div>
                        </div>

                        <h5 className="mb-3">
                          <i className="bi bi-lightning me-2"></i>Atributos Físicos y Técnicos
                        </h5>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label">Velocidad (0-100)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.speed}
                              onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                              min="0"
                              max="100"
                            />
                            {formData.speed && (
                              <div className="progress mt-2" style={{ height: "6px" }}>
                                <div
                                  className={`progress-bar ${getProgressBarColor(Number.parseInt(formData.speed))}`}
                                  style={{ width: `${formData.speed}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">Fuerza (0-100)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.strength}
                              onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                              min="0"
                              max="100"
                            />
                            {formData.strength && (
                              <div className="progress mt-2" style={{ height: "6px" }}>
                                <div
                                  className={`progress-bar ${getProgressBarColor(Number.parseInt(formData.strength))}`}
                                  style={{ width: `${formData.strength}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">Técnica (0-100)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.technique}
                              onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                              min="0"
                              max="100"
                            />
                            {formData.technique && (
                              <div className="progress mt-2" style={{ height: "6px" }}>
                                <div
                                  className={`progress-bar ${getProgressBarColor(Number.parseInt(formData.technique))}`}
                                  style={{ width: `${formData.technique}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contract Tab */}
                      <div className="tab-pane fade" id="contract-tab">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              <i className="bi bi-graph-up me-1"></i>Valor de Mercado (€)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.marketValue}
                              onChange={(e) => setFormData({ ...formData, marketValue: e.target.value })}
                              min="0"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              <i className="bi bi-calendar me-1"></i>Fin de Contrato
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              value={formData.contract}
                              onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn text-white"
                        style={{ background: "linear-gradient(45deg, #43e97b, #38f9d7)" }}
                      >
                        {editingPlayer ? "💾 Actualizar" : "⚽ Fichar"} Jugador
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Player Modal */}
        {viewingPlayer && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center">
                    <img
                      src={viewingPlayer.image || "/placeholder.svg"}
                      alt={viewingPlayer.name}
                      className="rounded-circle me-3 border border-3 border-primary"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div>
                      <div className="d-flex align-items-center">
                        {viewingPlayer.name}
                        {viewingPlayer.isFavorite && <i className="bi bi-star-fill text-warning ms-2"></i>}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-secondary">{viewingPlayer.position}</span>
                        <small className="text-muted">{viewingPlayer.age} años</small>
                        <small className={`fw-bold ${getPerformanceColor(viewingPlayer.stats.rating)}`}>
                          ⭐ {viewingPlayer.stats.rating}
                        </small>
                      </div>
                    </div>
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setViewingPlayer(null)}></button>
                </div>
                <div className="modal-body">
                  <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                      <a className="nav-link active" data-bs-toggle="tab" href="#overview-tab">
                        📊 Resumen
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="tab" href="#detailed-stats-tab">
                        📈 Estadísticas
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="tab" href="#contract-info-tab">
                        💼 Contrato
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* Overview Tab */}
                    <div className="tab-pane fade show active" id="overview-tab">
                      <div className="row">
                        <div className="col-md-6">
                          <h5 className="mb-3">
                            <i className="bi bi-person me-2"></i>Información Personal
                          </h5>
                          <div className="list-group list-group-flush">
                            <div className="list-group-item d-flex justify-content-between">
                              <strong>Nacionalidad:</strong>
                              <span>{viewingPlayer.nationality}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between">
                              <strong>Equipo:</strong>
                              <span>{viewingPlayer.team}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between">
                              <strong>Posición:</strong>
                              <span>{viewingPlayer.position}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between">
                              <strong>Edad:</strong>
                              <span>{viewingPlayer.age} años</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h5 className="mb-3">
                            <i className="bi bi-bar-chart me-2"></i>Estadísticas Rápidas
                          </h5>
                          <div className="row">
                            <div className="col-6 mb-3">
                              <div
                                className="text-center p-3 rounded"
                                style={{ background: "linear-gradient(45deg, #43e97b, #38f9d7)" }}
                              >
                                <h3 className="text-white mb-1">{viewingPlayer.stats.goals}</h3>
                                <small className="text-white">Goles</small>
                              </div>
                            </div>
                            <div className="col-6 mb-3">
                              <div
                                className="text-center p-3 rounded"
                                style={{ background: "linear-gradient(45deg, #4facfe, #00f2fe)" }}
                              >
                                <h3 className="text-white mb-1">{viewingPlayer.stats.assists}</h3>
                                <small className="text-white">Asistencias</small>
                              </div>
                            </div>
                            <div className="col-6 mb-3">
                              <div
                                className="text-center p-3 rounded"
                                style={{ background: "linear-gradient(45deg, #fa709a, #fee140)" }}
                              >
                                <h3 className="text-white mb-1">{viewingPlayer.stats.matches}</h3>
                                <small className="text-white">Partidos</small>
                              </div>
                            </div>
                            <div className="col-6 mb-3">
                              <div
                                className="text-center p-3 rounded"
                                style={{ background: "linear-gradient(45deg, #a8edea, #fed6e3)" }}
                              >
                                <h3 className="text-dark mb-1">{viewingPlayer.stats.rating}</h3>
                                <small className="text-dark">Valoración</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {viewingPlayer.description && (
                        <div className="mt-4">
                          <h5 className="mb-3">
                            <i className="bi bi-chat-text me-2"></i>Descripción
                          </h5>
                          <div className="alert alert-info">{viewingPlayer.description}</div>
                        </div>
                      )}
                    </div>

                    {/* Detailed Stats Tab */}
                    <div className="tab-pane fade" id="detailed-stats-tab">
                      <h5 className="mb-4">
                        <i className="bi bi-lightning me-2"></i>Atributos Físicos y Técnicos
                      </h5>
                      <div className="row">
                        <div className="col-md-4 mb-4">
                          <div className="text-center">
                            <h6>Velocidad</h6>
                            <div className="progress mb-2" style={{ height: "20px" }}>
                              <div
                                className={`progress-bar ${getProgressBarColor(viewingPlayer.stats.speed)}`}
                                style={{ width: `${viewingPlayer.stats.speed}%` }}
                              >
                                {viewingPlayer.stats.speed}/100
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="text-center">
                            <h6>Fuerza</h6>
                            <div className="progress mb-2" style={{ height: "20px" }}>
                              <div
                                className={`progress-bar ${getProgressBarColor(viewingPlayer.stats.strength)}`}
                                style={{ width: `${viewingPlayer.stats.strength}%` }}
                              >
                                {viewingPlayer.stats.strength}/100
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="text-center">
                            <h6>Técnica</h6>
                            <div className="progress mb-2" style={{ height: "20px" }}>
                              <div
                                className={`progress-bar ${getProgressBarColor(viewingPlayer.stats.technique)}`}
                                style={{ width: `${viewingPlayer.stats.technique}%` }}
                              >
                                {viewingPlayer.stats.technique}/100
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col-md-4">
                          <div className="card text-center h-100">
                            <div className="card-body">
                              <i className="bi bi-bullseye display-4 text-success mb-3"></i>
                              <h3 className="text-success">{viewingPlayer.stats.goals}</h3>
                              <p className="text-muted">Goles Marcados</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card text-center h-100">
                            <div className="card-body">
                              <i className="bi bi-people display-4 text-primary mb-3"></i>
                              <h3 className="text-primary">{viewingPlayer.stats.assists}</h3>
                              <p className="text-muted">Asistencias</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card text-center h-100">
                            <div className="card-body">
                              <i className="bi bi-activity display-4 text-info mb-3"></i>
                              <h3 className="text-info">{viewingPlayer.stats.matches}</h3>
                              <p className="text-muted">Partidos Jugados</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Info Tab */}
                    <div className="tab-pane fade" id="contract-info-tab">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body text-center">
                              <i className="bi bi-graph-up display-4 text-success mb-3"></i>
                              <h4>Valor de Mercado</h4>
                              <h2 className="text-success">{formatCurrency(viewingPlayer.marketValue)}</h2>
                              <p className="text-muted">Valoración actual del jugador</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body text-center">
                              <i className="bi bi-calendar display-4 text-primary mb-3"></i>
                              <h4>Contrato</h4>
                              <h2 className="text-primary">
                                {viewingPlayer.contract
                                  ? new Date(viewingPlayer.contract).toLocaleDateString("es-ES")
                                  : "No especificado"}
                              </h2>
                              <p className="text-muted">Fecha de finalización</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <img
                          src={viewingPlayer.image || "/placeholder.svg"}
                          alt={viewingPlayer.name}
                          className="img-fluid rounded shadow-lg"
                          style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  )
}
