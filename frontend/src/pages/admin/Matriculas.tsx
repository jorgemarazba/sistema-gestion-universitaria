import { useState } from 'react';
import { Calendar, Eye, CheckCircle, XCircle, Search, Plus, Download } from 'lucide-react';

interface Matricula {
  id: number;
  estudiante: string;
  programa: string;
  periodo: string;
  fecha: string;
  estado: 'aprobada' | 'pendiente' | 'en revisión' | 'rechazada' | 'cancelada por estudiante' | 'finalizada';
}

const matriculasData: Matricula[] = [
  {
    id: 1,
    estudiante: 'Maria Garcia',
    programa: 'Ing. Sistemas',
    periodo: '2024-1',
    fecha: '2024-01-15 10:30',
    estado: 'aprobada',
  },
  {
    id: 2,
    estudiante: 'Carlos Lopez',
    programa: 'Ing. Sistemas',
    periodo: '2024-1',
    fecha: '2024-01-14 14:20',
    estado: 'pendiente',
  },
  {
    id: 3,
    estudiante: 'Ana Martinez',
    programa: 'Derecho',
    periodo: '2024-1',
    fecha: '2024-01-14 09:15',
    estado: 'en revisión',
  },
  {
    id: 4,
    estudiante: 'Pedro Sanchez',
    programa: 'Medicina',
    periodo: '2024-1',
    fecha: '2024-01-13 16:45',
    estado: 'aprobada',
  },
  {
    id: 5,
    estudiante: 'Laura Torres',
    programa: 'Contaduría',
    periodo: '2024-1',
    fecha: '2024-01-12 11:00',
    estado: 'rechazada',
  },
  {
    id: 6,
    estudiante: 'Roberto Diaz',
    programa: 'Psicología',
    periodo: '2024-1',
    fecha: '2024-01-11 08:30',
    estado: 'cancelada por estudiante',
  },
  {
    id: 7,
    estudiante: 'Sofia Hernandez',
    programa: 'Administración',
    periodo: '2024-1',
    fecha: '2024-01-10 15:20',
    estado: 'aprobada',
  },
  {
    id: 8,
    estudiante: 'Diego Vargas',
    programa: 'Ing. Sistemas',
    periodo: '2023-2',
    fecha: '2024-01-09 12:10',
    estado: 'finalizada',
  },
];

const filtros = ['Todos', 'pendiente', 'en revisión', 'aprobada', 'rechazada'] as const;

export const AdminMatriculas = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<typeof filtros[number]>('Todos');

  const matriculasFiltradas = matriculasData.filter((matricula) => {
    const matchBusqueda =
      matricula.estudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
      matricula.programa.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'Todos' || matricula.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'en revisión':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'rechazada':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'cancelada por estudiante':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'finalizada':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return '✓';
      case 'pendiente':
        return '⏳';
      case 'en revisión':
        return '👁';
      case 'rechazada':
        return '✕';
      case 'cancelada por estudiante':
        return '⊘';
      case 'finalizada':
        return '✓';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Matrículas</h1>
          <p className="text-sm mt-1 font-medium text-gray-300">Administra las matrículas de estudiantes</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition">
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            <span>Nueva Matrícula</span>
          </button>
        </div>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por estudiante o programa..."
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

      {/* Lista de Matrículas */}
      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Calendar size={20} />
            Lista de Matrículas ({matriculasFiltradas.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800 border-b border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Estudiante</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Programa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Periodo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Estado</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {matriculasFiltradas.map((matricula) => (
                <tr key={matricula.id} className="hover:bg-slate-800 transition">
                  <td className="px-6 py-4 text-sm font-medium text-white">#{matricula.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">{matricula.estudiante}</td>
                  <td className="px-6 py-4 text-sm text-white">{matricula.programa}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                      {matricula.periodo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{matricula.fecha}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getEstadoStyle(
                        matricula.estado
                      )}`}
                    >
                      <span>{getEstadoIcon(matricula.estado)}</span>
                      {matricula.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Eye size={16} />
                      </button>
                      {matricula.estado === 'pendiente' || matricula.estado === 'en revisión' ? (
                        <>
                          <button className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition">
                            <CheckCircle size={16} />
                          </button>
                          <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : null}
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
