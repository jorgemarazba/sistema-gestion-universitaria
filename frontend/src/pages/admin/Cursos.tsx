import { useState } from 'react';
import { BookOpen, Eye, Edit2, Trash2, Search, Plus, Download, Monitor, Video, Users } from 'lucide-react';

interface Curso {
  id: number;
  nombre: string;
  programa: string;
  creditos: number;
  semestre: string;
  cupos: number;
  modalidad: 'Presencial' | 'Virtual' | 'Híbrido';
}

const cursosData: Curso[] = [
  {
    id: 1,
    nombre: 'Cálculo Diferencial',
    programa: 'Ing. Sistemas',
    creditos: 4,
    semestre: 'Sem 1',
    cupos: 5,
    modalidad: 'Presencial',
  },
  {
    id: 2,
    nombre: 'Programación I',
    programa: 'Ing. Sistemas',
    creditos: 4,
    semestre: 'Sem 1',
    cupos: 0,
    modalidad: 'Presencial',
  },
  {
    id: 3,
    nombre: 'Álgebra Lineal',
    programa: 'Ing. Sistemas',
    creditos: 3,
    semestre: 'Sem 2',
    cupos: 12,
    modalidad: 'Virtual',
  },
  {
    id: 4,
    nombre: 'Base de Datos',
    programa: 'Ing. Sistemas',
    creditos: 4,
    semestre: 'Sem 3',
    cupos: 8,
    modalidad: 'Híbrido',
  },
  {
    id: 5,
    nombre: 'Contabilidad General',
    programa: 'Contaduría',
    creditos: 3,
    semestre: 'Sem 1',
    cupos: 15,
    modalidad: 'Presencial',
  },
  {
    id: 6,
    nombre: 'Derecho Civil',
    programa: 'Derecho',
    creditos: 4,
    semestre: 'Sem 2',
    cupos: 3,
    modalidad: 'Presencial',
  },
  {
    id: 7,
    nombre: 'Anatomía Humana',
    programa: 'Medicina',
    creditos: 6,
    semestre: 'Sem 1',
    cupos: 0,
    modalidad: 'Presencial',
  },
  {
    id: 8,
    nombre: 'Psicología General',
    programa: 'Psicología',
    creditos: 3,
    semestre: 'Sem 1',
    cupos: 20,
    modalidad: 'Virtual',
  },
];

const modalidades = ['Todos', 'Presencial', 'Virtual', 'Híbrido'] as const;

export const AdminCursos = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroModalidad, setFiltroModalidad] = useState<typeof modalidades[number]>('Todos');

  const cursosFiltrados = cursosData.filter((curso) => {
    const matchBusqueda =
      curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.programa.toLowerCase().includes(busqueda.toLowerCase());
    const matchModalidad = filtroModalidad === 'Todos' || curso.modalidad === filtroModalidad;
    return matchBusqueda && matchModalidad;
  });

  const getModalidadIcon = (modalidad: string) => {
    switch (modalidad) {
      case 'Presencial':
        return <Users size={14} className="mr-1" />;
      case 'Virtual':
        return <Video size={14} className="mr-1" />;
      case 'Híbrido':
        return <Monitor size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const getModalidadStyle = (modalidad: string) => {
    switch (modalidad) {
      case 'Presencial':
        return 'bg-blue-100 text-blue-700';
      case 'Virtual':
        return 'bg-green-100 text-green-700';
      case 'Híbrido':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Gestión de Cursos</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#000000' }}>Administra los cursos del sistema</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition">
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            <span>Nuevo Curso</span>
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
              placeholder="Buscar por nombre o programa..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {modalidades.map((modalidad) => (
              <button
                key={modalidad}
                onClick={() => setFiltroModalidad(modalidad)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtroModalidad === modalidad
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {modalidad}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#000000' }}>
            <BookOpen size={20} />
            Lista de Cursos ({cursosFiltrados.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Curso</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Programa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Créditos</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Semestre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Cupos</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Modalidad</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cursosFiltrados.map((curso) => (
                <tr key={curso.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">#{curso.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#000000' }}>{curso.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>{curso.programa}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>{curso.creditos} cr</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>{curso.semestre}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        curso.cupos === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {curso.cupos} cupos
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getModalidadStyle(
                        curso.modalidad
                      )}`}
                    >
                      {getModalidadIcon(curso.modalidad)}
                      {curso.modalidad}
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
                      <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                        <Trash2 size={16} />
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
