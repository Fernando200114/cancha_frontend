import React, { useState } from 'react';

interface Props {
  agregarEquipo: (equipo: { nombre: string; ciudad: string }) => void;
}

const FormEquipo: React.FC<Props> = ({ agregarEquipo }) => {
  // Estados para controlar inputs
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');

  // Maneja envío del formulario
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !ciudad.trim()) {
      alert('Completa todos los campos');
      return;
    }
    // Llama función para agregar equipo
    agregarEquipo({ nombre: nombre.trim(), ciudad: ciudad.trim() });
    // Limpia formulario
    setNombre('');
    setCiudad('');
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{ marginBottom: 20, display: 'flex', gap: 10 }}
    >
      <input
        type="text"
        placeholder="Nombre del equipo"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ciudad"
        value={ciudad}
        onChange={e => setCiudad(e.target.value)}
      />
      <button type="submit">Agregar Equipo</button>
    </form>
  );
};

export default FormEquipo;
