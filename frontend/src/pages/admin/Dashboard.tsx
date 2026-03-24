import React from 'react';

export const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Principal</h1>
      
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Usuarios</h2>
          <p className="text-3xl font-bold text-gray-800">1,254</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Cursos Activos</h2>
          <p className="text-3xl font-bold text-gray-800">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Solicitudes Pendientes</h2>
          <p className="text-3xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Alertas del Sistema</h2>
          <p className="text-3xl font-bold text-gray-800">2</p>
        </div>
      </div>

      {/* Aquí luego podemos agregar un gráfico o tabla resumen */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
        <p className="text-gray-600">Conectaremos esto con la API más adelante...</p>
      </div>
    </div>
  );
};