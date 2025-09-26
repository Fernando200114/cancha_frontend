// import type React from "react"
// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Trophy, Bullseye, PeopleFill, ChevronUp, ChevronDown } from "react-bootstrap-icons"


// interface Equipo {
//   equipoId: string
//   PJ: number
//   PG: number
//   PE: number
//   PP: number
//   GF: number
//   GC: number
//   DG: number
//   Pts: number
// }

// interface EquipoConNombre extends Equipo {
//   nombre: string
//   escudo?: string
// }

// type SortField = keyof Omit<EquipoConNombre, "equipoId" | "nombre" | "escudo">
// type SortDirection = "asc" | "desc"

// export default function TablaPosiciones() {
//   const [equipos, setEquipos] = useState<EquipoConNombre[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [sortField, setSortField] = useState<SortField>("Pts")
//   const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

//   const fetchPosiciones = async () => {
//     try {
//       setLoading(true)
//       const response = await axiosAuth.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/tabla-posiciones")
//       const equiposConNombres = await Promise.all(
//         response.data.map(async (equipo: Equipo) => {
//           try {
//             const equipoInfo = await axiosAuth.get(`https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos/${equipo.equipoId}`)
//             return {
//               ...equipo,
//               nombre: equipoInfo.data.nombre || `Equipo ${equipo.equipoId.slice(-4)}`,
//               escudo: equipoInfo.data.escudo || undefined,
//             }
//           } catch {
//             return {
//               ...equipo,
//               nombre: `Equipo ${equipo.equipoId.slice(-4)}`,
//               escudo: undefined,
//             }
//           }
//         })
//       )
//       setEquipos(equiposConNombres)
//       setError(null)
//     } catch (err) {
//       console.error("Error fetching data:", err)
//       setError("Error al cargar los datos")
//       setEquipos([
//         {
//           equipoId: "68752dda733b560e3379f63c",
//           nombre: "Equipo Ejemplo",
//           PJ: 1,
//           PG: 0,
//           PE: 1,
//           PP: 0,
//           GF: 0,
//           GC: 0,
//           DG: 0,
//           Pts: 1,
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchPosiciones()
//   }, [])

//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("desc")
//     }
//   }

//   // Ordenar equipos primero por puntos, luego diferencia de gol y luego goles
//   const equiposOrdenados = [...equipos].sort((a, b) => {
//     if (b.Pts !== a.Pts) return b.Pts - a.Pts
//     if (b.DG !== a.DG) return b.DG - a.DG
//     return b.GF - a.GF
//   })

//   const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
//     <th
//       className="fw-semibold text-start"
//       style={{ cursor: "pointer", userSelect: "none" }}
//       onClick={() => handleSort(field)}
//       scope="col"
//       title={`Ordenar por ${field}`}
//     >
//       <div className="d-flex align-items-center gap-1">
//         {children}
//         {sortField === field &&
//           (sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
//       </div>
//     </th>
//   )

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
//         <div className="spinner-border text-primary" role="status" />
//       </div>
//     )
//   }

//   return (
//     <div className="container my-5 p-4 bg-white rounded shadow-sm">
//       <div className="mb-4">
//         <div className="d-flex align-items-center gap-3 mb-2">
//           <Trophy color="#f59e0b" size={32} />
//           <h1 className="h3 m-0 text-dark">Tabla de Posiciones</h1>
//         </div>
//         <p className="text-muted">Clasificación actual del torneo</p>
//         {error && (
//           <div className="alert alert-danger" role="alert">
//             {error}
//           </div>
//         )}
//       </div>

