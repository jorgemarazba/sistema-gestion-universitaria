import { useState } from 'react';
import { Search, Download, Plus, Eye, Edit2, Trash2, Mail, Phone } from 'lucide-react';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  documentoTipo: string;
  documentoNumero: string;
  rol: 'Estudiante' | 'Profesor' | 'Administrador';
  estado: 'activo' | 'verificacion pendiente' | 'suspendido';
  fechaRegistro: string;
}

const usuariosData: Usuario[] = [
  {
    id: 1,
    nombre: 'Maria Garcia',
    email: 'maria@email.com',
    telefono: '3001234567',
    documentoTipo: 'CC',
    documentoNumero: '1234567890',
    rol: 'Estudiante',
    estado: 'activo',
    fechaRegistro: '2024-01-15'
  },
  {
    id: 2,
    nombre: 'Carlos Lopez',
    email: 'carlos@email.com',
    telefono: '3009876543',
    documentoTipo: 'CC',
    documentoNumero: '0987654321',
    rol: 'Estudiante',
    estado: 'verificacion pendiente',
    fechaRegistro: '2024-01-14'
  },
  {
    id: 3,
    nombre: 'Ana Martinez',
    email: 'ana@email.com',
    telefono: '3005551234',
    documentoTipo: 'CC',
    documentoNumero: '1122334455',
    rol: 'Profesor',
    estado: 'activo',
    fechaRegistro: '2024-01-14'
  },
  {
    id: 4,
    nombre: 'Pedro Sanchez',
    email: 'pedro@email.com',
    telefono: '3007778899',
    documentoTipo: 'CE',
    documentoNumero: '5544332211',
    rol: 'Estudiante',
    estado: 'activo',
    fechaRegistro: '2024-01-13'
  },
  {
    id: 5,
    nombre: 'Laura Torres',
    email: 'laura@email.com',
    telefono: '3002223344',
    documentoTipo: 'CC',
    documentoNumero: '6677889900',
    rol: 'Estudiante',
    estado: 'suspendido',
    fechaRegistro: '2024-01-12'
  },
  {
    id: 6,
    nombre: 'Roberto Diaz',
    email: 'roberto@email.com',
    telefono: '3001112222',
    documentoTipo: 'CC',
    documentoNumero: '1231231234',
    rol: 'Administrador',
    estado: 'activo',
    fechaRegistro: '2024-01-11'
  }
];

const filtros = ['Todos', 'Estudiante', 'Profesor'] as const;
type FiltroRol = typeof filtros[number];

export const AdminUsuarios = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState<FiltroRol>('Todos');

  const usuariosFiltrados = usuariosData.filter(usuario => {
    const coincideBusqueda = 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.documentoNumero.includes(busqueda);
    
    const coincideFiltro = filtroActivo === 'Todos' || usuario.rol === filtroActivo;
    
    return coincideBusqueda && coincideFiltro;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-700';
      case 'verificacion pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'suspendido':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'Estudiante':
        return 'bg-blue-50 text-blue-600';
      case 'Profesor':
        return 'bg-purple-50 text-purple-600';
      case 'Administrador':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Gestión de Usuarios</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#000000' }}>Administra los usuarios del sistema</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition">
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            <span>Nuevo Usuario</span>
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
              placeholder="Buscar por nombre, correo o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroActivo(filtro)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtroActivo === filtro
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

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#000000' }}>
            <span>👥</span>
            Lista de Usuarios ({usuariosFiltrados.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Documento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Rol</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Registro</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#000000' }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: '#000000' }}>
                    #{usuario.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold" style={{ color: '#000000' }}>{usuario.nombre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm" style={{ color: '#000000' }}>
                        <Mail size={14} />
                        {usuario.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: '#000000' }}>
                        <Phone size={14} />
                        {usuario.telefono}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>
                    <span className="font-medium" style={{ color: '#000000' }}>{usuario.documentoTipo}</span>{' '}
                    {usuario.documentoNumero}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium`} style={{ color: '#000000' }}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: '#000000' }}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize`} style={{ color: '#000000' }}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#000000' }}>
                    {usuario.fechaRegistro}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition">
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
