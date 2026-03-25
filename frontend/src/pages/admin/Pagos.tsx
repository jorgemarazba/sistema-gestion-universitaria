export const AdminPagos = () => {
  const pagos = [
    { id: 1, usuario: 'Juan Pérez', concepto: 'Matrícula 2024-1', monto: '$1,500,000', estado: 'Pagado', fecha: '2024-01-10' },
    { id: 2, usuario: 'María López', concepto: 'Curso Adicional', monto: '$750,000', estado: 'Pendiente', fecha: '2024-01-15' },
    { id: 3, usuario: 'Carlos García', concepto: 'Matrícula 2024-1', monto: '$1,500,000', estado: 'Vencido', fecha: '2024-01-05' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#000000' }}>Gestión de Pagos</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Usuario</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Concepto</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Monto</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Estado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Fecha</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase" style={{ color: '#000000' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium" style={{ color: '#000000' }}>{pago.usuario}</td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{pago.concepto}</td>
                <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#000000' }}>{pago.monto}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pago.estado === 'Pagado' ? 'bg-green-100 text-green-700' : pago.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`} style={{ color: '#000000' }}>
                    {pago.estado}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{pago.fecha}</td>
                <td className="px-5 py-4 text-sm flex justify-center gap-2">
                  <button className="text-blue-600 hover:underline">Procesar</button>
                  <button className="text-gray-600 hover:underline">Descargar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
