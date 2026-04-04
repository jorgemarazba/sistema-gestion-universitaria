import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UserPlus, 
  GraduationCap, 
  Send, 
  FileText,
  X,
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  AlertCircle,
  Zap,
  Crown,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
  DollarSign,
  Library
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { getAdminStats, getRoleDistribution, type AdminStats, type RoleDistribution } from '../../services/admin.service';
import type { CreateCursoData } from '../../types/curso.types';
import { ModalidadCurso, NivelCurso, type NivelCursoType, type ModalidadCursoType } from '../../types/curso.types';
import { useAuthStore } from '../../store/authStore';
import { CursosService } from '../../services/cursos.service';
import { UsuariosService } from '../../services/usuarios.service';
import type { Usuario } from '../../services/usuarios.service';
import { ProgramasService } from '../../services/programas.service';
import { NotificacionesService, type TipoNotificacion } from '../../services/notificaciones.service';
import { useNotificacionesStore } from '../../store/notificacionesStore';

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
  const [carreras, setCarreras] = useState<Array<{id: string, nombre: string}>>([]);
  const [cargandoCarreras, setCargandoCarreras] = useState(false);
  const [cursosExistentes, setCursosExistentes] = useState<Array<{id: string, codigo: string, nombre: string}>>([]);

  // Cargar profesores y carreras desde el backend
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const usuarios = await UsuariosService.getAll();
        console.log('Usuarios recibidos:', usuarios);
        const profesoresFiltrados = usuarios.filter(
          (u) => u.rol === 'profesor'
        );
        console.log('Profesores filtrados:', profesoresFiltrados);
        setProfesores(profesoresFiltrados);
      } catch (err) {
        console.error('Error al cargar profesores:', err);
        addToast('error', 'Error', 'No se pudieron cargar los profesores del sistema');
      }
    };

    const fetchCarreras = async () => {
      try {
        setCargandoCarreras(true);
        const programasData = await ProgramasService.getAll();
        const programasActivos = programasData.filter((p) => p.estado === 'activo');
        setCarreras(programasActivos);
      } catch (err) {
        console.error('Error al cargar carreras:', err);
      } finally {
        setCargandoCarreras(false);
      }
    };

    const fetchCursosExistentes = async () => {
      try {
        const cursosData = await CursosService.getAll();
        setCursosExistentes(cursosData);
      } catch (err) {
        console.error('Error al cargar cursos existentes:', err);
      }
    };

    fetchProfesores();
    fetchCarreras();
    fetchCursosExistentes();
  }, []);

  // Handler para crear curso
  const handleCrearCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await CursosService.create(formData);
      addToast('success', '¡Curso Creado! 🎓', `El curso ${formData.nombre} ha sido creado exitosamente.`);
      setModalCurso(false);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        carrera: '',
        nivel: NivelCurso.PREGRADO,
        modalidad: ModalidadCurso.PRESENCIAL,
        creditos: 3,
        semestre: 1,
        cupos: 30,
        profesorId: '',
        horaInicio: '',
        horaFin: '',
      });
    } catch (err: any) {
      console.error('Error al crear curso:', err);
      addToast('error', 'Error al Crear Curso', err.response?.data?.message || 'Hubo un problema al crear el curso. Por favor, intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [roleDistribution, setRoleDistribution] = useState<RoleDistribution[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState<UsuarioReciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para notificaciones toast
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Estado para usuarios online (WebSocket real-time)
  const [usuariosOnline, setUsuariosOnline] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  
  // Estados para modales
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalCurso, setModalCurso] = useState(false);
  const [modalNotificacion, setModalNotificacion] = useState(false);
  const [modalReporte, setModalReporte] = useState(false);

  // Estado para formulario de crear curso
  const [formData, setFormData] = useState<CreateCursoData & { horaInicio?: string; horaFin?: string }>({
    codigo: '',
    nombre: '',
    descripcion: '',
    carrera: '',
    nivel: NivelCurso.PREGRADO,
    modalidad: ModalidadCurso.PRESENCIAL,
    creditos: 3,
    semestre: 1,
    cupos: 30,
    profesorId: '',
    horaInicio: '',
    horaFin: '',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profesores, setProfesores] = useState<Usuario[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submitting, setSubmitting] = useState(false);

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

  // Estado para formulario de notificación
  const [formNotificacion, setFormNotificacion] = useState({
    destinatarios: '',
    tipo: 'info' as TipoNotificacion,
    asunto: '',
    mensaje: '',
    enviarEmail: false,
  });
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false);

  // Estado para formulario de reporte
  const [formReporte, setFormReporte] = useState({
    tipo: 'academico' as 'academico' | 'financiero' | 'usuarios' | 'cursos',
    titulo: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    exportar: false,
  });
  const [generandoReporte, setGenerandoReporte] = useState(false);

  // Función para enviar notificación
  const handleEnviarNotificacion = async () => {
    try {
      setEnviandoNotificacion(true);
      
      await NotificacionesService.crearNotificacion({
        titulo: formNotificacion.asunto,
        descripcion: formNotificacion.mensaje,
        tipo: formNotificacion.tipo,
        destinatarios: formNotificacion.destinatarios,
        enviarEmail: formNotificacion.enviarEmail,
        paraAdmin: formNotificacion.destinatarios === 'admin',
      });
      
      // Recargar notificaciones en el store para actualizar el icono
      await useNotificacionesStore.getState().cargarNotificaciones();
      
      addToast('success', 'Notificación Enviada', 'La notificación se ha enviado exitosamente.');
      
      // Limpiar formulario y cerrar modal
      setFormNotificacion({
        destinatarios: '',
        tipo: 'info',
        asunto: '',
        mensaje: '',
        enviarEmail: false,
      });
      setModalNotificacion(false);
    } catch (err: any) {
      console.error('Error al enviar notificación:', err);
      addToast('error', 'Error', err.response?.data?.message || 'Hubo un problema al enviar la notificación.');
    } finally {
      setEnviandoNotificacion(false);
    }
  };

  // Función para generar reporte
  const handleGenerarReporte = async () => {
    try {
      setGenerandoReporte(true);
      
      const response = await axios.post(`${API_URL}/reportes/generar`, {
        tipo: formReporte.tipo,
        titulo: formReporte.titulo,
        fechaInicio: formReporte.fechaInicio,
        fechaFin: formReporte.fechaFin,
        descripcion: formReporte.descripcion,
        exportar: formReporte.exportar,
      });
      
      addToast('success', 'Reporte Generado', `El reporte "${formReporte.titulo}" se ha generado exitosamente.`);
      
      // Limpiar formulario y cerrar modal
      setFormReporte({
        tipo: 'academico',
        titulo: '',
        fechaInicio: '',
        fechaFin: '',
        descripcion: '',
        exportar: false,
      });
      setModalReporte(false);
    } catch (err: any) {
      console.error('Error al generar reporte:', err);
      addToast('error', 'Error', err.response?.data?.message || 'Hubo un problema al generar el reporte.');
    } finally {
      setGenerandoReporte(false);
    }
  };

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
        setLoading(true);
        const [statsData, rolesData, ticketsData, pagosData, usuariosData] = await Promise.all([
          getAdminStats(),
          getRoleDistribution(),
          axios.get(`${API_URL}/tickets/recientes?limite=5`).then(r => Array.isArray(r.data) ? r.data : (r.data.data || [])),
          axios.get(`${API_URL}/pagos/pendientes?limite=5`).then(r => Array.isArray(r.data) ? r.data : (r.data.data || [])),
          axios.get(`${API_URL}/usuarios/recientes?limite=5`).then(r => Array.isArray(r.data) ? r.data : (r.data.data || []))
        ]);
        setStats(statsData);
        setRoleDistribution(rolesData);
        setTickets(ticketsData);
        setPagos(pagosData);
        setUsuariosRecientes(usuariosData);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
        setError(`Error al cargar: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const user = useAuthStore((state) => state.user);

  // Conexión WebSocket para usuarios online en tiempo real
  useEffect(() => {
    // Conectar al namespace /presence
    const socket = io('http://localhost:3003/presence');
    socketRef.current = socket;

    socket.on('connect', () => {
      if (user?.id) {
        socket.emit('usuario:autenticado', {
          userId: user.id,
          nombre: user.nombre || 'Admin',
          rol: user.rol || 'administrador'
        });
      } else {
        // Usar un ID temporal para pruebas
        const tempId = 'temp-' + Date.now();
        socket.emit('usuario:autenticado', {
          userId: tempId,
          nombre: 'Admin',
          rol: 'administrador'
        });
      }
    });

    socket.on('usuarios:online', (data: { count: number; usuarios: any[] }) => {
      setUsuariosOnline(data.count);
    });

    socket.on('disconnect', () => {
    });

    // Heartbeat cada 30 segundos para mantener la conexión activa
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('usuario:heartbeat');
      }
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      socket.disconnect();
    };
  }, [user]);

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
            {/* Usuarios Activos - En tiempo real vía WebSocket */}
            <div className="group bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 relative">
                    <Zap className="w-6 h-6 text-emerald-400" />
                    {/* Indicador de conexión en tiempo real */}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-800"></span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Usuarios Conectados</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-white">{usuariosOnline}</p>
                      <p className="text-sm text-slate-400">en tiempo real</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {/* Badge 'En vivo' removido - ya está en el header */}
                </div>
              </div>
              <div className="mt-3 h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min((usuariosOnline / (stats?.totalUsers || 1)) * 100, 100)}%` }}>
                </div>
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
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre"
                    name="nombre"
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-400 mb-1">Apellido</label>
                  <input 
                    type="text" 
                    id="apellido"
                    name="apellido"
                    value={formUsuario.apellido}
                    onChange={(e) => setFormUsuario({...formUsuario, apellido: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="documento" className="block text-sm font-medium text-gray-400 mb-1">Documento de Identidad</label>
                <input 
                  type="text" 
                  id="documento"
                  name="documento"
                  value={formUsuario.documentoIdentidad}
                  onChange={(e) => setFormUsuario({...formUsuario, documentoIdentidad: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                />
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-400 mb-1">Correo Personal</label>
                <input 
                  type="email" 
                  id="correo"
                  name="correo"
                  value={formUsuario.correoPersonal}
                  onChange={(e) => setFormUsuario({...formUsuario, correoPersonal: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  id="telefono"
                  name="telefono"
                  value={formUsuario.telefono}
                  onChange={(e) => setFormUsuario({...formUsuario, telefono: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                />
              </div>

              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-400 mb-1">Rol</label>
                <select 
                  id="rol"
                  name="rol"
                  value={formUsuario.rol}
                  onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value as 'estudiante' | 'profesor' | 'administrador'})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option key="estudiante" value="estudiante">Estudiante</option>
                  <option key="profesor" value="profesor">Profesor</option>
                  <option key="administrador" value="administrador">Administrador</option>
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
          <div className="bg-[#374151] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-600">
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
            <form onSubmit={handleCrearCurso} className="p-6 space-y-4">
              {/* Código y Semestre */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="codigo-curso" className="block text-sm font-semibold text-gray-200 mb-1">Código del Curso *</label>
                  <input 
                    type="text" 
                    id="codigo-curso"
                    name="codigo-curso"
                    list="codigos-existentes"
                    placeholder="Ej: MAT101" 
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white placeholder-gray-400" 
                    required
                  />
                  <datalist id="codigos-existentes">
                    {cursosExistentes.map((curso, index) => (
                      <option key={`curso-codigo-${curso.id || index}`} value={curso.codigo}>
                        {curso.nombre}
                      </option>
                    ))}
                  </datalist>
                  {cursosExistentes.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {cursosExistentes.length} curso(s) existente(s)
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="semestre" className="block text-sm font-semibold text-gray-200 mb-1">Semestre *</label>
                  <select 
                    id="semestre" 
                    name="semestre" 
                    value={formData.semestre}
                    onChange={(e) => setFormData({...formData, semestre: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white"
                    required
                  >
                    <option key="semestre-empty" value="">Seleccionar...</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(s => (
                      <option key={`sem-${s}`} value={s}>Semestre {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nombre del Curso */}
              <div>
                <label htmlFor="nombre-curso" className="block text-sm font-semibold text-gray-200 mb-1">Nombre del Curso *</label>
                <input 
                  type="text" 
                  id="nombre-curso"
                  name="nombre-curso"
                  placeholder="Ej: Cálculo Diferencial" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white placeholder-gray-400" 
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-200 mb-1">Descripción</label>
                <textarea 
                  id="descripcion"
                  name="descripcion"
                  rows={3}
                  placeholder="Describe el contenido y objetivos del curso..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Profesor Asignado */}
              <div>
                <label htmlFor="profesor" className="block text-sm font-semibold text-gray-200 mb-1">Profesor Asignado</label>
                <select 
                  id="profesor" 
                  name="profesor" 
                  value={formData.profesorId}
                  onChange={(e) => setFormData({...formData, profesorId: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white"
                >
                  <option key="profesor-empty" value="">Seleccionar profesor...</option>
                  {profesores.length > 0 ? (
                    profesores.map((prof, index) => (
                      <option key={`profesor-item-${index}-${prof.id_usuario || 'unknown'}`} value={prof.id_usuario}>
                        {prof.nombre} {prof.apellido}
                      </option>
                    ))
                  ) : (
                    <option key="profesor-loading" value="" disabled>Cargando profesores...</option>
                  )}
                </select>
              </div>

              {/* Créditos, Cupos y Nivel */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="creditos" className="block text-sm font-semibold text-gray-200 mb-1">Créditos *</label>
                  <input 
                    type="number" 
                    id="creditos"
                    name="creditos"
                    min={1}
                    max={6}
                    placeholder="3"
                    value={formData.creditos}
                    onChange={(e) => setFormData({...formData, creditos: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white placeholder-gray-400" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cupos" className="block text-sm font-semibold text-gray-200 mb-1">Cupos *</label>
                  <input 
                    type="number" 
                    id="cupos"
                    name="cupos"
                    min={1}
                    placeholder="30"
                    value={formData.cupos}
                    onChange={(e) => setFormData({...formData, cupos: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white placeholder-gray-400" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="nivel" className="block text-sm font-semibold text-gray-200 mb-1">Nivel *</label>
                  <select 
                    id="nivel" 
                    name="nivel" 
                    value={formData.nivel}
                    onChange={(e) => setFormData({...formData, nivel: e.target.value as NivelCursoType})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white"
                    required
                  >
                    <option key="nivel-empty" value="">Seleccionar...</option>
                    <option key="nivel-pregrado" value="pregrado">Pregrado</option>
                    <option key="nivel-posgrado" value="posgrado">Posgrado</option>
                    <option key="nivel-diplomado" value="diplomado">Diplomado</option>
                  </select>
                </div>
              </div>

              {/* Modalidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Modalidad *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['presencial', 'virtual', 'hibrido'].map((mod) => (
                    <label key={mod} className="cursor-pointer">
                      <input
                        type="radio"
                        name="modalidad"
                        value={mod}
                        checked={formData.modalidad === mod}
                        onChange={(e) => setFormData({...formData, modalidad: e.target.value as ModalidadCursoType})}
                        className="sr-only"
                        required
                      />
                      <div className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        formData.modalidad === mod
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-gray-600 bg-[#1f2937] text-gray-400 hover:border-gray-500'
                      }`}>
                        <span className="text-xs font-medium capitalize">{mod}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Carrera / Programa */}
              <div>
                <label htmlFor="carrera" className="block text-sm font-semibold text-gray-200 mb-1">Carrera / Programa *</label>
                <select 
                  id="carrera" 
                  name="carrera" 
                  value={formData.carrera}
                  onChange={(e) => setFormData({...formData, carrera: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white"
                  required
                  disabled={cargandoCarreras}
                >
                  <option key="empty" value="">
                    {cargandoCarreras ? 'Cargando carreras...' : 'Seleccionar carrera...'}
                  </option>
                  {carreras.map((carrera, index) => (
                    <option key={`carrera-${carrera.id || index}`} value={carrera.nombre}>
                      {carrera.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Horario */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hora-inicio" className="block text-sm font-semibold text-gray-200 mb-1">Hora Inicio</label>
                  <input 
                    type="time" 
                    id="hora-inicio"
                    name="hora-inicio"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white"
                  />
                </div>
                <div>
                  <label htmlFor="hora-fin" className="block text-sm font-semibold text-gray-200 mb-1">Hora Fin</label>
                  <input 
                    type="time" 
                    id="hora-fin"
                    name="hora-fin"
                    value={formData.horaFin}
                    onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalCurso(false)} 
                  className="flex-1 px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium disabled:opacity-50"
                >
                  {submitting ? 'Creando...' : 'Crear Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL: ENVIAR NOTIFICACIÓN ========== */}
      {modalNotificacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#374151] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-600">
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
                <label htmlFor="destinatarios" className="block text-sm font-semibold text-gray-200 mb-1">Destinatarios</label>
                <select 
                  id="destinatarios" 
                  name="destinatarios" 
                  value={formNotificacion.destinatarios}
                  onChange={(e) => setFormNotificacion({...formNotificacion, destinatarios: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white"
                >
                  <option key="empty" value="">Seleccionar grupo...</option>
                  <option key="todos" value="todos">Todos los usuarios</option>
                  <option key="estudiantes" value="estudiantes">Todos los estudiantes</option>
                  <option key="profesores" value="profesores">Todos los profesores</option>
                  <option key="carrera" value="carrera">Por carrera específica</option>
                  <option key="curso" value="curso">Por curso específico</option>
                  <option key="individual" value="individual">Usuario individual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">Tipo de Notificación</label>
                <div className="flex gap-2">
                  {['info', 'warning', 'success', 'urgent'].map((tipo) => (
                    <button 
                      key={tipo} 
                      onClick={() => setFormNotificacion({...formNotificacion, tipo: tipo as TipoNotificacion})}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition capitalize ${
                        formNotificacion.tipo === tipo 
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                          : 'border-gray-500 text-gray-200 hover:bg-purple-500/20 hover:border-purple-400'
                      }`}
                    >
                      {tipo === 'info' ? 'Informativa' : tipo === 'warning' ? 'Advertencia' : tipo === 'success' ? 'Éxito' : 'Urgente'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="asunto" className="block text-sm font-semibold text-gray-200 mb-1">Asunto</label>
                <input 
                  type="text" 
                  id="asunto" 
                  name="asunto" 
                  placeholder="Ej: Recordatorio de matrícula" 
                  value={formNotificacion.asunto}
                  onChange={(e) => setFormNotificacion({...formNotificacion, asunto: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-400" 
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-200 mb-1">Mensaje</label>
                <textarea 
                  id="mensaje" 
                  name="mensaje" 
                  rows={4} 
                  placeholder="Escribe el mensaje de la notificación..." 
                  value={formNotificacion.mensaje}
                  onChange={(e) => setFormNotificacion({...formNotificacion, mensaje: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none text-white placeholder-gray-400" 
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="email" 
                  checked={formNotificacion.enviarEmail}
                  onChange={(e) => setFormNotificacion({...formNotificacion, enviarEmail: e.target.checked})}
                  className="w-4 h-4 text-purple-600 rounded border-gray-500 focus:ring-purple-500 bg-[#1f2937]" 
                />
                <label htmlFor="email" className="text-sm text-gray-300">Enviar también por correo electrónico</label>
              </div>
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setModalNotificacion(false)} className="flex-1 px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition font-medium">
                  Cancelar
                </button>
                <button 
                  onClick={handleEnviarNotificacion}
                  disabled={enviandoNotificacion}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {enviandoNotificacion ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Notificación'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL: GENERAR REPORTE ========== */}
      {modalReporte && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#374151] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-600">
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
                <label className="block text-sm font-semibold text-gray-200 mb-1">Tipo de Reporte</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'academico', label: 'Académico', Icon: BookOpen },
                    { id: 'financiero', label: 'Financiero', Icon: DollarSign },
                    { id: 'usuarios', label: 'Usuarios', Icon: Users },
                    { id: 'cursos', label: 'Cursos', Icon: Library },
                  ].map((tipo) => (
                    <button 
                      key={tipo.id} 
                      onClick={() => setFormReporte({...formReporte, tipo: tipo.id as any})}
                      className={`p-3 border rounded-lg hover:border-orange-400 hover:bg-gray-700 transition text-left flex items-center gap-3 ${
                        formReporte.tipo === tipo.id 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-gray-500 bg-[#1f2937]'
                      }`}
                    >
                      <tipo.Icon className="w-5 h-5 text-orange-400" />
                      <span className="text-sm font-medium text-gray-200">{tipo.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="titulo-reporte" className="block text-sm font-semibold text-gray-200 mb-1">Título del Reporte</label>
                <input 
                  type="text" 
                  id="titulo-reporte" 
                  name="titulo-reporte" 
                  placeholder="Ej: Reporte de matrícula 2025-I" 
                  value={formReporte.titulo}
                  onChange={(e) => setFormReporte({...formReporte, titulo: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-white placeholder-gray-400" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fecha-inicio" className="block text-sm font-semibold text-gray-200 mb-1">Fecha Inicio</label>
                  <input 
                    type="date" 
                    id="fecha-inicio" 
                    name="fecha-inicio" 
                    value={formReporte.fechaInicio}
                    onChange={(e) => setFormReporte({...formReporte, fechaInicio: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-white" 
                  />
                </div>
                <div>
                  <label htmlFor="fecha-fin" className="block text-sm font-semibold text-gray-200 mb-1">Fecha Fin</label>
                  <input 
                    type="date" 
                    id="fecha-fin" 
                    name="fecha-fin" 
                    value={formReporte.fechaFin}
                    onChange={(e) => setFormReporte({...formReporte, fechaFin: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-white" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="descripcion-reporte" className="block text-sm font-semibold text-gray-200 mb-1">Descripción / Notas</label>
                <textarea 
                  id="descripcion-reporte" 
                  name="descripcion-reporte" 
                  rows={2} 
                  placeholder="Notas adicionales sobre el reporte..." 
                  value={formReporte.descripcion}
                  onChange={(e) => setFormReporte({...formReporte, descripcion: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none text-white placeholder-gray-400" 
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="export" 
                  checked={formReporte.exportar}
                  onChange={(e) => setFormReporte({...formReporte, exportar: e.target.checked})}
                  className="w-4 h-4 text-orange-600 rounded border-gray-500 focus:ring-orange-500 bg-[#1f2937]" 
                />
                <label htmlFor="export" className="text-sm text-gray-300">Exportar automáticamente a Excel/PDF</label>
              </div>
              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setModalReporte(false)} className="flex-1 px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition font-medium">
                  Cancelar
                </button>
                <button 
                  onClick={handleGenerarReporte}
                  disabled={generandoReporte}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generandoReporte ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generando...
                    </>
                  ) : (
                    'Generar Reporte'
                  )}
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
