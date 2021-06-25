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
import { pt } from 'date-fns/locale';
import { Subscription } from 'rxjs';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { Contato } from 'src/app/core/models/contato.models';
import { UsuarioService } from 'src/app/core/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { PushNotificationsService } from 'ng-push-ivy';
import {
  OnPageVisible, OnPageHidden,
  OnPageVisibilityChange,
  AngularPageVisibilityStateEnum,
  OnPagePrerender, OnPageUnloaded} from 'angular-page-visibility';
import { DeviceDetectorService } from 'ngx-device-detector';





@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
/**
 * Tab-chat component
 */
export class ChatsComponent implements OnInit {
  busca = '';
  audiosWeWantToUnlock = [];
  audio = new Audio('../../../../assets/toast_sound.mp3');
  chat: Chats[];
  sub: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  items: any;
  contato: any[];
  contatos: Contato[];
  text: string;
  chatMenu: Chat;
  loadingVisible = false;
  idChat = '';
  paginaVisivel = false;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    dots: false,
    margin: 16,
    navSpeed: 700,
    items: 4,
    nav: false,
  };
  @OnPageVisible()
  logWhenPageVisible(): void {
  }

  @OnPageHidden()
  logWhenPageHidden(): void {
  }

  @OnPagePrerender()
  logWhenPagePrerender(): void {
  }

  @OnPageUnloaded()
  logWhenPageUnloaded(): void {
  }

  @OnPageVisibilityChange()
  logWhenPageVisibilityChange( visibilityState: AngularPageVisibilityStateEnum ): void {
    if ( AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.VISIBLE]) {
      this.paginaVisivel = true;
    } else if (AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.HIDDEN]) {
      this.paginaVisivel = false;
    } else if (AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.PRERENDER]) {
    } else if (AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.UNLOADED]) {
    }
  }



  constructor(public translate: TranslateService, private chatsService: ChatsService,
              private chatativo: ChatativoService, private readonly signalRService: SignalRService,
              private authfackservice: AuthfakeauthenticationService, private usuarioService: UsuarioService,
              private toastr: ToastrService, private pushNotifications: PushNotificationsService,
              private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    document.body.addEventListener('touchstart',  () => {
      this.audio.play();
      this.audio.pause();
      this.audio.currentTime = 0;
     }, false);
    const currentUser = this.authfackservice.currentUserValue;
    this.usuarioService.getContatosEmpresaID(currentUser.cd_empresa).subscribe(res => {
      this.items = [{
        id: 1,
        name: ' ',
        items: []
    }];
      res.forEach(x => {
        const teste = {name: x.ds_nome, id: x.cd_codigo};
        this.items[0].items.push(teste);
      });
    });
    this.LerChats();
    this.sub2 = EventEmitterService.get('LerChat').subscribe((event) => {
      this.LerChats();
    });
    this.sub = EventEmitterService.get('ChatAtualizado').subscribe(
      (x) => {
        if (!x.st_interno && x.cd_atendente === '00000000-0000-0000-0000-000000000000'){
          this.LerChats();
          this.toastr.info(x.ds_ultima_msg, x.ds_nome, {
        closeButton : true,
        progressBar	: true,
        timeOut: 5000
      });
          console.log('tocou uma vez');
          this.audio.play();
        }else{
          this.chat.forEach(chat => {
          if (chat.cd_codigo === x.cd_codigo){
            if (currentUser.cd_codigo !== undefined){
              if (x.cd_codigo !== this.chatativo.retorna()){
                 if (x.st_interno === false){
                  if (x.cd_atendente === currentUser.cd_codigo || x.cd_atendente === '00000000-0000-0000-0000-000000000000'){
                    if (!this.deviceService.isMobile()){
                      this.pushNotifications.create(chat.ds_nome, {body: x.ds_ultima_msg}).subscribe(
                      err => console.log(err));
                    }
                    this.toastr.info(x.ds_ultima_msg, chat.ds_nome, {
                  closeButton : true,
                  progressBar	: true,
                  timeOut: 5000
                });
                    console.log('tocou uma vez');
                    this.audio.play();
                  // tslint:disable-next-line: max-line-length
                    // const audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
                    // audio.play();
                  }
                }
                else if (currentUser.cd_codigo === x.cd_ultimo_id){
                  if (!this.deviceService.isMobile()){
                    this.pushNotifications.create(chat.ds_nome, {body: x.ds_ultima_msg}).subscribe(
                    err => console.log(err));
                  }
                  this.toastr.info(x.ds_ultima_msg, chat.ds_nome, {
                closeButton : true,
                progressBar	: true,
                timeOut: 5000
              });
                  console.log('tocou segunda vez');
                  this.audio.play();
                // tslint:disable-next-line: max-line-length
                  // const audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
                  // audio.play();
              }
              }
              else if (!this.paginaVisivel){
                if (currentUser.cd_codigo === x.cd_ultimo_id){
                  if (!this.deviceService.isMobile()){
                    this.pushNotifications.create(chat.ds_nome, {body: x.ds_ultima_msg}).subscribe(
                    err => console.log(err));
                  }
                  this.toastr.info(x.ds_ultima_msg, chat.ds_nome, {
                  closeButton : true,
                  progressBar	: true,
                  timeOut: 5000
          });
                  console.log('tocou terceira vez');
                  this.audio.play();
            // tslint:disable-next-line: max-line-length
                  // const audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
                  // audio.play();
            }
          }
          else{
            this.toastr.info('', '', {
              timeOut: 1
            });
          }
          }
            this.LerChats();
          }else{
          }
        });
        }
      }
    );
    this.pushNotifications.requestPermission();
  }

  itemClick(e: any, id: string): any {
    e.event.stopPropagation();
    if (e.itemData.id !== 1 ){
      this.chatsService.postAtribuiAtendente(id, e.itemData.id).subscribe(res => {
        EventEmitterService.get('DesativaTela').emit(e);
        this.LerChats();
    });
    }
  }

  LerChats = () => {
    const currentUser = this.authfackservice.currentUserValue;
    // tslint:disable-next-line: deprecation
    if (currentUser.ds_perfil_acesso === 'atendente'){
      this.chatsService.getCM_BuscarPorEmpresaComESemAtendente(currentUser.cd_empresa, currentUser.cd_codigo).subscribe((res) => {
        this.chatsService.CM_BuscarChatInterno(currentUser.cd_empresa, currentUser.cd_codigo).subscribe(res2 => {
          const concat = res.concat(res2);
          concat.forEach(x => {
          x.name = x.ds_nome;
          x.cd_chat =  x.cd_chat;
          x.cd_remetente = x.cd_remetente;
          x.lastMessage = x.ds_ultima_msg.replace(/\*/g, '');
          if (x.st_interno){
            x.unRead = '';
            x.name = x.ds_nome;
          }else{
            x.unRead = x.cd_atendente === '00000000-0000-0000-0000-000000000000' ? 'Não atribuído' : '';
          }
          if (x.st_grupo){
            x.name = x.ds_nome;
          }
          x.time = format(new Date(x.dt_atualizacao), 'dd/MM HH:mm');
          x.st_interno = x.st_interno;
        });
          this.chat = concat;
        });
      });
    }else{
      this.chatsService.getChatsPorEmpresa(currentUser.cd_empresa, currentUser.cd_codigo).subscribe((res) => {
        this.chatsService.CM_BuscarChatInterno(currentUser.cd_empresa, currentUser.cd_codigo).subscribe(res2 => {
          const concat = res.concat(res2);
          concat.forEach(x => {
          x.name = x.ds_nome;
          x.cd_chat =  x.cd_chat;
          x.cd_remetente = x.cd_remetente;
          x.lastMessage = x.ds_ultima_msg.replace(/\*/g, '');
          if (x.st_interno){
            x.unRead = '';
            x.name = x.ds_nome;
          }else{
            x.unRead = x.ds_nome_atendente;
          }
          if (x.st_grupo){
            x.name = x.ds_nome;
          }
          x.time = format(new Date(x.dt_atualizacao), 'dd/MM HH:mm');
          x.st_interno = x.st_interno;
        });
          this.chat = concat;
        });
    });
    }
  }

  /**
   * Show user chat
   */
  // tslint:disable-next-line: typedef
  showChat = (event: Chat) => {
    EventEmitterService.get('LerChat').emit(event);
    this.chatativo.nomeia(event.cd_codigo);
    this.idChat = event.cd_codigo;
    const currentUser = this.authfackservice.currentUserValue;
    if (currentUser.ds_perfil_acesso === 'atendente'){
      if (!event.st_interno){
        if (!event.st_grupo){
          this.chatsService.postAtribuiAtendente(event.cd_codigo, currentUser.cd_codigo).subscribe(res => {
          this.LerChats();
        });
        }
      }
    }
  }

 showLoadPanel(): any {
    this.loadingVisible = true;
  }
  hideLoadPanel(): any {
    this.loadingVisible = false;
  }
}
