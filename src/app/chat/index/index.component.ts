import { ChangeDetectorRef, Component, EventEmitter, OnInit, TestabilityRegistry, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from './chat.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import {EventEmitterService} from '../../core/services/eventemitter.service';
import { MensagensService } from '../../core/services/mensagens.service';
import { format } from 'date-fns';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Contato } from 'src/app/core/models/contato.models';
import { Linha } from 'src/app/core/models/linha.models';
import {Mensagem} from '../../core/models/mensagem.models';
import { Chat } from 'src/app/core/models/chat.models';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MensagemParametroModelo } from '../../core/models/mensagemParametro.Models';
import { ChatativoService } from 'src/app/core/services/chatativo.service';
import { ContatoService } from 'src/app/core/services/contato.service';
import {LinhaService} from 'src/app/core/services/linha.service';
import { ChatsService } from 'src/app/core/services/chats.service';
import { Usuario } from 'src/app/core/models/usuario.models';
import { UsuarioService } from 'src/app/core/services/usuarios.service';
import { MensagemInterna } from 'src/app/core/models/mensagemInterna.Models';
import * as Sentry from '@sentry/angular';
import { Contacts } from '../tabs/contacts/contacts.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StatusMensagemService } from 'src/app/core/services/statusMensagem.service';
const MicRecorder = require('mic-recorder-to-mp3');
declare var MediaRecorder: any;
export enum RecordingState {
  STOPPED = 'stopped',
  RECORDING = 'recording',
  FORBIDDEN = 'forbidden',
}
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
/**
 * Chat-component
 */
export class IndexComponent implements OnInit {
  public imagePath;
  imgURL: any;
  public message: string;
  focusEvent = new EventEmitter<boolean>();
  desativaResponder = true;
  desativaEnviar = true;
  photoVisible = false;
  imagemGrande = '';
  respostaWP =  false;
  respostaIN = false;
  time = 0;
  display ;
  interval;
  contacts: Contacts[];
  conversaParaEncaminhar: any;
  copiaMensagemResponder: any;
  responderTexto = '';
  usuarios: Usuario[];
  popupListaUsuarios = false;
  activetab = 2;
  file: any;
  Messages: Message[];
  textoatual = '';
  textoatual2 = '';
  MensagemEnviar: Message;
  MensagemInternaEnviar: MensagemInterna;
  MensagemRecebida: Message;
  nomeContatoBar = '';
  contato: Contato;
  numeroEnviar: string;
  sub: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  popupVisible = false;
  popupVisible2 = false;
  binario: string;
  loadingVisible = false;
  toggled = false;
  chatativo = false;
  contactsList: any;
  // tslint:disable-next-line: variable-name
  vl_Numero_da_Pagina = 1;
  // tslint:disable-next-line: variable-name
  vl_Tamanho_da_Pagina = 10;
  mensagemParametroModelo: MensagemParametroModelo;
  primeiraVezCarregando = true;
  linhaContato: Linha;
  adm = false;
  usuario: Usuario;
  seconds: number;
  state: RecordingState = RecordingState.STOPPED;
  audioURLs = [];
  private mediaRecorder;
  private recordings$: Observable<any>;
  popupResponder = false;
  private recorder = new MicRecorder({
    bitRate: 128
  });
  chat: Chat;
  listLang = [
    { text: 'Português', flag: 'assets/images/flags/brasil.png', lang: 'ptbr' },
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];
  lang: string;
  public type = 'component';

