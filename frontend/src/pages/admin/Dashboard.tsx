import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UserPlus, 
  GraduationCap, 
  Send, 
  FileText,
  X,
  Users,
  UserCircle,
  BookOpen,
  TrendingUp,
  Activity,
  AlertCircle,
  Zap,
  Crown,
  Loader2,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';
import { getAdminStats, getRoleDistribution, type AdminStats, type RoleDistribution } from '../../services/admin.service';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3003/api/v1';

interface UsuarioReciente {
  id: number;
  initials: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: string;
  rol: string;
}

interface Ticket {
  id: string;
  asunto: string;
  descripcion: string;
  estado: 'abierto' | 'en_proceso' | 'escalado' | 'resuelto' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  creadoEn: string;
  usuario: {
    nombre: string;
    apellido: string;
    rol: string;
  };
}

interface Pago {
  id: string;
  concepto: string;
  monto: number;
  estado: 'pendiente' | 'procesado' | 'vencido' | 'cancelado';
  fechaVencimiento?: string;
  creadoEn: string;
  usuario: {
    nombre: string;
    apellido: string;
    rol: string;
  };
}

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [roleDistribution, setRoleDistribution] = useState<RoleDistribution[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState<UsuarioReciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para notificaciones toast
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Estados para modales
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalCurso, setModalCurso] = useState(false);
  const [modalNotificacion, setModalNotificacion] = useState(false);
  const [modalReporte, setModalReporte] = useState(false);

  // Estado para formulario de crear usuario
  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    apellido: '',
    documentoIdentidad: '',
    correoPersonal: '',
    telefono: '',
    rol: 'estudiante' as 'estudiante' | 'profesor' | 'administrador',
  });
  const [creandoUsuario, setCreandoUsuario] = useState(false);

  // Función para agregar notificaciones toast
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Función para remover notificación
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Función para crear usuario
  const handleCrearUsuario = async () => {
    try {
      setCreandoUsuario(true);
      await axios.post(`${API_URL}/usuarios`, {
        nombre: formUsuario.nombre,
        apellido: formUsuario.apellido,
        documentoIdentidad: formUsuario.documentoIdentidad,
        correoPersonal: formUsuario.correoPersonal,
        telefono: formUsuario.telefono,
        rol: formUsuario.rol,
        estado: 'activo',
      });
      
      // Limpiar formulario y cerrar modal
      setFormUsuario({
        nombre: '',
        apellido: '',
        documentoIdentidad: '',
        correoPersonal: '',
        telefono: '',
        rol: 'estudiante',
      });
      setModalUsuario(false);
      
      // Recargar datos del dashboard
      const [statsData, rolesData, usuariosData] = await Promise.all([
        getAdminStats(),
        getRoleDistribution(),
        axios.get(`${API_URL}/usuarios/recientes?limite=5`).then(r => Array.isArray(r.data) ? r.data : (r.data.data || [])),
      ]);
      setStats(statsData);
      setRoleDistribution(rolesData);
      setUsuariosRecientes(usuariosData);
      
      // Notificación de éxito estilo universitario
      addToast('success', '¡Registro Exitoso! 🎓', `${formUsuario.nombre} ${formUsuario.apellido} ha sido registrado correctamente en nuestra comunidad académica.`);
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      // Notificación de error amigable
      addToast('error', 'Error en el Registro', err.response?.data?.message || 'Hubo un problema al registrar el usuario. Por favor, intenta nuevamente.');
    } finally {
      setCreandoUsuario(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Iniciando carga de datos del dashboard...');
        setLoading(true);
        const [statsData, rolesData, ticketsData, pagosData, usuariosData] = await Promise.all([
          getAdminStats(),
          getRoleDistribution(),
          axios.get(`${API_URL}/tickets/recientes?limite=5`).then(r => Array.isArray(r.data) ? r.data : (r.data.data || [])),
          axios.get(`${API_URL}/pagos/pendientes?limite=5`).then(r => Array.isArray(r.data) ? r.data : (r.data.data || [])),
          axios.get(`${API_URL}/usuarios/recientes?limite=5`).then(r => Array.isArray(r.data) ? r.data : (r.data.data || []))
        ]);
        console.log('✅ Datos cargados:', { statsData, rolesData, ticketsData, pagosData, usuariosData });
        setStats(statsData);
        setRoleDistribution(rolesData);
        setTickets(ticketsData);
        setPagos(pagosData);
        setUsuariosRecientes(usuariosData);
        setError(null);
      } catch (err) {
        console.error('❌ Error crítico en fetchDashboardData:', err);
        const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
        setError(`Error al cargar: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getEstadoColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('activo')) return 'bg-green-100 text-green-800';
    if (estadoLower.includes('verificacion')) return 'bg-yellow-100 text-yellow-800';
    if (estadoLower.includes('suspendido')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTicketEstadoColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'abierto') return 'bg-blue-100 text-blue-800';
    if (estadoLower === 'en_proceso') return 'bg-orange-100 text-orange-800';
    if (estadoLower === 'escalado') return 'bg-red-100 text-red-800';
    if (estadoLower === 'resuelto') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPagoEstadoColor = (estado: string) => {
    if (estado === 'pendiente') return 'bg-yellow-100 text-yellow-800';
    if (estado === 'procesado') return 'bg-blue-100 text-blue-800';
    if (estado === 'vencido') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const totalByRole = roleDistribution.reduce((sum, role) => sum + role.count, 0);

  const getPercentage = (count: number) => {
    return totalByRole > 0 ? Math.round((count / totalByRole) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-800 font-medium">Cargando métricas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 animate-fadeIn"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: `
          linear-gradient(30deg, rgba(56, 189, 248, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(56, 189, 248, 0.1) 87.5%, rgba(56, 189, 248, 0.1)),
          linear-gradient(150deg, rgba(56, 189, 248, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(56, 189, 248, 0.1) 87.5%, rgba(56, 189, 248, 0.1)),
          linear-gradient(30deg, rgba(56, 189, 248, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(56, 189, 248, 0.1) 87.5%, rgba(56, 189, 248, 0.1)),
          linear-gradient(150deg, rgba(56, 189, 248, 0.1) 12%, transparent 12.5%, transparent 87%, rgba(56, 189, 248, 0.1) 87.5%, rgba(56, 189, 248, 0.1)),
          linear-gradient(60deg, rgba(30, 58, 138, 0.2) 25%, transparent 25.5%, transparent 75%, rgba(30, 58, 138, 0.2) 75%, rgba(30, 58, 138, 0.2)),
          linear-gradient(60deg, rgba(30, 58, 138, 0.2) 25%, transparent 25.5%, transparent 75%, rgba(30, 58, 138, 0.2) 75%, rgba(30, 58, 138, 0.2)),
          linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)
        `,
        backgroundSize: '80px 140px, 80px 140px, 80px 140px, 80px 140px, 80px 140px, 80px 140px, 100% 100%',
        backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px, 0 0',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Dashboard General</h1>
        <p className="text-sm text-white font-medium">Última actualización: Ahora</p>
      </div>

      {/* Estadísticas Universitarias Elegantes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Circular de Distribución */}
        <div className="lg:col-span-2 bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Distribución Institucional
              </h2>
              <p className="text-slate-400 text-sm mt-1">Composición de la comunidad universitaria</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Gráfico Donut SVG */}
            <div className="relative w-48 h-48 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Círculo base */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="12" />
                {/* Segmentos de datos */}
                {roleDistribution.length > 0 && (() => {
                  let accumulatedPercentage = 0;
                  const colors = ['#3b82f6', '#06b6d4', '#f59e0b']; // Azul, Cyan, Ámbar
                  
                  return roleDistribution.map((role, index) => {
                    const percentage = getPercentage(role.count);
                    const circumference = 2 * Math.PI * 40;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
                    accumulatedPercentage += percentage;
                    
                    return (
                      <circle
                        key={role.role}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={colors[index % colors.length]}
                        strokeWidth="12"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    );
                  });
                })()}
              </svg>
              {/* Centro del donut */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{totalByRole}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Total</div>
                </div>
              </div>
            </div>

            {/* Leyenda de Roles */}
            <div className="flex-1 space-y-4 w-full">
              {roleDistribution.length > 0 ? (
                roleDistribution.map((role, index) => {
                  const percentage = getPercentage(role.count);
                  const colors = [
                    { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-400', icon: Users },
                    { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-400', icon: BookOpen },
                    { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-400', icon: Crown }
                  ];
                  const color = colors[index % colors.length];
                  const Icon = color.icon;
                  const label = role.role === 'estudiante' ? 'Estudiantes' : role.role === 'profesor' ? 'Profesores' : 'Administradores';

                  return (
                    <div key={role.role} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${color.bg}/20 flex items-center justify-center border ${color.border}/30`}>
                            <Icon className={`w-5 h-5 ${color.text}`} />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{label}</p>
                            <p className="text-slate-400 text-sm">{role.count} usuarios</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${color.text}`}>{percentage}%</p>
                        </div>
                      </div>
                      {/* Barra de progreso mini */}
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${color.bg} rounded-full transition-all duration-700`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-center py-8">No hay datos de distribución</p>
              )}
            </div>
          </div>
        </div>

        {/* Actividad Crítica */}
        <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                Actividad Crítica
              </h2>
              <p className="text-slate-400 text-sm mt-1">Métricas en tiempo real</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-400 font-medium">En vivo</span>
            </div>
          </div>
          
          {/* Tarjetas de métricas */}
          <div className="space-y-4">
            {/* Usuarios Activos */}
            <div className="group bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Zap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Usuarios Activos</p>
                    <p className="text-2xl font-bold text-white">{stats?.activeUsers ?? 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                    Operativo
                  </span>
                </div>
              </div>
              <div className="mt-3 h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${Math.min((stats?.activeUsers ?? 0) * 10, 100)}%` }}></div>
              </div>
            </div>

            {/* Solicitudes Pendientes */}
            <div className="group bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Solicitudes Pendientes</p>
                    <p className="text-2xl font-bold text-white">{stats?.pendingRequests ?? 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${(stats?.pendingRequests ?? 0) > 5 ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {(stats?.pendingRequests ?? 0) > 5 ? 'Urgente' : 'Pendiente'}
                  </span>
                </div>
              </div>
              <div className="mt-3 h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${(stats?.pendingRequests ?? 0) > 5 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((stats?.pendingRequests ?? 0) * 20, 100)}%` }}></div>
              </div>
            </div>

            {/* Total de Usuarios */}
            <div className="group bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <UserCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total de Usuarios</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalUsers ?? 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-full">
                    Registrados
                  </span>
                </div>
              </div>
              <div className="mt-3 h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Botón de acción */}
          <button
            onClick={() => navigate('/admin/solicitudes')}
            className="w-full mt-6 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 group"
          >
            <span>Gestionar Solicitudes</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Usuarios Recientes y Tickets Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuarios Recientes */}
        <div className="bg-[#374151] rounded-lg shadow-lg border border-gray-600 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Usuarios Recientes</h2>
            <a href="/admin/usuarios" className="text-blue-400 text-sm font-semibold hover:text-blue-300">Ver todos</a>
          </div>
          <div className="space-y-4">
            {usuariosRecientes.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No hay usuarios recientes</p>
            ) : (
              usuariosRecientes.map((usuario, index) => (
                <div key={`${usuario.id}-${index}`} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      usuario.rol === 'estudiante' ? 'bg-blue-500' :
                      usuario.rol === 'profesor' ? 'bg-cyan-500' :
                      usuario.rol === 'administrador' ? 'bg-purple-500' :
                      'bg-emerald-500'
                    }`}>
                      {usuario.initials || usuario.nombre?.charAt(0)?.toUpperCase()}{usuario.apellido?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{usuario.nombre} {usuario.apellido}</p>
                      <p className="text-gray-400 text-xs">{usuario.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getEstadoColor(usuario.estado)}`}>
                    {usuario.estado}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tickets Recientes */}
        <div className="bg-[#374151] rounded-lg shadow-lg border border-gray-600 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Tickets Recientes</h2>
            <a href="/admin/tickets" className="text-blue-400 text-sm font-semibold hover:text-blue-300">Ver todos</a>
          </div>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No hay tickets recientes</p>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                      ticket.usuario?.rol === 'estudiante' ? 'bg-blue-600' :
                      ticket.usuario?.rol === 'profesor' ? 'bg-cyan-500' :
                      ticket.usuario?.rol === 'administrador' ? 'bg-purple-500' :
                      'bg-blue-600'
                    }`}>
                      {ticket.usuario?.nombre?.charAt(0)}{ticket.usuario?.apellido?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{ticket.usuario?.nombre} {ticket.usuario?.apellido}</p>
                      <p className="text-gray-400 text-xs">{ticket.asunto}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getTicketEstadoColor(ticket.estado)}`}>
                    {ticket.estado}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagos Pendientes */}
      <div className="bg-[#374151] rounded-lg shadow-lg border border-gray-600 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Pagos Pendientes</h2>
          <a href="/admin/pagos" className="text-blue-400 text-sm font-semibold hover:text-blue-300">Ver todos</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-300 uppercase py-3">Usuario</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase py-3">Concepto</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase py-3">Monto</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase py-3">Estado</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No hay pagos pendientes</td>
                </tr>
              ) : (
                pagos.map((pago) => (
                  <tr key={pago.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-200 font-medium">{pago.usuario?.nombre} {pago.usuario?.apellido}</td>
                    <td className="py-4 text-sm text-gray-200">{pago.concepto}</td>
                    <td className="py-4 text-sm font-semibold text-white">${Number(pago.monto).toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${getPagoEstadoColor(pago.estado)}`}>
                        {pago.estado}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-blue-400 font-semibold hover:text-blue-300 cursor-pointer">
                      Procesar
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-[#374151] rounded-lg shadow-lg border border-gray-600 p-6">
        <h2 className="text-lg font-bold mb-6 text-white">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setModalUsuario(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-blue-400 hover:bg-gray-600 transition cursor-pointer"
          >
            <UserPlus size={24} className="text-blue-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Nuevo Usuario</span>
          </button>
          <button
            onClick={() => setModalCurso(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-green-400 hover:bg-gray-600 transition cursor-pointer"
          >
            <GraduationCap size={24} className="text-green-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Nuevo Curso</span>
          </button>
          <button
            onClick={() => setModalNotificacion(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 hover:bg-gray-600 transition cursor-pointer"
          >
            <Send size={24} className="text-purple-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Enviar Notificación</span>
          </button>
          <button
            onClick={() => setModalReporte(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-orange-400 hover:bg-gray-600 transition cursor-pointer"
          >
            <FileText size={24} className="text-orange-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Generar Reporte</span>
          </button>
        </div>
      </div>
      {/* ========== MODAL: NUEVO USUARIO ========== */}
      {modalUsuario && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#374151] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-600">
            {/* Header universitario */}
            <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Crear Nuevo Usuario</h3>
                  <p className="text-blue-200 text-xs">Sistema Universitario</p>
                </div>
              </div>
              <button onClick={() => setModalUsuario(false)} className="text-white/80 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            {/* Formulario */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Apellido</label>
                  <input 
                    type="text" 
                    value={formUsuario.apellido}
                    onChange={(e) => setFormUsuario({...formUsuario, apellido: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Documento de Identidad</label>
                <input 
                  type="text" 
                  value={formUsuario.documentoIdentidad}
                  onChange={(e) => setFormUsuario({...formUsuario, documentoIdentidad: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Correo Personal</label>
                <input 
                  type="email" 
                  value={formUsuario.correoPersonal}
                  onChange={(e) => setFormUsuario({...formUsuario, correoPersonal: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  value={formUsuario.telefono}
                  onChange={(e) => setFormUsuario({...formUsuario, telefono: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rol</label>
                <select 
                  value={formUsuario.rol}
                  onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value as 'estudiante' | 'profesor' | 'administrador'})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              {/* Preview del correo institucional */}
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
                <p className="text-sm text-blue-300 font-medium">Correo institucional que se generará:</p>
                <p className="text-sm text-blue-400">usuario@universidad.edu.co</p>
              </div>
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setModalUsuario(false)} 
                  disabled={creandoUsuario}
                  className="flex-1 px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCrearUsuario}
                  disabled={creandoUsuario}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg shadow-blue-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creandoUsuario ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Usuario'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL: NUEVO CURSO ========== */}
      {modalCurso && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header universitario */}
            <div className="bg-linear-to-r from-green-600 to-green-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nuevo Curso</h3>
                  <p className="text-green-200 text-xs">Gestión Académica</p>
                </div>
              </div>
              <button onClick={() => setModalCurso(false)} className="text-white/80 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            {/* Formulario */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Código del Curso</label>
                  <input type="text" placeholder="Ej: MAT101" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Semestre</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white">
                    <option value="">Seleccionar...</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(s => (
                      <option key={s} value={s}>Semestre {s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Curso</label>
                <input type="text" placeholder="Ej: Cálculo Diferencial" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Carrera</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white">
                  <option value="">Seleccionar carrera...</option>
                  <option value="ingenieria_sistemas">Ingeniería de Sistemas</option>
                  <option value="ingenieria_civil">Ingeniería Civil</option>
                  <option value="medicina">Medicina</option>
                  <option value="enfermeria">Enfermería</option>
                  <option value="derecho">Derecho</option>
                  <option value="administracion">Administración de Empresas</option>
                  <option value="contaduria">Contaduría Pública</option>
                  <option value="psicologia">Psicología</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Créditos</label>
                  <input type="number" placeholder="Ej: 3" min="1" max="6" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nivel</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white">
                    <option value="pregrado">Pregrado</option>
                    <option value="posgrado">Posgrado</option>
                    <option value="diplomado">Diplomado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea rows={3} placeholder="Descripción del curso, objetivos, contenido..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none" />
              </div>
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setModalCurso(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium shadow-lg shadow-green-200">
                  Crear Curso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL: ENVIAR NOTIFICACIÓN ========== */}
      {modalNotificacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header universitario */}
            <div className="bg-linear-to-r from-purple-600 to-purple-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Enviar Notificación</h3>
                  <p className="text-purple-200 text-xs">Comunicaciones Institucionales</p>
                </div>
              </div>
              <button onClick={() => setModalNotificacion(false)} className="text-white/80 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            {/* Formulario */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Destinatarios</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white">
                  <option value="">Seleccionar grupo...</option>
                  <option value="todos">Todos los usuarios</option>
                  <option value="estudiantes">Todos los estudiantes</option>
                  <option value="profesores">Todos los profesores</option>
                  <option value="carrera">Por carrera específica</option>
                  <option value="curso">Por curso específico</option>
                  <option value="individual">Usuario individual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Notificación</label>
                <div className="flex gap-2">
                  {['info', 'warning', 'success', 'urgent'].map((tipo) => (
                    <button key={tipo} className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 hover:bg-purple-50 hover:border-purple-300 transition capitalize">
                      {tipo === 'info' ? 'Informativa' : tipo === 'warning' ? 'Advertencia' : tipo === 'success' ? 'Éxito' : 'Urgente'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Asunto</label>
                <input type="text" placeholder="Ej: Recordatorio de matrícula" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mensaje</label>
                <textarea rows={4} placeholder="Escribe el mensaje de la notificación..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="email" className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                <label htmlFor="email" className="text-sm text-gray-700">Enviar también por correo electrónico</label>
              </div>
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setModalNotificacion(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-medium shadow-lg shadow-purple-200">
                  Enviar Notificación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL: GENERAR REPORTE ========== */}
      {modalReporte && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header universitario */}
            <div className="bg-linear-to-r from-orange-500 to-orange-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Generar Reporte</h3>
                  <p className="text-orange-200 text-xs">Sistema de Reportes Institucionales</p>
                </div>
              </div>
              <button onClick={() => setModalReporte(false)} className="text-white/80 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            {/* Formulario */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Reporte</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'academico', label: 'Académico', icon: '📚' },
                    { id: 'financiero', label: 'Financiero', icon: '💰' },
                    { id: 'usuarios', label: 'Usuarios', icon: '👥' },
                    { id: 'cursos', label: 'Cursos', icon: '🎓' },
                  ].map((tipo) => (
                    <button key={tipo.id} className="p-3 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition text-left">
                      <span className="text-xl mr-2">{tipo.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{tipo.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título del Reporte</label>
                <input type="text" placeholder="Ej: Reporte de matrícula 2025-I" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Inicio</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Fin</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción / Notas</label>
                <textarea rows={2} placeholder="Notas adicionales sobre el reporte..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="export" className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                <label htmlFor="export" className="text-sm text-gray-700">Exportar automáticamente a Excel/PDF</label>
              </div>
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setModalReporte(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium shadow-lg shadow-orange-200">
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`transform transition-all duration-300 ease-out animate-in slide-in-from-right-full ${
              toast.type === 'success' ? 'bg-linear-to-r from-emerald-500 to-teal-600' :
              toast.type === 'error' ? 'bg-linear-to-r from-rose-500 to-pink-600' :
              toast.type === 'warning' ? 'bg-linear-to-r from-amber-500 to-orange-600' :
              'bg-linear-to-r from-blue-500 to-indigo-600'
            } text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-sm border border-white/20`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 size={20} className="text-white" />}
              {toast.type === 'error' && <XCircle size={20} className="text-white" />}
              {toast.type === 'warning' && <AlertCircle size={20} className="text-white" />}
              {toast.type === 'info' && <Info size={20} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight mb-1">
                {toast.title}
              </h4>
              <p className="text-xs text-white/90 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/70 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
