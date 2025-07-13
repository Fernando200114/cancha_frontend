import { useEffect, useState } from "react";

// Tipo de equipo
interface Equipo {
  id: number;
  nombre: string;
  jugadoresDestacados: string[];
  PJ: number;
  PG: number;
  PE: number;
  PP: number;
  GF: number;
  GC: number;
  Dif: number;
  Pts: number;
}

// Tipo de fase
interface Fase {
  id: number;
  nombre: string;
  equipos: Equipo[];
}

const fasesIniciales: Fase[] = [
  // Mismos datos que antes...
];

export default function TablaCRUD() {
  // Estado con los datos, que luego vendrán del backend
  const [fases, setFases] = useState<Fase[]>([]);
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [editandoEquipoId, setEditandoEquipoId] = useState<number | null>(null);
  const [equipoEditado, setEquipoEditado] = useState<Partial<Equipo>>({});

  useEffect(() => {
    // Simulamos fetch al backend:
    setFases(fasesIniciales);
  }, []);

  // Abrir/ cerrar fase
  const toggleFase = (id: number) => {
    setFaseActiva(faseActiva === id ? null : id);
  };

  // Empezar a editar un equipo
  const editarEquipo = (equipo: Equipo) => {
    setEditandoEquipoId(equipo.id);
    setEquipoEditado(equipo);
  };

  // Guardar cambios (simulado, luego lo haces llamar API PUT)
  const guardarCambios = () => {
    if (editandoEquipoId === null) return;

    setFases((prevFases) =>
      prevFases.map((fase) => ({
        ...fase,
        equipos: fase.equipos.map((eq) =>
          eq.id === editandoEquipoId ? { ...eq, ...equipoEditado } : eq
        ),
      }))
    );

    setEditandoEquipoId(null);
    setEquipoEditado({});
    alert("Cambios guardados (simulado)");
  };

  // Manejar cambios en inputs
  const onChangeCampo = (campo: keyof Equipo, valor: any) => {
    setEquipoEditado((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">
          Tabla de Posiciones CRUD (Simulado)
        </h1>

        {fases.map((fase) => (
          <div
            key={fase.id}
            className="mb-10 border border-gray-300 rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center bg-gray-200 px-8 py-5 rounded-t-lg
                text-left font-semibold text-lg text-gray-800 hover:bg-yellow-300 transition-colors"
              onClick={() => toggleFase(fase.id)}
            >
              {fase.nombre}
              <span className="text-2xl font-bold">
                {faseActiva === fase.id ? "▲" : "▼"}
              </span>
            </button>

            {faseActiva === fase.id && (
              <table className="w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                    <th className="border border-gray-400 px-6 py-4">#</th>
                    <th className="border border-gray-400 px-6 py-4 text-left">
                      Equipo
                    </th>
                    <th className="border border-gray-400 px-6 py-4 text-left">
                      Jugadores Destacados
                    </th>
                    <th className="border border-gray-400 px-5 py-4">PJ</th>
                    <th className="border border-gray-400 px-5 py-4">PG</th>
                    <th className="border border-gray-400 px-5 py-4">PE</th>
                    <th className="border border-gray-400 px-5 py-4">PP</th>
                    <th className="border border-gray-400 px-5 py-4">GF</th>
                    <th className="border border-gray-400 px-5 py-4">GC</th>
                    <th className="border border-gray-400 px-5 py-4">Dif</th>
                    <th className="border border-gray-400 px-6 py-4">Pts</th>
                    <th className="border border-gray-400 px-6 py-4">Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {fase.equipos.map((eq, index) => (
                    <tr
                      key={eq.id}
                      className={`cursor-pointer transition-colors duration-200 ${
                        index === 0
                          ? "font-semibold bg-yellow-200 text-gray-900"
                          : "hover:bg-yellow-100 text-gray-700"
                      }`}
                    >
                      <td className="border border-gray-400 px-6 py-4 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-400 px-6 py-4">
                        {eq.nombre}
                      </td>
                      <td className="border border-gray-400 px-6 py-4">
                        {eq.jugadoresDestacados.join(", ")}
                      </td>

                      {/* Aquí mostramos inputs si es el equipo editando */}
                      {editandoEquipoId === eq.id ? (
                        <>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.PJ}
                              onChange={(e) =>
                                onChangeCampo("PJ", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.PG}
                              onChange={(e) =>
                                onChangeCampo("PG", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.PE}
                              onChange={(e) =>
                                onChangeCampo("PE", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.PP}
                              onChange={(e) =>
                                onChangeCampo("PP", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.GF}
                              onChange={(e) =>
                                onChangeCampo("GF", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.GC}
                              onChange={(e) =>
                                onChangeCampo("GC", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.Dif}
                              onChange={(e) =>
                                onChangeCampo("Dif", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-center">
                            <input
                              type="number"
                              value={equipoEditado.Pts}
                              onChange={(e) =>
                                onChangeCampo("Pts", Number(e.target.value))
                              }
                              className="w-full text-center"
                            />
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-center">
                            <button
                              onClick={guardarCambios}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditandoEquipoId(null)}
                              className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600"
                            >
                              Cancelar
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            {eq.PJ}
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            {eq.PG}
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            {eq.PE}
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            {eq.PP}
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            {eq.GF}
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            {eq.GC}
                          </td>
                          <td className="border border-gray-400 px-5 py-4 text-center">
                            {eq.Dif}
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-center">
                            {eq.Pts}
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-center">
                            <button
                              onClick={() => editarEquipo(eq)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Editar
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