//       <div className="row text-center mb-4">
//         <div className="col-md-4 mb-3">
//           <div className="bg-primary bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-primary">
//               <PeopleFill size={20} />
//               <span className="fw-semibold fs-5">Equipos</span>
//             </div>
//             <p className="fs-2 fw-bold m-0 text-primary">{equipos.length}</p>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className="bg-success bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-success">
//               <Bullseye size={20} />
//               <span className="fw-semibold fs-5">Total Goles</span>
//             </div>
//             <p className="fs-2 fw-bold m-0 text-success">
//               {equipos.reduce((sum, equipo) => sum + equipo.GF, 0)}
//             </p>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className="bg-warning bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-warning">
//               <Trophy size={20} />
//               <span className="fw-semibold fs-5">Líder</span>
//             </div>
//             <p className="fs-5 fw-bold m-0 text-truncate text-warning">
//               {equiposOrdenados[0]?.nombre || "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="table-responsive border rounded shadow-sm">
//         <table className="table table-sm align-middle text-center mb-0" style={{ minWidth: 720 }}>
//           <thead className="table-light">
//             <tr>
//               <th scope="col" className="fw-semibold text-start px-3 py-2">
//                 #
//               </th>
//               <th scope="col" className="fw-semibold text-start px-3 py-2">
//                 Equipo
//               </th>
//               <SortableHeader field="PJ">PJ</SortableHeader>
//               <SortableHeader field="PG">PG</SortableHeader>
//               <SortableHeader field="PE">PE</SortableHeader>
//               <SortableHeader field="PP">PP</SortableHeader>
//               <SortableHeader field="GF">GF</SortableHeader>
//               <SortableHeader field="GC">GC</SortableHeader>
//               <SortableHeader field="DG">DG</SortableHeader>
//               <SortableHeader field="Pts">Pts</SortableHeader>
//             </tr>
//           </thead>
//           <tbody>
//             {equiposOrdenados.map((equipo, index) => {
//               const isLider = index === 0
//               const enZonaAscenso = index < 4
//               const enZonaDescenso = index >= equipos.length - 3
//               return (
//                 <tr
//                   key={equipo.equipoId}
//                   className={`${isLider ? "table-warning" : ""}`}
//                   style={{
//                     borderLeft: enZonaAscenso
//                       ? "4px solid #198754"
//                       : enZonaDescenso
//                         ? "4px solid #dc3545"
//                         : undefined,
//                   }}
//                 >
//                   <td className="fw-semibold text-start px-3 py-2">{index + 1}</td>
//                   <td className="text-start d-flex align-items-center gap-2 px-3 py-2">
//                     {equipo.escudo && equipo.escudo.startsWith("http") ? (
//                       <img
//                         src={equipo.escudo}
//                         alt={equipo.nombre}
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).style.display = "none";
//                         }}
//                         style={{ width: 24, height: 24, objectFit: "cover", borderRadius: "50%" }}
//                       />
//                     ) : (
//                       <div
//                         className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle"
//                         style={{ width: 24, height: 24, fontWeight: "700" }}
//                       >
//                         {equipo.nombre.charAt(0)}
//                       </div>
//                     )}

//                     <span>{equipo.nombre}</span>
//                   </td>
//                   <td className="px-3 py-2">{equipo.PJ}</td>
//                   <td className="text-success fw-semibold px-3 py-2">{equipo.PG}</td>
//                   <td className="text-warning fw-semibold px-3 py-2">{equipo.PE}</td>
//                   <td className="text-danger fw-semibold px-3 py-2">{equipo.PP}</td>
//                   <td className="px-3 py-2">{equipo.GF}</td>
//                   <td className="px-3 py-2">{equipo.GC}</td>
//                   <td
//                     className={`fw-semibold px-3 py-2 ${equipo.DG > 0 ? "text-success" : equipo.DG < 0 ? "text-danger" : "text-secondary"
//                       }`}
//                   >
//                     {equipo.DG > 0 ? "+" : ""}
//                     {equipo.DG}
//                   </td>
//                   <td className="px-3 py-2">
//                     <span className="badge bg-primary fs-6 fw-bold">{equipo.Pts}</span>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       <footer className="mt-4 d-flex flex-wrap justify-content-center gap-4 text-muted small">
//         <div className="d-flex align-items-center gap-2">
//           <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#198754" }}></div>
//           <span>Clasificación</span>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#dc3545" }}></div>
//           <span>Descenso</span>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <Trophy color="#f59e0b" size={16} />
//           <span>Líder</span>
//         </div>
//       </footer>

