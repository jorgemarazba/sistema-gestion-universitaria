import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Loader2, AlertCircle, Mail, Fingerprint, GraduationCap, FileText, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002/api/v1';

interface Solicitud {
  id_usuario: string;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  correoPersonal: string;
  rol: string;
  motivoSolicitud: string;
  fechaRegistro: string;
  estado: string;
}

export const AdminSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rechazoModal, setRechazoModal] = useState<{ open: boolean; id: string; motivo: string }>({
    open: false,
    id: '',
    motivo: '',
  });

  // Cargar solicitudes pendientes
  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/usuarios/pendientes`);
      setSolicitudes(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las solicitudes. Intenta de nuevo.');
      console.error('Error cargando solicitudes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // Aprobar solicitud
  const handleAprobar = async (id: string) => {
    try {
      setProcessingId(id);
      await axios.patch(`${API_URL}/usuarios/${id}/status`, {
        status: 'activo',
      });
      
      // Remover de la lista local
      setSolicitudes((prev) => prev.filter((s) => s.id_usuario !== id));
      alert('✅ Solicitud aprobada. Se enviaron las credenciales al correo personal del usuario.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al aprobar la solicitud';
      alert(`❌ ${msg}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Abrir modal de rechazo
  const openRechazoModal = (id: string) => {
    setRechazoModal({ open: true, id, motivo: '' });
  };

  // Rechazar solicitud
  const handleRechazar = async () => {
    if (!rechazoModal.motivo.trim()) {
      alert('⚠️ Debes proporcionar un motivo de rechazo');
      return;
    }

    try {
      setProcessingId(rechazoModal.id);
      await axios.patch(`${API_URL}/usuarios/${rechazoModal.id}/status`, {
        status: 'rechazado',
        motivoRechazo: rechazoModal.motivo,
      });

      // Remover de la lista local
      setSolicitudes((prev) => prev.filter((s) => s.id_usuario !== rechazoModal.id));
      setRechazoModal({ open: false, id: '', motivo: '' });
      alert('❌ Solicitud rechazada. Se notificó al usuario por email.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al rechazar la solicitud';
      alert(`❌ ${msg}`);
    } finally {
      setProcessingId(null);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Solicitudes Pendientes</h1>
        <button
          onClick={cargarSolicitudes}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading && solicitudes.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (!Array.isArray(solicitudes) || solicitudes.length === 0) ? (
        <div className="text-center py-16 bg-[#374151] rounded-xl border border-gray-600">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay solicitudes pendientes</h3>
          <p className="text-gray-400">Todas las solicitudes han sido procesadas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((req) => (
            <div
              key={req.id_usuario}
              className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 p-6 hover:border-blue-500/50 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Nombre completo */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Nombre</p>
                    <p className="text-white font-semibold">
                      {req.nombre} {req.apellido}
                    </p>
                  </div>
                </div>

                {/* Documento */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Fingerprint size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Documento</p>
                    <p className="text-white">{req.documentoIdentidad}</p>
                  </div>
                </div>

                {/* Correo personal */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Mail size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Correo Personal</p>
                    <p className="text-white text-sm">{req.correoPersonal}</p>
                  </div>
                </div>

                {/* Rol solicitado */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <GraduationCap size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Rol Solicitado</p>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium capitalize">
                      {req.rol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <div className="flex items-start gap-3 mb-4 p-4 bg-[#2d3748] rounded-lg">
                <div className="p-2 bg-gray-500/20 rounded-lg">
                  <FileText size={20} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">Motivo / Facultad o Área</p>
                  <p className="text-white text-sm">{req.motivoSolicitud}</p>
                </div>
              </div>

              {/* Fecha y acciones */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-600">
                <p className="text-sm text-gray-400">
                  Solicitado el: <span className="text-blue-400">{formatFecha(req.fechaRegistro)}</span>
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAprobar(req.id_usuario)}
                    disabled={processingId === req.id_usuario}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {processingId === req.id_usuario ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    Aprobar
                  </button>
                  <button
                    onClick={() => openRechazoModal(req.id_usuario)}
                    disabled={processingId === req.id_usuario}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                  >
                    <X size={18} />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de rechazo */}
      {rechazoModal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#374151] rounded-xl shadow-2xl border border-gray-600 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Rechazar Solicitud</h3>
            <p className="text-gray-400 mb-4">
              Por favor, proporciona un motivo claro para el rechazo. Esto se enviará al usuario por email.
            </p>
            <textarea
              value={rechazoModal.motivo}
              onChange={(e) => setRechazoModal({ ...rechazoModal, motivo: e.target.value })}
              placeholder="Ej: El documento proporcionado no coincide con nuestros registros..."
              className="w-full h-32 p-3 bg-[#2d3748] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRechazoModal({ open: false, id: '', motivo: '' })}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                disabled={processingId === rechazoModal.id || !rechazoModal.motivo.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {processingId === rechazoModal.id ? (
                  <Loader2 size={18} className="animate-spin mx-auto" />
                ) : (
                  'Confirmar Rechazo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};