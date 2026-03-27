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
   * Template HTML para credenciales
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
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .credentials-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .credential-item { margin: 12px 0; }
          .label { font-weight: 600; color: #333; }
          .value { color: #666; font-family: 'Courier New', monospace; background: white; padding: 8px; border-radius: 3px; display: inline-block; margin-top: 3px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 4px; margin: 15px 0; color: #856404; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
          a { color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido, ${nombre}!</h1>
            <p>Tu solicitud ha sido aprobada exitosamente 🎉</p>
          </div>
          
          <div class="content">
            <p>Hola <strong>${nombre} ${apellido}</strong>,</p>
            
            <p>Es un placer informarte que tu solicitud de acceso a la Plataforma Educativa ha sido <strong style="color: #28a745;">aprobada</strong>. Aquí están tus credenciales de acceso:</p>
            
            <div class="credentials-box">
              <div class="credential-item">
                <div class="label">📧 Correo Institucional:</div>
                <div class="value">${correoInstitucional}</div>
              </div>
              
              <div class="credential-item">
                <div class="label">🔐 Contraseña Temporal:</div>
                <div class="value">${passwordTemporal}</div>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong> Esta es una contraseña temporal. Por tu seguridad, debes cambiarla en tu primer acceso a la plataforma.
            </div>
            
            <p><strong>Próximos pasos:</strong></p>
            <ol>
              <li>Accede a la plataforma con las credenciales proporcionadas</li>
              <li>Cambia tu contraseña temporal por una contraseña segura</li>
              <li>Completa tu perfil de usuario</li>
              <li>¡Comienza a explorar la plataforma!</li>
            </ol>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Acceder a la Plataforma</a>
            </center>
            
            <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
            
            <p>¡Que comience tu experiencia académica con nosotros!</p>
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
