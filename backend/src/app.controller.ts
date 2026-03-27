import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): { status: string; message: string; timestamp: string } {
    return {
      status: 'OK',
      message: 'API Universidad activa',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'Backend está funcionando correctamente ',
      timestamp: new Date().toISOString(),
    };
  }
}
