import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Calendar, User, Pencil, X, Save } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api/v1';

// Contenido base por carrera siguiendo la estructura de 5 secciones
const carreraTemplates: Record<string, {
  gancho: string;
  vision: string;
  diferenciador: string;
  proyeccion: string;
  cta: string;
}> = {
  'Medicina': {
    gancho: 'Elegir la medicina es abrazar una vocación donde la ciencia más rigurosa se encuentra con la compasión más profunda. Cada diagnóstico que realices, cada tratamiento que prescríbas, tiene el poder de transformar vidas enteras y devolver la esperanza a quienes más lo necesitan.',
    vision: `<strong>La Excelencia en Formación Médica</strong><br><br>
Nuestro programa forma médicos con un enfoque integral que combina conocimiento científico de vanguardia con habilidades clínicas prácticas desde los primeros semestres. Durante tu formación dominarás:<br><br>
<strong>• Ciencias Básicas y Anatomía:</strong> Estudiarás anatomía humana con modelos tridimensionales y cadáveres reales, comprendiendo la complejidad del cuerpo humano desde la perspectiva celular hasta los sistemas orgánicos integrados.<br><br>
<strong>• Diagnóstico y Clínica:</strong> Desarrollarás habilidades de semiología, interpretación de exámenes de laboratorio e imagenología diagnóstica, aprendiendo a identificar patrones clínicos y establecer diagnósticos diferenciales precisos.<br><br>
<strong>• Práctica Hospitalaria:</strong> Rotarás por todas las especialidades médicas y quirúrgicas en nuestro Hospital Universitario, atendiendo pacientes reales bajo la supervisión de médicos especialistas con décadas de experiencia.`,
    diferenciador: `<strong>Infraestructura de Vanguardia</strong><br><br>
Nuestra facultad se distingue por contar con tecnología médica de última generación que prepara a nuestros estudiantes para los desafíos de la medicina moderna. Disponemos de simuladores de realidad virtual para procedimientos quirúrgicos, laboratorios de investigación en genética y biología molecular, y convenios con los hospitales más prestigiosos del mundo para rotaciones internacionales.`,
    proyeccion: `<strong>Horizontes Profesionales</strong><br><br>
Como médico egresado, tu campo de práctica no tiene límites. Podrás especializarte en áreas quirúrgicas de alta complejidad, dedicarte a la investigación biomédica, trabajar en medicina deportiva con atletas de élite, o emprender en el sector salud. La demanda de médicos bien formados es universal, y tu preparación te abrirá puertas en los mejores hospitales de América Latina, Europa y Estados Unidos.`,
    cta: 'Tu camino hacia convertirte en un profesional de la salud de excelencia comienza aquí. Reserva tu cita de asesoría personalizada para conocer cómo estructurar tu plan de estudios según la especialidad que desees.'
  },
  'Ingeniería': {
    gancho: 'Tomar la decisión de formarse en Ingeniería de Sistemas es aceptar el reto de convertirse en un arquitecto del mundo digital. Esta disciplina trasciende la simple escritura de código; se trata de una ciencia dedicada a la integración de procesos, la optimización de recursos y la creación de infraestructuras lógicas que sostienen la economía y la sociedad moderna.',
    vision: `<strong>La Profundidad del Aprendizaje</strong><br><br>
Durante tu formación, no solo aprenderás sintaxis de lenguajes de programación, sino que desarrollarás un pensamiento sistémico capaz de descomponer problemas complejos en soluciones escalables. El enfoque académico te llevará a dominar:<br><br>
<strong>• Arquitectura de Software y Backend:</strong> Comprenderás el funcionamiento interno de los sistemas, la gestión eficiente de servidores y el diseño de APIs robustas que permitan la comunicación fluida entre aplicaciones.<br><br>
<strong>• Gestión de Datos:</strong> Aprenderás a diseñar y administrar bases de datos relacionales y no relacionales, asegurando la integridad, seguridad y disponibilidad de la información, que es el activo más valioso de cualquier organización actual.<br><br>
<strong>• Frontend y Experiencia de Usuario:</strong> Desarrollarás la capacidad de crear interfaces modernas y reactivas que no solo sean estéticas, sino que respondan a una lógica de usabilidad intuitiva para el usuario final.`,
    diferenciador: `<strong>El Diferencial Tecnológico</strong><br><br>
La ingeniería moderna exige el dominio de herramientas de vanguardia. En esta carrera, la teoría se encuentra con la práctica mediante la implementación de marcos de trabajo (frameworks) de alto rendimiento, el despliegue en entornos de nube y la integración de modelos de inteligencia artificial para automatizar tareas y generar análisis predictivos.`,
    proyeccion: `<strong>Proyección Profesional</strong><br><br>
Como ingeniero de sistemas, tu campo de acción no tiene fronteras. Podrás liderar proyectos de transformación digital, desempeñarte como desarrollador Full-Stack, consultor en ciberseguridad o arquitecto de datos. El mercado laboral actual no solo busca programadores, sino profesionales con criterio técnico que sepan gestionar presupuestos de desarrollo, liderar equipos interdisciplinarios y garantizar la sostenibilidad de los proyectos de software.`,
    cta: 'Tu futuro como motor de innovación tecnológica comienza con una base académica sólida que te brinde las herramientas para evolucionar al ritmo de la industria. Agenda tu asesoría personalizada hoy mismo.'
  },
  'Derecho': {
    gancho: 'En una sociedad donde los conflictos son cada vez más complejos y multifacéticos, el derecho se ha convertido en la herramienta más poderosa para generar justicia real, proteger derechos fundamentales y transformar comunidades enteras hacia un estado de mayor equidad.',
    vision: `<strong>Formación Jurídica Integral</strong><br><br>
Nuestro programa de Derecho va más allá del estudio de normas y códigos; forma abogados con capacidad de pensamiento crítico, argumentación jurídica sólida y ética profesional inquebrantable. A lo largo de tu carrera desarrollarás:<br><br>
<strong>• Derecho Constitucional y Derechos Fundamentales:</strong> Comprenderás la estructura del Estado, los mecanismos de control constitucional y las acciones de tutela que protegen los derechos de todos los ciudadanos ante vulneraciones por parte de entidades públicas.<br><br>
<strong>• Derecho Civil y Mercantil:</strong> Dominarás las normas que regulan las relaciones entre particulares, desde contratos comerciales complejos hasta derecho de familia, sucesiones y responsabilidad civil.<br><br>
<strong>• Práctica Litigiosa:</strong> Participarás en nuestra Clínica Jurídica atendiendo casos reales de personas de escasos recursos, litigando ante jueces de tutela y desarrollando habilidades de audiencia bajo la supervisión de abogados experimentados.`,
    diferenciador: `<strong>Ecosistema Legal de Excelencia</strong><br><br>
Nuestra Facultad de Derecho se distingue por su Centro de Arbitraje Internacional, donde estudiantes observan casos de arbitraje comercial y de inversión. Contamos con convenios con las firmas de abogados más prestigiosas del país, programas de pasantías en la Corte Constitucional, y profesores que son jueces activos, magistrados de altas cortes y socios de firmas internacionales.`,
    proyeccion: `<strong>Caminos Profesionales</strong><br><br>
Como abogado egresado, tu campo de acción es vasto y diverso. Podrás desempeñarte como litigante en derecho penal, corporativo o internacional; aspirar a cargos en la rama judicial como juez o magistrado; especializarte en derecho ambiental, propiedad intelectual o tecnológico; o fundar tu propio bufete especializado. La preparación integral que recibirás te habilita para los concursos de méritos de la rama judicial y las firmas más exigentes.`,
    cta: 'Descubre si tu vocación es el litigio, la consultoría estratégica o la función judicial. Participa en nuestra Jornada de Puertas Abiertas donde simularás un juicio real con nuestros estudiantes.'
  },
  'Administración': {
    gancho: 'En un mundo donde las empresas nacen y desaparecen en ciclos cada vez más cortos, la capacidad de crear organizaciones resilientes, escalables y capaces de adaptarse al cambio se ha convertido en la habilidad más valiosa del siglo XXI.',
    vision: `<strong>Formación en Gestión y Negocios</strong><br><br>
Nuestro programa de Administración forma líderes capaces de tomar decisiones estratégicas basadas en datos, gestionar equipos multidisciplinarios y crear valor sostenible para todas las partes interesadas. Tu formación incluirá:<br><br>
<strong>• Estrategia Empresarial y Modelos de Negocio:</strong> Aprenderás a diseñar planes estratégicos, analizar mercados competitivos, identificar oportunidades de negocio y estructurar modelos de negocio innovadores que generen ventajas competitivas sostenibles.<br><br>
<strong>• Finanzas Corporativas y Análisis de Inversión:</strong> Dominarás la interpretación de estados financieros, la evaluación de proyectos de inversión, la gestión de flujos de caja y la estructuración de financiamiento para empresas en diferentes etapas de crecimiento.<br><br>
<strong>• Marketing Digital y Transformación Digital:</strong> Desarrollarás competencias en marketing analytics, gestión de marca, e-commerce, automatización de procesos de venta y liderazgo de la transformación digital en organizaciones tradicionales.`,
    diferenciador: `<strong>Ecosistema de Emprendimiento</strong><br><br>
Nuestra Escuela de Negocios cuenta con la acreditación internacional AACSB, que ostentan menos del 5% de las escuelas de negocios en el mundo. Disponemos de un Trading Room con terminales Bloomberg, incubadora de startups con dos millones de dólares en financiación disponible para proyectos estudiantiles, y un programa de mentores CEOs que acompañan a los estudiantes en el desarrollo de sus ideas de negocio.`,
    proyeccion: `<strong>Trayectorias de Éxito</strong><br><br>
Como administrador egresado, podrás desempeñarte como gerente de área en multinacionales, director de operaciones en empresas de tecnología, consultor estratégico en firmas como McKinsey o BCG, fundador de startups escalables, o inversionista en private equity y venture capital. Nuestros egresados ocupan posiciones de liderazgo en empresas del Fortune 500 y han fundado unicornios latinoamericanos.`,
    cta: 'Tu futuro como líder empresarial comienza con una base académica sólida. Presenta tu idea de negocio y recibe feedback de nuestros inversores en residence. Agenda tu asesoría personalizada hoy.'
  },
  'default': {
    gancho: 'Tu carrera profesional es una decisión que transformará tu vida y la de quienes te rodean. Elegir bien es el primer paso hacia un futuro lleno de propósito y éxito.',
    vision: 'Nuestro programa te ofrece una formación integral que combina teoría sólida con práctica desde el primer día. Trabajarás en proyectos reales, tendrás acceso a los mejores profesores del país, y desarrollarás habilidades que el mercado laboral demanda activamente.',
    diferenciador: 'Contamos con instalaciones de última generación, laboratorios especializados, y convenios con las empresas más importantes del sector para que hagas prácticas profesionales. Nuestro enfoque en innovación te prepara para los desafíos del futuro.',
    proyeccion: 'Nuestros egresados trabajan en las mejores empresas del país y del mundo. Muchos han creado sus propias empresas, otros ocupan posiciones de liderazgo en multinacionales. La red de contactos que construirás aquí te acompañará toda la vida.',
    cta: 'Agenda tu asesoría personalizada hoy. Nuestros directores de programa te ayudarán a diseñar un plan de estudios que se ajuste a tus metas profesionales. Las plazas son limitadas y las becas de excelencia están disponibles.'
  }
};

