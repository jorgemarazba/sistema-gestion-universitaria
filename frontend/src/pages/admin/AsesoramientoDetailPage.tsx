import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Calendar, User } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api/v1';

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
      setAsesoramiento(response.data);
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
        setTemplateCargado(true);
      }
    } catch (err) {
      console.error('Error al cargar template:', err);
      // No mostrar error, el admin puede escribir manualmente
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
      await axios.post(`${API_URL}/asesoramiento/${id}/archivos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Archivos subidos exitosamente', 'success');
      cargarAsesoramiento();
    } catch (err) {
      console.error('Error al subir archivos:', err);
      showToast('Error al subir archivos', 'error');
    } finally {
      setSubiendoArchivos(false);
    }
  };

  const eliminarArchivo = async (nombre: string) => {
    try {
      await axios.delete(`${API_URL}/asesoramiento/${id}/archivos/${nombre}`);
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
                <p className="text-white">{asesoramiento.email}</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="text-green-400" size={18} />
                  <span className="text-gray-400 text-sm">Teléfono</span>
                </div>
                <p className="text-white">{asesoramiento.telefono}</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-orange-400" size={18} />
                  <span className="text-gray-400 text-sm">Ubicación</span>
                </div>
                <p className="text-white">{asesoramiento.ciudad}, {asesoramiento.pais}</p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-purple-400" size={18} />
                  <span className="text-gray-400 text-sm">Fecha de solicitud</span>
                </div>
                <p className="text-white">
                  {new Date(asesoramiento.creadoEn).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
                  <p className="text-white font-medium">{asesoramiento.programa}</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="text-cyan-400" size={18} />
                    <span className="text-gray-400 text-sm">Modalidad</span>
                  </div>
                  <p className="text-white font-medium capitalize">{asesoramiento.modalidad}</p>
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
                <label className="text-gray-400 text-sm">Contenido del Email (puedes editarlo):</label>
                <textarea
                  value={mensajeEmail}
                  onChange={(e) => setMensajeEmail(e.target.value)}
                  placeholder="Cargando template..."
                  className="w-full min-h-[200px] bg-slate-700 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-y font-mono text-sm leading-relaxed"
                />

                {/* Archivos Adjuntos */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Archivos Adjuntos ({asesoramiento.archivos?.length || 0})
                  </h4>
                  
                  {/* Lista de archivos existentes */}
                  {asesoramiento.archivos && asesoramiento.archivos.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {asesoramiento.archivos.map((archivo, index) => (
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

                  {/* Input para subir archivos */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={subirArchivos}
                        className="hidden"
                        disabled={subiendoArchivos}
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition border border-dashed border-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {subiendoArchivos ? 'Subiendo...' : 'Agregar archivos'}
                      </div>
                    </label>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
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
