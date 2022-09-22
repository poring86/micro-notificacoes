import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyrmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
