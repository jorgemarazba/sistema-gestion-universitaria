import { useState } from 'react';
import { Folder, Clock, BookOpen, Users, Eye, Edit2, Trash2, Search, Plus } from 'lucide-react';

interface Programa {
  id: number;
  nombre: string;
  descripcion: string;
  semestres: number;
  cursos: number;
  estudiantes: number;
  estado: 'Activo' | 'Inactivo';
}

const programasData: Programa[] = [
  {
    id: 1,
    nombre: 'Ingeniería de Sistemas',
    descripcion: 'Programa de formación en tecnologías de la información y desarrollo de software',
    semestres: 10,
    cursos: 45,
    estudiantes: 320,
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'Administración de Empresas',
    descripcion: 'Formación en gestión empresarial y liderazgo organizacional',
    semestres: 10,
    cursos: 42,
    estudiantes: 280,
    estado: 'Activo',
  },
  {
    id: 3,
    nombre: 'Contaduría Pública',
    descripcion: 'Programa especializado en contabilidad y finanzas',
    semestres: 10,
    cursos: 40,
    estudiantes: 195,
    estado: 'Activo',
  },
  {
    id: 4,
    nombre: 'Derecho',
    descripcion: 'Formación en ciencias jurídicas y legales',
    semestres: 10,
    cursos: 48,
    estudiantes: 250,
    estado: 'Activo',
  },
  {
    id: 5,
    nombre: 'Medicina',
    descripcion: 'Programa de formación en ciencias de la salud',
    semestres: 12,
    cursos: 65,
    estudiantes: 180,
    estado: 'Activo',
  },
  {
    id: 6,
    nombre: 'Psicología',
    descripcion: 'Estudio del comportamiento humano y procesos mentales',
    semestres: 10,
    cursos: 38,
    estudiantes: 210,
    estado: 'Activo',
  },
];

export const AdminProgramas = () => {
  const [busqueda, setBusqueda] = useState('');

  const programasFiltrados = programasData.filter(
    (programa) =>
      programa.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      programa.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Programas</h1>
          <p className="text-sm mt-1 font-medium text-gray-300">Administra los programas académicos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus size={18} />
          <span>Nuevo Programa</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 p-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar programas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid de Programas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programasFiltrados.map((programa) => (
          <div key={programa.id} className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 overflow-hidden hover:shadow-xl transition">
            {/* Card Header */}
            <div className="p-4 pb-2">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Folder className="text-blue-600" size={20} />
                </div>
                <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  {programa.estado}
                </span>
              </div>
              
              <h2 className="text-lg font-bold mb-2 text-white">{programa.nombre}</h2>
              <p className="text-sm leading-relaxed text-gray-300">{programa.descripcion}</p>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 border-t border-gray-600">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <Clock size={16} className="text-gray-400 mb-1" />
                  <span className="text-lg font-bold text-white">{programa.semestres}</span>
                  <span className="text-xs text-gray-300">Semestres</span>
                </div>
                <div className="flex flex-col items-center">
                  <BookOpen size={16} className="text-gray-400 mb-1" />
                  <span className="text-lg font-bold text-white">{programa.cursos}</span>
                  <span className="text-xs text-gray-300">Cursos</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users size={16} className="text-gray-400 mb-1" />
                  <span className="text-lg font-bold text-white">{programa.estudiantes}</span>
                  <span className="text-xs text-gray-300">Estudiantes</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-gray-600 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-500 rounded-lg hover:bg-gray-600 transition">
                <Eye size={16} className="text-gray-300" />
                <span className="text-sm font-medium text-gray-200">Ver</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-500 rounded-lg hover:bg-gray-600 transition">
                <Edit2 size={16} className="text-gray-300" />
                <span className="text-sm font-medium text-gray-200">Editar</span>
              </button>
              <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