// Función para generar el email según la carrera
const generarEmailAsesoramiento = (programa: string, nombreEstudiante: string) => {
  const contenido = carreraTemplates[programa] || carreraTemplates['default'];
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Universidad - Admisiones</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background-color: #f5f5f5; 
      margin: 0; 
      padding: 20px; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header { 
      background: #2c5282; 
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin: 0;
      font-weight: 600;
    }
    .header-subtitle {
      font-size: 14px;
      margin-top: 8px;
      opacity: 0.9;
    }
    .content { 
      padding: 40px 30px; 
      color: #333;
    }
    .saludo {
      font-size: 18px;
      font-weight: 600;
      color: #2c5282;
      margin-bottom: 25px;
    }
    
    /* Sección 1: Gancho Inicial */
    .gancho-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 25px;
      font-size: 15px;
      line-height: 1.6;
    }
    .gancho-box .section-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.8;
      margin-bottom: 10px;
    }
    
    /* Sección 2: Visión Académica */
    .vision-box {
      background: #f7fafc;
      border-left: 4px solid #2c5282;
      padding: 25px;
      margin-bottom: 25px;
    }
    .vision-box .section-label {
      color: #2c5282;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .vision-box .section-content {
      color: #4a5568;
      font-size: 14px;
      line-height: 1.7;
    }
    
    /* Sección 3: Diferenciador */
    .diferenciador-box {
      background: #fffaf0;
      border: 2px solid #ed8936;
      padding: 25px;
      margin-bottom: 25px;
      border-radius: 8px;
    }
    .diferenciador-box .section-label {
      color: #c05621;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .diferenciador-box .section-content {
      color: #744210;
      font-size: 14px;
      line-height: 1.7;
    }
    
    /* Sección 4: Proyección Laboral */
    .proyeccion-box {
      background: #f0fff4;
      border-left: 4px solid #38a169;
      padding: 25px;
      margin-bottom: 25px;
    }
    .proyeccion-box .section-label {
      color: #276749;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .proyeccion-box .section-content {
      color: #22543d;
      font-size: 14px;
      line-height: 1.7;
    }
    
    /* Sección 5: CTA */
    .cta-box {
      background: #ebf8ff;
      border: 2px solid #4299e1;
      padding: 25px;
      margin-bottom: 25px;
      border-radius: 8px;
      text-align: center;
    }
    .cta-box .section-label {
      color: #2b6cb0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .cta-box .section-content {
      color: #2c5282;
      font-size: 15px;
      line-height: 1.6;
      font-weight: 500;
    }
    
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button { 
      display: inline-block; 
      background: #2c5282; 
      color: white !important; 
      padding: 16px 40px; 
      text-decoration: none; 
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    .button:hover {
      background: #1a365d;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(44, 82, 130, 0.3);
    }
    .footer { 
      background: #f7fafc;
      border-top: 1px solid #e2e8f0;
      padding: 30px; 
      text-align: center; 
    }
    .footer-brand {
      font-size: 16px;
      font-weight: 600;
      color: #2c5282;
      margin-bottom: 10px;
    }
    .footer-text {
      font-size: 13px;
      color: #718096;
      margin: 5px 0;
    }
    .copyright {
      background: #2c5282;
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Universidad</h1>
      <div class="header-subtitle">Admisiones - ${programa}</div>
    </div>
    
    <div class="content">
      <div class="saludo">Estimado/a ${nombreEstudiante},</div>
      
      <!-- Sección 1: Gancho Inicial -->
      <div class="gancho-box" data-section="gancho">
        <div class="section-content">${contenido.gancho}</div>
      </div>
      
      <!-- Sección 2: Visión Académica -->
      <div class="vision-box" data-section="vision">
        <div class="section-content">${contenido.vision}</div>
      </div>
      
      <!-- Sección 3: Diferenciador -->
      <div class="diferenciador-box" data-section="diferenciador">
        <div class="section-content">${contenido.diferenciador}</div>
      </div>
      
      <!-- Sección 4: Proyección Laboral -->
      <div class="proyeccion-box" data-section="proyeccion">
        <div class="section-content">${contenido.proyeccion}</div>
      </div>
      
      <!-- Sección 5: CTA -->
      <div class="cta-box" data-section="cta">
        <div class="section-content">${contenido.cta}</div>
      </div>
      
      <div class="button-container">
        <a href="#" class="button">Agendar Asesoría Personalizada</a>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-brand">Dirección de Admisiones</div>
      <div class="footer-text">📞 (555) 123-4567 | ✉️ admisiones@universidad.edu</div>
      <div class="footer-text">Estamos aquí para ayudarte a tomar la mejor decisión de tu vida</div>
    </div>
    
    <div class="copyright">
      © 2024 Universidad. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>`;
};

interface Asesoramiento {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  pais: string;
  ciudad: string;
  modalidad: string;
  programa: string;
  estado: string;
  creadoEn: string;
  archivos?: { nombre: string; url: string; tipo: string }[];
}

export function AsesoramientoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asesoramiento, setAsesoramiento] = useState<Asesoramiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [mensajeEmail, setMensajeEmail] = useState('');
  const [templateCargado, setTemplateCargado] = useState(false);
  const [modalEdicionAbierto, setModalEdicionAbierto] = useState(false);
  const [mensajeEmailTemporal, setMensajeEmailTemporal] = useState('');
  const [cargandoTemplate, setCargandoTemplate] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [subiendoArchivos, setSubiendoArchivos] = useState(false);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({show: false, message: '', type: 'success'});

  useEffect(() => {
    cargarAsesoramiento();
  }, [id]);

  // Cargar template de email cuando se tenga el asesoramiento
  useEffect(() => {
    if (asesoramiento && !templateCargado) {
      cargarTemplateEmail();
    }
  }, [asesoramiento, templateCargado]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({show: true, message, type});
    setTimeout(() => setToast(prev => ({...prev, show: false})), 4000);
  };

  const cargarAsesoramiento = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/asesoramiento/${id}`);
      console.log('[Frontend] Respuesta cargarAsesoramiento:', response.data);
      
      // Manejar estructura envuelta en 'data' o directa
      const responseData = response.data.data || response.data;
      setAsesoramiento(responseData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar asesoramiento:', err);
      setError('No se pudo cargar la solicitud de asesoramiento');
    } finally {
      setLoading(false);
    }
  };

  const cargarTemplateEmail = async () => {
    try {
      const response = await axios.get(`${API_URL}/asesoramiento/${id}/template-email`);
      if (response.data.contenidoTemplate) {
        setMensajeEmail(response.data.contenidoTemplate);
      } else if (asesoramiento) {
        // Generar template dinámicamente según la carrera
        const templateGenerado = generarEmailAsesoramiento(
          asesoramiento.programa, 
          `${asesoramiento.nombres} ${asesoramiento.apellidos}`
        );
        setMensajeEmail(templateGenerado);
      }
      setTemplateCargado(true);
    } catch (err) {
      console.error('Error al cargar template:', err);
      // Generar template como fallback
      if (asesoramiento) {
        const templateGenerado = generarEmailAsesoramiento(
          asesoramiento.programa, 
          `${asesoramiento.nombres} ${asesoramiento.apellidos}`
        );
        setMensajeEmail(templateGenerado);
      }
      setTemplateCargado(true);
    }
  };

  const enviarEmailRespuesta = async () => {
    if (!mensajeEmail.trim()) {
      showToast('Por favor escribe un mensaje para el solicitante', 'error');
      return;
    }
    setEnviandoEmail(true);
    try {
      await axios.post(`${API_URL}/asesoramiento/${id}/responder-email`, {
        mensaje: mensajeEmail,
      });
      showToast('Email enviado exitosamente', 'success');
      setMensajeEmail('');
      setArchivos([]);
      cargarAsesoramiento();
    } catch (err) {
      console.error('Error al enviar email:', err);
      showToast('Error al enviar el email', 'error');
    } finally {
      setEnviandoEmail(false);
    }
  };

  const subirArchivos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSubiendoArchivos(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('archivos', file);
    });

    try {
      const response = await axios.post(`${API_URL}/asesoramiento/${id}/archivos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('[Frontend] Respuesta completa:', response.data);
      showToast('Archivos subidos exitosamente', 'success');
      
      // Extraer datos - manejar estructura envuelta en 'data' o directa
      const responseData = response.data.data || response.data;
      console.log('[Frontend] Datos extraídos:', responseData);
      
      if (responseData) {
        // Actualizar el estado con los nuevos datos, preservando el asesoramiento existente
        const updatedAsesoramiento = {
          ...asesoramiento,
          ...responseData.asesoramiento,
          archivos: responseData.archivos || responseData.asesoramiento?.archivos || []
        };
        console.log('[Frontend] Actualizando estado con:', updatedAsesoramiento);
        console.log('[Frontend] Total archivos:', updatedAsesoramiento.archivos?.length);
        setAsesoramiento(updatedAsesoramiento);
      } else {
        cargarAsesoramiento();
      }
    } catch (err) {
      console.error('Error al subir archivos:', err);
      showToast('Error al subir archivos', 'error');
    } finally {
      setSubiendoArchivos(false);
    }
  };

  const eliminarArchivo = async (nombre: string) => {
    try {
      const nombreCodificado = encodeURIComponent(nombre);
      await axios.delete(`${API_URL}/asesoramiento/${id}/archivos/${nombreCodificado}`);
      showToast('Archivo eliminado exitosamente', 'success');
      cargarAsesoramiento();
    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      showToast('Error al eliminar archivo', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (error || !asesoramiento) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-red-400">{error || 'No se encontró la solicitud'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <ToastNotification 
        toast={toast} 
        onClose={() => setToast(prev => ({...prev, show: false}))} 
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/reportes')}
            className="p-2 bg-slate-800 text-gray-400 rounded-lg hover:bg-slate-700 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Detalle de Asesoramiento</h1>
            <p className="text-gray-400">Solicitud de información académica</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          {/* Info Header */}
          <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {asesoramiento.nombres} {asesoramiento.apellidos}
                </h2>
                <p className="text-blue-200 text-sm">
                  Solicitud para: {asesoramiento.programa}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="text-blue-400" size={18} />
                  <span className="text-gray-400 text-sm">Email</span>
                </div>
                <p className="text-white">{asesoramiento.email || 'No disponible'}</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="text-green-400" size={18} />
                  <span className="text-gray-400 text-sm">Teléfono</span>
                </div>
                <p className="text-white">{asesoramiento.telefono || 'No disponible'}</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-orange-400" size={18} />
                  <span className="text-gray-400 text-sm">Ubicación</span>
                </div>
                <p className="text-white">
                  {asesoramiento.ciudad && asesoramiento.pais 
                    ? `${asesoramiento.ciudad}, ${asesoramiento.pais}`
                    : asesoramiento.ciudad || asesoramiento.pais || 'No disponible'}
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-purple-400" size={18} />
                  <span className="text-gray-400 text-sm">Fecha de solicitud</span>
                </div>
                <p className="text-white">
                  {asesoramiento.creadoEn && !isNaN(new Date(asesoramiento.creadoEn).getTime())
                    ? new Date(asesoramiento.creadoEn).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Fecha no disponible'
                  }
                </p>
              </div>
            </div>

            {/* Program Info */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información del Programa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="text-blue-400" size={18} />
                    <span className="text-gray-400 text-sm">Programa de interés</span>
                  </div>
                  <p className="text-white font-medium">{asesoramiento.programa || 'No especificado'}</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="text-cyan-400" size={18} />
                    <span className="text-gray-400 text-sm">Modalidad</span>
                  </div>
                  <p className="text-white font-medium capitalize">{asesoramiento.modalidad || 'No especificada'}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Responder por Email</h3>

              {/* Info del programa destacado */}
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                <p className="text-gray-300 text-sm">
                  <span className="text-blue-400 font-medium">Programa:</span> {asesoramiento.programa}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  <span className="text-blue-400 font-medium">Modalidad:</span> {asesoramiento.modalidad}
                </p>
                {templateCargado && (
                  <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Template de {asesoramiento.programa} cargado automáticamente
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-400 text-sm">Contenido del Email:</label>
                  <button
                    onClick={() => {
                      // Generar template según la carrera si no hay mensaje previo
                      const contenidoAEditar = mensajeEmail || (asesoramiento ? generarEmailAsesoramiento(
                        asesoramiento.programa, 
                        `${asesoramiento.nombres} ${asesoramiento.apellidos}`
                      ) : '');
                      setMensajeEmailTemporal(contenidoAEditar);
                      setModalEdicionAbierto(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                  >
                    <Pencil size={16} />
                    <span>Editar</span>
                  </button>
                </div>
                
                {!mensajeEmail && (
                  <p className="text-gray-500 text-sm italic">Cargando template...</p>
                )}

                {/* Archivos Adjuntos */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center gap-2 mb-3">
                    <label className="cursor-pointer" title="Agregar archivos">
                      <input
                        type="file"
                        multiple
                        onChange={subirArchivos}
                        className="hidden"
                        disabled={subiendoArchivos}
                      />
                      <svg className="w-5 h-5 text-blue-400 hover:text-blue-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </label>
                    <h4 className="text-white font-medium">
                      Archivos Adjuntos ({asesoramiento.archivos?.filter(a => a.url?.startsWith('http'))?.length || 0})
                    </h4>
                  </div>
                  
                  {/* Lista de archivos existentes - solo con URLs válidas */}
                  {asesoramiento.archivos && asesoramiento.archivos.filter(a => a.url?.startsWith('http')).length > 0 && (
                    <div className="space-y-2 mb-4">
                      {asesoramiento.archivos.filter(a => a.url?.startsWith('http')).map((archivo, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-600/50 p-2 rounded-lg">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-2xl">
                              {archivo.tipo?.includes('pdf') ? '📄' : 
                               archivo.tipo?.includes('image') ? '🖼️' : 
                               archivo.tipo?.includes('word') ? '📝' : '📎'}
                            </span>
                            <span className="text-white text-sm truncate">{archivo.nombre}</span>
                          </div>
                          <button
                            onClick={() => eliminarArchivo(archivo.nombre)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Eliminar archivo"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-500 text-xs">
                    Los archivos se enviarán automáticamente con el email
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={enviarEmailRespuesta}
                    disabled={enviandoEmail || !mensajeEmail.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Mail size={18} />
                    {enviandoEmail ? 'Enviando...' : `Enviar Email${asesoramiento.archivos?.length ? ` (${asesoramiento.archivos.length} archivos)` : ''}`}
                  </button>
                  <button
                    onClick={() => cargarTemplateEmail()}
                    className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition"
                    title="Recargar template"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>

            {/* Notas/Respuesta */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Notas / Respuesta Interna</h3>
              <div className="space-y-3">
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Escribe aquí tus notas o respuesta sobre esta solicitud..."
                  className="w-full min-h-[120px] bg-slate-700 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-y"
                />
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      if (!notas.trim()) return;
                      setGuardando(true);
                      try {
                        await axios.patch(`${API_URL}/asesoramiento/${id}/notas`, { notas });
                        showToast('Notas guardadas exitosamente', 'success');
                      } catch (err) {
                        console.error('Error al guardar notas:', err);
                        showToast('Error al guardar las notas', 'error');
                      } finally {
                        setGuardando(false);
                      }
                    }}
                    disabled={guardando || !notas.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {guardando ? 'Guardando...' : 'Guardar Notas'}
                  </button>
                  <button
                    onClick={() => setNotas('')}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Email */}
      {modalEdicionAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-semibold text-white">Editar Contenido del Email</h3>
                <p className="text-gray-400 text-sm">Programa: {asesoramiento?.programa}</p>
              </div>
              <button
                onClick={() => setModalEdicionAbierto(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body del Modal - Vista Visual Editable del Email */}
            <div className="flex-1 overflow-auto p-6 bg-gray-100">
              <div 
                ref={(el) => {
                  if (el) {
                    el.innerHTML = mensajeEmailTemporal;
                  }
                }}
                contentEditable
                onInput={(e) => setMensajeEmailTemporal(e.currentTarget.innerHTML)}
                className="w-full min-h-[400px] bg-white rounded-lg shadow-lg overflow-hidden outline-none"
                style={{ minHeight: '400px' }}
              />
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button
                onClick={() => setModalEdicionAbierto(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setMensajeEmail(mensajeEmailTemporal);
                  setModalEdicionAbierto(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Save size={18} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Toast Notification Component
function ToastNotification({ toast, onClose }: { toast: {show: boolean; message: string; type: 'success' | 'error'}; onClose: () => void }) {
  if (!toast.show) return null;
  
  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 ${
        toast.type === 'success' 
          ? 'bg-slate-800 border-green-500 text-white' 
          : 'bg-slate-800 border-red-500 text-white'
      }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          toast.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">
            {toast.type === 'success' ? '¡Éxito!' : 'Error'}
          </p>
          <p className="text-gray-300 text-sm">{toast.message}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AsesoramientoDetailPage;
