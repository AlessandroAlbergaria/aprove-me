import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
