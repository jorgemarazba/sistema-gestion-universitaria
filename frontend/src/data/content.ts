/** Imágenes de ejemplo (Unsplash) */
export const SLIDE_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    alt: 'Campus universitario',
    caption: 'Proyectos de investigación y extensión',
  },
  {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Estudiantes en biblioteca',
    caption: 'Eventos académicos y culturales',
  },
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Taller grupal',
    caption: 'Cursos y laboratorios prácticos',
  },
  {
    src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
    alt: 'Graduación',
    caption: 'Ceremonias y comunidad universitaria',
  },
]

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  image: string
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Nueva alianza con empresas tech',
    excerpt:
      'Convenios de práctica profesional y proyectos conjuntos en inteligencia artificial aplicada a la gestión educativa.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  },
  {
    id: 'n2',
    title: 'Semana de innovación docente',
    excerpt:
      'Docentes comparten metodologías activas y uso de nuestro campus virtual integrado con el sistema de gestión.',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
  },
  {
    id: 'n3',
    title: 'Becas regionales 2026',
    excerpt:
      'Ampliamos cupos para talentos de zonas rurales con seguimiento académico desde la plataforma unificada.',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
  },
  {
    id: 'n4',
    title: 'Ranking de sostenibilidad',
    excerpt:
      'La universidad destaca en indicadores ambientales gracias a proyectos verdes liderados por estudiantes.',
    image:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80',
  },
  {
    id: 'n5',
    title: 'Laboratorio de datos abiertos',
    excerpt:
      'Nuevo espacio para investigación con datasets anonimizados y visualización para tesis de pregrado.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    id: 'n6',
    title: 'Intercambios internacionales',
    excerpt:
      'Más convenios con universidades socias: movilidad virtual y presencial con reconocimiento automático de créditos.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
  },
]

export type EventItem = {
  id: string
  title: string
  excerpt: string
  image: string
}

export const EVENT_ITEMS: EventItem[] = [
  {
    id: 'e1',
    title: 'Open Day virtual',
    excerpt:
      'Recorre programas, habla con coordinadores y conoce cómo el sistema de gestión simplifica tu vida académica.',
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  },
  {
    id: 'e2',
    title: 'Hackathon salud digital',
    excerpt:
      '48 horas de prototipado con mentores de la industria y premiación para equipos multidisciplinarios.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  },
  {
    id: 'e3',
    title: 'Conferencia de educación superior',
    excerpt:
      'Panel con rectores sobre transformación digital y calidad institucional en la región.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    id: 'e4',
    title: 'Feria de empleo',
    excerpt:
      'Más de 40 empresas buscan talento; inscripción y CV desde el portal del estudiante.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
  },
]
