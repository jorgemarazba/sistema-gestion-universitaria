import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, Mail, Phone, RefreshCw, X, Send, Shield, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3003/api/v1';

type Rol = 'estudiante' | 'profesor' | 'administrador';

interface Usuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  correoInstitucional: string;
  correoPersonal?: string;
  telefono?: string;
  documentoIdentidad: string;
  rol: Rol;
  estado: 'activo' | 'verificacion pendiente' | 'suspendido';
  fechaRegistro: string;
}

interface FormNuevoUsuario {
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  correoPersonal: string;
  telefono: string;
  rol: Rol;
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
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [creandoUsuario, setCreandoUsuario] = useState(false);
  const [formNuevoUsuario, setFormNuevoUsuario] = useState<FormNuevoUsuario>({
    nombre: '',
    apellido: '',
    documentoIdentidad: '',
    correoPersonal: '',
    telefono: '',
    rol: 'estudiante',
  });
  const [reenviando, setReenviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [usuarioEliminando, setUsuarioEliminando] = useState<Usuario | null>(null);
  const [eliminandoUsuario, setEliminandoUsuario] = useState(false);

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
      usuario.correoInstitucional?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.documentoIdentidad?.includes(busqueda);
    
    const coincideFiltro = filtroActivo === 'Todos' || 
      usuario.rol?.toLowerCase() === filtroActivo.toLowerCase();
    
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

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreandoUsuario(true);
      await axios.post(`${API_URL}/usuarios`, {
        nombre: formNuevoUsuario.nombre,
        apellido: formNuevoUsuario.apellido,
        documentoIdentidad: formNuevoUsuario.documentoIdentidad,
        correoPersonal: formNuevoUsuario.correoPersonal,
        telefono: formNuevoUsuario.telefono,
        rol: formNuevoUsuario.rol,
        estado: 'activo',
      });
      setMostrarModalCrear(false);
      setFormNuevoUsuario({
        nombre: '',
        apellido: '',
        documentoIdentidad: '',
        correoPersonal: '',
        telefono: '',
        rol: 'estudiante',
      });
      cargarUsuarios();
      setMensajeExito('Usuario creado exitosamente');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al crear usuario:', err);
      alert('Error al crear usuario');
    } finally {
      setCreandoUsuario(false);
    }
  };

  // Función para abrir modal de edición
  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setMostrarModalEditar(true);
  };

  // Función para editar usuario
  const handleEditarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioEditando) return;
    
    try {
      setEditandoUsuario(true);
      await axios.patch(`${API_URL}/usuarios/${usuarioEditando.id_usuario}`, {
        nombre: usuarioEditando.nombre,
        apellido: usuarioEditando.apellido,
        telefono: usuarioEditando.telefono,
        correoPersonal: usuarioEditando.correoPersonal,
        rol: usuarioEditando.rol,
        estado: usuarioEditando.estado,
      });
      
      cargarUsuarios();
      setMensajeExito('Usuario actualizado exitosamente');
      setTimeout(() => setMensajeExito(''), 3000);
      setMostrarModalEditar(false);
    } catch (err) {
      console.error('Error al editar usuario:', err);
      alert('Error al editar usuario');
    } finally {
      setEditandoUsuario(false);
    }
  };

  // Función para confirmar eliminación
  const confirmarEliminar = (usuario: Usuario) => {
    setUsuarioEliminando(usuario);
    setMostrarConfirmacionEliminar(true);
  };

  // Función para eliminar usuario
  const handleEliminarUsuario = async () => {
    if (!usuarioEliminando) return;
    
    try {
      setEliminandoUsuario(true);
      await axios.delete(`${API_URL}/usuarios/${usuarioEliminando.id_usuario}`);
      
      cargarUsuarios();
      setMensajeExito('Usuario eliminado exitosamente');
      setTimeout(() => setMensajeExito(''), 3000);
      setMostrarConfirmacionEliminar(false);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('Error al eliminar usuario');
    } finally {
      setEliminandoUsuario(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-sm mt-1 font-medium text-gray-300">Administra los usuarios del sistema</p>
        </div>
        <button 
          onClick={cargarUsuarios}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Actualizar</span>
        </button>
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
            <Users size={20} className="text-blue-400" />
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
                  <td className="px-6 py-4 text-sm font-medium text-white">#{usuario.id_usuario.slice(0,8)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{usuario.nombre} {usuario.apellido}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Mail size={14} />
                        {usuario.correoInstitucional || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Phone size={14} />
                        {usuario.telefono || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <span className="font-medium text-white">CC</span> {usuario.documentoIdentidad}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRolColor(usuario.rol)}`}>
                      {usuario.rol}
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
                      <button 
                        onClick={() => abrirModalEditar(usuario)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Editar usuario"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmarEliminar(usuario)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Eliminar usuario"
                      >
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

      {/* Modal de Detalles - Estilo glassmorphism con fondo transparente */}
      {mostrarModal && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-500/50 max-w-md w-full overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-linear-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Credenciales</h3>
                  <p className="text-blue-200 text-xs">Acceso Institucional</p>
                </div>
              </div>
              <button onClick={() => setMostrarModal(false)} className="text-white/80 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            {/* Contenido con mejor organización */}
            <div className="p-6 space-y-5">
              {/* Info del usuario */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-600">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                  usuarioSeleccionado.rol === 'estudiante' ? 'bg-blue-600' :
                  usuarioSeleccionado.rol === 'profesor' ? 'bg-cyan-500' :
                  usuarioSeleccionado.rol === 'administrador' ? 'bg-purple-500' :
                  'bg-blue-600'
                }`}>
                  {usuarioSeleccionado.nombre?.charAt(0)}{usuarioSeleccionado.apellido?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                  <p className="text-gray-400 text-sm capitalize">{usuarioSeleccionado.rol}</p>
                </div>
              </div>
              
              {/* Correo Institucional destacado */}
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                <label className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Correo Institucional</label>
                <div className="flex items-center gap-2 mt-2">
                  <Mail size={18} className="text-blue-400" />
                  <p className="text-white font-mono text-sm">{usuarioSeleccionado.correoInstitucional}</p>
                </div>
              </div>

              {usuarioSeleccionado.correoPersonal && (
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Correo Personal</label>
                  <p className="text-gray-300 text-sm mt-1">{usuarioSeleccionado.correoPersonal}</p>
                </div>
              )}

              {/* Alerta mejorada */}
              <div className="bg-amber-900/40 border border-amber-600/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-amber-200 text-sm leading-relaxed">
                    La contraseña temporal solo se muestra al momento de aprobar la solicitud. Si el usuario no la recibió, puedes reenviar las credenciales.
                  </p>
                </div>
              </div>

// ... (rest of the code remains the same)
              {mensajeExito && (
                <div className="bg-green-900/50 border border-green-500/40 text-green-300 p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle size={18} />
                  {mensajeExito}
                </div>
              )}

              {/* Botones */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={reenviarCredenciales}
                  disabled={reenviando}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg shadow-blue-900/30 disabled:opacity-50"
                >
                  <Send size={18} />
                  {reenviando ? 'Enviando...' : 'Reenviar Credenciales'}
                </button>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Usuario */}
      {mostrarModalCrear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#374151] rounded-xl shadow-2xl border border-gray-600 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-600 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Crear Nuevo Usuario</h3>
              <button onClick={() => setMostrarModalCrear(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCrearUsuario} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                  <input
                    type="text"
                    value={formNuevoUsuario.nombre}
                    onChange={(e) => setFormNuevoUsuario({...formNuevoUsuario, nombre: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Apellido</label>
                  <input
                    type="text"
                    value={formNuevoUsuario.apellido}
                    onChange={(e) => setFormNuevoUsuario({...formNuevoUsuario, apellido: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Documento de Identidad</label>
                <input
                  type="text"
                  value={formNuevoUsuario.documentoIdentidad}
                  onChange={(e) => setFormNuevoUsuario({...formNuevoUsuario, documentoIdentidad: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Correo Personal</label>
                <input
                  type="email"
                  value={formNuevoUsuario.correoPersonal}
                  onChange={(e) => setFormNuevoUsuario({...formNuevoUsuario, correoPersonal: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Teléfono</label>
                <input
                  type="tel"
                  value={formNuevoUsuario.telefono}
                  onChange={(e) => setFormNuevoUsuario({...formNuevoUsuario, telefono: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Rol</label>
                <select
                  value={formNuevoUsuario.rol}
                  onChange={(e) => setFormNuevoUsuario({...formNuevoUsuario, rol: e.target.value as Rol})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={creandoUsuario}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {creandoUsuario ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Crear Usuario
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModalCrear(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL: EDITAR USUARIO ========== */}
      {mostrarModalEditar && usuarioEditando && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937] rounded-2xl shadow-2xl w-full max-w-lg border border-gray-600 overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Editar Usuario</h3>
                  <p className="text-blue-200 text-xs">Modificar datos del usuario</p>
                </div>
              </div>
              <button onClick={() => setMostrarModalEditar(false)} className="text-white/80 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            {/* Formulario */}
            <form onSubmit={handleEditarUsuario} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    value={usuarioEditando.nombre}
                    onChange={(e) => setUsuarioEditando({...usuarioEditando, nombre: e.target.value})}
                    className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Apellido</label>
                  <input 
                    type="text" 
                    value={usuarioEditando.apellido}
                    onChange={(e) => setUsuarioEditando({...usuarioEditando, apellido: e.target.value})}
                    className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                <input 
                  type="text" 
                  value={usuarioEditando.telefono || ''}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, telefono: e.target.value})}
                  className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Correo Personal</label>
                <input 
                  type="email" 
                  value={usuarioEditando.correoPersonal || ''}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, correoPersonal: e.target.value})}
                  className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              {usuarioEditando.correoInstitucional && (
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <label className="block text-xs font-medium text-blue-300 mb-1 uppercase tracking-wider">Correo Institucional</label>
                  <p className="text-blue-200 text-sm">{usuarioEditando.correoInstitucional}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Rol</label>
                  <select 
                    value={usuarioEditando.rol}
                    onChange={(e) => setUsuarioEditando({...usuarioEditando, rol: e.target.value as Rol})}
                    className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                  <select 
                    value={usuarioEditando.estado}
                    onChange={(e) => setUsuarioEditando({...usuarioEditando, estado: e.target.value as Usuario['estado']})}
                    className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="activo">Activo</option>
                    <option value="verificacion pendiente">Verificación Pendiente</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
              </div>
              {/* Botones */}
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={editandoUsuario}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg shadow-blue-900/30 disabled:opacity-50"
                >
                  {editandoUsuario ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModalEditar(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL: CONFIRMAR ELIMINAR ========== */}
      {mostrarConfirmacionEliminar && usuarioEliminando && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937] rounded-2xl shadow-2xl w-full max-w-md border border-gray-600 overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-red-600 to-red-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Eliminar Usuario</h3>
                  <p className="text-red-200 text-xs">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <button onClick={() => setMostrarConfirmacionEliminar(false)} className="text-white/80 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            {/* Contenido */}
            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-center">
                ¿Estás seguro de que deseas eliminar al usuario <strong className="text-white">{usuarioEliminando.nombre} {usuarioEliminando.apellido}</strong>?
              </p>
              <p className="text-red-400 text-sm text-center">
                Esta acción eliminará permanentemente todos los datos del usuario.
              </p>
              {/* Botones */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setMostrarConfirmacionEliminar(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminarUsuario}
                  disabled={eliminandoUsuario}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-medium shadow-lg shadow-red-900/30 disabled:opacity-50"
                >
                  {eliminandoUsuario ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
