import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from './chat.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import {EventEmitterService} from '../../core/services/eventemitter.service';
import { MensagensService } from '../../core/services/mensagens.service';
import { format } from 'date-fns';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
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

  activetab = 2;
  Messages: Message[];
  textoatual = '';
  MensagemEnviar: Message;
  MensagemRecebida: Message;
  nomeContatoBar = '';
  contato: Contato;
  numeroEnviar: string;
  sub: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  popupVisible = false;
  binario: string;
  loadingVisible = false;
  toggled = false;
  chatativo = false;
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
  private recorder = new MicRecorder({
    bitRate: 128
  });


  listLang = [
    { text: 'Português', flag: 'assets/images/flags/brasil.png', lang: 'ptbr' },
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  lang: string;

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;



  constructor(private authFackservice: AuthfakeauthenticationService, private authService: AuthenticationService,
              private router: Router, public translate: TranslateService, private mensagensService: MensagensService,
              private sanitizer: DomSanitizer, private chatativoService: ChatativoService,
              private authfackservice: AuthfakeauthenticationService, private contatoService: ContatoService,
              private linhaService: LinhaService, private chatService: ChatsService,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.recordings$ = fromEvent(this.mediaRecorder, 'dataavailable');
    })
    .catch(error => {
      console.log('CANNOT RECORD: ', error);
      this.state = RecordingState.FORBIDDEN;
    });
    this.lang = this.translate.currentLang;
    this.contato = {
   ds_nome: 'Selecione um contato'
  };
    const currentUser = this.authfackservice.currentUserValue;
    this.usuario = this.authfackservice.currentUserValue;
    this.adm = currentUser.ds_perfil_acesso === 'atendente' ? false : true;
    this.sub4 = EventEmitterService.get('AtualizarMensagem').subscribe((mensagem) => {
      if (this.Messages.length > 0){
        this.Messages.forEach(x => {
          if (x.cd_codigo === mensagem.cd_codigo){
            x.vl_status = mensagem.vl_status;
          }
        });
      }
    });
    this.sub3 = EventEmitterService.get('DesativaTela').subscribe(() => {
      this.chatativo = false;
    });
    this.sub2 = EventEmitterService.get('LerChat').subscribe((event) => {
      this.vl_Numero_da_Pagina = 1;
      this.chatativo = true;
      if (event !== undefined){
        this.setarContato(event);
        this.LerMensagensPorChat(event.cd_codigo);
        setTimeout(() => {
          if (this.componentRef !== undefined){
              this.componentRef.directiveRef.scrollToBottom();
          }
      }, 3000);
      }else{
        this.chatativo = false;
      }
    });
    this.sub = EventEmitterService.get('NovaMensagem').subscribe(
      (x) => {
        const teste = [];
        teste.push(x);
        this.Messages.push(this.mensagensService.bindarMensagens(teste)[0]);
        setTimeout(() => {
      this.perfectScroll.directiveRef.scrollToBottom(0, 1);
   }, 1000);
      });
  }

   LerMensagensPorChat = async (chatId: string) => {
      this.mensagensService.lerMensagensPorChat(chatId, this.vl_Numero_da_Pagina, this.vl_Tamanho_da_Pagina).then(res => {
        this.Messages = res;
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
    this.contatoService.getContatoID(chat.cd_contato).subscribe(res => {
      this.contato = res;
    });
    this.linhaService.getLinhaPeloDono(chat.cd_contato).subscribe(res => {
      this.linhaContato = res;
    });
  }



  // tslint:disable-next-line: variable-name
  getClass = (vl_status) => {
    return {'ri-error-warning-line': vl_status === -1,
            'ri-checkbox-blank-circle-line': vl_status === 0,
           'ri-checkbox-circle-line': vl_status === 1,
           'ri-check-line': vl_status === 2,
           'ri-check-double-line': vl_status === 3,
           '': vl_status === 100,
          };
 }

 handleScroll(event): any{
    this.vl_Numero_da_Pagina = this.vl_Numero_da_Pagina + 1;
    this.LerMensagensPorScroll(this.chatativoService.activeChatId);
 }

  onEnviar = () => {
      let numeroFinal = this.linhaContato.ds_numero_wp;
      const texto = this.textoatual;
      this.textoatual = null;
      numeroFinal = numeroFinal.replace('@c.us', '');
      this.MensagemEnviar = {
        ds_corpo : texto,
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
        this.componentRef.directiveRef.scrollToBottom();
   }, 500);
      this.componentRef.directiveRef.scrollToBottom();
    });

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
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      this.showLoadPanel();
      let arquivoBi: any;
      arquivoBi = reader.result;
      this.binario = arquivoBi;
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
          this.componentRef.directiveRef.scrollToBottom();
          this.hideLoadPanel();
     }, 500);
        this.componentRef.directiveRef.scrollToBottom();
      }, error => {
        this.hideInfo();
        this.hideLoadPanel();
        console.log(error);
      });
  };
}

downloadFile(event: any): any{
  const FileSaver = require('file-saver');
  const byteCharacters = atob(event.ds_data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: event.ds_mimetype});
  FileSaver.saveAs(blob, 'arquivo');
}

// download and upload start end

// popup start
showInfo(): any {
  this.popupVisible = true;
}

hideInfo(): any {
  this.popupVisible = false;
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
  // Start recording. Browser will request permission to use your microphone.
this.recorder.start().then(() => {
  // something else
}).catch((e) => {
  console.error(e);
});
}

stopRecording2(): any {
  this.state = RecordingState.STOPPED;
  this.recorder
.stop()
.getMp3().then(([buffer, blob]) => {
  // do what ever you want with buffer and blob
  // Example: Create a mp3 file and play
  const file = new File(buffer, 'me-at-thevoice.mp3', {
    type: blob.type,
    lastModified: Date.now()
  });

  console.log(file);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      this.showLoadPanel();
      let arquivoBi: any;
      arquivoBi = reader.result;
      this.binario = arquivoBi;
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
          this.componentRef.directiveRef.scrollToBottom();
          this.hideLoadPanel();
     }, 500);
        this.componentRef.directiveRef.scrollToBottom();
      }, error => {
        this.hideInfo();
        this.hideLoadPanel();
        console.log(error);
      });
  };

}).catch((e) => {
  alert('We could not retrieve your message');
  console.log(e);
});
}

}