  public disabled = false;

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;
  @ViewChild('content2', { static: false }) private content;
  constructor(private authFackservice: AuthfakeauthenticationService, private authService: AuthenticationService,
              private router: Router, public translate: TranslateService, private mensagensService: MensagensService,
              private chatativoService: ChatativoService, private usuarioService: UsuarioService,
              private authfackservice: AuthfakeauthenticationService, private contatoService: ContatoService,
              private linhaService: LinhaService, private chatService: ChatsService,
              private contatoServico: ContatoService, private spinner: NgxSpinnerService,
              private modalService: NgbModal, private toastr: ToastrService,
              private statusMensagemService: StatusMensagemService, private sanitizer: DomSanitizer
              ) { }

  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.contato = {
   ds_nome: 'Selecione um contato'
  };
    const currentUser = this.authfackservice.currentUserValue;
    // Sentry.setUser({currentUser});
    this.usuario = this.authfackservice.currentUserValue;
    this.adm = currentUser.ds_perfil_acesso === 'atendente' ? false : true;
    this.sub4 = EventEmitterService.get('AtualizarMensagem').subscribe((mensagem) => {
      if (this.Messages !== undefined){
        if (this.Messages.length > 0){
        this.Messages.forEach(x => {
          if (x.cd_codigo === mensagem.cd_codigo){
            x.vl_status = mensagem.vl_status;
          }
        });
      }
      }
    });
    this.sub3 = EventEmitterService.get('DesativaTela').subscribe(() => {
      this.chatativo = false;
    });
    this.sub2 = EventEmitterService.get('LerChat').subscribe((event) => {
      this.setFocus();
      this.chatativo = true;
      // this.loadingVisible = true;
      this.vl_Numero_da_Pagina = 1;
      if (event !== undefined){
        this.setarContato(event);
        this.chat = event;
        this.LerMensagensPorChat(event.cd_codigo);
        setTimeout(() => {
          this.componentRef.directiveRef.scrollToBottom(0, 500);
       }, 1000);
      }else{
        this.chatativo = false;
      }
    });
    this.sub = EventEmitterService.get('NovaMensagem').subscribe(
      (x) => {
        if (this.chat !== undefined){
          if (this.chat.st_interno){
          this.statusMensagemService.postCM_AtualizarMensagensLidas(this.chat.cd_codigo, currentUser.cd_codigo).subscribe(tantofaz => {
          });
          }
          else{
            x.vl_status = 3;
            this.mensagensService.putMessage(x).subscribe(result => {
            });
          }
          }
        this.scrollToBottom();
        this.componentRef.directiveRef.scrollToBottom(0, 500);
        const teste = [];
        teste.push(x);
        this.Messages.push(this.mensagensService.bindarMensagens(teste)[0]);
        setTimeout(() => {
          this.componentRef.directiveRef.scrollToBottom(0, 500);
          this.scrollToBottom();
    }, 2000);
        this.scrollToBottom();
        this.componentRef.directiveRef.scrollToBottom(0, 500);
        EventEmitterService.get('LerChat').emit();
      });
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }

  setFocus(): any {
    this.focusEvent.emit(true);
}

limpaTexto(): any{
  this.textoatual2 = '';
}

