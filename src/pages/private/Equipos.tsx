import type React from "react";
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
  const token = localStorage.getItem("token");
  let esAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      esAdmin = payload.rol === "admin";
    } catch {
      console.error("Token inválido");
    }
  }

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [equipoActual, setEquipoActual] = useState<Equipo>({
    _id: "",
    nombre: "",
    ciudad: "",
    entrenador: "",
    escudoUrl: "",
    puntos: 0,
  });
  const [editando, setEditando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroOrden, setFiltroOrden] = useState<"nombre" | "puntos" | "ciudad">("puntos");

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const cargarEquiposYPosiciones = async () => {
      try {
        const [equiposRes, posicionesRes] = await Promise.all([
          axios.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos", { headers }),
          axios.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/tabla-posiciones", { headers }),
        ]);

        const equiposData = equiposRes.data;
        const posicionesData = posicionesRes.data;

        if (!Array.isArray(equiposData)) throw new Error("La respuesta de /equipos no es un arreglo.");

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

        equiposActualizados.sort((a, b) => {
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
  }, [token]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEquipoActual({
      ...equipoActual,
      [name]: name === "puntos" ? Number.parseInt(value) || 0 : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagenArchivo(file);

  };

  const resetFormulario = () => {
    setEquipoActual({ _id: "", nombre: "", ciudad: "", entrenador: "", escudoUrl: "", puntos: 0 });
    setImagenArchivo(null);
    setEditando(false);
    setMostrarFormulario(false);
    
  };

  const editarEquipo = (equipo: Equipo) => {
    setEquipoActual(equipo);
    setEditando(true);
    setMostrarFormulario(true);
    
    setImagenArchivo(null);
  };

  const eliminarEquipo = async (_id: string) => {
    if (!token) return console.error("No hay token para autenticación.");
    try {
      await axios.delete(`https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipos(equipos.filter((eq) => eq._id !== _id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return console.error("No hay token para autenticación.");

    try {
      const formData = new FormData();

      formData.append("nombre", equipoActual.nombre);
      formData.append("ciudad", equipoActual.ciudad);
      formData.append("entrenador", equipoActual.entrenador);
      formData.append("puntos", equipoActual.puntos.toString());

      // Si hay archivo nuevo, lo agregamos
      if (imagenArchivo) {
        formData.append("escudo", imagenArchivo);
      } else if (editando && equipoActual.escudoUrl) {
        // Si editamos pero no cambiamos imagen, enviamos la url para que no se pierda
        formData.append("escudoUrl", equipoActual.escudoUrl);
      }

      const endpoint = editando
        ? `https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos/${equipoActual._id}`
        : `https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos`;

      const method = editando ? axios.put : axios.post;

      await method(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Importante: NO poner Content-Type, axios lo maneja para multipart/form-data automáticamente
        },
      });

      // Refrescar lista
      const res = await axios.get("https://nestjs-cancha-backend-api.desarrollo-software.xyz/equipos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipos(res.data);
      resetFormulario();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
    }
  };

  return (
    <div className="container mt-4">
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
        {esAdmin && (
          <button className="btn btn-success" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            {mostrarFormulario ? "Ocultar Formulario" : "Nuevo Equipo"}
          </button>
        )}
      </div>

      {esAdmin && mostrarFormulario && (
        <form onSubmit={handleSubmit} className="card card-body mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                name="nombre"
                value={equipoActual.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                name="ciudad"
                type="text"
                value={equipoActual.ciudad}
                onChange={handleInputChange}
                placeholder="Ciudad"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="entrenador"
                value={equipoActual.entrenador}
                onChange={handleInputChange}
                placeholder="Dueño del Equipo"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control"
                required={!editando} // obligatorio solo si es creación
              />
            </div>
            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editando ? "Actualizar" : "Guardar"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetFormulario}>
                Cancelar
              </button>
            </div>
          </div>

          {imagenArchivo && (
            <img
              src={URL.createObjectURL(imagenArchivo)}
              alt="preview"
              style={{ width: 200, height: 200, objectFit: "cover" }}
            />
          )}
        </form>
      )}

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Escudo</th>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Dueño Equipo</th>
            <th>Puntos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {equiposFiltrados.length > 0 ? (
            equiposFiltrados.map((equipo) => (
              <tr key={equipo._id}>
                <td>
                  <img
                    src={
                      (equipo.escudoUrl ?? "").startsWith("data:image")
                        ? equipo.escudoUrl
                        : `https://nestjs-cancha-backend-api.desarrollo-software.xyz/static/imagenes/${equipo.escudoUrl || "default.png"}`
                    }
                    alt={equipo.nombre}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/imagenes/mono.png?height=50&width=50";
                    }}
                  />
                </td>
                <td>{equipo.nombre}</td>
                <td>{equipo.ciudad}</td>
                <td>{equipo.entrenador}</td>
                <td>{equipo.puntos}</td>
                <td>
                  {esAdmin && (
                    <>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editarEquipo(equipo)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarEquipo(equipo._id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No hay equipos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
