
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

interface Equipo {
  _id: string;
  nombre: string;
  ciudad: string;
  entrenador: string;
  escudoUrl: string;
  puntos: number;
  GF?: number;
  GC?: number;
  DG?: number;
}

export default function Equipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroOrden, setFiltroOrden] = useState<"nombre" | "puntos" | "ciudad">("puntos");

  useEffect(() => {
    const cargarEquiposYPosiciones = async () => {
      try {
        const [equiposRes, posicionesRes] = await Promise.all([
          axios.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos"),
          axios.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/tabla-posiciones"),
        ]);

        const equiposData = equiposRes.data;
        const posicionesData = posicionesRes.data;

        const equiposActualizados = equiposData.map((equipo: any) => {
          const posicion = posicionesData.find((p: any) => p.equipoId === equipo._id);
          return {
            ...equipo,
            puntos: posicion?.Pts || 0,
            GF: posicion?.GF || 0,
            GC: posicion?.GC || 0,
            DG: (posicion?.GF || 0) - (posicion?.GC || 0),
          };
        });

        equiposActualizados.sort((a: { puntos: number; DG: any; GF: any; }, b: { puntos: number; DG: any; GF: any; }) => {
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          if ((b.DG || 0) !== (a.DG || 0)) return (b.DG || 0) - (a.DG || 0);
          return (b.GF || 0) - (a.GF || 0);
        });

        setEquipos(equiposActualizados);
      } catch (err) {
        console.error("Error al cargar equipos:", err);
      }
    };

    cargarEquiposYPosiciones();
  }, []);

  const equiposFiltrados = useMemo(() => {
    const resultado = equipos.filter(
      (equipo) =>
        equipo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        equipo.ciudad.toLowerCase().includes(busqueda.toLowerCase()) ||
        equipo.entrenador.toLowerCase().includes(busqueda.toLowerCase())
    );

    resultado.sort((a, b) => {
      if (filtroOrden === "puntos") return b.puntos - a.puntos;
      if (filtroOrden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (filtroOrden === "ciudad") return a.ciudad.localeCompare(b.ciudad);
      return 0;
    });

    return resultado;
  }, [equipos, busqueda, filtroOrden]);

  return (
    <div className="container" style={{ paddingTop: "200px" }}>


      <h1>Liga de Equipos</h1>

      <div className="mb-3 d-flex gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="form-select"
          value={filtroOrden}
          onChange={(e) => setFiltroOrden(e.target.value as "nombre" | "puntos" | "ciudad")}
        >
          <option value="puntos">Ordenar por Puntos</option>
          <option value="nombre">Ordenar por Nombre</option>
          <option value="ciudad">Ordenar por Ciudad</option>
        </select>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Escudo</th>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Dueño Equipo</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {equiposFiltrados.length > 0 ? (
            equiposFiltrados.map((equipo) => (
              <tr key={equipo._id}>
                <td>
                  <img
                    src={`https://nestjs-cancha-backend-api.desarrollo-software.xyz/static/imagenes/${equipo.escudoUrl || "default.png"}`}
                    alt={equipo.nombre}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/imagenes/mono.png";
                    }}
                  />
                </td>
                <td>{equipo.nombre}</td>
                <td>{equipo.ciudad}</td>
                <td>{equipo.entrenador}</td>
                <td>{equipo.puntos}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-muted">
                No hay equipos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
