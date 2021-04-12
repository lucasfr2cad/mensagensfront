import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Message } from './chat.model';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { MensagensService } from '../../core/services/mensagens.service';

import { format } from 'date-fns';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';





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

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  lang: string;

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;


  constructor(private authFackservice: AuthfakeauthenticationService, private authService: AuthenticationService,
              private router: Router, public translate: TranslateService, private mensagensService: MensagensService) { }

  ngOnInit(): void {
    this.LerMensagens();
    this.lang = this.translate.currentLang;
    setTimeout(() => {
      this.componentRef.directiveRef.scrollToBottom();
 }, 1000);
  }

  LerMensagens = () => {
    this.mensagensService.getAll().subscribe((res) => {
      res.forEach(x => {
        x.message = x.ds_corpo;
        x.align = x.st_de_mim ? 'right' : 'left'
        x.time = format(new Date(x.dt_criacao), 'HH:mm');
        x.profile = 'assets/images/users/avatar-4.jpg';
        x.vl_status = x.vl_status;
        x.name = x.ds_nome_contato_curto;
      });
      this.Messages = res;
      setTimeout(() => {
        this.LerMensagens();
        this.componentRef.directiveRef.scrollToBottom();
   }, 3000);
    }, error => {
      console.log('Errrou');
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

  onEnviar = () => {
    console.log(this.textoatual)

    this.MensagemEnviar = {
      ds_corpo : this.textoatual,
      ds_destinatario : '555198961483'
    }
    this.mensagensService.postMensagem(this.MensagemEnviar).subscribe((res) => {
      console.log(res);
      this.textoatual = null;
    }, error => {
      console.log(error);
    });
  }


  /**
   * Show user profile
   */
  // tslint:disable-next-line: typedef
  showUserProfile() {
    document.getElementById('profile-detail').style.display = 'block';
  }

  /**
   * Close user chat
   */
  // tslint:disable-next-line: typedef
  closeUserChat() {
    document.getElementById('chat-room').classList.remove('user-chat-show');
  }

  /**
   * Logout the user
   */
  logout() {
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
  setLanguage(lang) {
    this.translate.use(lang);
    this.lang = lang;
  }
}
