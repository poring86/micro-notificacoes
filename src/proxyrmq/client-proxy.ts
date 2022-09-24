import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientProxySmartRanking {
  constructor(private configService: ConfigService) {}

  rmqUser = this.configService.get<string>('RMQ_USER');
  rmqPassword = this.configService.get<string>('RMQ_PASSWORD');
  rmqUrl = this.configService.get<string>('RMQ_URL');

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,

      options: {
        urls: [`amqp://${this.rmqUser}:${this.rmqPassword}@${this.rmqUrl}`],
        queue: 'admin-backend',
      },
    });
  }

  getClientProxyDesafiosInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,

      options: {
        urls: [
          `amqp://${this.configService.get<string>(
            'RABBITMQ_USER',
          )}:${this.configService.get<string>(
            'RABBITMQ_PASSWORD',
          )}@${this.configService.get<string>('RABBITMQ_URL')}`,
        ],

        queue: 'desafios',
      },
    });
  }

  getClientProxyRankingsInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,

      options: {
        urls: [
          `amqp://${this.configService.get<string>(
            'RABBITMQ_USER',
          )}:${this.configService.get<string>(
            'RABBITMQ_PASSWORD',
          )}@${this.configService.get<string>('RABBITMQ_URL')}`,
        ],

        queue: 'rankings',
      },
    });
  }
}
