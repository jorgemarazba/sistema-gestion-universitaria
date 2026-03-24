import React from 'react';

export const AdminSolicitudes = () => {
  // Datos falsos por ahora (Mock data)
  const pendientes = [
    { id: 1, nombre: 'Ana Gómez', email: 'ana@universidad.edu', rol: 'Estudiante', fecha: '23 Oct 2023' },
    { id: 2, nombre: 'Carlos Ruiz', email: 'carlos.r@universidad.edu', rol: 'Profesor', fecha: '24 Oct 2023' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solicitudes Pendientes</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo Institucional</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol Solicitado</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.map((req) => (
              <tr key={req.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium">{req.nombre}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{req.email}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{req.rol}</td>
                <td className="px-5 py-4 text-sm flex justify-center gap-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs font-bold transition">Aprobar</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs font-bold transition">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};