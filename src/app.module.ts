import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SES_HOST'),
          port: config.get<string>('SES_PORT'),
          secure: false,
          tls: {
            ciphers: 'SSLv3',
          },
          auth: {
            user: config.get<string>('SES_USER'),
            pass: config.get<string>('SES_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ProxyRMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
