export type Specialty = {
  id: string
  title: string
  short: string
  description: string
  /** Imagen representativa (URL) */
  image: string
}

export const SPECIALTIES: Specialty[] = [
  {
    id: '1',
    title: 'Ingeniería de Sistemas',
    short: 'Software y TI',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    description:
      'Formación en desarrollo de software, arquitectura de sistemas, bases de datos y gestión de proyectos tecnológicos alineados a la industria 4.0.',
  },
  {
    id: '2',
    title: 'Medicina',
    short: 'Ciencias de la salud',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    description:
      'Programa basado en competencias clínicas, investigación médica y práctica hospitalaria con enfoque humanista y bioético.',
  },
  {
    id: '3',
    title: 'Derecho',
    short: 'Ciencias jurídicas',
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    description:
      'Análisis del ordenamiento legal, litigio, derecho constitucional y corporativo con moot courts y clínicas jurídicas.',
  },
  {
    id: '4',
    title: 'Administración de Empresas',
    short: 'Gestión y negocios',
    image:
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    description:
      'Finanzas, marketing, emprendimiento y dirección estratégica con casos reales y simuladores de negocio.',
  },
  {
    id: '5',
    title: 'Psicología',
    short: 'Ciencias del comportamiento',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    description:
      'Evaluación psicológica, intervención clínica y organizacional con prácticas supervisadas y laboratorios.',
  },
  {
    id: '6',
    title: 'Contaduría Pública',
    short: 'Finanzas y auditoría',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    description:
      'Normativa fiscal internacional, auditoría, costos y reporting financiero con software contable profesional.',
  },
  {
    id: '7',
    title: 'Arquitectura',
    short: 'Diseño y urbanismo',
    image:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
    description:
      'Proyectos sostenibles, BIM, historia del arte y talleres de diseño con visitas a obra y concursos.',
  },
  {
    id: '8',
    title: 'Educación',
    short: 'Pedagogía',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    description:
      'Didáctica, tecnología educativa e innovación curricular para formar docentes líderes en el aula.',
  },
]
