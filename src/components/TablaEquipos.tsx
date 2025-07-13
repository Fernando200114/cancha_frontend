import React from 'react';

interface Equipo {
  id: number;
  nombre: string;
  ciudad: string;
}

interface Props {
  equipos: Equipo[];
  eliminarEquipo: (id: number) => void;
}

const TablaEquipos: React.FC<Props> = ({ equipos, eliminarEquipo }) => {
  if (equipos.length === 0) {
    return <p>No hay equipos agregados.</p>;
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
          <th>Ciudad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {equipos.map(e => (
          <tr key={e.id}>
            <td>{e.nombre}</td>
            <td>{e.ciudad}</td>
            <td>
              <button
                onClick={() => eliminarEquipo(e.id)}
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

export default TablaEquipos;
