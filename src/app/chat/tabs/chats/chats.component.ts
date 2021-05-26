import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';
import { Chats } from './chats.model';
import {Chat} from '../../../core/models/chat.models';
import { ChatsService } from '../../../core/services/chats.service';
import {ChatativoService} from '../../../core/services/chatativo.service';
import { SignalRService } from '../../../core/services/signalR.service';
import {EventEmitterService} from '../../../core/services/eventemitter.service';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { Contato } from 'src/app/core/models/contato.models';
import { UsuarioService } from 'src/app/core/services/usuarios.service';




@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
/**
 * Tab-chat component
 */
export class ChatsComponent implements OnInit {
  chat: Chats[];
  sub: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  items: any;
  contato: any[];
  contatos: Contato[];
  text: string;
  chatMenu: Chat;



  constructor(public translate: TranslateService, private chatsService: ChatsService,
              private chatativo: ChatativoService, private readonly signalRService: SignalRService,
              private authfackservice: AuthfakeauthenticationService, private usuarioService: UsuarioService) { }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    dots: false,
    margin: 16,
    navSpeed: 700,
    items: 4,
    nav: false,
  };

  ngOnInit(): void {
    const currentUser = this.authfackservice.currentUserValue;
    this.usuarioService.getContatosEmpresaID(currentUser.cd_empresa).subscribe(res => {
      this.items = [{
        text: 'Enviar conversa para',
        items: []
    }];
      res.forEach(x => {
        const teste = {text: x.ds_nome, cd_codigo: x.cd_codigo};
        this.items[0].items.push(teste);
      });
    });
    this.LerChats();
    this.sub = EventEmitterService.get('NovaMensagem').subscribe(
      (res) => this.LerChats()
    );
    this.sub2 = EventEmitterService.get('LerChat').subscribe((event) => {
      this.LerChats();
    });
    this.sub3 = EventEmitterService.get('ChatAtualizado').subscribe(
      (res) => this.LerChats()
    );
  }

  itemClick(e): any {
    this.chatsService.postAtribuiAtendente(this.chatMenu.cd_codigo, e.itemData.cd_codigo).subscribe(res => {
      EventEmitterService.get('DesativaTela').emit(e);
      this.LerChats();
    });
  }

  teste(e: any): any{
    this.chatMenu = e;
  }

  LerChats = () => {
    const currentUser = this.authfackservice.currentUserValue;
    // tslint:disable-next-line: deprecation
    if (currentUser.ds_perfil_acesso === 'atendente'){
      this.chatsService.getCM_BuscarPorEmpresaComESemAtendente(currentUser.cd_empresa, currentUser.cd_codigo).subscribe((res) => {
        res.forEach(x => {
          // x.id = x.cd_codigo;
          x.name = x.ds_nome;
          x.cd_chat = x.cd_chat;
          x.cd_remetente = x.cd_remetente;
          x.lastMessage = x.ds_ultima_msg;
          x.unRead = x.cd_atendente === '00000000-0000-0000-0000-000000000000' ? 'Não atibuído' : '';
          x.time = format(new Date(x.dt_atualizacao), 'HH:mm');
        });
        this.chat = res;
      });
    }else{
      this.chatsService.getChatsPorEmpresa(currentUser.cd_empresa).subscribe((res) => {
      res.forEach(x => {
        // x.id = x.cd_codigo;
        x.name = x.ds_nome;
        x.cd_chat = x.cd_chat;
        x.cd_remetente = x.cd_remetente;
        x.lastMessage = x.ds_ultima_msg;
        x.unRead = x.cd_atendente === '00000000-0000-0000-0000-000000000000' ? 'Não atibuído' : x.ds_nome_atendente;
        x.time = format(new Date(x.dt_atualizacao), 'HH:mm');
      });
      this.chat = res;
    });
    }
  }

  /**
   * Show user chat
   */
  // tslint:disable-next-line: typedef
  showChat = (event: Chat) => {
    const currentUser = this.authfackservice.currentUserValue;
    if (currentUser.ds_perfil_acesso === 'atendente'){
      this.chatsService.postAtribuiAtendente(event.cd_codigo, currentUser.cd_codigo).subscribe(res => {
      this.LerChats();
    });
    }
    this.chatativo.nomeia(event.cd_codigo);
    EventEmitterService.get('LerChat').emit(event);
    setTimeout(() => {
      document.getElementById('chat-room').classList.add('user-chat-show');
 }, 1000);
  }
}
