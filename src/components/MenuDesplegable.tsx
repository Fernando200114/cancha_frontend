import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const MenuDesplegable = () => {
  // Estado para saber si el menú está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cambia el estado para abrir o cerrar menú
  const toggleMenu = () => setMenuAbierto(prev => !prev);

  // Cierra menú (cuando se hace click en opción)
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Botón para abrir/cerrar menú */}
      <button onClick={toggleMenu}>
        {menuAbierto ? 'Cerrar Menú' : 'Abrir Menú'}
      </button>

      {/* Lista desplegable solo visible si menuAbierto es true */}
      {menuAbierto && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: 200,
            zIndex: 1000,
          }}
        >
          {/* Cada opción usa NavLink para navegación SPA y para saber si está activa */}
          <li>
            <NavLink
              to="/"
              onClick={cerrarMenu}
              style={({ isActive }) => ({
                display: 'block',
                padding: '8px 12px',
                backgroundColor: isActive ? '#ddd' : undefined,
                textDecoration: 'none',
                color: 'black',
              })}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/equipos"
              onClick={cerrarMenu}
              style={({ isActive }) => ({
                display: 'block',
                padding: '8px 12px',
                backgroundColor: isActive ? '#ddd' : undefined,
                textDecoration: 'none',
                color: 'black',
              })}
            >
              Equipos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jugadores"
              onClick={cerrarMenu}
              style={({ isActive }) => ({
                display: 'block',
                padding: '8px 12px',
                backgroundColor: isActive ? '#ddd' : undefined,
                textDecoration: 'none',
                color: 'black',
              })}
            >
              Jugadores
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tablaposiciones"
              onClick={cerrarMenu}
              style={({ isActive }) => ({
                display: 'block',
                padding: '8px 12px',
                backgroundColor: isActive ? '#ddd' : undefined,
                textDecoration: 'none',
                color: 'black',
              })}
            >
              TablaPosiciones
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MenuDesplegable;




