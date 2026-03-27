import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, Mail, Phone, RefreshCw, X, Send } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3002/api/v1';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  email_personal?: string;
  telefono: string;
  documento_tipo: string;
  documento_numero: string;
  tipo_usuario: 'estudiante' | 'profesor' | 'administrador';
  estado: 'activo' | 'verificacion pendiente' | 'suspendido';
  fecha_registro: string;
}

const filtros = ['Todos', 'estudiante', 'profesor', 'administrador'] as const;
type FiltroRol = typeof filtros[number];

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState<FiltroRol>('Todos');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/usuarios`);
      const usuariosData = response.data?.data || response.data || [];
      setUsuarios(usuariosData);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda = 
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.documento_numero?.includes(busqueda);
    
    const coincideFiltro = filtroActivo === 'Todos' || usuario.tipo_usuario === filtroActivo;
    
    return coincideBusqueda && coincideFiltro;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-700';
      case 'verificacion pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'suspendido': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'estudiante': return 'bg-blue-50 text-blue-600';
      case 'profesor': return 'bg-purple-50 text-purple-600';
      case 'administrador': return 'bg-orange-50 text-orange-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const verDetalles = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
    setMensajeExito('');
  };

  const reenviarCredenciales = async () => {
    if (!usuarioSeleccionado) return;
    
    try {
      setReenviando(true);
      await axios.post(`${API_URL}/usuarios/${usuarioSeleccionado.id_usuario}/reenviar-credenciales`);
      setMensajeExito('✅ Credenciales reenviadas exitosamente al correo personal del usuario.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al reenviar credenciales');
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-sm mt-1 font-medium text-gray-300">Administra los usuarios del sistema</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={cargarUsuarios}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Actualizar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {filtro === 'Todos' ? 'Todos' : filtro.charAt(0).toUpperCase() + filtro.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <span>👥</span>
            Lista de Usuarios ({usuariosFiltrados.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800 border-b border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Documento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Estado</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-slate-800 transition">
                  <td className="px-6 py-4 text-sm font-medium text-white">#{usuario.id_usuario}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{usuario.nombre} {usuario.apellido}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Mail size={14} />
                        {usuario.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Phone size={14} />
                        {usuario.telefono || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <span className="font-medium text-white">{usuario.documento_tipo}</span> {usuario.documento_numero}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRolColor(usuario.tipo_usuario)}`}>
                      {usuario.tipo_usuario}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getEstadoColor(usuario.estado)}`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => verDetalles(usuario)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Ver detalles y credenciales"
                      >
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

      {/* Modal de Detalles */}
      {mostrarModal && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#374151] rounded-xl shadow-2xl border border-gray-600 max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-600 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Credenciales del Usuario</h3>
              <button onClick={() => setMostrarModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400">Nombre Completo</label>
                <p className="text-white font-medium">{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Correo Institucional</label>
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium font-mono bg-slate-800 p-2 rounded flex-1">{usuarioSeleccionado.email}</p>
                </div>
              </div>

              {usuarioSeleccionado.email_personal && (
                <div>
                  <label className="text-sm text-gray-400">Correo Personal</label>
                  <p className="text-white">{usuarioSeleccionado.email_personal}</p>
                </div>
              )}

              <div className="bg-yellow-900 border border-yellow-700 p-3 rounded">
                <p className="text-yellow-300 text-sm">
                  <strong>⚠️ Nota:</strong> La contraseña temporal solo se muestra al momento de aprobar la solicitud. 
                  Si el usuario no la recibió por email, puedes reenviar las credenciales.
                </p>
              </div>

              {mensajeExito && (
                <div className="bg-green-900 border border-green-700 text-green-300 p-3 rounded">
                  {mensajeExito}
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  onClick={reenviarCredenciales}
                  disabled={reenviando}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Send size={18} />
                  {reenviando ? 'Enviando...' : 'Reenviar Credenciales'}
                </button>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
