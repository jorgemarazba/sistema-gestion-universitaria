import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, BookOpen, Bell, BarChart3, CheckCircle, Clock } from 'lucide-react';
import { getAdminStats, getRoleDistribution, type AdminStats, type RoleDistribution } from '../../services/admin.service';

interface UsuarioReciente {
  id: number;
  initials: string;
  nombre: string;
  email: string;
  estado: string;
  rol: string;
}

interface Ticket {
  id: number;
  initials: string;
  nombre: string;
  problema: string;
  estado: string;
}

interface Pago {
  id: number;
  usuario: string;
  concepto: string;
  monto: string;
  estado: string;
}

const usuariosRecientesData: UsuarioReciente[] = [
  { id: 1, initials: 'MG', nombre: 'Maria García', email: 'maria@email.com', estado: 'activo', rol: 'Estudiante' },
  { id: 2, initials: 'CL', nombre: 'Carlos Lopez', email: 'carlos@email.com', estado: 'verificacion pendiente', rol: 'Estudiante' },
  { id: 3, initials: 'AM', nombre: 'Ana Martinez', email: 'ana@email.com', estado: 'activo', rol: 'Profesor' },
  { id: 4, initials: 'PS', nombre: 'Pedro Sanchez', email: 'pedro@email.com', estado: 'activo', rol: 'Estudiante' },
  { id: 5, initials: 'LT', nombre: 'Laura Torres', email: 'laura@email.com', estado: 'suspendido', rol: 'Estudiante' },
];

const ticketsRecientesData: Ticket[] = [
  { id: 1, initials: 'MG', nombre: 'Maria García', problema: 'Problema con factura', estado: 'Abierto' },
  { id: 2, initials: 'CL', nombre: 'Carlos Lopez', problema: 'No puedo ver mis cursos', estado: 'En proceso' },
  { id: 3, initials: 'AM', nombre: 'Ana Martinez', problema: 'Error al cargar documentos', estado: 'Escalado' },
];

const pagosPendientesData: Pago[] = [
  { id: 1, usuario: 'Pedro Sanchez', concepto: 'Matricula 2024-1', monto: '$1,500,000', estado: 'pendiente' },
  { id: 2, usuario: 'Laura Torres', concepto: 'Curso adicional', monto: '$750,000', estado: 'procesado' },
  { id: 3, usuario: 'Juan Ramirez', concepto: 'Matricula 2024-1', monto: '$2,000,000', estado: 'vencido' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [roleDistribution, setRoleDistribution] = useState<RoleDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Iniciando carga de datos del dashboard...');
        setLoading(true);
        const [statsData, rolesData] = await Promise.all([
          getAdminStats(),
          getRoleDistribution(),
        ]);
        console.log('✅ Datos cargados:', { statsData, rolesData });
        setStats(statsData);
        setRoleDistribution(rolesData);
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
    if (estado === 'Abierto') return 'bg-blue-100 text-blue-800';
    if (estado === 'En proceso') return 'bg-orange-100 text-orange-800';
    if (estado === 'Escalado') return 'bg-red-100 text-red-800';
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
            {usuariosRecientesData.map((usuario) => (
              <div key={usuario.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
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
            ))}
          </div>
        </div>

        {/* Tickets Recientes */}
        <div className="bg-[#374151] rounded-lg shadow-lg border border-gray-600 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Tickets Recientes</h2>
            <a href="/admin/tickets" className="text-blue-400 text-sm font-semibold hover:text-blue-300">Ver todos</a>
          </div>
          <div className="space-y-4">
            {ticketsRecientesData.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {ticket.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{ticket.nombre}</p>
                    <p className="text-gray-400 text-xs">{ticket.problema}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getTicketEstadoColor(ticket.estado)}`}>
                  {ticket.estado}
                </span>
              </div>
            ))}
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
              {pagosPendientesData.map((pago) => (
                <tr key={pago.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-200 font-medium">{pago.usuario}</td>
                  <td className="py-4 text-sm text-gray-200">{pago.concepto}</td>
                  <td className="py-4 text-sm font-semibold text-white">{pago.monto}</td>
                  <td className="py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded ${getPagoEstadoColor(pago.estado)}`}>
                      {pago.estado}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-blue-400 font-semibold hover:text-blue-300 cursor-pointer">
                    Procesar
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-[#374151] rounded-lg shadow-lg border border-gray-600 p-6">
        <h2 className="text-lg font-bold mb-6 text-white">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-blue-400 hover:bg-gray-600 transition">
            <Users size={24} className="text-blue-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Nuevo Usuario</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-green-400 hover:bg-gray-600 transition">
            <BookOpen size={24} className="text-green-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Nuevo Curso</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 hover:bg-gray-600 transition">
            <Bell size={24} className="text-purple-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Enviar Notificación</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-orange-400 hover:bg-gray-600 transition">
            <BarChart3 size={24} className="text-orange-400 mb-3" />
            <span className="text-sm font-semibold text-gray-200">Generar Reporte</span>
          </button>
        </div>
      </div>
    </div>
  );
};