marcarComoNaoLida(event): any{
  this.mensagensService.marcaNaoLida(event.cd_codigo).subscribe(result => {
    EventEmitterService.get('LerChat').emit();
  });
}

   LerMensagensPorChat = async (chatId: string) => {
      this.primeiraVezCarregando = true;
      const currentUser = this.authfackservice.currentUserValue;
      this.mensagensService.lerMensagensPorChat(chatId, this.vl_Numero_da_Pagina, this.vl_Tamanho_da_Pagina).then(res => {
        this.Messages = res;
        res.forEach(element => {
          element.vl_status = 3;
          this.mensagensService.putMessage(element).subscribe(result => {
          });
        });
        this.loadingVisible = false;
        if (this.chat.st_interno){
            console.log('passou aqui');
            this.statusMensagemService.postCM_AtualizarMensagensLidas(this.chat.cd_codigo, currentUser.cd_codigo).subscribe(x => {
              console.log(x);
            });
        }
        document.getElementById('chat-room').classList.add('user-chat-show');
        setTimeout(() => {
          EventEmitterService.get('LerChat').emit();
          this.componentRef.directiveRef.scrollToBottom(0, 500);
    }, 1000);
      });
    }

  LerMensagensPorScroll = (chatId: string) => {
    if (!this.primeiraVezCarregando){
        this.mensagensService.lerMensagensPorChatOrdenada(chatId, this.vl_Numero_da_Pagina, this.vl_Tamanho_da_Pagina).then(res => {
          res.forEach(element => {
            this.Messages.unshift(element);
        });
      });
    }
    this.primeiraVezCarregando = false;
}

  // tslint:disable-next-line: variable-name
  setarContato(chat: Chat): any{
    if (chat.st_interno){
      const currentUser = this.authfackservice.currentUserValue;
      if (currentUser.cd_codigo === chat.cd_remetente){
          this.usuarioService.getUsuarioID(chat.cd_destinatario).subscribe(res => {
            this.contato = res;
          });
      }else{
        this.usuarioService.getUsuarioID(chat.cd_remetente).subscribe(res => {
          this.contato = res;
        });
      }
    }
    else if (chat.st_grupo){
      this.contato.ds_nome = chat.ds_nome;
    }
    else{
      this.contatoService.getContatoID(chat.cd_contato).subscribe(res => {
      this.contato = res;
    });
      this.linhaService.getLinhaPeloDono(chat.cd_contato).subscribe(res => {
      this.linhaContato = res;
    });
    }
  }



  // tslint:disable-next-line: variable-name
  getClass = (vl_status) => {
    return {'': vl_status === -1,
            'ri-time-line': vl_status === 0,
           'ri-checkbox-circle-line': vl_status === 1,
           'ri-check-double-fill': vl_status === 2,
           'ri-check-double-line text-primary': vl_status === 3,
           ' ': vl_status === 100,
          };
 }

 handleScroll(event): any{
    this.vl_Numero_da_Pagina = this.vl_Numero_da_Pagina + 1;
    this.LerMensagensPorScroll(this.chatativoService.activeChatId);
 }

  onEnviar = () => {
        const currentUser = this.authfackservice.currentUserValue;
        if (this.chat.st_interno){
        if (this.respostaIN){
          this.respostaIN = false;
          this.MensagemInternaEnviar = {
            ds_corpo : this.textoatual,
            ds_remetente: currentUser.cd_codigo,
            ds_destinatario: this.chat.cd_remetente === currentUser.cd_codigo ? this.chat.cd_destinatario : this.chat.cd_remetente,
            ds_tipo:  'interno',
            st_citacao: true,
            ds_corpo_citado: this.contato.ds_nome + ': ' + this.copiaMensagemResponder.ds_corpo,
          };
          this.textoatual = '';
          this.textoatual2 = '';
          this.mensagensService.postMensagemInterna(this.MensagemInternaEnviar).subscribe(res => {
            this.componentRef.directiveRef.scrollToBottom(0, 500);
          });
        }else{
          this.MensagemInternaEnviar = {
          ds_corpo : this.textoatual,
          ds_remetente: currentUser.cd_codigo,
          ds_destinatario: this.chat.cd_remetente === currentUser.cd_codigo ? this.chat.cd_destinatario : this.chat.cd_remetente,
          ds_tipo:  'interno'
        };
          this.textoatual = '';
          this.textoatual2 = '';
          this.mensagensService.postMensagemInterna(this.MensagemInternaEnviar).subscribe(res => {
          this.componentRef.directiveRef.scrollToBottom(0, 500);
        });
        }
      }
      else if (this.chat.st_grupo){
        if (this.respostaWP){
          this.respostaWP = false;
          const numeroFinal = this.chat.cd_grupo_wp;
          const texto = this.textoatual2;
          this.textoatual2 = '';
          this.MensagemEnviar = {
            ds_corpo : 'Enviado por: ' + '*' + currentUser.ds_nome + '*' + '\n' + texto,
            ds_destinatario : numeroFinal,
            st_citacao: true,
            ds_corpo_citado: this.contato.ds_nome + ': ' + this.copiaMensagemResponder.ds_corpo,
            ds_id_mensagem_whatsapp_serializado: this.copiaMensagemResponder.ds_id_mensagem_whatsapp_serializado
          };
          // tslint:disable-next-line: deprecation
          this.mensagensService.postMensagem(this.MensagemEnviar).subscribe((Res: Mensagem) => {
          setTimeout(() => {
            this.componentRef.directiveRef.scrollToBottom(0, 500);
       }, 1000);
        });
        }else{
        const numeroFinal = this.chat.cd_grupo_wp;
        const texto = this.textoatual;
        this.MensagemEnviar = {
          ds_corpo : 'Enviado por' + '*' + currentUser.ds_nome + '*' + ': ' + '\n' + texto,
          ds_destinatario : numeroFinal

        };
        this.textoatual = null;
        this.textoatual2 = '';
        // tslint:disable-next-line: deprecation
        this.mensagensService.postMensagem(this.MensagemEnviar).subscribe((Res: Mensagem) => {
        setTimeout(() => {
          this.componentRef.directiveRef.scrollToBottom(0, 500);
    }, 1000);
        this.componentRef.directiveRef.scrollToBottom(0, 500);
      });
      }
          }
      else if (this.respostaWP){
      this.respostaWP = false;
      let numeroFinal = this.linhaContato.ds_numero_wp;
      const texto = this.textoatual2;
      this.textoatual2 = '';
      numeroFinal = numeroFinal.replace('@c.us', '');
      this.MensagemEnviar = {
        ds_corpo : 'Enviado por ' + '*' + currentUser.ds_nome + '*' + ': ' + '\n' + texto,
        ds_destinatario : numeroFinal,
        st_citacao: true,
        ds_corpo_citado: this.contato.ds_nome + ': ' + this.copiaMensagemResponder.ds_corpo,
        ds_id_mensagem_whatsapp_serializado: this.copiaMensagemResponder.ds_id_mensagem_whatsapp_serializado
      };
      // tslint:disable-next-line: deprecation
      this.mensagensService.postMensagem(this.MensagemEnviar).subscribe((Res: Mensagem) => {
      setTimeout(() => {
        this.componentRef.directiveRef.scrollToBottom(0, 500);
   }, 1000);
    });
      }
      else{
      let numeroFinal = this.linhaContato.ds_numero_wp;
      const texto = this.textoatual;
      this.textoatual = null;
      this.textoatual2 = '';
      numeroFinal = numeroFinal.replace('@c.us', '');
      this.MensagemEnviar = {
        ds_corpo : 'Enviado por ' + '*' + currentUser.ds_nome + '*' + ': ' + '\n' + texto,
        ds_destinatario : numeroFinal

      };
      // tslint:disable-next-line: deprecation
      this.mensagensService.postMensagem(this.MensagemEnviar).subscribe((Res: Mensagem) => {
      this.MensagemRecebida = {
        message : texto,
        align : 'right',
        time : format(new Date(), 'dd:MM HH:mm'),
      };
      // this.Messages.push(this.MensagemRecebida);
      setTimeout(() => {
        this.componentRef.directiveRef.scrollToBottom(0, 500);
   }, 1000);
      this.componentRef.directiveRef.scrollToBottom(0, 500);
    });
      }
        this.setFocus();
  }

  keyPress(event): any {
    if (event.keyCode === 13 && !event.shiftKey) {
      // Stops enter from creating a new line
      event.preventDefault();
      this.onEnviar();
      return true;
  }
}

  deleteChat(): any{
    this.chatService.deleteChat(this.chatativoService.activeChatId).subscribe(res => {
      this.chatativo = false;
      EventEmitterService.get('LerChat').emit();
    });
  }


  /**
   * Show user profile
   */
  showUserProfile(contato): any {
    EventEmitterService.get('AbreContato').emit(contato);
    document.getElementById('profile-detail').style.display = 'block';
  }

  /**
   * Close user chat
   */
  closeUserChat(): any {
    document.getElementById('chat-room').classList.remove('user-chat-show');
  }

  /**
   * Logout the user
   */
  logout(): any {
    if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else if (environment.defaultauth === 'fackbackend') {
      this.authFackservice.logout();
      Sentry.configureScope(scope => scope.setUser(null));
    }
    this.router.navigate(['/account/login']);
  }

  /**
   * Set language
   * @param lang language
   */
  setLanguage(lang): any {
    this.translate.use(lang);
    this.lang = lang;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): any {
    this.sub.unsubscribe();
}

