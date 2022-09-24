import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Desafio } from './interfaces/desafio.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { Jogador } from './interfaces/jogador.interface';
import HTML_NOTIFICACAO_ADVERSARIO from './static/html-static-notificacao-adversario';

@Injectable()
export class AppService {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private readonly mailService: MailerService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async enviarEmailParaAdversario(desafio: Desafio): Promise<void> {
    try {
      let idAdversario = '';
      desafio.jogadores.map((jogador) => {
        if (jogador != desafio.solicitante) {
          idAdversario = jogador;
        }
      });

      const adversario: Jogador = await this.clientAdminBackend
        .send('consultar-jogadores', idAdversario)
        .toPromise();

      const solicitante: Jogador = await this.clientAdminBackend
        .send('consultar-jogadores', desafio.solicitante)
        .toPromise();

      let markup = '';
      markup = HTML_NOTIFICACAO_ADVERSARIO;
      markup = markup.replace(/#NOME_ADVERSARIO/g, adversario.nome);
      markup = markup.replace(/#NOME_SOLICITANTE/g, solicitante.nome);
      console.log('markup', markup);

      this.mailService
        .sendMail({
          to: adversario.email,
          from: 'SMART RANKING <matheuslino86a@gmail.com>',
          subject: 'Notificação de desafio',
          html: markup,
        })
        .then((success) => {
          console.log(success);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}
