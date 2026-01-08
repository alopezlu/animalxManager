import React from 'react';
import { Member } from '../types';

const MembersTable: React.FC<{ members: Member[] }> = ({ members }) => (
  <div className="overflow-x-auto mt-5">
    <table className="min-w-full bg-white text-black rounded shadow">
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Género</th><th>Edad</th>
          <th>Fecha Nacimiento</th><th>DNI</th><th>Estado Cuota</th><th>Día Cuota</th><th>Tipo Pago</th><th>Cuota</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.Id} className="hover:bg-blue-50 transition">
            <td>{m.Id}</td><td>{m.Nombre}</td><td>{m.Correo}</td><td>{m.Telefono}</td><td>{m.Genero}</td><td>{m.Edad}</td>
            <td>{m.FechaNacimiento}</td><td>{m.DNI}</td><td>{m.EstadoCuota}</td><td>{m.DiaPagarCuota}</td><td>{m.TipoPago}</td><td>{m.Cuota}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {members.length === 0 && <p className="mt-5 text-gray-400">No hay miembros registrados.</p>}
  </div>
);
export default MembersTable;