// download and upload start

  handleUpload(event: any): any {
  const currentUser = this.authfackservice.currentUserValue;
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      this.showLoadPanel();
      let arquivoBi: any;
      arquivoBi = reader.result;
      this.binario = arquivoBi;
      if (this.chat.st_interno){
        this.MensagemInternaEnviar = {
          ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
          ds_mimetype : this.binario.match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0],
          st_midia : true,
          ds_remetente: currentUser.cd_codigo,
          ds_destinatario: this.chat.cd_remetente === currentUser.cd_codigo ? this.chat.cd_destinatario : this.chat.cd_remetente,
          ds_tipo:  'interno',
          ds_corpo: file.name
        };
        this.mensagensService.postMensagemInterna(this.MensagemInternaEnviar).subscribe(res => {
          this.textoatual = '';
          setTimeout(() => {
            this.hideInfo();
            this.componentRef.directiveRef.scrollToBottom(0, 500);
            this.hideLoadPanel();
       }, 1000);
        });
      }
      else if (this.chat.st_grupo){
        const mensagem = {
          ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
          ds_mimetype : this.binario.match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0],
          st_midia : true,
          ds_remetente: currentUser.cd_codigo,
          ds_destinatario: this.chat.cd_grupo_wp
        };
        this.mensagensService.postMensagem(mensagem).subscribe(res => {
          this.textoatual = '';
          setTimeout(() => {
            this.hideInfo();
            this.componentRef.directiveRef.scrollToBottom(0, 500);
            this.hideLoadPanel();
       }, 1000);
      });
      }
      else{
      let numeroFinal = this.linhaContato.ds_numero_wp;
      numeroFinal = numeroFinal.replace('@c.us', '');
      const mensagem = {
        ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
        ds_destinatario : numeroFinal,
        ds_mimetype : this.binario.match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0],
        st_midia : true,
        ds_corpo: currentUser.ds_nome
      };
      // tslint:disable-next-line: deprecation
      this.mensagensService.postMensagem(mensagem).subscribe((Res: Mensagem) => {
        this.textoatual = null;
        setTimeout(() => {
          this.hideInfo();
          this.componentRef.directiveRef.scrollToBottom(0, 500);
          this.hideLoadPanel();
     }, 1000);
        this.componentRef.directiveRef.scrollToBottom(0, 500);
      }, error => {
        this.hideInfo();
        this.hideLoadPanel();
        console.log(error);
      });
      }

  };
}

