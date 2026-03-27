import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="cursos" element={<TeacherCursos />} />
          <Route path="estudiantes" element={<TeacherEstudiantes />} />
          <Route path="calificaciones" element={<TeacherCalificaciones />} />
          <Route path="horario" element={<TeacherHorario />} />
          <Route path="materiales" element={<TeacherMateriales />} />
          <Route path="mensajes" element={<TeacherMensajes />} />
          <Route path="reportes" element={<TeacherReportes />} />
        </Route>

        {/* RUTAS ESTUDIANTE */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="inscripcion" replace />} />
          <Route path="inscripcion" element={<StudentInscripcion />} />
          <Route path="pagos" element={<StudentPagos />} />
          <Route path="calificaciones" element={<StudentCalificaciones />} />
          <Route path="historial" element={<StudentHistorial />} />
          <Route path="documentos" element={<StudentDocumentos />} />
          <Route path="horario" element={<StudentHorario />} />
          <Route path="soporte" element={<StudentSoporte />} />
          <Route path="mensajes" element={<StudentMensajes />} />
          <Route path="reportes" element={<StudentReportes />} />
          <Route path="perfil" element={<StudentPerfil />} />
        </Route>

        {/* RUTAS ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="solicitudes" element={<AdminSolicitudes />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="programas" element={<AdminProgramas />} />
          <Route path="cursos" element={<AdminCursos />} />
          <Route path="matriculas" element={<AdminMatriculas />} />
          <Route path="pagos" element={<AdminPagos />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="notificaciones" element={<AdminNotificaciones />} />
        </Route>

        <Route path="*" element={<div className="p-10 text-center text-2xl font-bold">404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;