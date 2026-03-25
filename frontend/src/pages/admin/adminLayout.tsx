import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
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

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Usuarios', path: '/admin/usuarios', icon: <Users size={20} /> },
    { name: 'Programas', path: '/admin/programas', icon: <BookOpen size={20} /> },
    { name: 'Cursos', path: '/admin/cursos', icon: <BookOpen size={20} /> },
    { name: 'Matriculas', path: '/admin/matriculas', icon: <UserPlus size={20} /> },
    { name: 'Pagos', path: '/admin/pagos', icon: <CreditCard size={20} /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <Ticket size={20} /> },
    { name: 'Reportes', path: '/admin/reportes', icon: <BarChart3 size={20} /> },
    { name: 'Notificaciones', path: '/admin/notificaciones', icon: <Bell size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
           <span className="text-sm text-gray-600 font-medium mr-4">Administrador</span>
           <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
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