//       <div className="mt-4 text-center">
//         <button onClick={fetchPosiciones} disabled={loading} className="btn btn-primary px-4 py-2 fw-semibold">
//           {loading ? "Actualizando..." : "Actualizar Tabla"}
//         </button>
//       </div>
//     </div>
//   )
// }
// import type React from "react"
// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Trophy, Bullseye, PeopleFill, ChevronUp, ChevronDown } from "react-bootstrap-icons"


// interface Equipo {
//   equipoId: string
//   PJ: number
//   PG: number
//   PE: number
//   PP: number
//   GF: number
//   GC: number
//   DG: number
//   Pts: number
// }

// interface EquipoConNombre extends Equipo {
//   nombre: string
//   escudo?: string
// }

// type SortField = keyof Omit<EquipoConNombre, "equipoId" | "nombre" | "escudo">
// type SortDirection = "asc" | "desc"

// export default function TablaPosiciones() {
//   const [equipos, setEquipos] = useState<EquipoConNombre[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [sortField, setSortField] = useState<SortField>("Pts")
//   const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

//   const fetchPosiciones = async () => {
//     try {
//       setLoading(true)
//       const response = await axiosAuth.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/tabla-posiciones")
//       const equiposConNombres = await Promise.all(
//         response.data.map(async (equipo: Equipo) => {
//           try {
//             const equipoInfo = await axiosAuth.get(`https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos/${equipo.equipoId}`)
//             return {
//               ...equipo,
//               nombre: equipoInfo.data.nombre || `Equipo ${equipo.equipoId.slice(-4)}`,
//               escudo: equipoInfo.data.escudo || undefined,
//             }
//           } catch {
//             return {
//               ...equipo,
//               nombre: `Equipo ${equipo.equipoId.slice(-4)}`,
//               escudo: undefined,
//             }
//           }
//         })
//       )
//       setEquipos(equiposConNombres)
//       setError(null)
//     } catch (err) {
//       console.error("Error fetching data:", err)
//       setError("Error al cargar los datos")
//       setEquipos([
//         {
//           equipoId: "68752dda733b560e3379f63c",
//           nombre: "Equipo Ejemplo",
//           PJ: 1,
//           PG: 0,
//           PE: 1,
//           PP: 0,
//           GF: 0,
//           GC: 0,
//           DG: 0,
//           Pts: 1,
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchPosiciones()
//   }, [])

//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("desc")
//     }
//   }

//   // Ordenar equipos primero por puntos, luego diferencia de gol y luego goles
//   const equiposOrdenados = [...equipos].sort((a, b) => {
//     if (b.Pts !== a.Pts) return b.Pts - a.Pts
//     if (b.DG !== a.DG) return b.DG - a.DG
//     return b.GF - a.GF
//   })

//   const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
//     <th
//       className="fw-semibold text-start"
//       style={{ cursor: "pointer", userSelect: "none" }}
//       onClick={() => handleSort(field)}
//       scope="col"
//       title={`Ordenar por ${field}`}
//     >
//       <div className="d-flex align-items-center gap-1">
//         {children}
//         {sortField === field &&
//           (sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
//       </div>
//     </th>
//   )

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
//         <div className="spinner-border text-primary" role="status" />
//       </div>
//     )
//   }

//   return (
//     <div className="container my-5 p-4 bg-white rounded shadow-sm">
//       <div className="mb-4">
//         <div className="d-flex align-items-center gap-3 mb-2">
//           <Trophy color="#f59e0b" size={32} />
//           <h1 className="h3 m-0 text-dark">Tabla de Posiciones</h1>
//         </div>
//         <p className="text-muted">Clasificación actual del torneo</p>
//         {error && (
//           <div className="alert alert-danger" role="alert">
//             {error}
//           </div>
//         )}
//       </div>

