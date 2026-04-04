import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asesoramiento } from './entities/asesoramiento.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AsesoramientoService {
  constructor(
    @InjectRepository(Asesoramiento)
    private asesoramientoRepo: Repository<Asesoramiento>,
    private notificacionesService: NotificacionesService,
    private mailService: MailService,
  ) {}

  async crearSolicitud(data: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    pais: string;
    ciudad: string;
    modalidad: string;
    programa: string;
  }) {
    // Crear la solicitud de asesoramiento
    const solicitud = this.asesoramientoRepo.create({
      ...data,
      estado: 'pendiente',
    });
    await this.asesoramientoRepo.save(solicitud);

    // Crear notificación para el administrador
    await this.notificacionesService.crearNotificacion({
      titulo: `Nueva solicitud de asesoramiento - ${data.programa}`,
      descripcion: `${data.nombres} ${data.apellidos} solicita asesoramiento para ${data.programa}. Contacto: ${data.email} - ${data.telefono}`,
      tipo: 'solicitud',
      paraAdmin: true,
      entidadId: solicitud.id,
      entidadTipo: 'asesoramiento',
      metadata: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        programa: data.programa,
        modalidad: data.modalidad,
        ciudad: data.ciudad,
        pais: data.pais,
      },
    });

    return {
      success: true,
      message: 'Solicitud enviada exitosamente',
      solicitudId: solicitud.id,
    };
  }

  async findAll() {
    return this.asesoramientoRepo.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findById(id: string) {
    return this.asesoramientoRepo.findOne({ where: { id } });
  }

  async responderSolicitud(id: string, respuesta: string) {
    const solicitud = await this.asesoramientoRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new Error('Solicitud no encontrada');
    }

    solicitud.estado = 'respondido';
    solicitud.respuesta = respuesta;
    solicitud.respondidoEn = new Date();

    await this.asesoramientoRepo.save(solicitud);

    return {
      success: true,
      message: 'Solicitud respondida exitosamente',
    };
  }

  async cerrarSolicitud(id: string) {
    const solicitud = await this.asesoramientoRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new Error('Solicitud no encontrada');
    }

    solicitud.estado = 'cerrado';
    await this.asesoramientoRepo.save(solicitud);

    return {
      success: true,
      message: 'Solicitud cerrada exitosamente',
    };
  }

  async guardarNotas(id: string, notas: string) {
    const solicitud = await this.asesoramientoRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new Error('Solicitud no encontrada');
    }

    solicitud.notas = notas;
    await this.asesoramientoRepo.save(solicitud);

    return {
      success: true,
      message: 'Notas guardadas exitosamente',
    };
  }

  async obtenerTemplateEmail(id: string) {
    const solicitud = await this.asesoramientoRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException('Solicitud de asesoramiento no encontrada');
    }

    const template = this.generarTemplatePrograma(solicitud.programa, solicitud.modalidad);

    return {
      success: true,
      programa: solicitud.programa,
      modalidad: solicitud.modalidad,
      contenidoTemplate: template.contenido,
      mensaje: 'Template de email generado exitosamente',
    };
  }

  private generarTemplatePrograma(programa: string, modalidad: string): { contenido: string; imagenes?: string[] } {
    const programaLower = programa.toLowerCase();
    
    // Templates por programa
    const templates: Record<string, { contenido: string; imagenes?: string[] }> = {
      medicina: {
        contenido: `Estimado aspirante a la carrera de Medicina,

Nos complace que hayas elegido nuestra prestigiosa Facultad de Medicina. Te compartimos información detallada sobre el programa:

🩺 INFORMACIÓN ACADÉMICA
El programa de Medicina tiene una duración de 6 años (12 semestres), incluyendo el internado rotatorio. Nuestro plan de estudios está diseñado para formar médicos con excelencia científica y humana.

📚 CURRICULUM POR SEMESTRES:
• Semestres 1-2: Ciencias Básicas (Anatomía, Fisiología, Bioquímica, Histología)
• Semestres 3-4: Ciencias Pre-clínicas (Patología, Farmacología, Microbiología)
• Semestres 5-6: Ciencias Clínicas (Medicina Interna, Cirugía, Pediatría)
• Semestres 7-8: Especialidades Clínicas (Ginecología, Psiquiatría, Neurología)
• Semestres 9-10: Internado Hospitalario (Rotaciones en hospitales)
• Semestres 11-12: Especialización y Servicio Social

💰 INVERSIÓN SEMESTRAL:
• Semestres 1-6: $8,500 USD cada uno
• Semestres 7-10: $9,200 USD cada uno
• Semestres 11-12: $7,800 USD cada uno
• Material de laboratorio: $1,200 USD por año
• Equipos médicos y uniformes: $800 USD

🏥 CAMPUS Y LABORATORIOS:
Contamos con laboratorios de simulación médica de última generación, incluyendo:
- Centro de Simulación Clínica con 20 maniquíes de alta fidelidad
- Laboratorio de Anatomía con modelos digitales 3D
- Hospital Universitario con 500 camas para prácticas

🌟 CAMPOS LABORALES:
Al graduarte podrás desempeñarte como:
• Médico General en hospitales públicos y privados
• Médico Especialista (con residencia)
• Investigador médico
• Docente universitario
• Médico de empresas o deportivo
• Servicio diplomático en salud

La medicina es una de las profesiones con mayor demanda laboral, con promedios salariales de $3,000-$15,000 USD mensuales según especialización.

Si deseas más información o agendar una visita guiada a nuestras instalaciones, no dudes en contactarnos.`,
        imagenes: ['https://universidad.edu/images/medicina-cursos.jpg', 'https://universidad.edu/images/medicina-pagos.jpg', 'https://universidad.edu/images/medicina-laboral.jpg']
      }
    };

    // Template genérico para otros programas
    return {
      contenido: `Estimado aspirante,

Gracias por tu interés en nuestro programa de ${programa}. Te proporcionamos la siguiente información:

📚 INFORMACIÓN DEL PROGRAMA
• Programa: ${programa}
• Modalidad: ${modalidad}
• Duración: Consulta planes de estudio específicos

💰 INVERSIONES:
Los costos semestrales varían según el programa. Contamos con opciones de financiamiento y becas académicas.

🏛️ INSTALACIONES:
Nuestra universidad cuenta con modernas instalaciones, laboratorios equipados y biblioteca digital con acceso a recursos académicos internacionales.

🎓 PROYECCIÓN PROFESIONAL:
Nuestros egresados se desempeñan exitosamente en el sector público y privado, con altas tasas de empleabilidad.

Para información más detallada sobre este programa específico, te invitamos a agendar una asesoría personalizada.`,
      imagenes: []
    };
  }

  private generarDocumentosPrograma(programa: string): { nombre: string; url: string; icono: string }[] {
    const programaLower = programa.toLowerCase().replace(/\s+/g, '_');
    
    // Documentos base que todos los programas tienen
    const documentosBase = [
      {
        nombre: `Plan_Estudios_${programaLower}_2024.pdf`,
        url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/planes/${programaLower}_plan.pdf`,
        icono: '📄'
      },
      {
        nombre: `Brochure_${programaLower}.jpg`,
        url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/brochures/${programaLower}_brochure.jpg`,
        icono: '🖼️'
      }
    ];

    // Documentos específicos por carrera
    const documentosEspecificos: Record<string, { nombre: string; url: string; icono: string }[]> = {
      medicina: [
        {
          nombre: 'Manual_Laboratorio_Clinico.pdf',
          url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/medicina/laboratorio.pdf`,
          icono: '🧪'
        },
        {
          nombre: 'Convenios_Hospitales_2024.pdf',
          url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/medicina/convenios.pdf`,
          icono: '🏥'
        }
      ],
      ingenieria_sistemas: [
        {
          nombre: 'Pensum_Ing_Sistemas_2024.pdf',
          url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/sistemas/pensum.pdf`,
          icono: '💻'
        },
        {
          nombre: 'Convenios_Tecnologicos.pdf',
          url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/sistemas/convenios_tech.pdf`,
          icono: '🤝'
        }
      ],
      derecho: [
        {
          nombre: 'Malla_Curricular_Derecho.pdf',
          url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/derecho/malla.pdf`,
          icono: '⚖️'
        }
      ],
      administracion: [
        {
          nombre: 'Plan_Estudios_Administracion.pdf',
          url: `${process.env.FRONTEND_URL || 'https://universidad.edu'}/documentos/administracion/plan.pdf`,
          icono: '📊'
        }
      ]
    };

    const programaKey = programaLower.replace(/\s+/g, '_');
    const especificos = documentosEspecificos[programaKey] || [];

    return [...documentosBase, ...especificos];
  }

  async enviarEmailRespuesta(id: string, mensajePersonalizado: string) {
    const solicitud = await this.asesoramientoRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException('Solicitud de asesoramiento no encontrada');
    }

    // Generar template según el programa
    const template = this.generarTemplatePrograma(solicitud.programa, solicitud.modalidad);
    const contenidoFinal = mensajePersonalizado || template.contenido;

    // Generar contenido del email automático con imágenes
    const asunto = `Impulsa tu futuro: Información sobre ${solicitud.programa} en Universidad`;
    
    // Generar documentos según la carrera
    const documentos = this.generarDocumentosPrograma(solicitud.programa);
    
    const contenidoHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; margin: 0 auto; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Universidad</h1>
          <p style="color: #e0e0e0; margin: 8px 0 0 0;">Admisiones - Facultad de ${solicitud.programa}</p>
        </div>
        
        <!-- Body -->
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Estimado/a ${solicitud.nombres} ${solicitud.apellidos},</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Un gusto saludarte. Es un placer enviarte la guía para tu camino universitario.
          </p>
          
          <!-- Program Info -->
          <div style="background: #f8fafc; padding: 25px; margin: 25px 0; border-radius: 8px;">
            <h3 style="color: #1e3a5f; margin-top: 0;">Sobre nuestro Programa de ${solicitud.programa}</h3>
            <p style="color: #6b7280; line-height: 1.6;">
              Este es tu programa, aquí la personalización sobre la ${solicitud.programa}:
            </p>
            <ul style="color: #4b5563; line-height: 1.8; margin-top: 15px; padding-left: 20px;">
              <li>Desarrollo y estudios para la ${solicitud.programa}</li>
              <li>Plan de estudios actualizado y acreditado</li>
              <li>Prácticas profesionales en empresas líderes</li>
              <li>Oportunidades de intercambio internacional</li>
            </ul>
          </div>

          <!-- Recursos y Asesoría -->
          <div style="background: #f8fafc; padding: 25px; margin: 25px 0; border-radius: 8px;">
            <h3 style="color: #1e3a5f; margin-top: 0;">Recursos y Asesoría Especializada</h3>
            <p style="color: #6b7280; line-height: 1.6;">
              Asesoría Especializada detallada sobre becas, información en Coordinación Académica, convenios, académicos de financiación y pagos.
            </p>
          </div>

          <!-- Pasos a Seguir -->
          <div style="background: #e8f4f8; border-left: 4px solid #1e3a5f; padding: 25px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #1e3a5f; margin-top: 0;">Pasos a Seguir</h3>
            <p style="color: #4b5563; line-height: 1.6;">
              Responde a este correo, completa tu inscripción, contáctate al (555) 123-4567 o asiste a tu asesoría y la Jornada en la Universidad.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://universidad.edu'}/solicitar-cuenta" 
               style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); 
                      color: white; 
                      padding: 16px 40px; 
                      text-decoration: none; 
                      border-radius: 30px; 
                      font-weight: 600; 
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(30, 58, 95, 0.3);">
              Comenzar Inscripción →
            </a>
          </div>

          <!-- Firma -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #4b5563; margin: 0;">Atentamente,</p>
            <p style="color: #1e3a5f; font-weight: 600; margin: 5px 0;">Dirección de Admisiones</p>
            <p style="color: #6b7280; margin: 5px 0;">Facultad de ${solicitud.programa}</p>
            <p style="color: #6b7280; margin: 5px 0;">Universidad</p>
            <p style="color: #1e3a5f; font-weight: 500; margin-top: 10px;">
              📞 (555) 123-4567 | 📧 admisiones@universidad.edu
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1e3a5f; padding: 25px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 Universidad. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `;

    // Enviar el email (sin archivos adjuntos que no existen físicamente)
    // NOTA: Los archivos se guardan como URLs, no como archivos físicos locales
    await this.mailService.enviarEmailHtmlDirecto(
      solicitud.email,
      asunto,
      contenidoHtml,
      [], // No enviar archivos adjuntos hasta que se implemente almacenamiento físico
    );

    // Actualizar el estado de la solicitud a respondido
    solicitud.estado = 'respondido';
    solicitud.respuesta = contenidoFinal;
    solicitud.respondidoEn = new Date();
    await this.asesoramientoRepo.save(solicitud);

    return {
      success: true,
      message: 'Email de respuesta enviado exitosamente',
    };
  }

  async subirArchivos(id: string, archivos: any[]) {
    const solicitud = await this.asesoramientoRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException('Solicitud de asesoramiento no encontrada');
    }

    // Inicializar array de archivos si no existe
    if (!solicitud.archivos) {
      solicitud.archivos = [];
    }

    // Procesar cada archivo
    const nuevosArchivos = archivos.map((archivo) => ({
      nombre: archivo.originalname,
      url: `/uploads/asesoramiento/${id}/${archivo.filename}`,
      tipo: archivo.mimetype,
    }));

    // Agregar a la lista existente
    solicitud.archivos = [...solicitud.archivos, ...nuevosArchivos];
    await this.asesoramientoRepo.save(solicitud);

    return {
      success: true,
      message: 'Archivos subidos exitosamente',
      archivos: solicitud.archivos,
    };
  }

  async eliminarArchivo(id: string, archivoNombre: string) {
    const solicitud = await this.asesoramientoRepo.findOne({ where: { id } });
    if (!solicitud || !solicitud.archivos) {
      throw new NotFoundException('Solicitud o archivos no encontrados');
    }

    // Filtrar el archivo a eliminar
    solicitud.archivos = solicitud.archivos.filter(
      (archivo) => archivo.nombre !== archivoNombre,
    );

    await this.asesoramientoRepo.save(solicitud);

    return {
      success: true,
      message: 'Archivo eliminado exitosamente',
    };
  }
}
