import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface UsuarioOnline {
  userId: string;
  socketId: string;
  nombre: string;
  rol: string;
  conectadoEn: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/presence',
})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('PresenceGateway');
  private usuariosOnline: Map<string, UsuarioOnline> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    // Emitir conteo actual a todos
    this.emitirConteoUsuarios();
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    // Remover usuario si estaba autenticado
    this.usuariosOnline.delete(client.id);
    this.emitirConteoUsuarios();
  }

  @SubscribeMessage('usuario:autenticado')
  handleUsuarioAutenticado(client: Socket, payload: { userId: string; nombre: string; rol: string }) {
    this.logger.log(`Usuario autenticado: ${payload.nombre} (${payload.userId})`);
    
    const usuario: UsuarioOnline = {
      userId: payload.userId,
      socketId: client.id,
      nombre: payload.nombre,
      rol: payload.rol,
      conectadoEn: new Date(),
    };

    this.usuariosOnline.set(client.id, usuario);
    this.emitirConteoUsuarios();
  }

  @SubscribeMessage('usuario:heartbeat')
  handleHeartbeat(client: Socket) {
    // Actualizar timestamp de última actividad
    const usuario = this.usuariosOnline.get(client.id);
    if (usuario) {
      usuario.conectadoEn = new Date();
      this.usuariosOnline.set(client.id, usuario);
    }
  }

  private emitirConteoUsuarios() {
    const conteo = this.usuariosOnline.size;
    this.logger.log(`Usuarios online: ${conteo}`);
    
    // Emitir a todos los clientes conectados
    this.server.emit('usuarios:online', {
      count: conteo,
      usuarios: Array.from(this.usuariosOnline.values()).map(u => ({
        userId: u.userId,
        nombre: u.nombre,
        rol: u.rol,
      })),
    });
  }

  // Método público para obtener conteo (usado por el servicio de estadísticas)
  getUsuariosOnlineCount(): number {
    // Limpiar usuarios inactivos (más de 5 minutos sin heartbeat)
    const ahora = new Date();
    const limiteInactividad = 5 * 60 * 1000; // 5 minutos

    for (const [socketId, usuario] of this.usuariosOnline.entries()) {
      if (ahora.getTime() - usuario.conectadoEn.getTime() > limiteInactividad) {
        this.usuariosOnline.delete(socketId);
      }
    }

    return this.usuariosOnline.size;
  }

  getUsuariosOnline(): UsuarioOnline[] {
    return Array.from(this.usuariosOnline.values());
  }
}
