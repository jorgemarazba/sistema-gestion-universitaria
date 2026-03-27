import { useState } from 'react';
import { CreditCard, Eye, Download, CheckCircle, Search, Plus, DollarSign, Calendar } from 'lucide-react';

interface Pago {
  id: number;
  estudiante: string;
  concepto: string;
  monto: string;
  fechaVencimiento: string;
  estado: 'Pagado' | 'Pendiente' | 'Vencido' | 'Parcial';
  metodoPago: string;
}

const pagosData: Pago[] = [
  {
    id: 1,
    estudiante: 'Maria Garcia',
    concepto: 'Matrícula 2024-1',
    monto: '$2,500,000',
    fechaVencimiento: '2024-02-15',
    estado: 'Pagado',
    metodoPago: 'Transferencia',
  },
  {
    id: 2,
    estudiante: 'Carlos Lopez',
    concepto: 'Matrícula 2024-1',
    monto: '$2,500,000',
    fechaVencimiento: '2024-02-15',
    estado: 'Pendiente',
    metodoPago: 'Pendiente',
  },
  {
    id: 3,
    estudiante: 'Ana Martinez',
    concepto: 'Curso de Verano',
    monto: '$850,000',
    fechaVencimiento: '2024-01-30',
    estado: 'Vencido',
    metodoPago: '—',
  },
  {
    id: 4,
    estudiante: 'Pedro Sanchez',
    concepto: 'Matrícula 2024-1',
    monto: '$2,500,000',
    fechaVencimiento: '2024-02-15',
    estado: 'Parcial',
    metodoPago: 'Efectivo',
  },
  {
    id: 5,
    estudiante: 'Laura Torres',
    concepto: 'Laboratorio Química',
    monto: '$320,000',
    fechaVencimiento: '2024-03-01',
    estado: 'Pagado',
    metodoPago: 'Tarjeta Crédito',
  },
  {
    id: 6,
    estudiante: 'Roberto Diaz',
    concepto: 'Matrícula 2023-2',
    monto: '$2,300,000',
    fechaVencimiento: '2023-08-15',
    estado: 'Vencido',
    metodoPago: '—',
  },
];

const filtros = ['Todos', 'Pagado', 'Pendiente', 'Vencido', 'Parcial'] as const;

export const AdminPagos = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<typeof filtros[number]>('Todos');

  const pagosFiltrados = pagosData.filter((pago) => {
    const matchBusqueda =
      pago.estudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
      pago.concepto.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'Todos' || pago.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'Vencido':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'Parcial':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Gestión de Pagos</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#000000' }}>Administra los pagos de estudiantes</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition">
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            <span>Nuevo Pago</span>
          </button>
        </div>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por estudiante o concepto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroEstado(filtro)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtroEstado === filtro
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Pagos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#000000' }}>
            <CreditCard size={20} />
            Lista de Pagos ({pagosFiltrados.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Estudiante</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Concepto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Monto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Fecha Venc.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Método</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagosFiltrados.map((pago) => (
                <tr key={pago.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">#{pago.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#000000' }}>{pago.estudiante}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>{pago.concepto}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#000000' }}>
                      <DollarSign size={14} />
                      {pago.monto}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm" style={{ color: '#000000' }}>
                      <Calendar size={14} className="text-slate-400" />
                      {pago.fechaVencimiento}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getEstadoStyle(
                        pago.estado
                      )}`}
                    >
                      {pago.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>{pago.metodoPago}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Eye size={16} />
                      </button>
                      {pago.estado === 'Pendiente' && (
                        <button className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
