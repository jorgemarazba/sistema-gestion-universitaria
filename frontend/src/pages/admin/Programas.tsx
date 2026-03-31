import { useState, useEffect } from 'react';
import { 
  Cpu, Building2, Stethoscope, Scale, Palette, 
  Calculator, Microscope, BookOpen, Globe, Briefcase, 
  Clock, Users, Eye, Edit2, Trash2, Search, Plus, X, GraduationCap, AlertTriangle,
  type LucideIcon
} from 'lucide-react';
import { ProgramasService, type CreateProgramaData } from '../../services/programas.service';
import { CursosService } from '../../services/cursos.service';
import { UsuariosService } from '../../services/usuarios.service';
import type { Curso } from '../../types/curso.types';
import toast from 'react-hot-toast';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
}

interface ProgramaUI {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  semestres: number;
  cursos: number;
  estudiantes: number;
  estado: 'activo' | 'inactivo' | 'en_planeacion';
  nivel: 'pregrado' | 'posgrado' | 'maestria' | 'doctorado' | 'especializacion' | 'diplomado';
  creditosTotales?: number;
  coordinadorId?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}


export const AdminProgramas = () => {
  // Estados
  const [programas, setProgramas] = useState<ProgramaUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalVistaAbierto, setModalVistaAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState<ProgramaUI | null>(null);
  const [coordinadores, setCoordinadores] = useState<Usuario[]>([]);
  const [cargandoCoordinadores, setCargandoCoordinadores] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [programaAEliminar, setProgramaAEliminar] = useState<ProgramaUI | null>(null);
  const [cursosPrograma, setCursosPrograma] = useState<Curso[]>([]);
  const [cargandoCursos, setCargandoCursos] = useState(false);
  const [modalCursosAbierto, setModalCursosAbierto] = useState(false);
  const [modalEstudiantesAbierto, setModalEstudiantesAbierto] = useState(false);
  const [estudiantesPrograma, setEstudiantesPrograma] = useState<Array<{id: string, nombre: string, apellido: string, email: string}>>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState<CreateProgramaData>({
    codigo: '',
    nombre: '',
    descripcion: '',
    semestres: 10,
    cursos: 0,
    estudiantes: 0,
    estado: 'activo',
    nivel: 'pregrado',
    creditosTotales: undefined,
    coordinadorId: '',
  });

  // Cargar programas al montar el componente
  useEffect(() => {
    cargarProgramas();
  }, []);

  // Cargar coordinadores cuando se abre el modal
  useEffect(() => {
    if (modalAbierto) {
      cargarCoordinadores();
    }
  }, [modalAbierto]);

  const cargarCoordinadores = async () => {
    try {
      setCargandoCoordinadores(true);
      const response: any = await UsuariosService.getAll();
      // La API devuelve {success, data} donde data puede ser array u objeto anidado
      let usuarios: any[] = [];
      if (Array.isArray(response)) {
        usuarios = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        usuarios = response.data;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        usuarios = response.data.data;
      }
      // Filtrar solo profesores y administradores como coordinadores
      const coordinadoresDisponibles = usuarios.filter(
        (u: any) => u.rol === 'profesor' || u.rol === 'administrador'
      );
      setCoordinadores(coordinadoresDisponibles);
    } catch (error) {
      console.error('Error al cargar coordinadores:', error);
    } finally {
      setCargandoCoordinadores(false);
    }
  };

  const cargarProgramas = async () => {
    try {
      setLoading(true);
      const response = await ProgramasService.getAll();
      console.log('Datos recibidos de API:', response);
      // La API devuelve {success, data} donde data es el array de programas
      const data = Array.isArray(response) ? response : (response as any).data || [];
      setProgramas(data);
    } catch (error) {
      console.error('Error al cargar programas:', error);
      toast.error('Error al cargar los programas');
      setProgramas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar programas - asegurar que siempre sea un array
  const programasFiltrados = (programas || []).filter(
    (programa) =>
      programa.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      programa.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      programa.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProgramaSeleccionado(null);
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      semestres: 10,
      cursos: 0,
      estudiantes: 0,
      estado: 'activo',
      nivel: 'pregrado',
      creditosTotales: undefined,
      coordinadorId: '',
    });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (programa: ProgramaUI) => {
    setModoEdicion(true);
    setProgramaSeleccionado(programa);
    setFormData({
      codigo: programa.codigo,
      nombre: programa.nombre,
      descripcion: programa.descripcion || '',
      semestres: programa.semestres,
      cursos: programa.cursos,
      estudiantes: programa.estudiantes,
      estado: programa.estado,
      nivel: programa.nivel,
      creditosTotales: programa.creditosTotales,
      coordinadorId: programa.coordinadorId || '',
    });
    setModalAbierto(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setProgramaSeleccionado(null);
  };

  // Abrir modal de vista detallada
  const abrirModalVista = async (programa: ProgramaUI) => {
    setProgramaSeleccionado(programa);
    setModalVistaAbierto(true);
    
    // Cargar cursos asociados al programa
    try {
      setCargandoCursos(true);
      const cursos = await CursosService.getAll(undefined, programa.id, undefined);
      setCursosPrograma(cursos);
    } catch (error) {
      console.error('Error al cargar cursos del programa:', error);
      setCursosPrograma([]);
    } finally {
      setCargandoCursos(false);
    }
  };

  // Cerrar modal de vista
  const cerrarModalVista = () => {
    setModalVistaAbierto(false);
    setProgramaSeleccionado(null);
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  // Guardar programa (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modoEdicion && programaSeleccionado) {
        await ProgramasService.update(programaSeleccionado.id, formData);
        toast.success('Programa actualizado correctamente');
      } else {
        await ProgramasService.create(formData);
        toast.success('Programa creado correctamente');
      }
      cerrarModal();
      cargarProgramas();
    } catch (error) {
      console.error('Error al guardar programa:', error);
      toast.error('Error al guardar el programa');
    }
  };

  // Abrir modal de confirmación de eliminación
  const abrirModalEliminar = (programa: ProgramaUI) => {
    setProgramaAEliminar(programa);
    setModalEliminarAbierto(true);
  };

  // Cerrar modal de eliminación
  const cerrarModalEliminar = () => {
    setModalEliminarAbierto(false);
    setProgramaAEliminar(null);
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (!programaAEliminar) return;
    
    try {
      await ProgramasService.delete(programaAEliminar.id);
      toast.success('Programa eliminado correctamente');
      cerrarModalEliminar();
      cargarProgramas();
    } catch (error) {
      console.error('Error al eliminar programa:', error);
      toast.error('Error al eliminar el programa');
    }
  };

  // Obtener label del nivel
  const getNivelLabel = (nivel: string) => {
    const labels: Record<string, string> = {
      pregrado: 'Pregrado',
      posgrado: 'Posgrado',
      maestria: 'Maestría',
      doctorado: 'Doctorado',
      especializacion: 'Especialización',
      diplomado: 'Diplomado',
    };
    return labels[nivel] || nivel;
  };

  // Obtener icono según la carrera
  const getIconoPorCarrera = (nombre: string): LucideIcon => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('sistem') || nombreLower.includes('software') || nombreLower.includes('comput')) return Cpu;
    if (nombreLower.includes('civil') || nombreLower.includes('construc')) return Building2;
    if (nombreLower.includes('medic') || nombreLower.includes('enferm') || nombreLower.includes('salud')) return Stethoscope;
    if (nombreLower.includes('derecho') || nombreLower.includes('ley')) return Scale;
    if (nombreLower.includes('diseño') || nombreLower.includes('arte') || nombreLower.includes('grafic')) return Palette;
    if (nombreLower.includes('matem') || nombreLower.includes('fisic') || nombreLower.includes('estad')) return Calculator;
    if (nombreLower.includes('biolog') || nombreLower.includes('quimic') || nombreLower.includes('labora')) return Microscope;
    if (nombreLower.includes('admin') || nombreLower.includes('negocio') || nombreLower.includes('empres')) return Briefcase;
    if (nombreLower.includes('idioma') || nombreLower.includes('ingles') || nombreLower.includes('lengu')) return Globe;
    return BookOpen;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6 flex items-center justify-center">
        <div className="text-white text-xl">Cargando programas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Programas</h1>
          <p className="text-sm mt-1 font-medium text-gray-300">Administra los programas académicos</p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span>Nuevo Programa</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 p-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            id="busqueda"
            type="text"
            placeholder="Buscar programas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid de Programas - Estilo Universitario Moderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programasFiltrados.map((programa) => {
          const IconoCarrera = getIconoPorCarrera(programa.nombre);
          return (
            <div 
              key={programa.id} 
              className="group relative bg-linear-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-xl border border-slate-600/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header con gradiente */}
              <div className="relative p-5">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex justify-between items-start">
                  {/* Icono de la carrera */}
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <IconoCarrera className="text-white" size={28} strokeWidth={1.5} />
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                      programa.estado === 'activo' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      programa.estado === 'inactivo' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {programa.estado === 'activo' ? 'Activo' : 
                       programa.estado === 'inactivo' ? 'Inactivo' : 'En Planeación'}
                    </span>
                    <span className={`px-3 py-0.5 text-xs font-medium rounded-lg text-white bg-linear-to-r ${
                      programa.nivel === 'pregrado' ? 'from-blue-500 to-blue-600' :
                      programa.nivel === 'posgrado' ? 'from-purple-500 to-purple-600' :
                      programa.nivel === 'maestria' ? 'from-amber-500 to-amber-600' :
                      programa.nivel === 'doctorado' ? 'from-red-500 to-red-600' :
                      programa.nivel === 'especializacion' ? 'from-cyan-500 to-cyan-600' :
                      'from-emerald-500 to-emerald-600'
                    }`}>
                      {getNivelLabel(programa.nivel)}
                    </span>
                  </div>
                </div>
                
                {/* Título y descripción */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                    {programa.nombre}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {programa.descripcion || 'Sin descripción disponible'}
                  </p>
                </div>

                {/* Código del programa */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-mono bg-slate-900/50 text-slate-400 rounded border border-slate-700">
                    {programa.codigo}
                  </span>
                </div>
              </div>

              {/* Stats - Sección con fondo diferenciado */}
              <div className="bg-slate-900/30 px-5 py-4 border-t border-slate-600/30">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                      <Clock size={14} className="text-blue-400" />
                    </div>
                    <span className="text-lg font-bold text-white">{programa.semestres}</span>
                    <span className="text-xs text-slate-400 font-medium">Semestres</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                      <BookOpen size={14} className="text-purple-400" />
                    </div>
                    <span className="text-lg font-bold text-white">{programa.cursos}</span>
                    <span className="text-xs text-slate-400 font-medium">Cursos</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                      <Users size={14} className="text-emerald-400" />
                    </div>
                    <span className="text-lg font-bold text-white">{programa.estudiantes}</span>
                    <span className="text-xs text-slate-400 font-medium">Estudiantes</span>
                  </div>
                </div>
              </div>

              {/* Actions - Botones funcionales */}
              <div className="px-5 py-4 border-t border-slate-600/30 flex gap-3 bg-slate-800/50">
                <button 
                  onClick={() => abrirModalVista(programa)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  <Eye size={16} />
                  <span>Ver</span>
                </button>
                <button 
                  onClick={() => abrirModalEditar(programa)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg shadow-blue-500/25"
                >
                  <Edit2 size={16} />
                  <span>Editar</span>
                </button>
                <button 
                  onClick={() => abrirModalEliminar(programa)}
                  className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition-all duration-200 border border-rose-500/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {programasFiltrados.length === 0 && !loading && (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 text-lg">No se encontraron programas</p>
          <p className="text-gray-500 text-sm">Intenta con otra búsqueda o crea un nuevo programa</p>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937]/90 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-500/50">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-600">
              <h2 className="text-xl font-bold text-white">
                {modoEdicion ? 'Editar Programa' : 'Nuevo Programa'}
              </h2>
              <button
                onClick={cerrarModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Código */}
                <div>
                  <label htmlFor="codigo" className="block text-sm font-medium text-gray-300 mb-1">
                    Código <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="codigo"
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: ING-SIS"
                    required
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Ingeniería de Sistemas"
                    required
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Descripción del programa académico..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Semestres */}
                <div>
                  <label htmlFor="semestres" className="block text-sm font-medium text-gray-300 mb-1">
                    Semestres <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="semestres"
                    type="number"
                    name="semestres"
                    value={formData.semestres}
                    onChange={handleChange}
                    min={1}
                    max={12}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Cursos */}
                <div>
                  <label htmlFor="cursos" className="block text-sm font-medium text-gray-300 mb-1">
                    Cursos
                  </label>
                  <input
                    id="cursos"
                    type="number"
                    name="cursos"
                    value={formData.cursos || ''}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Estudiantes */}
                <div>
                  <label htmlFor="estudiantes" className="block text-sm font-medium text-gray-300 mb-1">
                    Estudiantes
                  </label>
                  <input
                    id="estudiantes"
                    type="number"
                    name="estudiantes"
                    value={formData.estudiantes || ''}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Nivel */}
                <div>
                  <label htmlFor="nivel" className="block text-sm font-medium text-gray-300 mb-1">
                    Nivel Académico
                  </label>
                  <select
                    id="nivel"
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pregrado">Pregrado</option>
                    <option value="posgrado">Posgrado</option>
                    <option value="especializacion">Especialización</option>
                    <option value="maestria">Maestría</option>
                    <option value="doctorado">Doctorado</option>
                    <option value="diplomado">Diplomado</option>
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-1">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="en_planeacion">En Planeación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Créditos Totales */}
                <div>
                  <label htmlFor="creditosTotales" className="block text-sm font-medium text-gray-300 mb-1">
                    Créditos Totales
                  </label>
                  <input
                    id="creditosTotales"
                    type="number"
                    name="creditosTotales"
                    value={formData.creditosTotales || ''}
                    onChange={handleChange}
                    min={1}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 180"
                  />
                </div>

                {/* Coordinador */}
                <div>
                  <label htmlFor="coordinadorId" className="block text-sm font-medium text-gray-300 mb-1">
                    Coordinador
                  </label>
                  <select
                    id="coordinadorId"
                    name="coordinadorId"
                    value={formData.coordinadorId || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sin coordinador</option>
                    {coordinadores.map((coord, index) => (
                      <option key={coord.id || `coord-${index}`} value={coord.id}>
                        {coord.nombre} {coord.apellido} ({coord.rol})
                      </option>
                    ))}
                  </select>
                  {cargandoCoordinadores && (
                    <p className="text-xs text-gray-500 mt-1">Cargando...</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-600">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Crear Programa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {modalEliminarAbierto && programaAEliminar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-600/50 w-full max-w-md overflow-hidden">
            {/* Header con icono de advertencia */}
            <div className="relative p-6 text-center">
              <div className="absolute inset-0 bg-linear-to-br from-rose-600/10 to-orange-600/10" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center border-2 border-rose-500/30">
                  <AlertTriangle size={32} className="text-rose-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Confirmar Eliminación
                </h2>
                <p className="text-slate-400">
                  ¿Estás seguro de que deseas eliminar el programa <span className="text-white font-semibold">{programaAEliminar.nombre}</span>?
                </p>
              </div>
            </div>

            {/* Detalles del programa */}
            <div className="px-6 pb-4">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const IconoCarrera = getIconoPorCarrera(programaAEliminar.nombre);
                    return <IconoCarrera size={20} className="text-slate-400" />;
                  })()}
                  <span className="text-white font-medium">{programaAEliminar.codigo}</span>
                </div>
                <p className="text-sm text-slate-400">
                  {programaAEliminar.semestres} semestres • {programaAEliminar.estudiantes} estudiantes
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="p-6 border-t border-slate-600/50 bg-slate-800/50 flex gap-3">
              <button
                onClick={cerrarModalEliminar}
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista Detallada */}
      {modalVistaAbierto && programaSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-600/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header con icono y título */}
            <div className="relative p-6 border-b border-slate-600/50">
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-purple-600/10 rounded-t-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg flex items-center justify-center shrink-0">
                  {(() => {
                    const IconoCarrera = getIconoPorCarrera(programaSeleccionado.nombre);
                    return <IconoCarrera className="text-white" size={32} strokeWidth={1.5} />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        {programaSeleccionado.nombre}
                      </h2>
                      <p className="text-sm text-slate-400 font-mono mt-1">
                        {programaSeleccionado.codigo}
                      </p>
                    </div>
                    <button
                      onClick={cerrarModalVista}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                      programaSeleccionado.estado === 'activo' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      programaSeleccionado.estado === 'inactivo' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {programaSeleccionado.estado === 'activo' ? 'Activo' : 
                       programaSeleccionado.estado === 'inactivo' ? 'Inactivo' : 'En Planeación'}
                    </span>
                    <span className={`px-3 py-0.5 text-xs font-medium rounded-lg text-white bg-linear-to-r ${
                      programaSeleccionado.nivel === 'pregrado' ? 'from-blue-500 to-blue-600' :
                      programaSeleccionado.nivel === 'posgrado' ? 'from-purple-500 to-purple-600' :
                      programaSeleccionado.nivel === 'maestria' ? 'from-amber-500 to-amber-600' :
                      programaSeleccionado.nivel === 'doctorado' ? 'from-red-500 to-red-600' :
                      programaSeleccionado.nivel === 'especializacion' ? 'from-cyan-500 to-cyan-600' :
                      'from-emerald-500 to-emerald-600'
                    }`}>
                      {getNivelLabel(programaSeleccionado.nivel)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Descripción */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Descripción
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {programaSeleccionado.descripcion || 'No hay descripción disponible para este programa.'}
                </p>
              </div>

              {/* Grid de estadísticas clickeables */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Información Académica
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Semestres - no clickeable */}
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/30">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Clock size={18} className="text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{programaSeleccionado.semestres}</p>
                    <p className="text-xs text-slate-400">Semestres</p>
                  </div>
                  
                  {/* Cursos - clickeable */}
                  <button 
                    onClick={() => setModalCursosAbierto(true)}
                    className="bg-slate-700/50 hover:bg-slate-700/70 rounded-xl p-4 text-center border border-slate-600/30 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30">
                      <BookOpen size={18} className="text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{programaSeleccionado.cursos}</p>
                    <p className="text-xs text-slate-400">Cursos</p>
                  </button>
                  
                  {/* Estudiantes - clickeable */}
                  <button 
                    onClick={() => {
                      setModalEstudiantesAbierto(true);
                      cargarEstudiantesPrograma(programaSeleccionado.id);
                    }}
                    className="bg-slate-700/50 hover:bg-slate-700/70 rounded-xl p-4 text-center border border-slate-600/30 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30">
                      <Users size={18} className="text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{programaSeleccionado.estudiantes}</p>
                    <p className="text-xs text-slate-400">Estudiantes</p>
                  </button>
                  
                  {/* Créditos - no clickeable */}
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/30">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <GraduationCap size={18} className="text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{programaSeleccionado.creditosTotales || 0}</p>
                    <p className="text-xs text-slate-400">Créditos</p>
                  </div>
                </div>
              </div>

              {/* Coordinador */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Coordinador del Programa
                </h3>
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                  {coordinadores.find(c => c.id === programaSeleccionado.coordinadorId) ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {coordinadores.find(c => c.id === programaSeleccionado.coordinadorId)?.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {coordinadores.find(c => c.id === programaSeleccionado.coordinadorId)?.nombre} {coordinadores.find(c => c.id === programaSeleccionado.coordinadorId)?.apellido}
                        </p>
                        <p className="text-sm text-slate-400 capitalize">
                          {coordinadores.find(c => c.id === programaSeleccionado.coordinadorId)?.rol}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400">
                      <Users size={24} className="text-slate-500" />
                      <span>Sin coordinador asignado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cursos del Programa */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Cursos del Programa
                </h3>
                <div className="bg-slate-700/50 rounded-xl border border-slate-600/30 overflow-hidden">
                  {cargandoCursos ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
                      <p className="text-slate-400">Cargando cursos...</p>
                    </div>
                  ) : cursosPrograma.length > 0 ? (
                    <div className="divide-y divide-slate-600/30">
                      {cursosPrograma.map((curso) => (
                        <div key={curso.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono bg-slate-900/50 text-slate-400 px-2 py-0.5 rounded">
                                  {curso.codigo}
                                </span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  curso.modalidad === 'presencial' ? 'bg-blue-500/20 text-blue-400' :
                                  curso.modalidad === 'virtual' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {curso.modalidad}
                                </span>
                              </div>
                              <h4 className="font-semibold text-white truncate">{curso.nombre}</h4>
                              <p className="text-sm text-slate-400 line-clamp-1">{curso.descripcion || 'Sin descripción'}</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400 shrink-0">
                              <div className="text-center">
                                <span className="block font-semibold text-white">{curso.creditos}</span>
                                <span className="text-xs">Créditos</span>
                              </div>
                              <div className="text-center">
                                <span className="block font-semibold text-white">{curso.cupos}</span>
                                <span className="text-xs">Cupos</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <BookOpen size={32} className="mx-auto mb-3 text-slate-500" />
                      <p>No hay cursos asignados a este programa</p>
                      <p className="text-sm text-slate-500 mt-1">Los cursos aparecerán aquí cuando se asocien al programa</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-slate-400 mb-1">Creado</p>
                  <p className="text-white font-medium">
                    {programaSeleccionado.creadoEn ? new Date(programaSeleccionado.creadoEn).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No disponible'}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-slate-400 mb-1">Última actualización</p>
                  <p className="text-white font-medium">
                    {programaSeleccionado.actualizadoEn ? new Date(programaSeleccionado.actualizadoEn).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No disponible'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer con acciones */}
            <div className="p-6 border-t border-slate-600/50 bg-slate-800/50 flex gap-3">
              <button
                onClick={cerrarModalVista}
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  cerrarModalVista();
                  abrirModalEditar(programaSeleccionado);
                }}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Edit2 size={18} />
                Editar Programa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Cursos */}
      {modalCursosAbierto && programaSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-600/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-6 border-b border-slate-600/50">
              <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 to-blue-600/10 rounded-t-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg flex items-center justify-center">
                    <BookOpen className="text-white" size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Gestión de Cursos
                    </h2>
                    <p className="text-sm text-slate-400">
                      {programaSeleccionado.nombre} • {programaSeleccionado.codigo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalCursosAbierto(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Botón agregar curso */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Cursos del Programa</h3>
                  <p className="text-sm text-slate-400">
                    {cursosPrograma.length} {cursosPrograma.length === 1 ? 'curso asignado' : 'cursos asignados'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalCursosAbierto(false);
                    window.location.href = '/admin/cursos';
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                >
                  <Plus size={18} />
                  Agregar Curso
                </button>
              </div>

              {/* Lista de cursos */}
              {cargandoCursos ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-slate-400">Cargando cursos...</p>
                </div>
              ) : cursosPrograma.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cursosPrograma.map((curso) => (
                    <div
                      key={curso.id}
                      className="bg-slate-700/50 hover:bg-slate-700/70 rounded-xl p-4 border border-slate-600/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono bg-slate-900/50 text-slate-400 px-2 py-0.5 rounded">
                              {curso.codigo}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              curso.modalidad === 'presencial' ? 'bg-blue-500/20 text-blue-400' :
                              curso.modalidad === 'virtual' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {curso.modalidad}
                            </span>
                          </div>
                          <h4 className="font-semibold text-white truncate">{curso.nombre}</h4>
                          <p className="text-sm text-slate-400 line-clamp-1">{curso.descripcion || 'Sin descripción'}</p>
                          
                          {/* Info adicional */}
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="text-slate-400">
                              <span className="text-white font-medium">{curso.creditos}</span> créditos
                            </span>
                            <span className="text-slate-400">
                              <span className="text-white font-medium">{curso.cupos}</span> cupos
                            </span>
                            <span className="text-slate-400">
                              Semestre <span className="text-white font-medium">{curso.semestre}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setModalCursosAbierto(false);
                              window.location.href = `/admin/cursos?view=${curso.id}`;
                            }}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <BookOpen size={48} className="mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-300 font-medium mb-1">No hay cursos asignados</p>
                  <p className="text-sm text-slate-400 mb-4">Este programa aún no tiene cursos asignados</p>
                  <button
                    onClick={() => {
                      setModalCursosAbierto(false);
                      window.location.href = '/admin/cursos';
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Ir a Cursos
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-600/50 bg-slate-800/50">
              <button
                onClick={() => setModalCursosAbierto(false)}
                className="w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Estudiantes */}
      {modalEstudiantesAbierto && programaSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-600/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-6 border-b border-slate-600/50">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-600/10 to-teal-600/10 rounded-t-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-lg flex items-center justify-center">
                    <Users className="text-white" size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Estudiantes Registrados
                    </h2>
                    <p className="text-sm text-slate-400">
                      {programaSeleccionado.nombre} • {programaSeleccionado.codigo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalEstudiantesAbierto(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {cargandoEstudiantes ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                  <p className="text-slate-400">Cargando estudiantes...</p>
                </div>
              ) : estudiantesPrograma.length > 0 ? (
                <div className="space-y-3">
                  {estudiantesPrograma.map((est) => (
                    <div
                      key={est.id}
                      className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl border border-slate-600/30"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Users size={20} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white">{est.nombre} {est.apellido}</h4>
                        <p className="text-sm text-slate-400 truncate">{est.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <Users size={48} className="mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-300 font-medium mb-1">No hay estudiantes registrados</p>
                  <p className="text-sm text-slate-400">Este programa aún no tiene estudiantes matriculados</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-600/50 bg-slate-800/50">
              <button
                onClick={() => setModalEstudiantesAbierto(false)}
                className="w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
