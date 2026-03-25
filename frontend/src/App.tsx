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

// Public & Auth Pages
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