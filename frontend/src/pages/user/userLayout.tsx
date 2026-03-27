import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, BookOpen, CreditCard, Award, History, FileText, Clock, HelpCircle, MessageSquare, BarChart3 } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Inscripción', path: '/user/inscripcion', icon: <BookOpen size={18} /> },
  { label: 'Pagos', path: '/user/pagos', icon: <CreditCard size={18} /> },
  { label: 'Calificaciones', path: '/user/calificaciones', icon: <Award size={18} /> },
  { label: 'Historial', path: '/user/historial', icon: <History size={18} /> },
  { label: 'Documentos', path: '/user/documentos', icon: <FileText size={18} /> },
  { label: 'Horario', path: '/user/horario', icon: <Clock size={18} /> },
  { label: 'Soporte', path: '/user/soporte', icon: <HelpCircle size={18} /> },
  { label: 'Mensajes', path: '/user/mensajes', icon: <MessageSquare size={18} /> },
  { label: 'Reportes', path: '/user/reportes', icon: <BarChart3 size={18} /> },
  { label: 'Perfil', path: '/user/perfil', icon: <User size={18} /> },
];

const backgroundStyle = {
  backgroundColor: '#0f172a',
  backgroundImage: `
    linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, transparent 50%),
    linear-gradient(225deg, rgba(15, 23, 42, 0.9) 0%, transparent 50%),
    linear-gradient(45deg, rgba(30, 41, 59, 0.6) 0%, transparent 50%),
    linear-gradient(315deg, rgba(51, 65, 85, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(30, 41, 59, 0.3) 10px,
      rgba(30, 41, 59, 0.3) 20px
    )
  `,
  backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%',
};

export const UserLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const notificaciones = [
    { id: 1, titulo: 'Nueva calificación', descripcion: 'Se ha publicado tu nota de Matemáticas', tiempo: '2 h', leida: false },
    { id: 2, titulo: 'Pago recibido', descripcion: 'Tu pago de matrícula ha sido confirmado', tiempo: '5 h', leida: true },
    { id: 3, titulo: 'Nuevo mensaje', descripcion: 'Tienes un mensaje del profesor García', tiempo: '1 d', leida: true },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen font-sans" style={backgroundStyle}>
      {/* Navbar Horizontal */}
      <header className="h-16 bg-slate-900/95 border-b border-slate-700 flex items-center justify-between px-4 sticky top-0 z-50 shadow-lg backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <span className="text-white font-bold text-xl hidden lg:block">Universidad</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center text-white">
                3
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                  <h3 className="text-lg font-bold text-white">Notificaciones</h3>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    Marcar todas
                  </button>
                </div>
                <div className="py-2">
                  {notificaciones.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-700 transition cursor-pointer ${
                        !notif.leida ? 'bg-blue-500/10' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {notif.titulo.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{notif.titulo}</p>
                        <p className="text-slate-400 text-xs">{notif.descripcion}</p>
                        <p className="text-blue-400 text-xs mt-1">{notif.tiempo}</p>
                      </div>
                      {!notif.leida && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-700 text-center">
                  <button className="text-blue-400 text-sm hover:text-blue-300 font-medium">
                    Ver todas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              U
            </div>
            <span className="text-white text-sm font-medium hidden lg:block">Usuario</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
