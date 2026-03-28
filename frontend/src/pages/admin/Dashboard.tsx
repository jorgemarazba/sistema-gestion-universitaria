import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  Bell, 
  BarChart3,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { getAdminStats, getRoleDistribution, type AdminStats, type RoleDistribution } from '../../services/admin.service';

const API_URL = 'http://localhost:3002/api/v1';

interface UsuarioReciente {
  id: number;
  initials: string;
  nombre: string;
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
  };
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
  
  // Estados para modales
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalCurso, setModalCurso] = useState(false);
  const [modalNotificacion, setModalNotificacion] = useState(false);
  const [modalReporte, setModalReporte] = useState(false);

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

      {/* Distribución de Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#374151] p-6 rounded-xl shadow-lg border border-gray-600">
          <h2 className="text-lg font-bold mb-4 text-white">Distribución de Usuarios</h2>
          <div className="space-y-4">
            {roleDistribution.length > 0 ? (
              roleDistribution.map((role, index) => {
                const percentage = getPercentage(role.count);
                const colors = ['bg-blue-600', 'bg-sky-500', 'bg-amber-500'];
                const labelColor = index === 0 ? 'Estudiantes' : index === 1 ? 'Profesores' : 'Administradores';

                return (
                  <div key={role.role}>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-300 font-medium">{labelColor || role.role} ({percentage}%)</p>
                      <span className="text-sm font-bold text-white">{role.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm font-medium">No hay datos de distribución</p>
            )}
          </div>
        </div>

        {/* Actividad Crítica */}
        <div className="bg-[#374151] p-6 rounded-xl shadow-lg border border-gray-600">
          <h2 className="text-lg font-bold mb-4 text-white">Actividad Crítica</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              <li className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <p className="text-sm text-gray-300 font-medium">Usuarios activos: <span className="font-bold text-white">{stats?.activeUsers ?? 0}</span></p>
                    <span className="text-xs text-gray-400 font-medium">En vivo</span>
                  </div>
                </div>
              </li>
              <li className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <Clock size={16} />
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <p className="text-sm text-gray-300 font-medium">Solicitudes en espera: <span className="font-bold text-white">{stats?.pendingRequests ?? 0}</span></p>
                    <span className="text-xs text-gray-400 font-medium">Pendiente</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/admin/solicitudes')}
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Gestionar Solicitudes
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
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {usuario.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{usuario.nombre}</p>
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
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
            <Users size={24} className="text-blue-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Nuevo Usuario</span>
          </button>
          <button 
            onClick={() => setModalCurso(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-green-400 hover:bg-gray-600 transition cursor-pointer"
          >
            <BookOpen size={24} className="text-green-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Nuevo Curso</span>
          </button>
          <button 
            onClick={() => setModalNotificacion(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 hover:bg-gray-600 transition cursor-pointer"
          >
            <Bell size={24} className="text-purple-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Enviar Notificación</span>
          </button>
          <button 
            onClick={() => setModalReporte(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-orange-400 hover:bg-gray-600 transition cursor-pointer"
          >
            <BarChart3 size={24} className="text-orange-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Generar Reporte</span>
          </button>
        </div>
      </div>
      {/* ========== MODAL: NUEVO USUARIO ========== */}
      {modalUsuario && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header universitario */}
            <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nuevo Usuario</h3>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                  <input type="text" placeholder="Ej: María" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
                  <input type="text" placeholder="Ej: García" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Documento de Identidad</label>
                <input type="text" placeholder="Ej: 1234567890" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Personal</label>
                <input type="email" placeholder="Ej: usuario@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Usuario</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white">
                    <option value="">Seleccionar...</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Carrera / Departamento</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white">
                    <option value="">Seleccionar...</option>
                    <option value="ingenieria">Ingeniería</option>
                    <option value="medicina">Medicina</option>
                    <option value="derecho">Derecho</option>
                    <option value="administracion">Administración</option>
                  </select>
                </div>
              </div>
              {/* Preview del correo institucional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">Correo institucional que se generará:</p>
                <p className="text-sm text-blue-600">mgarcia@universidad.edu.co</p>
              </div>
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setModalUsuario(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg shadow-blue-200">
                  Crear Usuario
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
                  <BookOpen className="w-5 h-5 text-white" />
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
                  <Bell className="w-5 h-5 text-white" />
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
                  <BarChart3 className="w-5 h-5 text-white" />
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
    </div>
  );
};