downloadFile(event: any): any{
  this.mensagensService.getMessage(event.cd_codigo).subscribe(res => {
  const FileSaver = require('file-saver');
  const byteCharacters = atob(res.ds_data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: res.ds_mimetype});
  if (res.ds_corpo !== null){
    FileSaver.saveAs(blob, res.ds_corpo);
  }else{
    FileSaver.saveAs(blob, 'arquivo');
  }
  });

}

// download and upload start end

// popup start
showInfo(): any {
  this.popupVisible = true;
}

hideInfo(): any {
  this.popupVisible = false;
}
showInfo2(): any {
  this.popupVisible2 = true;
}

hideInfo2(): any {
  this.popupVisible2 = false;
}
showLoadPanel(): any {
  this.loadingVisible = true;
}

hideLoadPanel(): any {
  this.loadingVisible = false;
}
// popup end

handleSelection(event: any): any {
  this.textoatual = this.textoatual == null ? event.char : this.textoatual + event.char;
}



// audio record start
onHold(time): any {
  this.state = RecordingState.RECORDING;
  this.seconds = Math.round(time / 1000);
}

startRecording2(): any {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .catch(error => {
    console.log('CANNOT RECORD: ', error);
    this.state = RecordingState.FORBIDDEN;
  });
  this.recorder.start().then(() => {
  // something else
  this.startTimer();
}).catch((e) => {
  console.error(e);
});
}

