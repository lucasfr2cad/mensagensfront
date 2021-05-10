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




@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
/**
 * Tab-chat component
 */
export class ChatsComponent implements OnInit {
  @Output() callParent = new EventEmitter<any>();
  chat: Chats[];
  sub: Subscription;


  constructor(public translate: TranslateService, private chatsService: ChatsService,
              private chatativo: ChatativoService, private readonly signalRService: SignalRService,
              private authfackservice: AuthfakeauthenticationService) { }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    dots: false,
    margin: 16,
    navSpeed: 700,
    items: 4,
    nav: false
  };

  ngOnInit(): void {
    this.LerChats();
    this.sub = EventEmitterService.get('NovaMensagem').subscribe(
      (res) => this.LerChats()
    );
  }

  LerChats = () => {
    const currentUser = this.authfackservice.currentUserValue;
    // tslint:disable-next-line: deprecation
    this.chatsService.getAllChatId(currentUser.cd_codigo).subscribe((res) => {
      res.forEach(x => {
        x.id = x.cd_codigo;
        x.name = x.ds_nome;
        x.cd_chat = x.cd_chat;
        x.cd_remetente = x.cd_remetente;
        x.lastMessage = x.ds_ultima_msg;
        x.time = format(new Date(x.dt_atualizacao), 'HH:mm');
      });
      this.chat = res;
    });
  }

  /**
   * Show user chat
   */
  // tslint:disable-next-line: typedef
  showChat = (event: Chat) => {
    this.chatativo.nomeia(event.cd_codigo);
    this.callParent.emit(event);
    setTimeout(() => {
      document.getElementById('chat-room').classList.add('user-chat-show');
 }, 3000);
  }
}
