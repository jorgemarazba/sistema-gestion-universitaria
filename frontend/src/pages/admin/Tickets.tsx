import { useState } from 'react';
import { MessageSquare, Eye, Edit2, Trash2, Search, Plus, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface Ticket {
  id: number;
  usuario: string;
  asunto: string;
  categoria: string;
  prioridad: 'Urgente' | 'Alta' | 'Media' | 'Baja';
  fecha: string;
  estado: 'Abierto' | 'En proceso' | 'Cerrado' | 'Urgente';
}

const ticketsData: Ticket[] = [
  {
    id: 1,
    usuario: 'Maria Garcia',
    asunto: 'Error al cargar notas',
    categoria: 'Académico',
    prioridad: 'Alta',
    fecha: '2024-03-20 14:30',
    estado: 'Abierto',
  },
  {
    id: 2,
    usuario: 'Carlos Lopez',
    asunto: 'Problema con pago en línea',
    categoria: 'Financiero',
    prioridad: 'Urgente',
    fecha: '2024-03-19 11:20',
    estado: 'Urgente',
  },
  {
    id: 3,
    usuario: 'Ana Martinez',
    asunto: 'Solicitud de certificado',
    categoria: 'Documentos',
    prioridad: 'Media',
    fecha: '2024-03-19 09:15',
    estado: 'En proceso',
  },
  {
    id: 4,
    usuario: 'Pedro Sanchez',
    asunto: 'Cambio de contraseña',
    categoria: 'Técnico',
    prioridad: 'Baja',
    fecha: '2024-03-18 16:45',
    estado: 'Cerrado',
  },
  {
    id: 5,
    usuario: 'Laura Torres',
    asunto: 'Problema con inscripción',
    categoria: 'Académico',
    prioridad: 'Urgente',
    fecha: '2024-03-18 10:00',
    estado: 'Urgente',
  },
  {
    id: 6,
    usuario: 'Roberto Diaz',
    asunto: 'Consulta sobre beca',
    categoria: 'Financiero',
    prioridad: 'Media',
    fecha: '2024-03-17 13:20',
    estado: 'Abierto',
  },
  {
    id: 7,
    usuario: 'Sofia Hernandez',
    asunto: 'Error en plataforma virtual',
    categoria: 'Técnico',
    prioridad: 'Alta',
    fecha: '2024-03-17 08:30',
    estado: 'En proceso',
  },
];

const filtros = ['Todos', 'Abierto', 'En proceso', 'Cerrado', 'Urgente'] as const;

export const AdminTickets = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<typeof filtros[number]>('Todos');

  const ticketsFiltrados = ticketsData.filter((ticket) => {
    const matchBusqueda =
      ticket.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'Todos' || ticket.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'En proceso':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'Cerrado':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'Urgente':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPrioridadStyle = (prioridad: string) => {
    switch (prioridad) {
      case 'Urgente':
        return 'text-red-600 font-semibold';
      case 'Alta':
        return 'text-orange-600 font-semibold';
      case 'Media':
        return 'text-yellow-600';
      case 'Baja':
        return 'text-slate-600';
      default:
        return 'text-slate-600';
    }
  };

  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'Urgente':
        return <AlertTriangle size={14} className="text-red-500 mr-1" />;
      case 'Alta':
        return <AlertTriangle size={14} className="text-orange-500 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Gestión de Tickets</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#000000' }}>Administra los tickets de soporte</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            <span>Nuevo Ticket</span>
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
              placeholder="Buscar por usuario, asunto o categoría..."
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

      {/* Lista de Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#000000' }}>
            <MessageSquare size={20} />
            Lista de Tickets ({ticketsFiltrados.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Asunto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Prioridad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Estado</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ticketsFiltrados.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">#{ticket.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#000000' }}>{ticket.usuario}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>{ticket.asunto}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
                      {ticket.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center text-sm ${getPrioridadStyle(ticket.prioridad)}`}>
                      {getPrioridadIcon(ticket.prioridad)}
                      {ticket.prioridad}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm" style={{ color: '#000000' }}>
                      <Clock size={14} className="text-slate-400" />
                      {ticket.fecha}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getEstadoStyle(
                        ticket.estado
                      )}`}
                    >
                      {ticket.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit2 size={16} />
                      </button>
                      {ticket.estado !== 'Cerrado' && (
                        <button className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                        <XCircle size={16} />
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