clearAudio(): any{
  this.desativaEnviar = true;
  this.file = undefined;
  this.display = 0;
  this.time = 0;
}

sendAudio(): any{
  this.popupVisible2 = false;
  const currentUser = this.authfackservice.currentUserValue;
  const reader = new FileReader();
  reader.readAsDataURL(this.file);
  reader.onload = () => {
      this.showLoadPanel();
      let arquivoBi: any;
      arquivoBi = reader.result;
      this.binario = arquivoBi;
      if (this.chat.st_interno){
        this.MensagemInternaEnviar = {
          ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
          ds_mimetype : this.binario.match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0],
          st_midia : true,
          ds_remetente: currentUser.cd_codigo,
          ds_destinatario: this.chat.cd_remetente === currentUser.cd_codigo ? this.chat.cd_destinatario : this.chat.cd_remetente,
          ds_tipo:  'interno'
        };
        this.mensagensService.postMensagemInterna(this.MensagemInternaEnviar).subscribe(res => {
          this.textoatual = '';
          setTimeout(() => {
            this.hideInfo();
            this.componentRef.directiveRef.scrollToBottom(0, 500);
            this.hideLoadPanel();
       }, 1000);
        });
      } else if (this.chat.st_grupo){
        const mensagem = {
          ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
          ds_mimetype : this.binario.match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0],
          st_midia : true,
          ds_remetente: currentUser.cd_codigo,
          ds_destinatario: this.chat.cd_grupo_wp,
        };
        this.mensagensService.postMensagem(mensagem).subscribe(res => {
          this.textoatual = '';
          setTimeout(() => {
            this.hideInfo();
            this.componentRef.directiveRef.scrollToBottom(0, 500);
            this.hideLoadPanel();
       }, 1000);
      });
      }
      else{
      let numeroFinal = this.linhaContato.ds_numero_wp;
      numeroFinal = numeroFinal.replace('@c.us', '');
      const mensagem = {
        ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
        ds_destinatario : numeroFinal,
        ds_mimetype : this.binario.match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0],
        st_midia : true
      };
      // tslint:disable-next-line: deprecation
      this.mensagensService.postMensagem(mensagem).subscribe((Res: Mensagem) => {
        this.textoatual = null;
        setTimeout(() => {
          this.hideInfo();
          this.componentRef.directiveRef.scrollToBottom(0, 500);
          this.hideLoadPanel();
     }, 1000);
        this.componentRef.directiveRef.scrollToBottom(0, 500);
      }, error => {
        this.hideInfo();
        this.hideLoadPanel();
        console.log(error);
      });
    }
  };
}

stopRecording2(): any {
  this.desativaEnviar = false;
  this.pauseTimer();
  this.state = RecordingState.STOPPED;
  this.recorder
.stop()
.getMp3().then(([buffer, blob]) => {
  this.file = new File(buffer, 'me-at-thevoice.mp3', {
    type: blob.type,
    lastModified: Date.now()
  });
}).catch((e) => {
  alert('We could not retrieve your message');
});
}


