import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private isConfigValid: boolean = false;

  constructor() {
    this.validateConfig();
    if (this.isConfigValid) {
      this.initializeTransporter();
    }
  }

  private validateConfig(): void {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.warn('⚠️  Configuración de email incompleta:');
      if (!user) console.warn('   - GMAIL_USER no está definido');
      if (!pass) console.warn('   - GMAIL_APP_PASSWORD no está definido');
      console.warn('   Los emails no se enviarán. Revisa tu archivo .env');
      this.isConfigValid = false;
    } else {
      console.log('✅ Configuración de email cargada:');
      console.log(`   - Usuario: ${user}`);
      console.log(`   - Password: ${pass.substring(0, 4)}...${pass.substring(pass.length - 4)}`);
      this.isConfigValid = true;
    }
  }

  private initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
      console.log('✅ Transportador de email inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar transportador:', error);
      this.isConfigValid = false;
    }
  }

  /**
   * Enviar email de bienvenida con credenciales al estudiante aprobado
   */
  async enviarCredenciales(
    correoPersonal: string,
    nombre: string,
    apellido: string,
    correoInstitucional: string,
    passwordTemporal: string,
  ) {
    const asunto = '🎉 ¡Bienvenido! Tus credenciales de acceso están listas';

    const contenidoHtml = this.generarTemplateCredenciales(
      nombre,
      apellido,
      correoInstitucional,
      passwordTemporal,
    );

    try {
      const info = await this.transporter.sendMail({
        from: `"Plataforma Educativa" <${process.env.GMAIL_USER}>`,
        to: correoPersonal,
        subject: asunto,
        html: contenidoHtml,
      });

      console.log('✅ Email enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw new Error(`Error enviando email: ${error.message}`);
    }
  }

  /**
   * Enviar notificación de rechazo
   */
  async enviarRechazo(
    correoPersonal: string,
    nombre: string,
    motivo: string,
  ) {
    const asunto = 'Notificación - Tu solicitud ha sido revisada';

    const contenidoHtml = this.generarTemplateRechazo(nombre, motivo);

    try {
      const info = await this.transporter.sendMail({
        from: `"Plataforma Educativa" <${process.env.GMAIL_USER}>`,
        to: correoPersonal,
        subject: asunto,
        html: contenidoHtml,
      });

      console.log('✅ Email de rechazo enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar email de rechazo:', error);
      throw new Error(`Error enviando email: ${error.message}`);
    }
  }

  /**
   * Template HTML para credenciales - Estilo Universitario Profesional
   */
  private generarTemplateCredenciales(
    nombre: string,
    apellido: string,
    correoInstitucional: string,
    passwordTemporal: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Source+Sans+Pro:wght@400;600&display=swap');
          
          body { 
            font-family: 'Source Sans Pro', Arial, sans-serif; 
            background-color: #f8f9fa; 
            margin: 0; 
            padding: 0; 
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border: 1px solid #e9ecef;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
          }
          .header { 
            background: #1e3a5f; 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
            border-bottom: 4px solid #c9a227;
          }
          .header h1 {
            font-family: 'Crimson Text', Georgia, serif;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: 700;
          }
          .header-subtitle {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
            color: #343a40;
          }
          .saludo {
            font-family: 'Crimson Text', Georgia, serif;
            font-size: 20px;
            margin-bottom: 20px;
            color: #1e3a5f;
          }
          .mensaje-principal {
            margin-bottom: 30px;
            font-size: 16px;
          }
          .credentials-box { 
            background: #f8f9fa; 
            border: 2px solid #1e3a5f;
            padding: 25px; 
            margin: 30px 0; 
          }
          .credentials-title {
            font-family: 'Crimson Text', Georgia, serif;
            font-size: 18px;
            color: #1e3a5f;
            margin-bottom: 20px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .credential-item { 
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-left: 4px solid #c9a227;
          }
          .label { 
            font-weight: 600; 
            color: #1e3a5f;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .value { 
            color: #212529; 
            font-family: 'Courier New', monospace; 
            font-size: 15px;
            font-weight: 600;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffc107; 
            padding: 20px; 
            margin: 30px 0; 
            color: #856404;
            font-size: 14px;
          }
          .warning strong {
            color: #856404;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          .next-steps-title {
            font-family: 'Crimson Text', Georgia, serif;
            font-size: 18px;
            color: #1e3a5f;
            margin-bottom: 15px;
            font-weight: 600;
          }
          .next-steps-list {
            margin: 20px 0;
            padding-left: 20px;
          }
          .next-steps-list li {
            margin: 10px 0;
            color: #495057;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .button { 
            display: inline-block; 
            background: #1e3a5f; 
            color: white !important; 
            padding: 15px 40px; 
            text-decoration: none; 
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 13px;
            border: 2px solid #1e3a5f;
          }
          .button:hover {
            background: #c9a227;
            border-color: #c9a227;
          }
          .footer { 
            background: #f8f9fa; 
            border-top: 1px solid #e9ecef;
            padding: 30px; 
            text-align: center; 
            font-size: 13px; 
            color: #6c757d; 
          }
          .footer-brand {
            font-family: 'Crimson Text', Georgia, serif;
            font-size: 16px;
            color: #1e3a5f;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .divider {
            width: 60px;
            height: 2px;
            background: #c9a227;
            margin: 20px auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-subtitle">Sistema de Gestion Universitaria</div>
            <div class="divider" style="background: rgba(201, 162, 39, 0.5);"></div>
            <h1>Bienvenido a la Universidad</h1>
          </div>
          
          <div class="content">
            <div class="saludo">Estimado(a) ${nombre} ${apellido},</div>
            
            <div class="mensaje-principal">
              Nos complace informarle que su solicitud de acceso al Sistema de Gestion Universitaria ha sido <strong style="color: #1e3a5f;">APROBADA</strong>. A continuacion encontrara sus credenciales institucionales:
            </div>
            
            <div class="credentials-box">
              <div class="credentials-title">Credenciales de Acceso</div>
              
              <div class="credential-item">
                <div class="label">Correo Institucional:</div>
                <div class="value">${correoInstitucional}</div>
              </div>
              
              <div class="credential-item">
                <div class="label">Contraseña Temporal:</div>
                <div class="value">${passwordTemporal}</div>
              </div>
            </div>
            
            <div class="warning">
              <strong>NOTA DE SEGURIDAD:</strong><br>
              Esta contraseña es temporal y de un solo uso. Por motivos de seguridad institucional, debe cambiarla inmediatamente al ingresar por primera vez a la plataforma.
            </div>
            
            <div class="next-steps-title">Pasos a Seguir</div>
            <ol class="next-steps-list">
              <li>Ingrese a la plataforma mediante el siguiente enlace institucional</li>
              <li>Cambie su contraseña temporal por una contraseña segura y personal</li>
              <li>Complete los datos de su perfil academico</li>
              <li>Revise su horario y asignaturas correspondientes</li>
            </ol>
            
            <div class="button-container">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Acceder al Sistema</a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
              Para cualquier consulta o asistencia tecnica, contacte a la Oficina de Tecnologias de la Informacion.
            </p>
          </div>
          
          <div class="footer">
            <div class="footer-brand">Sistema de Gestion Universitaria</div>
            <p>© 2026 Todos los derechos reservados.</p>
            <p>Este correo es generado automaticamente. Por favor no responda a esta direccion.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template HTML para rechazo
   */
  private generarTemplateRechazo(nombre: string, motivo: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .motivo-box { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; margin: 15px 0; color: #721c24; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .next-steps { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px; margin: 15px 0; color: #0c5460; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Notificación sobre tu solicitud</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>
            
            <p>Hemos revisado cuidadosamente tu solicitud de acceso a la Plataforma Educativa. Lamentablemente, en esta ocasión no hemos podido aprobarla.</p>
            
            <div class="motivo-box">
              <strong>Motivo del rechazo:</strong><br>
              ${motivo}
            </div>
            
            <div class="next-steps">
              <strong>¿Qué puedes hacer?</strong><br>
              Si consideras que hay un error o deseas proporcionar información adicional que apoye tu solicitud, ponte en contacto con nuestro equipo de soporte. Estaremos encantados de revisar tu caso nuevamente.
            </div>
            
            <p>Si tienes preguntas, contacta a nuestro equipo de soporte:</p>
            <p>📧 soporte@institucion.edu<br>
               📞 +57 (1) XXXX-XXXX</p>
            
            <p>Gracias por tu interés en nuestra institución.</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Plataforma Educativa. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas directamente a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
