import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import AdminLayout from './pages/admin/adminLayout';
import { MainLayout } from './layouts/MainLayout';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminSolicitudes } from './pages/admin/Solicitudes';
import { AdminUsuarios } from './pages/admin/Usuarios';
import { AdminCursos } from './pages/admin/Cursos';
import { AdminProgramas } from './pages/admin/Programas';
import { AdminMatriculas } from './pages/admin/Matriculas';
import { AdminPagos } from './pages/admin/Pagos';
import { AdminTickets } from './pages/admin/Tickets';
import { AdminReportes } from './pages/admin/Reportes';
import { AdminNotificaciones } from './pages/admin/Notificaciones';

// Student Layout & Pages
import { StudentLayout } from './pages/student/studentLayout';
import { StudentInscripcion } from './pages/student/Inscripcion';
import { StudentPagos } from './pages/student/Pagos';
import { StudentCalificaciones } from './pages/student/Calificaciones';
import { StudentHistorial } from './pages/student/Historial';
import { StudentDocumentos } from './pages/student/Documentos';
import { StudentHorario } from './pages/student/Horario';
import { StudentSoporte } from './pages/student/Soporte';
import { StudentMensajes } from './pages/student/Mensajes';
import { StudentReportes } from './pages/student/Reportes';
import { StudentPerfil } from './pages/student/Perfil';
// Teacher Layout & Pages
import { TeacherLayout } from './pages/teacher/teacherLayout';
import { TeacherDashboard } from './pages/teacher/Dashboard';
import { TeacherCursos } from './pages/teacher/Cursos';
import { TeacherEstudiantes } from './pages/teacher/Estudiantes';
import { TeacherCalificaciones } from './pages/teacher/Calificaciones';
import { TeacherHorario } from './pages/teacher/Horario';
import { TeacherMateriales } from './pages/teacher/Materiales';
import { TeacherMensajes } from './pages/teacher/Mensajes';
import { TeacherReportes } from './pages/teacher/Reportes';
import { Home } from './pages/Home';
import { LoginPage } from './pages/auth/LoginPage';
import { SolicitudCuentaPage } from './pages/auth/SolicitudCuentaPage';
import { AspirantePage } from './pages/AspirantePage';
import { EstudiantePage } from './pages/EstudiantePage';
import { ProfesorPage } from './pages/ProfesorPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AQUÍ SE USA: Al entrar a la raíz, redirige al Home */}
        {/* El atributo 'replace' evita que el usuario regrese a una página vacía */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* RUTAS PÚBLICAS */}
        <Route element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="aspirante" element={<AspirantePage />} />
          <Route path="estudiante" element={<EstudiantePage />} />
          <Route path="profesor" element={<ProfesorPage />} />
        </Route>

        {/* RUTAS AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/solicitar-cuenta" element={<SolicitudCuentaPage />} />

        {/* RUTAS PROFESOR */}
        <Route path="/teacher" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><TeacherLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherDashboard />} />
          </Route>
          <Route path="cursos" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherCursos />} />
          </Route>
          <Route path="estudiantes" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherEstudiantes />} />
          </Route>
          <Route path="calificaciones" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherCalificaciones />} />
          </Route>
          <Route path="horario" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherHorario />} />
          </Route>
          <Route path="materiales" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherMateriales />} />
          </Route>
          <Route path="mensajes" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherMensajes />} />
          </Route>
          <Route path="reportes" element={<ProtectedRoute allowedRoles={['profesor', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<TeacherReportes />} />
          </Route>
        </Route>

        {/* RUTAS ESTUDIANTE */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="inscripcion" replace />} />
          <Route path="inscripcion" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentInscripcion />} />
          </Route>
          <Route path="pagos" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentPagos />} />
          </Route>
          <Route path="calificaciones" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentCalificaciones />} />
          </Route>
          <Route path="historial" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentHistorial />} />
          </Route>
          <Route path="documentos" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentDocumentos />} />
          </Route>
          <Route path="horario" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentHorario />} />
          </Route>
          <Route path="soporte" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentSoporte />} />
          </Route>
          <Route path="mensajes" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentMensajes />} />
          </Route>
          <Route path="reportes" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentReportes />} />
          </Route>
          <Route path="perfil" element={<ProtectedRoute allowedRoles={['estudiante', 'administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<StudentPerfil />} />
          </Route>
        </Route>

        {/* RUTAS ADMIN */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrador']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="solicitudes" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminSolicitudes />} />
          </Route>
          <Route path="usuarios" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminUsuarios />} />
          </Route>
          <Route path="programas" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminProgramas />} />
          </Route>
          <Route path="cursos" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminCursos />} />
          </Route>
          <Route path="matriculas" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminMatriculas />} />
          </Route>
          <Route path="pagos" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminPagos />} />
          </Route>
          <Route path="tickets" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminTickets />} />
          </Route>
          <Route path="reportes" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminReportes />} />
          </Route>
          <Route path="notificaciones" element={<ProtectedRoute allowedRoles={['administrador']}><Outlet /></ProtectedRoute>}>
            <Route index element={<AdminNotificaciones />} />
          </Route>
        </Route>

        <Route path="*" element={<div className="p-10 text-center text-2xl font-bold">404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;