onPaste(event: any): any {
  const items = event.clipboardData.items;
  let blob = null;

  for (const item of items) {
    if (item.type.indexOf('image') === 0) {
      blob = item.getAsFile();
    }
  }

  if (blob !== null) {
  const currentUser = this.authfackservice.currentUserValue;
  const fileFromBlob: File = new File([blob], 'your-filename.jpg');
  const reader = new FileReader();
  reader.readAsDataURL(fileFromBlob);
  reader.onload = () => {
    let arquivoBi: any;
    arquivoBi = reader.result;
    this.binario = arquivoBi;
    this.imgURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.binario);
    this.modalService.open(this.content);
    };
}
}

EnviarColado(): any{
      this.modalService.dismissAll();
      const currentUser = this.authfackservice.currentUserValue;
      if (this.chat.st_interno){
        this.MensagemInternaEnviar = {
          ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
          ds_mimetype : 'image/png',
          st_midia : true,
          ds_remetente: currentUser.cd_codigo,
          ds_destinatario: this.chat.cd_remetente === currentUser.cd_codigo ? this.chat.cd_destinatario : this.chat.cd_remetente,
          ds_tipo:  'interno'
        };
        this.mensagensService.postMensagemInterna(this.MensagemInternaEnviar).subscribe(res => {
          this.textoatual = '';
          setTimeout(() => {
            this.hideInfo();
            this.componentRef.directiveRef.scrollToBottom(0, 500);
            this.hideLoadPanel();
       }, 1000);
        });
      }
      else if (this.chat.st_grupo){
        const mensagem = {
          ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
          ds_mimetype : 'image/png',
          st_midia : true,
          ds_remetente: currentUser.cd_codigo,
          ds_destinatario: this.chat.cd_grupo_wp
        };
        this.mensagensService.postMensagem(mensagem).subscribe(res => {
          this.textoatual = '';
          setTimeout(() => {
            this.hideInfo();
            this.componentRef.directiveRef.scrollToBottom(0, 500);
            this.hideLoadPanel();
       }, 1000);
      });
      }
      else{
      let numeroFinal = this.linhaContato.ds_numero_wp;
      numeroFinal = numeroFinal.replace('@c.us', '');
      const mensagem = {
        ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
        ds_destinatario : numeroFinal,
        ds_mimetype : 'image/png',
        st_midia : true
      };
      // tslint:disable-next-line: deprecation
      this.mensagensService.postMensagem(mensagem).subscribe((Res: Mensagem) => {
        this.textoatual = null;
        setTimeout(() => {
          this.hideInfo();
          this.componentRef.directiveRef.scrollToBottom(0, 500);
          this.hideLoadPanel();
     }, 1000);
        this.componentRef.directiveRef.scrollToBottom(0, 500);
      }, error => {
        this.hideInfo();
        this.hideLoadPanel();
        console.log(error);
      });
    }
  }


lerUsuarios(): any{
  const currentUser = this.authfackservice.currentUserValue;
  this.usuarioService.getContatosEmpresaID(currentUser.cd_empresa).subscribe(res => {
    res.forEach(x => {
      x.name = x.ds_nome;
    });
    this.usuarios = res;
    const sorted = this.usuarios.sort((a, b) => a.name > b.name ? 1 : -1);

    // tslint:disable-next-line: no-shadowed-variable
    const grouped = sorted.reduce((groups, contact) => {
    const letter = this.translate.instant(contact.name).charAt(0);
    groups[letter] = groups[letter] || [];
    groups[letter].push(contact);

    return groups;
  }, {});

    this.contactsList = Object.keys(grouped).map(key => ({ key, usuarios: grouped[key] }));
    this.contatoServico.getContatoEmpresaID(currentUser.cd_empresa).subscribe(res2 => {
      res2.forEach(x => {
        x.name = x.ds_nome;
        x.contato = true;
      });
      this.contacts = res2;

      this.usuarios =  this.usuarios.concat(this.contacts);

      this.contactsList = Object.keys(grouped).map(key => ({ key, contacts: grouped[key] }));
    });
  });
}

