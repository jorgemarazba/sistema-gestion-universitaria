import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { AspirantePage } from './pages/AspirantePage'
import { EstudiantePage } from './pages/EstudiantePage'
import { EgresadoPage } from './pages/EgresadoPage'
import { ProfesorPage } from './pages/ProfesorPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SolicitudCuentaPage } from './pages/auth/SolicitudCuentaPage'
import { DashboardPage } from './pages/DashboardPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/solicitar-cuenta" element={<SolicitudCuentaPage />} />

        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="aspirante" element={<AspirantePage />} />
          <Route path="estudiante" element={<EstudiantePage />} />
          <Route path="egresado" element={<EgresadoPage />} />
          <Route path="profesor" element={<ProfesorPage />} />
          <Route path="privacidad" element={<PrivacyPolicyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
