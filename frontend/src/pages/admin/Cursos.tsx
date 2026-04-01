import { useState, useEffect } from 'react';
import { BookOpen, Eye, Edit2, Trash2, Search, Monitor, Video, Users, X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { CursosService } from '../../services/cursos.service';
import { UsuariosService } from '../../services/usuarios.service';
import type { Curso, CreateCursoData, UpdateCursoData } from '../../types/curso.types';
import { ModalidadCurso, NivelCurso } from '../../types/curso.types';
import type { Usuario } from '../../services/usuarios.service';

type ModalType = 'create' | 'edit' | 'view' | 'delete' | null;

export const AdminCursos = () => {
  // Estados de datos
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroModalidad, setFiltroModalidad] = useState<string>('todos');

  // Estados de modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [profesores, setProfesores] = useState<Usuario[]>([]);
  const [cargandoProfesores, setCargandoProfesores] = useState(false);

  // Formulario
  const [formData, setFormData] = useState<CreateCursoData>({
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
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Cargar cursos
  useEffect(() => {
    cargarCursos();
  }, [filtroModalidad]);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const modalidad = filtroModalidad === 'todos' ? undefined : filtroModalidad;
      const data = await CursosService.getAll(undefined, undefined, modalidad);
      console.log('Cursos recibidos:', data);
      setCursos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los cursos');
      setCursos([]);
      console.error('Error cargando cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarProfesores = async () => {
    try {
      setCargandoProfesores(true);
      const response = await UsuariosService.getAll();
      const usuarios = Array.isArray(response) ? response : [];
      
      // Filtrar solo profesores con correo institucional
      const dominiosInstitucionales = ['@universidad.edu', '@institucion.edu', '@edu.co', '@uni.edu'];
      const profesoresList = usuarios.filter((u: any) => {
        const esProfesor = u.rol === 'profesor';
        const tieneEmailInstitucional = dominiosInstitucionales.some(dominio => 
          u.email && u.email.toLowerCase().includes(dominio)
        );
        return esProfesor && tieneEmailInstitucional;
      });
      
      setProfesores(profesoresList);
    } catch (err) {
      console.error('Error al cargar profesores:', err);
      setProfesores([]);
    } finally {
      setCargandoProfesores(false);
    }
  };

  // Filtrar cursos localmente
  const cursosFiltrados = cursos.filter((curso) => {
    const termino = busqueda.toLowerCase();
    return (
      curso.nombre.toLowerCase().includes(termino) ||
      curso.codigo.toLowerCase().includes(termino) ||
      curso.carrera.toLowerCase().includes(termino)
    );
  });

  // Abrir modal
  const openModal = (type: ModalType, curso?: Curso) => {
    setModalType(type);
    setCursoSeleccionado(curso || null);
    
    // Cargar profesores al abrir modal de crear o editar
    if (type === 'create' || type === 'edit') {
      cargarProfesores();
    }
    
    if (type === 'edit' && curso) {
      setFormData({
        codigo: curso.codigo,
        nombre: curso.nombre,
        descripcion: curso.descripcion || '',
        carrera: curso.carrera,
        nivel: curso.nivel,
        modalidad: curso.modalidad,
        creditos: curso.creditos || 3,
        semestre: curso.semestre || 1,
        cupos: curso.cupos || 30,
        profesorId: curso.profesorId || '',
      });
    } else if (type === 'create') {
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
      });
    }
    
    setModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setCursoSeleccionado(null);
  };

  // Crear curso
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await CursosService.create(formData);
      showToast('Curso creado exitosamente', 'success');
      closeModal();
      cargarCursos();
    } catch (err) {
      showToast('Error al crear el curso', 'error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Actualizar curso
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoSeleccionado) return;
    
    try {
      setSubmitting(true);
      await CursosService.update(cursoSeleccionado.id, formData as UpdateCursoData);
      showToast('Curso actualizado exitosamente', 'success');
      closeModal();
      cargarCursos();
    } catch (err) {
      showToast('Error al actualizar el curso', 'error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar curso
  const handleDelete = async () => {
    if (!cursoSeleccionado) return;
    
    try {
      setSubmitting(true);
      await CursosService.delete(cursoSeleccionado.id);
      showToast('Curso eliminado exitosamente', 'success');
      closeModal();
      cargarCursos();
    } catch (err) {
      showToast('Error al eliminar el curso', 'error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helpers de UI
  const getModalidadIcon = (modalidad: string) => {
    switch (modalidad) {
      case 'presencial':
        return <Users size={14} className="mr-1" />;
      case 'virtual':
        return <Video size={14} className="mr-1" />;
      case 'hibrido':
        return <Monitor size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const getModalidadLabel = (modalidad: string) => {
    const labels: Record<string, string> = {
      presencial: 'Presencial',
      virtual: 'Virtual',
      hibrido: 'Híbrido',
    };
    return labels[modalidad] || modalidad;
  };

  const getModalidadStyle = (modalidad: string) => {
    switch (modalidad) {
      case 'presencial':
        return 'bg-blue-100 text-blue-700';
      case 'virtual':
        return 'bg-green-100 text-green-700';
      case 'hibrido':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getNivelLabel = (nivel: string) => {
    const labels: Record<string, string> = {
      pregrado: 'Pregrado',
      posgrado: 'Posgrado',
      diplomado: 'Diplomado',
    };
    return labels[nivel] || nivel;
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Cursos</h1>
        <p className="text-sm mt-1 font-medium text-gray-400">Administra los cursos del sistema</p>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              id="busqueda"
              name="busqueda"
              type="text"
              placeholder="Buscar por nombre, código o carrera..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['todos', 'presencial', 'virtual', 'hibrido'].map((modalidad) => (
              <button
                key={modalidad}
                onClick={() => setFiltroModalidad(modalidad)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtroModalidad === modalidad
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {modalidad === 'todos' ? 'Todos' : getModalidadLabel(modalidad)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="bg-[#1f2937] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <BookOpen size={20} className="text-blue-400" />
            Lista de Cursos
            <span className="px-2.5 py-0.5 bg-gray-700 text-gray-300 text-sm rounded-full">
              {cursosFiltrados.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertTriangle size={40} className="mb-2" />
            <p>{error}</p>
            <button 
              onClick={cargarCursos}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : cursosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <BookOpen size={40} className="mb-2" />
            <p>No hay cursos disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Curso</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Carrera</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Nivel</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Créditos</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Cupos</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Modalidad</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {cursosFiltrados.map((curso) => (
                  <tr key={curso.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-blue-300">
                        {curso.codigo}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                          <BookOpen size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">{curso.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300 max-w-[150px] truncate" title={curso.carrera}>
                      {curso.carrera}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
                        {getNivelLabel(curso.nivel)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-white">{curso.creditos}</span>
                      <span className="text-xs text-gray-500 ml-0.5">cr</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        (curso.cupos || 0) === 0 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {curso.cupos || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        curso.modalidad === 'presencial' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        curso.modalidad === 'virtual' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {curso.modalidad === 'presencial' && <Users size={12} />}
                        {curso.modalidad === 'virtual' && <Video size={12} />}
                        {curso.modalidad === 'hibrido' && <Monitor size={12} />}
                        {getModalidadLabel(curso.modalidad)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <button 
                          onClick={() => openModal('view', curso)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => openModal('edit', curso)}
                          className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => openModal('delete', curso)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <h3 className="text-lg font-bold">
                  {modalType === 'create' && 'Nuevo Curso'}
                  {modalType === 'edit' && 'Editar Curso'}
                  {modalType === 'view' && 'Detalles'}
                  {modalType === 'delete' && 'Eliminar'}
                </h3>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {(modalType === 'create' || modalType === 'edit') && (
                <form onSubmit={modalType === 'create' ? handleCreate : handleUpdate} className="space-y-3">
                  {/* Código y Nombre */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Código</label>
                      <input
                        type="text"
                        value={formData.codigo}
                        onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MAT-101"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Cálculo Diferencial"
                        required
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                      placeholder="Descripción del curso..."
                    />
                  </div>

                  {/* Profesor y Nivel */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Profesor</label>
                      <select
                        value={formData.profesorId || ''}
                        onChange={(e) => setFormData({...formData, profesorId: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={cargandoProfesores}
                      >
                        <option value="">Seleccionar...</option>
                        {profesores.map((prof) => (
                          <option key={prof.id_usuario} value={prof.id_usuario}>
                            {prof.nombre} {prof.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nivel</label>
                      <select
                        value={formData.nivel}
                        onChange={(e) => setFormData({...formData, nivel: e.target.value as typeof NivelCurso.PREGRADO})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={NivelCurso.PREGRADO}>Pregrado</option>
                        <option value={NivelCurso.POSGRADO}>Posgrado</option>
                        <option value={NivelCurso.DIPLOMADO}>Diplomado</option>
                      </select>
                    </div>
                  </div>

                  {/* Créditos, Semestre, Cupos */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Créditos</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.creditos}
                        onChange={(e) => setFormData({...formData, creditos: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Semestre</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={formData.semestre}
                        onChange={(e) => setFormData({...formData, semestre: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Cupos</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.cupos}
                        onChange={(e) => setFormData({...formData, cupos: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Modalidad */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Modalidad</label>
                    <div className="flex gap-2">
                      {Object.values(ModalidadCurso).map((mod) => (
                        <label key={mod} className="flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="modalidad"
                            value={mod}
                            checked={formData.modalidad === mod}
                            onChange={(e) => setFormData({...formData, modalidad: e.target.value as typeof ModalidadCurso.PRESENCIAL})}
                            className="sr-only"
                          />
                          <div className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                            formData.modalidad === mod
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}>
                            {mod === 'presencial' && <Users size={14} />}
                            {mod === 'virtual' && <Video size={14} />}
                            {mod === 'hibrido' && <Monitor size={14} />}
                            {getModalidadLabel(mod)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-1.5"
                    >
                      {submitting && <Loader2 size={14} className="animate-spin" />}
                      {modalType === 'create' ? 'Crear' : 'Guardar'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'view' && cursoSeleccionado && (
                <div className="space-y-6">
                  {/* Sección: Información Principal */}
                  <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Información Principal</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Código</label>
                        <p className="text-lg font-bold text-gray-900">{cursoSeleccionado.codigo}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Nombre del Curso</label>
                        <p className="text-base font-semibold text-gray-900">{cursoSeleccionado.nombre}</p>
                      </div>
                    </div>
                    <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
                      <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Descripción</label>
                      <p className="text-gray-700">{cursoSeleccionado.descripcion || 'Sin descripción'}</p>
                    </div>
                  </div>

                  {/* Sección: Clasificación */}
                  <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Clasificación</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Carrera</label>
                        <p className="text-base font-semibold text-gray-900">{cursoSeleccionado.carrera}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Nivel Académico</label>
                        <p className="text-base font-semibold text-gray-900">{getNivelLabel(cursoSeleccionado.nivel)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Detalles Académicos */}
                  <div className="bg-linear-to-br from-green-50 to-teal-50 rounded-xl p-5 border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Detalles Académicos</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                        <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Créditos</label>
                        <p className="text-2xl font-bold text-green-600">{cursoSeleccionado.creditos}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                        <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Semestre</label>
                        <p className="text-2xl font-bold text-green-600">{cursoSeleccionado.semestre}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                        <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Cupos</label>
                        <p className="text-2xl font-bold text-green-600">{cursoSeleccionado.cupos}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Modalidad */}
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Modalidad</h4>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm inline-flex items-center gap-3">
                      {getModalidadIcon(cursoSeleccionado.modalidad)}
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getModalidadStyle(cursoSeleccionado.modalidad)}`}>
                        {getModalidadLabel(cursoSeleccionado.modalidad)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'delete' && cursoSeleccionado && (
                <div className="text-center">
                  <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar curso?</h4>
                  <p className="text-gray-600 mb-6">
                    Estás a punto de eliminar <strong>{cursoSeleccionado.nombre}</strong>. Esta acción no se puede deshacer.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={submitting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting && <Loader2 size={16} className="animate-spin" />}
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