//       <div className="row text-center mb-4">
//         <div className="col-md-4 mb-3">
//           <div className="bg-primary bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-primary">
//               <PeopleFill size={20} />
//               <span className="fw-semibold fs-5">Equipos</span>
//             </div>
//             <p className="fs-2 fw-bold m-0 text-primary">{equipos.length}</p>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className="bg-success bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-success">
//               <Bullseye size={20} />
//               <span className="fw-semibold fs-5">Total Goles</span>
//             </div>
//             <p className="fs-2 fw-bold m-0 text-success">
//               {equipos.reduce((sum, equipo) => sum + equipo.GF, 0)}
//             </p>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className="bg-warning bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-warning">
//               <Trophy size={20} />
//               <span className="fw-semibold fs-5">Líder</span>
//             </div>
//             <p className="fs-5 fw-bold m-0 text-truncate text-warning">
//               {equiposOrdenados[0]?.nombre || "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="table-responsive border rounded shadow-sm">
//         <table className="table table-sm align-middle text-center mb-0" style={{ minWidth: 720 }}>
//           <thead className="table-light">
//             <tr>
//               <th scope="col" className="fw-semibold text-start px-3 py-2">
//                 #
//               </th>
//               <th scope="col" className="fw-semibold text-start px-3 py-2">
//                 Equipo
//               </th>
//               <SortableHeader field="PJ">PJ</SortableHeader>
//               <SortableHeader field="PG">PG</SortableHeader>
//               <SortableHeader field="PE">PE</SortableHeader>
//               <SortableHeader field="PP">PP</SortableHeader>
//               <SortableHeader field="GF">GF</SortableHeader>
//               <SortableHeader field="GC">GC</SortableHeader>
//               <SortableHeader field="DG">DG</SortableHeader>
//               <SortableHeader field="Pts">Pts</SortableHeader>
//             </tr>
//           </thead>
//           <tbody>
//             {equiposOrdenados.map((equipo, index) => {
//               const isLider = index === 0
//               const enZonaAscenso = index < 4
//               const enZonaDescenso = index >= equipos.length - 3
//               return (
//                 <tr
//                   key={equipo.equipoId}
//                   className={`${isLider ? "table-warning" : ""}`}
//                   style={{
//                     borderLeft: enZonaAscenso
//                       ? "4px solid #198754"
//                       : enZonaDescenso
//                         ? "4px solid #dc3545"
//                         : undefined,
//                   }}
//                 >
//                   <td className="fw-semibold text-start px-3 py-2">{index + 1}</td>
//                   <td className="text-start d-flex align-items-center gap-2 px-3 py-2">
//                     {equipo.escudo && equipo.escudo.startsWith("http") ? (
//                       <img
//                         src={equipo.escudo}
//                         alt={equipo.nombre}
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).style.display = "none";
//                         }}
//                         style={{ width: 24, height: 24, objectFit: "cover", borderRadius: "50%" }}
//                       />
//                     ) : (
//                       <div
//                         className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle"
//                         style={{ width: 24, height: 24, fontWeight: "700" }}
//                       >
//                         {equipo.nombre.charAt(0)}
//                       </div>
//                     )}

//                     <span>{equipo.nombre}</span>
//                   </td>
//                   <td className="px-3 py-2">{equipo.PJ}</td>
//                   <td className="text-success fw-semibold px-3 py-2">{equipo.PG}</td>
//                   <td className="text-warning fw-semibold px-3 py-2">{equipo.PE}</td>
//                   <td className="text-danger fw-semibold px-3 py-2">{equipo.PP}</td>
//                   <td className="px-3 py-2">{equipo.GF}</td>
//                   <td className="px-3 py-2">{equipo.GC}</td>
//                   <td
//                     className={`fw-semibold px-3 py-2 ${equipo.DG > 0 ? "text-success" : equipo.DG < 0 ? "text-danger" : "text-secondary"
//                       }`}
//                   >
//                     {equipo.DG > 0 ? "+" : ""}
//                     {equipo.DG}
//                   </td>
//                   <td className="px-3 py-2">
//                     <span className="badge bg-primary fs-6 fw-bold">{equipo.Pts}</span>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       <footer className="mt-4 d-flex flex-wrap justify-content-center gap-4 text-muted small">
//         <div className="d-flex align-items-center gap-2">
//           <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#198754" }}></div>
//           <span>Clasificación</span>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#dc3545" }}></div>
//           <span>Descenso</span>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <Trophy color="#f59e0b" size={16} />
//           <span>Líder</span>
//         </div>
//       </footer>

