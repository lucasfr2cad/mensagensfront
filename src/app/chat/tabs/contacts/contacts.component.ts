import { Component, NgModule, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Contacts } from './contacts.model';
import { TranslateService } from '@ngx-translate/core';
import { ContatoService } from 'src/app/core/services/contato.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { ChatUsuariosService } from 'src/app/core/services/chatUsuario.service';
import { ChatsService } from 'src/app/core/services/chats.service';
import { ChatativoService } from 'src/app/core/services/chatativo.service';
import { Chat } from 'src/app/core/models/chat.models';
import { Subscription } from 'rxjs';
import {EventEmitterService} from '../../../core/services/eventemitter.service';
import { ToastrService } from 'ngx-toastr';
import { Contato } from 'src/app/core/models/contato.models';
import { Linha } from 'src/app/core/models/linha.models';
import { LinhaService } from 'src/app/core/services/linha.service';



@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
/**
 * Tab-contacts component
 */
export class ContactsComponent implements OnInit {
  numero = '';
  nome = '';
  sub: Subscription;
  contacts: Contacts[];
  chat: Chat;
  contactsList: any;
  NovoChat: any;
  editarContato: Contato;
  editarLinha: Linha;

  constructor(private modalService: NgbModal, public translate: TranslateService,
              private contatoServico: ContatoService, private authfackservice: AuthfakeauthenticationService,
              private chatUsuariosService: ChatUsuariosService, private chatsService: ChatsService,
              private chatativo: ChatativoService, private toastr: ToastrService,
              private linhaService: LinhaService
    ) { }

  ngOnInit(): void {
    this.lerContatos();
  }

  lerContatos(): any{
    const currentUser = this.authfackservice.currentUserValue;
    this.contatoServico.getContatoEmpresaID(currentUser.cd_empresa).subscribe(res => {
      res.forEach(x => {
        x.name = x.ds_nome;
      });
      this.contacts = res;
      const sorted = this.contacts.sort((a, b) => a.name > b.name ? 1 : -1);

      const grouped = sorted.reduce((groups, contact) => {
      const letter = this.translate.instant(contact.name).charAt(0);
      groups[letter] = groups[letter] || [];
      groups[letter].push(contact);

      return groups;
    }, {});

    // contacts list
      this.contactsList = Object.keys(grouped).map(key => ({ key, contacts: grouped[key] }));
    });
  }


  showChat = (event) => {
    const currentUser = this.authfackservice.currentUserValue;
    this.chatUsuariosService.getCM_BuscarChatPorIdContato(event.cd_codigo, event.cd_empresa).subscribe(res => {
      this.NovoChat = res;
      if (this.NovoChat === null){
        this.chatsService.CM_CriaNovoChatComChatsUsuarios(currentUser.cd_empresa, event.cd_codigo).subscribe(x => {
          this.NovoChat = x;
          if (currentUser.ds_perfil_acesso === 'atendente'){
            this.chatsService.postAtribuiAtendente(currentUser.cd_codigo, this.NovoChat.cd_codigo_chat);
        }
          this.chatsService.getChatID(this.NovoChat.cd_codigo).subscribe(res3 => {
            this.chatativo.nomeia(this.NovoChat.cd_codigo);
            EventEmitterService.get('LerChat').emit(res3);
            setTimeout(() => {
            document.getElementById('chat-room').classList.add('user-chat-show');
        }, 3000);
        });
        });
      }else{
      if (currentUser.ds_perfil_acesso === 'atendente'){
        this.chatsService.postAtribuiAtendente(this.NovoChat.cd_codigo_chat, currentUser.cd_codigo).subscribe(res2 => {
    });
    }
      this.chatsService.getChatID(this.NovoChat.cd_codigo_chat).subscribe(res3 => {
        this.chatativo.nomeia(this.NovoChat.cd_codigo_chat);
        EventEmitterService.get('LerChat').emit(res3);
        setTimeout(() => {
        document.getElementById('chat-room').classList.add('user-chat-show');
    }, 3000);
    });
  }
}
);
  }
  /**
   * Contacts modal open
   * @param content content
   */
  // tslint:disable-next-line: typedef
  openContactsModal(content) {
    this.modalService.open(content, { centered: true });
  }

  deleteContact(event): any{
    this.contatoServico.deleteContatoID(event.cd_codigo).subscribe(res => {
      this.lerContatos();
      this.toastr.success('Contato deletado com sucesso');
      EventEmitterService.get('DesativaTela').emit(event);
    } );
  }

  editar(event): any {
    this.editarContato = event;
    this.linhaService.getLinhaPeloDono(event.cd_codigo).subscribe(res => {
      this.editarLinha = res;
      this.numero = this.editarLinha.ds_numero_wp;
    });
    this.nome = event.ds_nome;
  }

  atualizarContato(): any{
    this.editarContato.ds_nome = this.nome;
    this.editarLinha.ds_numero_wp = this.numero;
    this.contatoServico.putContato(this.editarContato).subscribe(res => {
      this.linhaService.putLinha(this.editarLinha).subscribe(res2 => {
        this.modalService.dismissAll();
        this.toastr.success('Contato salvo com sucesso');
        this.lerContatos();
      });
    });
  }

  salvarContato(): any{
    const currentUser = this.authfackservice.currentUserValue;
    this.contatoServico.postContato(currentUser.cd_empresa, this.nome, this.numero).subscribe(res => {
      this.modalService.dismissAll();
      this.toastr.success('Contato salvo com sucesso');
      this.lerContatos();
    });
  }

}
