import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Desafio } from './interfaces/desafio.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('notificacao-novo-desafio')
  async enviarEmailAdversario(
    @Payload() desafio: Desafio,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.appService.enviarEmailParaAdversario(desafio);
      await channel.ack(originalMsg);
    } catch (e) {
      const filterAckError = ackErrors.filter((ackError) =>
        e.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