//       <div className="mt-4 text-center">
//         <button onClick={fetchPosiciones} disabled={loading} className="btn btn-primary px-4 py-2 fw-semibold">
//           {loading ? "Actualizando..." : "Actualizar Tabla"}
//         </button>
//       </div>
//     </div>
//   )
// }













// import type React from "react"
// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Trophy, Bullseye, PeopleFill, ChevronUp, ChevronDown } from "react-bootstrap-icons"

// interface Equipo {
//   equipoId: string
//   PJ: number
//   PG: number
//   PE: number
//   PP: number
//   GF: number
//   GC: number
//   DG: number
//   Pts: number
// }

// interface EquipoConNombre extends Equipo {
//   nombre: string
//   escudo?: string
// }

// type SortField = keyof Omit<EquipoConNombre, "equipoId" | "nombre" | "escudo">
// type SortDirection = "asc" | "desc"

// // Instancia axios con autenticación (token Bearer)
// const token = localStorage.getItem("token") || ""

// const axiosAuth = axios.create({
//   baseURL: "https://nestjs-cancha-backend-api.desarrollo-software.xyz",
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })

// export default function TablaPosiciones() {
//   const [equipos, setEquipos] = useState<EquipoConNombre[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [sortField, setSortField] = useState<SortField>("Pts")
//   const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

//   const fetchPosiciones = async () => {
//     try {
//       setLoading(true)
//       const response = await axiosAuth.get("/tabla-posiciones")
//       const equiposConNombres = await Promise.all(
//         response.data.map(async (equipo: Equipo) => {
//           try {
//             const equipoInfo = await axiosAuth.get(`/equipos/${equipo.equipoId}`)
//             return {
//               ...equipo,
//               nombre: equipoInfo.data.nombre || `Equipo ${equipo.equipoId.slice(-4)}`,
//               escudo: equipoInfo.data.escudo || undefined,
//             }
//           } catch {
//             return {
//               ...equipo,
//               nombre: `Equipo ${equipo.equipoId.slice(-4)}`,
//               escudo: undefined,
//             }
//           }
//         })
//       )
//       setEquipos(equiposConNombres)
//       setError(null)
//     } catch (err) {
//       console.error("Error fetching data:", err)
//       setError("Error al cargar los datos")
//       setEquipos([
//         {
//           equipoId: "68752dda733b560e3379f63c",
//           nombre: "Equipo Ejemplo",
//           PJ: 1,
//           PG: 0,
//           PE: 1,
//           PP: 0,
//           GF: 0,
//           GC: 0,
//           DG: 0,
//           Pts: 1,
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchPosiciones()
//   }, [])

//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("desc")
//     }
//   }

//   // Ordenar equipos primero por puntos, luego diferencia de gol y luego goles
//   const equiposOrdenados = [...equipos].sort((a, b) => {
//     if (b.Pts !== a.Pts) return b.Pts - a.Pts
//     if (b.DG !== a.DG) return b.DG - a.DG
//     return b.GF - a.GF
//   })

//   const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
//     <th
//       className="fw-semibold text-start"
//       style={{ cursor: "pointer", userSelect: "none" }}
//       onClick={() => handleSort(field)}
//       scope="col"
//       title={`Ordenar por ${field}`}
//     >
//       <div className="d-flex align-items-center gap-1">
//         {children}
//         {sortField === field &&
//           (sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
//       </div>
//     </th>
//   )

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
//         <div className="spinner-border text-primary" role="status" />
//       </div>
//     )
//   }

//   return (
//     <div className="container my-5 p-4 bg-white rounded shadow-sm">
//       <div className="mb-4">
//         <div className="d-flex align-items-center gap-3 mb-2">
//           <Trophy color="#f59e0b" size={32} />
//           <h1 className="h3 m-0 text-dark">Tabla de Posiciones</h1>
//         </div>
//         <p className="text-muted">Clasificación actual del torneo</p>
//         {error && (
//           <div className="alert alert-danger" role="alert">
//             {error}
//           </div>
//         )}
//       </div>

