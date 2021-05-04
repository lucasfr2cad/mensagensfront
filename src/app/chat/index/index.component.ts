import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from './chat.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import {EventEmitterService} from '../../core/services/eventemitter.service';
import { MensagensService } from '../../core/services/mensagens.service';
import { UsuarioService } from '../../core/services/usuarios.service';
import { format } from 'date-fns';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Contatos } from 'src/app/core/models/contato.models';
import {Mensagem} from '../../core/models/mensagem.models';
import { Chat } from 'src/app/core/models/chat.models';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { MensagemParametroModelo } from '../../core/models/mensagemParametro.Models';
import { ChatativoService } from 'src/app/core/services/chatativo.service';
import { Usuario } from 'src/app/core/models/usuario.models';



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
  contato: Contatos;
  numeroEnviar: string;
  sub: Subscription;
  popupVisible = false;
  binario: string;
  loadingVisible = false;
  toggled = false;
  chatativo = false;
  // tslint:disable-next-line: variable-name
  vl_Numero_da_Pagina = 1;
  // tslint:disable-next-line: variable-name
  vl_Tamanho_da_Pagina = 50;
  mensagemParametroModelo: MensagemParametroModelo;


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
              private authfackservice: AuthfakeauthenticationService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.contato = {
   ds_nome: 'Selecione um contato'
  };
    const currentUser = this.authfackservice.currentUserValue;
    this.sub = EventEmitterService.get('NovaMensagem').subscribe(
      (x) => {
        this.MensagemRecebida = {
          message : x.ds_corpo,
          align : x.ds_remetente === currentUser.ds_numero_wp ? 'right' : 'left',
          time : format(new Date(x.dt_criacao), 'HH:mm'),
          vl_status : x.vl_status,
          name : x.ds_nome_contato_curto,
          isimage : x.st_midia && x.ds_mimetype === 'image/jpeg' ? true : false,
          imageContent : this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${x.ds_data}`)
        };
        this.Messages.push(this.MensagemRecebida);
        setTimeout(() => {
      this.perfectScroll.directiveRef.scrollToBottom(0, 1);
   }, 1000);
      }, error => {
        console.log('Errrou');
      });
  }

  LerMensagensPorChat = (chatId: string) => {
    // tslint:disable-next-line: deprecation
    this.mensagemParametroModelo = {
      vl_Numero_da_Pagina : this.vl_Numero_da_Pagina,
      vl_Tamanho_da_Pagina : this.vl_Tamanho_da_Pagina
    };
    const currentUser = this.authfackservice.currentUserValue;
    // tslint:disable-next-line: deprecation
    this.mensagensService.postMensagemPorId(chatId, this.mensagemParametroModelo).subscribe(
      (res) => {
      res.forEach(x => {
        x.message = x.ds_corpo;
        x.align = x.ds_remetente === currentUser.ds_numero_wp ? 'right' : 'left';
        x.time = format(new Date(x.dt_criacao), 'HH:mm');
        // x.profile = 'assets/images/users/avatar-4.jpg';
        x.vl_status = x.vl_status;
        x.name = x.ds_nome_contato_curto;
        if (x.ds_mimetype !== null)
        {
          if (x.ds_mimetype.startsWith('image')){
          x.isimage = true;
          x. imageContent = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${x.ds_mimetype};base64, ${x.ds_data}`);
        }
          else{
            x.isfile = true;
            x.fileContent = 'arquivo';
          }
        }
      });
      this.Messages = res;
      this.perfectScroll.directiveRef.scrollToBottom(0, 1);
    }, error => {
      console.log('Errrou');
    });
  }

  LerMensagensPorScroll = (chatId: string) => {
    // tslint:disable-next-line: deprecation
    this.mensagemParametroModelo = {
      vl_Numero_da_Pagina : this.vl_Numero_da_Pagina,
      vl_Tamanho_da_Pagina : this.vl_Tamanho_da_Pagina
    };
    // tslint:disable-next-line: deprecation
    this.mensagensService.postMensagemPorId(chatId, this.mensagemParametroModelo).subscribe(
      (res) => {
      res.forEach(x => {
        x.message = x.ds_corpo;
        x.align = x.st_de_mim ? 'right' : 'left';
        x.time = format(new Date(x.dt_criacao), 'HH:mm');
        // x.profile = 'assets/images/users/avatar-4.jpg';
        x.vl_status = x.vl_status;
        x.name = x.ds_nome_contato_curto;
        if (x.ds_mimetype !== null)
        {
          if (x.ds_mimetype.startsWith('image')){
          x.isimage = true;
          x. imageContent = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${x.ds_mimetype};base64, ${x.ds_data}`);
        }
          else{
            x.isfile = true;
            x.fileContent = 'arquivo';
          }
        }
      });
      res.forEach(element => {
        this.Messages.unshift(element);
      });
    }, error => {
      console.log('Errrou');
    });
  }

  // tslint:disable-next-line: variable-name
  setarContato(chat: Chat): any{
    let destinatario: Usuario;
    let remetente: Usuario;
    this.usuarioService.getContatoPorId(chat.cd_remetente)
    // tslint:disable-next-line: deprecation
    .subscribe((res) => {
      remetente = res;
      this.usuarioService.getContatoPorId(chat.cd_destinatario)
    // tslint:disable-next-line: deprecation
    .subscribe((res2) => {
      destinatario = res2;
      const currentUser = this.authfackservice.currentUserValue;
      if (currentUser.cd_codigo === destinatario.cd_codigo){
        this.contato = remetente;
      }else{
        this.contato = destinatario;
      }
    },
    error => {
      console.log(error);
    });
    },
    error => {
      console.log(error);
    });
  }

  onCallParent = (chat: Chat) => {
    this.vl_Numero_da_Pagina = 1;
    this.chatativo = true;
    this.setarContato(chat);
    this.LerMensagensPorChat(chat.id);
    setTimeout(() => {
      this.componentRef.directiveRef.scrollToBottom();
 }, 3000);
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
    console.log('chegou ao inicio do scroll');
    this.vl_Numero_da_Pagina = this.vl_Numero_da_Pagina + 1;
    console.log(this.vl_Numero_da_Pagina);
    this.LerMensagensPorScroll(this.chatativoService.activeChatId);
 }

  onEnviar = () => {
      let numeroFinal = this.contato.ds_numero_wp;
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
        time : format(new Date(), 'HH:mm'),
      };
      this.Messages.push(this.MensagemRecebida);
      setTimeout(() => {
        this.componentRef.directiveRef.scrollToBottom();
   }, 500);
      this.componentRef.directiveRef.scrollToBottom();
    });

  }


  /**
   * Show user profile
   */
  showUserProfile(): any {
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

  handleUpload(event: any): any {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      this.showLoadPanel();
      let arquivoBi: any;
      arquivoBi = reader.result;
      this.binario = arquivoBi;
      let numeroFinal = this.contato.ds_numero_wp;
      numeroFinal = numeroFinal.replace('@c.us', '');
      const mensagem = {
        ds_data : this.binario.substr(this.binario.indexOf(',') + 1),
        ds_destinatario : numeroFinal,
        ds_mimetype : this.binario.match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0],
        st_midia : true
      };
      // tslint:disable-next-line: deprecation
      this.mensagensService.postMensagem(mensagem).subscribe((Res: Mensagem) => {
        this.MensagemRecebida = {
          align : 'right',
          time : format(new Date(), 'HH:mm'),
          isimage: mensagem.ds_mimetype.startsWith('image') ? true : false,
          isfile: mensagem.ds_mimetype.startsWith('image') ? false : true,
          imageContent : mensagem.ds_mimetype.startsWith('image') ? this.sanitizer.bypassSecurityTrustResourceUrl(`data:${mensagem.ds_mimetype};base64, ${mensagem.ds_data}`) : null,
          fileContent : mensagem.ds_mimetype.startsWith('image') ? null : 'arquivo',
          ds_data: mensagem.ds_data,
          ds_mimetype: mensagem.ds_mimetype,
          st_midia: true
        };
        this.Messages.push(this.MensagemRecebida);
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

handleSelection(event: any): any {
  this.textoatual = this.textoatual == null ? event.char : this.textoatual + event.char;
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


}

