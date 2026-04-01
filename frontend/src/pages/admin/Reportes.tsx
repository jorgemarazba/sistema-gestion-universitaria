import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Bell, 
  Trash2, 
  Eye, 
  Send,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Users,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { NotificacionesService } from '../../services/notificaciones.service';

interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: string;
  usuarioId?: string;
  paraAdmin: boolean;
  metadata?: Record<string, any>;
  creadoEn: string;
  actualizadoEn: string;
}

interface ReporteItem {
  id: string;
  tipo: 'notificacion' | 'reporte';
  titulo: string;
  descripcion?: string;
  categoria: string;
  fecha: string;
  estado?: string;
  destinatarios?: string;
  emailsEnviados?: number;
  metadata?: Record<string, any>;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3003/api/v1';

export const AdminReportes = () => {
  const [activeTab, setActiveTab] = useState<'todos' | 'notificaciones' | 'reportes'>('todos');
  const [items, setItems] = useState<ReporteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ReporteItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ReporteItem | null>(null);
  const [reenviando, setReenviando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editForm, setEditForm] = useState({ titulo: '', descripcion: '' });
  const [toast, setToast] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const itemsPerPage = 10;

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/notificaciones/historial`, {
        params: { 
          page: currentPage, 
          limit: itemsPerPage,
        }
      });
      
      // Manejar diferentes formatos de respuesta
      const responseData = response.data;
      
      // Si viene envuelto en {success, data}
      const innerData = responseData.data || responseData;
      
      // Si innerData tiene data (doble envoltura) o es array directo
      const notificaciones = Array.isArray(innerData) 
        ? innerData 
        : (innerData.data || []);
        
      const total = innerData.total || innerData.length || responseData.total || notificaciones.length || 0;
      
      if (!Array.isArray(notificaciones)) {
        console.error('La respuesta no es un array:', responseData);
        setItems([]);
        setTotalItems(0);
        return;
      }
      
      const transformedItems: ReporteItem[] = notificaciones.map((n: Notificacion) => ({
        id: n.id,
        tipo: 'notificacion',
        titulo: n.titulo,
        descripcion: n.descripcion,
        categoria: n.metadata?.destinatarios || n.tipo || 'sistema',
        fecha: n.creadoEn,
        estado: n.estado,
        destinatarios: n.metadata?.destinatarios,
        emailsEnviados: n.metadata?.emailsEnviados,
        metadata: n.metadata,
      }));

      setItems(transformedItems);
      setTotalItems(total);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      showToast('error', 'Error al cargar el historial');
      setItems([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [currentPage]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEliminar = async () => {
    if (!itemToDelete) return;
    
    try {
      await NotificacionesService.eliminarNotificacion(itemToDelete.id);
      showToast('success', 'Notificación eliminada correctamente');
      cargarDatos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      showToast('error', 'Error al eliminar la notificación');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleReenviar = async () => {
    if (!selectedItem || selectedItem.tipo !== 'notificacion') return;
    
    try {
      setReenviando(true);
      const response = await axios.post(`${API_URL}/notificaciones/${selectedItem.id}/reenviar`);
      showToast('success', `Notificación reenviada a ${response.data.cantidad} usuarios`);
      setShowDetailsModal(false);
      cargarDatos();
    } catch (err: any) {
      console.error('Error al reenviar:', err);
      showToast('error', err.response?.data?.message || 'Error al reenviar la notificación');
    } finally {
      setReenviando(false);
    }
  };

  const handleEditar = async () => {
    if (!selectedItem) return;
    
    try {
      setEditando(true);
      await axios.patch(`${API_URL}/notificaciones/${selectedItem.id}`, {
        titulo: editForm.titulo,
        descripcion: editForm.descripcion,
      });
      showToast('success', 'Notificación actualizada correctamente');
      setShowEditModal(false);
      cargarDatos();
    } catch (err: any) {
      console.error('Error al editar:', err);
      showToast('error', err.response?.data?.message || 'Error al actualizar la notificación');
    } finally {
      setEditando(false);
    }
  };

  const openEditModal = (item: ReporteItem) => {
    setSelectedItem(item);
    setEditForm({ titulo: item.titulo, descripcion: item.descripcion || '' });
    setShowEditModal(true);
  };

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'info': 'bg-blue-100 text-blue-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'success': 'bg-green-100 text-green-800',
      'urgent': 'bg-red-100 text-red-800',
      'pago': 'bg-green-100 text-green-800',
      'ticket': 'bg-purple-100 text-purple-800',
      'solicitud': 'bg-blue-100 text-blue-800',
      'sistema': 'bg-gray-100 text-gray-800',
      'todos': 'bg-indigo-100 text-indigo-800',
      'estudiantes': 'bg-cyan-100 text-cyan-800',
      'profesores': 'bg-orange-100 text-orange-800',
      'admin': 'bg-pink-100 text-pink-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getDestinatariosLabel = (dest?: string) => {
    const labels: Record<string, string> = {
      'todos': 'Todos los usuarios',
      'estudiantes': 'Todos los estudiantes',
      'profesores': 'Todos los profesores',
      'admin': 'Administradores',
    };
    return labels[dest] || dest || 'Individual';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'todos') return matchesSearch;
    if (activeTab === 'notificaciones') return matchesSearch && item.tipo === 'notificacion';
    if (activeTab === 'reportes') return matchesSearch && item.tipo === 'reporte';
    return matchesSearch;
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Reportes y Notificaciones</h1>
          <p className="text-gray-400">Gestiona reportes generados y notificaciones enviadas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'todos', label: 'Todos', icon: FileText },
            { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
            { id: 'reportes', label: 'Reportes', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={cargarDatos}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">Tipo</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">Título</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">Destinatarios</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">Fecha</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={20} />
                      Cargando...
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No hay elementos para mostrar
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(item.categoria)}`}>
                        {item.tipo === 'notificacion' ? <Bell size={12} /> : <FileText size={12} />}
                        {item.categoria}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">{item.titulo}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{item.descripcion}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-300">
                        {getDestinatariosLabel(item.destinatarios)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400">
                        {new Date(item.fecha).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-400">
            Mostrando {filteredItems.length} de {totalItems} elementos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-400">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700">
            <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {selectedItem.tipo === 'notificacion' ? <Bell className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Detalles</h3>
                  <p className="text-blue-200 text-xs">
                    {selectedItem.tipo === 'notificacion' ? 'Notificación' : 'Reporte'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="text-white/80 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Título</label>
                <p className="text-white font-medium">{selectedItem.titulo}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Descripción</label>
                <p className="text-gray-300 text-sm">{selectedItem.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Tipo</label>
                  <p className="text-gray-300 text-sm capitalize">{selectedItem.categoria}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Fecha</label>
                  <p className="text-gray-300 text-sm">
                    {new Date(selectedItem.fecha).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>

              {selectedItem.destinatarios && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Destinatarios</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Users size={16} className="text-blue-400" />
                    <span className="text-gray-300 text-sm">
                      {getDestinatariosLabel(selectedItem.destinatarios)}
                    </span>
                  </div>
                </div>
              )}

              {selectedItem.emailsEnviados !== undefined && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Emails Enviados</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-green-400" />
                    <span className="text-gray-300 text-sm">{selectedItem.emailsEnviados}</span>
                  </div>
                </div>
              )}

              {selectedItem.tipo === 'notificacion' && selectedItem.destinatarios && (
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-start gap-3 bg-blue-500/10 p-4 rounded-lg">
                    <AlertCircle className="text-blue-400 shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-300">
                        Puedes reenviar esta notificación a los mismos destinatarios. 
                        Se crearán nuevas notificaciones y se enviarán emails si están configurados.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                Cerrar
              </button>
              {selectedItem.tipo === 'notificacion' && selectedItem.destinatarios && (
                <button
                  onClick={handleReenviar}
                  disabled={reenviando}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {reenviando ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Reenviar Notificación
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirmar Eliminación</h3>
                <p className="text-gray-400 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar <strong className="text-white">{itemToDelete.titulo}</strong>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700">
            <div className="bg-linear-to-r from-yellow-700 to-yellow-900 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Editar Notificación</h3>
                  <p className="text-yellow-200 text-xs">Modifica el título y descripción</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-white/80 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                <input
                  type="text"
                  value={editForm.titulo}
                  onChange={(e) => setEditForm({...editForm, titulo: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditar}
                disabled={editando}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
              >
                {editando ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Pencil size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
