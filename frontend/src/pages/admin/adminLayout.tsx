import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  BookOpen, 
  LogOut,
  Settings,
  CreditCard,
  Ticket,
  BarChart3,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const API_URL = 'http://localhost:3002/api/v1';

interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'pago' | 'ticket' | 'solicitud' | 'sistema';
  estado: 'pendiente' | 'leida' | 'archivada';
  creadoEn: string;
  paraAdmin: boolean;
}

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [contadorNotif, setContadorNotif] = useState(0);

  // Cargar notificaciones
  const cargarNotificaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/notificaciones?admin=true`);
      const data = response.data;
      
      // Asegurar que sea un array
      const notificacionesArray = Array.isArray(data) ? data : (data.data || []);
      setNotificaciones(notificacionesArray);
      
      // Contar pendientes
      const pendientes = notificacionesArray.filter((n: Notificacion) => n.estado === 'pendiente').length;
      setContadorNotif(pendientes);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    }
  };

  // Cargar al montar
  useEffect(() => {
    cargarNotificaciones();
    // Actualizar cada 30 segundos
    const interval = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  // Marcar como leída
  const marcarComoLeida = async (id: string) => {
    try {
      await axios.post(`${API_URL}/notificaciones/${id}/leer`);
      cargarNotificaciones();
    } catch (err) {
      console.error('Error al marcar notificación:', err);
    }
  };

  // Marcar todas como leídas
  const marcarTodasLeidas = async () => {
    try {
      await axios.post(`${API_URL}/notificaciones/marcar-todas-leidas`);
      cargarNotificaciones();
    } catch (err) {
      console.error('Error al marcar todas:', err);
    }
  };

  // Formatear tiempo relativo
  const tiempoRelativo = (fecha: string) => {
    const diff = Date.now() - new Date(fecha).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `${minutos} min`;
    if (horas < 24) return `${horas} h`;
    if (dias < 7) return `${dias} d`;
    return new Date(fecha).toLocaleDateString();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Usuarios', path: '/admin/usuarios', icon: <Users size={20} /> },
    { name: 'Programas', path: '/admin/programas', icon: <BookOpen size={20} /> },
    { name: 'Cursos', path: '/admin/cursos', icon: <BookOpen size={20} /> },
    { name: 'Matriculas', path: '/admin/matriculas', icon: <UserPlus size={20} /> },
    { name: 'Pagos', path: '/admin/pagos', icon: <CreditCard size={20} /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <Ticket size={20} /> },
    { name: 'Reportes', path: '/admin/reportes', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex h-screen font-sans"
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
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-400 tracking-tight">EduAdmin</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Panel de Control</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER DEL SIDEBAR */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* BOTÓN CONFIGURACIÓN */}
          <button 
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800"
          >
            <Settings size={20} />
            <span className="text-sm font-medium">Configuración</span>
          </button>

          {/* BOTÓN CERRAR SESIÓN */}
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 transition rounded-lg"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-blue-600 border-b border-blue-500 flex items-center justify-between px-8 sticky top-0 z-50 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400 font-medium">Sistema en línea</span>
          </div>
          <div className="flex items-center gap-4 relative">
            {/* Botón de Notificaciones con Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-white hover:bg-blue-700 rounded-full transition"
              >
                <Bell size={20} />
                {contadorNotif > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                    {contadorNotif > 9 ? '9+' : contadorNotif}
                  </span>
                )}
              </button>

              {/* Dropdown de Notificaciones estilo Facebook */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-[#1e293b] rounded-xl shadow-2xl border border-gray-700 z-50 max-h-[500px] overflow-y-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">Notificaciones</h3>
                    {contadorNotif > 0 && (
                      <button 
                        onClick={marcarTodasLeidas}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>

                  {/* Lista de notificaciones */}
                  <div className="py-2">
                    {notificaciones.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-400">
                        No hay notificaciones
                      </div>
                    ) : (
                      notificaciones.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => marcarComoLeida(notif.id)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-[#374151] transition cursor-pointer ${
                            notif.estado === 'pendiente' ? 'bg-[#1e3a5f]/30' : ''
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                              notif.tipo === 'pago' ? 'bg-green-600' :
                              notif.tipo === 'ticket' ? 'bg-purple-600' :
                              notif.tipo === 'solicitud' ? 'bg-blue-600' :
                              'bg-gray-600'
                            }`}>
                              {notif.tipo === 'pago' ? 'P' :
                               notif.tipo === 'ticket' ? 'T' :
                               notif.tipo === 'solicitud' ? 'S' : 'N'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm leading-snug">
                              <span className="font-semibold">{notif.titulo}</span>{' '}
                              <span className="text-gray-300">{notif.descripcion}</span>
                            </p>
                            <p className="text-blue-400 text-xs mt-1">{tiempoRelativo(notif.creadoEn)}</p>
                          </div>
                          {notif.estado === 'pendiente' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-gray-700 text-center">
                    <button className="text-blue-400 text-sm hover:text-blue-300 font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="text-sm text-white font-medium">Administrador</span>
            <div className="h-9 w-9 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold border border-gray-600 shadow-lg">A</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet /> 
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;