encaminharMensagem(event: any): any{
  const currentUser = this.authfackservice.currentUserValue;
  if (event.contato !== undefined){
    if (event.contato){
      this.linhaService.getLinhaPeloDono(event.cd_codigo).subscribe(linha => {
      let numeroFinal = linha.ds_numero_wp;
      numeroFinal = numeroFinal.replace('@c.us', '');
      if (this.conversaParaEncaminhar.st_midia){
          const mensagem = {
            ds_data : this.conversaParaEncaminhar.ds_data,
            ds_mimetype : this.conversaParaEncaminhar.ds_mimetype,
            st_midia : this.conversaParaEncaminhar.st_midia,
            ds_destinatario : numeroFinal,
          };
          this.mensagensService.postMensagem(mensagem).subscribe((Res: Mensagem) => {
          this.popupListaUsuarios = false;
          });
      }
      else{
        this.MensagemEnviar = {
        ds_corpo: 'Enviado por ' + currentUser.ds_nome + ': ' + this.conversaParaEncaminhar.ds_corpo,
        ds_destinatario : numeroFinal
      };
      // tslint:disable-next-line: deprecation
        this.mensagensService.postMensagem(this.MensagemEnviar).subscribe((Res: Mensagem) => {
        this.popupListaUsuarios = false;
      });
      }
      });
    }
  }else{
  this.MensagemInternaEnviar = {
    ds_data : this.conversaParaEncaminhar.ds_data,
    ds_mimetype : this.conversaParaEncaminhar.ds_mimetype,
    st_midia : this.conversaParaEncaminhar.st_midia,
    ds_remetente: currentUser.cd_codigo,
    ds_destinatario: event.cd_codigo,
    ds_tipo:  'interno',
    ds_corpo: this.conversaParaEncaminhar.ds_corpo
  };
  this.mensagensService.postMensagemInterna(this.MensagemInternaEnviar).subscribe(res => {
    this.popupListaUsuarios = false;
  });
  }
}

mostraEncaminhar(event: any): any{
  this.conversaParaEncaminhar = event;
  this.lerUsuarios();
  this.popupListaUsuarios = true;
}

responderMensagem(event: any): any{
  this.copiaMensagemResponder = event;
  if (event.ds_tipo === 'wp'){
    this.respostaWP = true;
  }else{
    this.respostaIN = true;
  }
  this.responderTexto = this.contato.ds_nome + ':  ' + event.ds_corpo;
  this.desativaResponder = false;
  this.popupResponder = true;
}

onEnviar2(): any{
if (!this.respostaWP){
this.textoatual = this.textoatual2;
}
this.onEnviar();
this.popupResponder = false;
this.desativaResponder = true;
}

startTimer(): any {
  this.interval = setInterval(() => {
    if (this.time === 0) {
      this.time++;
    } else {
      this.time++;
    }
    this.display = this.transform( this.time);
  }, 1000);
}
transform(value: number): string {
     const minutes: number = Math.floor(value / 60);
     return minutes + ':' + (value - minutes * 60);
}
pauseTimer(): any {
  this.display = 0;
  this.time = 0;
  clearInterval(this.interval);
}

mostrarImagem(event: any): any{
  this.imagemGrande = event.imageContent;
  console.log(event);
 // this.photoVisible = true;
}

openModal(content): any {
  this.modalService.open(content, { centered: true });
}

deletaMensagem(event): any{
  this.mensagensService.deleteMessage(event.cd_codigo).subscribe(res => {
    const index = this.Messages.indexOf(event);
    if (index > -1) {
      this.Messages.splice(index, 1);
      this.toastr.success('Sucesso', 'Mensagem deletada!', {
        closeButton : true,
        progressBar	: true
      });
    }
  });
}

}