//       <div className="row text-center mb-4">
//         <div className="col-md-4 mb-3">
//           <div className="bg-primary bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-primary">
//               <PeopleFill size={20} />
//               <span className="fw-semibold fs-5">Equipos</span>
//             </div>
//             <p className="fs-2 fw-bold m-0 text-primary">{equipos.length}</p>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className="bg-success bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-success">
//               <Bullseye size={20} />
//               <span className="fw-semibold fs-5">Total Goles</span>
//             </div>
//             <p className="fs-2 fw-bold m-0 text-success">
//               {equipos.reduce((sum, equipo) => sum + equipo.GF, 0)}
//             </p>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className="bg-warning bg-opacity-10 p-3 rounded shadow-sm">
//             <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-warning">
//               <Trophy size={20} />
//               <span className="fw-semibold fs-5">Líder</span>
//             </div>
//             <p className="fs-5 fw-bold m-0 text-truncate text-warning">
//               {equiposOrdenados[0]?.nombre || "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="table-responsive border rounded shadow-sm">
//         <table className="table table-sm align-middle text-center mb-0" style={{ minWidth: 720 }}>
//           <thead className="table-light">
//             <tr>
//               <th scope="col" className="fw-semibold text-start px-3 py-2">
//                 #
//               </th>
//               <th scope="col" className="fw-semibold text-start px-3 py-2">
//                 Equipo
//               </th>
//               <SortableHeader field="PJ">PJ</SortableHeader>
//               <SortableHeader field="PG">PG</SortableHeader>
//               <SortableHeader field="PE">PE</SortableHeader>
//               <SortableHeader field="PP">PP</SortableHeader>
//               <SortableHeader field="GF">GF</SortableHeader>
//               <SortableHeader field="GC">GC</SortableHeader>
//               <SortableHeader field="DG">DG</SortableHeader>
//               <SortableHeader field="Pts">Pts</SortableHeader>
//             </tr>
//           </thead>
//           <tbody>
//             {equiposOrdenados.map((equipo, index) => {
//               const isLider = index === 0
//               const enZonaAscenso = index < 4
//               const enZonaDescenso = index >= equipos.length - 3
//               return (
//                 <tr
//                   key={equipo.equipoId}
//                   className={`${isLider ? "table-warning" : ""}`}
//                   style={{
//                     borderLeft: enZonaAscenso
//                       ? "4px solid #198754"
//                       : enZonaDescenso
//                         ? "4px solid #dc3545"
//                         : undefined,
//                   }}
//                 >
//                   <td className="fw-semibold text-start px-3 py-2">{index + 1}</td>
//                   <td className="text-start d-flex align-items-center gap-2 px-3 py-2">
//                     {equipo.escudo && equipo.escudo.startsWith("http") ? (
//                       <img
//                         src={equipo.escudo}
//                         alt={equipo.nombre}
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).style.display = "none";
//                         }}
//                         style={{ width: 24, height: 24, objectFit: "cover", borderRadius: "50%" }}
//                       />
//                     ) : (
//                       <div
//                         className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle"
//                         style={{ width: 24, height: 24, fontWeight: "700" }}
//                       >
//                         {equipo.nombre.charAt(0)}
//                       </div>
//                     )}

//                     <span>{equipo.nombre}</span>
//                   </td>
//                   <td className="px-3 py-2">{equipo.PJ}</td>
//                   <td className="text-success fw-semibold px-3 py-2">{equipo.PG}</td>
//                   <td className="text-warning fw-semibold px-3 py-2">{equipo.PE}</td>
//                   <td className="text-danger fw-semibold px-3 py-2">{equipo.PP}</td>
//                   <td className="px-3 py-2">{equipo.GF}</td>
//                   <td className="px-3 py-2">{equipo.GC}</td>
//                   <td
//                     className={`fw-semibold px-3 py-2 ${
//                       equipo.DG > 0
//                         ? "text-success"
//                         : equipo.DG < 0
//                         ? "text-danger"
//                         : "text-secondary"
//                     }`}
//                   >
//                     {equipo.DG > 0 ? "+" : ""}
//                     {equipo.DG}
//                   </td>
//                   <td className="px-3 py-2">
//                     <span className="badge bg-primary fs-6 fw-bold">{equipo.Pts}</span>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       <footer className="mt-4 d-flex flex-wrap justify-content-center gap-4 text-muted small">
//         <div className="d-flex align-items-center gap-2">
//           <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#198754" }}></div>
//           <span>Clasificación</span>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#dc3545" }}></div>
//           <span>Descenso</span>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <Trophy color="#f59e0b" size={16} />
//           <span>Líder</span>
//         </div>
//       </footer>

