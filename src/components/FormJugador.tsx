import React, { useState } from 'react';

interface Props {
  agregarJugador: (jugador: {
    nombre: string;
    posicion: string;
    numero: number;
  }) => void;
}

const FormJugador: React.FC<Props> = ({ agregarJugador }) => {
  // Estados para inputs
  const [nombre, setNombre] = useState('');
  const [posicion, setPosicion] = useState('');
  const [numero, setNumero] = useState<number | ''>('');

  // Manejar submit
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !posicion.trim() || numero === '') {
      alert('Completa todos los campos');
      return;
    }
    agregarJugador({
      nombre: nombre.trim(),
      posicion: posicion.trim(),
      numero: Number(numero),
    });
    setNombre('');
    setPosicion('');
    setNumero('');
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{ marginBottom: 20, display: 'flex', gap: 10 }}
    >
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Posición"
        value={posicion}
        onChange={e => setPosicion(e.target.value)}
      />
      <input
        type="number"
        placeholder="Número"
        value={numero}
        onChange={e =>
          setNumero(e.target.value === '' ? '' : Number(e.target.value))
        }
        style={{ width: 80 }}
      />
      <button type="submit">Agregar Jugador</button>
    </form>
  );
};

export default FormJugador;
