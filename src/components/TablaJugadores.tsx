import React from 'react';

interface Jugador {
  id: number;
  nombre: string;
  posicion: string;
  numero: number;
}

interface Props {
  jugadores: Jugador[];
  eliminarJugador: (id: number) => void;
}

const TablaJugadores: React.FC<Props> = ({ jugadores, eliminarJugador }) => {
  if (jugadores.length === 0) {
    return <p>No hay jugadores agregados.</p>;
  }

  return (
    <table
      border={1}
      cellPadding={8}
      style={{ width: '100%', borderCollapse: 'collapse' }}
    >
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Posición</th>
          <th>Número</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {jugadores.map(j => (
          <tr key={j.id}>
            <td>{j.nombre}</td>
            <td>{j.posicion}</td>
            <td>{j.numero}</td>
            <td>
              <button
                onClick={() => eliminarJugador(j.id)}
                style={{ color: 'red' }}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaJugadores;