//       <div className="mt-4 text-center">
//         <button onClick={fetchPosiciones} disabled={loading} className="btn btn-primary px-4 py-2 fw-semibold">
//           {loading ? "Actualizando..." : "Actualizar Tabla"}
//         </button>
//       </div>
//     </div>
//   )
// }












import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Trophy, Bullseye, PeopleFill, ChevronUp, ChevronDown } from "react-bootstrap-icons"

interface Equipo {
  equipoId: string
  PJ: number
  PG: number
  PE: number
  PP: number
  GF: number
  GC: number
  DG: number
  Pts: number
}

interface EquipoConNombre extends Equipo {
  nombre: string
  escudo?: string
}

type SortField = keyof Omit<EquipoConNombre, "equipoId" | "nombre" | "escudo">
type SortDirection = "asc" | "desc"

// Instancia axios con autenticación (token Bearer)
const token = localStorage.getItem("token") || ""

const axiosAuth = axios.create({
  baseURL: "https://cancha-backend-4.onrender.com/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export default function TablaPosiciones() {
  const [equipos, setEquipos] = useState<EquipoConNombre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("Pts")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const fetchPosiciones = async () => {
    try {
      setLoading(true)
      const response = await axiosAuth.get("/tabla-posiciones")
      const equiposConNombres = await Promise.all(
        response.data.map(async (equipo: Equipo) => {
          try {
            const equipoInfo = await axiosAuth.get(`/equipos/${equipo.equipoId}`)
            return {
              ...equipo,
              nombre: equipoInfo.data.nombre || `Equipo ${equipo.equipoId.slice(-4)}`,
              escudo: equipoInfo.data.escudo || undefined,
            }
          } catch {
            return {
              ...equipo,
              nombre: `Equipo ${equipo.equipoId.slice(-4)}`,
              escudo: undefined,
            }
          }
        })
      )
      setEquipos(equiposConNombres)
      setError(null)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar los datos")
      setEquipos([
        {
          equipoId: "68752dda733b560e3379f63c",
          nombre: "Equipo Ejemplo",
          PJ: 1,
          PG: 0,
          PE: 1,
          PP: 0,
          GF: 0,
          GC: 0,
          DG: 0,
          Pts: 1,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosiciones()
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Ordenar equipos primero por puntos, luego diferencia de gol y luego goles
  const equiposOrdenados = [...equipos].sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts
    if (b.DG !== a.DG) return b.DG - a.DG
    return b.GF - a.GF
  })

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="fw-semibold text-start"
      style={{ cursor: "pointer", userSelect: "none" }}
      onClick={() => handleSort(field)}
      scope="col"
      title={`Ordenar por ${field}`}
    >
      <div className="d-flex align-items-center gap-1">
        {children}
        {sortField === field &&
          (sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </div>
    </th>
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  return (
    <div className="container my-5 p-4 bg-white rounded shadow-sm">
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3 mb-2">
          <Trophy color="#f59e0b" size={32} />
          <h1 className="h3 m-0 text-dark">Tabla de Posiciones</h1>
        </div>
        <p className="text-muted">Clasificación actual del torneo</p>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </div>

      <div className="row text-center mb-4">
        <div className="col-md-4 mb-3">
          <div className="bg-primary bg-opacity-10 p-3 rounded shadow-sm">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-primary">
              <PeopleFill size={20} />
              <span className="fw-semibold fs-5">Equipos</span>
            </div>
            <p className="fs-2 fw-bold m-0 text-primary">{equipos.length}</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="bg-success bg-opacity-10 p-3 rounded shadow-sm">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-success">
              <Bullseye size={20} />
              <span className="fw-semibold fs-5">Total Goles</span>
            </div>
            <p className="fs-2 fw-bold m-0 text-success">
              {equipos.reduce((sum, equipo) => sum + equipo.GF, 0)}
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="bg-warning bg-opacity-10 p-3 rounded shadow-sm">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2 text-warning">
              <Trophy size={20} />
              <span className="fw-semibold fs-5">Líder</span>
            </div>
            <p className="fs-5 fw-bold m-0 text-truncate text-warning">
              {equiposOrdenados[0]?.nombre || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="table-responsive border rounded shadow-sm">
        <table className="table table-sm align-middle text-center mb-0" style={{ minWidth: 720 }}>
          <thead className="table-light">
            <tr>
              <th scope="col" className="fw-semibold text-start px-3 py-2">
                #
              </th>
              <th scope="col" className="fw-semibold text-start px-3 py-2">
                Equipo
              </th>
              <SortableHeader field="PJ">PJ</SortableHeader>
              <SortableHeader field="PG">PG</SortableHeader>
              <SortableHeader field="PE">PE</SortableHeader>
              <SortableHeader field="PP">PP</SortableHeader>
              <SortableHeader field="GF">GF</SortableHeader>
              <SortableHeader field="GC">GC</SortableHeader>
              <SortableHeader field="DG">DG</SortableHeader>
              <SortableHeader field="Pts">Pts</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {equiposOrdenados.map((equipo, index) => {
              const isLider = index === 0
              const enZonaAscenso = index < 4
              const enZonaDescenso = index >= equipos.length - 3
              return (
                <tr
                  key={equipo.equipoId}
                  className={`${isLider ? "table-warning" : ""}`}
                  style={{
                    borderLeft: enZonaAscenso
                      ? "4px solid #198754"
                      : enZonaDescenso
                      ? "4px solid #dc3545"
                      : undefined,
                  }}
                >
                  <td className="fw-semibold text-start px-3 py-2">{index + 1}</td>
                  <td className="text-start d-flex align-items-center gap-2 px-3 py-2">
                    {equipo.escudo && equipo.escudo.startsWith("http") ? (
                      <img
                        src={equipo.escudo}
                        alt={equipo.nombre}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                        style={{ width: 24, height: 24, objectFit: "cover", borderRadius: "50%" }}
                      />
                    ) : (
                      <div
                        className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle"
                        style={{ width: 24, height: 24, fontWeight: "700" }}
                      >
                        {equipo.nombre.charAt(0)}
                      </div>
                    )}

                    <span>{equipo.nombre}</span>
                  </td>
                  <td className="px-3 py-2">{equipo.PJ}</td>
                  <td className="text-success fw-semibold px-3 py-2">{equipo.PG}</td>
                  <td className="text-warning fw-semibold px-3 py-2">{equipo.PE}</td>
                  <td className="text-danger fw-semibold px-3 py-2">{equipo.PP}</td>
                  <td className="px-3 py-2">{equipo.GF}</td>
                  <td className="px-3 py-2">{equipo.GC}</td>
                  <td
                    className={`fw-semibold px-3 py-2 ${
                      equipo.DG > 0
                        ? "text-success"
                        : equipo.DG < 0
                        ? "text-danger"
                        : "text-secondary"
                    }`}
                  >
                    {equipo.DG > 0 ? "+" : ""}
                    {equipo.DG}
                  </td>
                  <td className="px-3 py-2">
                    <span className="badge bg-primary fs-6 fw-bold">{equipo.Pts}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 d-flex flex-wrap justify-content-center gap-4 text-muted small">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#198754" }}></div>
          <span>Clasificación</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="rounded" style={{ width: 20, height: 5, backgroundColor: "#dc3545" }}></div>
          <span>Descenso</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Trophy color="#f59e0b" size={16} />
          <span>Líder</span>
        </div>
      </footer>

      <div className="mt-4 d-flex justify-content-between">
        <button
          onClick={fetchPosiciones}
          disabled={loading}
          className="btn btn-primary px-4 py-2 fw-semibold"
        >
          {loading ? "Actualizando..." : "Actualizar Tabla"}
        </button>

        
      </div>
    </div>
  )
}



