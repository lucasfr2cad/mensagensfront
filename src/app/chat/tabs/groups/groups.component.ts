import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/core/models/chat.models';
import { Contato } from 'src/app/core/models/contato.models';
import { Linha } from 'src/app/core/models/linha.models';
import { Usuario } from 'src/app/core/models/usuario.models';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { ChatativoService } from 'src/app/core/services/chatativo.service';
import { ChatsService } from 'src/app/core/services/chats.service';
import { ChatUsuariosService } from 'src/app/core/services/chatUsuario.service';
import { EventEmitterService } from 'src/app/core/services/eventemitter.service';
import { UsuarioService } from 'src/app/core/services/usuarios.service';
import { Contacts } from '../contacts/contacts.model';

import { groups } from './data';
import { Groups } from './groups.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

/**
 * Tabs-group component
 */
export class GroupsComponent implements OnInit {

  public isCollapsed: boolean;
  groups: Groups[];
  busca = '';
  // tslint:disable-next-line: variable-name
  ds_usuario = '';
  // tslint:disable-next-line: variable-name
  ds_senha = '';
  // tslint:disable-next-line: variable-name
  ds_nome = '';
  // tslint:disable-next-line: variable-name
  ds_perfil_acesso = '';
  sub: Subscription;
  contacts: Contacts[];
  usuarios: Usuario[];
  chat: Chat;
  contactsList: any;
  NovoChat: any;
  editarContato: Contato;
  editarLinha: Linha;
  editarUsuario2: Usuario;
  downloads = ['gerente', 'atendente'];
  adm = false;

  constructor(private modalService: NgbModal, private authfackservice: AuthfakeauthenticationService,
              public translate: TranslateService, private usuarioService: UsuarioService,
              private toastr: ToastrService, private chatUsuariosService: ChatUsuariosService,
              private chatsService: ChatsService, private chatativo: ChatativoService) { }

  ngOnInit(): void {
    this.groups = groups;

    // collpsed value
    this.isCollapsed = true;

    this.lerUsuarios();
    const currentUser = this.authfackservice.currentUserValue;
    this.adm = currentUser.ds_perfil_acesso === 'atendente' ? false : true;
  }

  /**
   * Open add group modal
   * @param content content
   */
  // tslint:disable-next-line: typedef
  openGroupModal(content: any) {
    this.modalService.open(content, { centered: true });
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

    // contacts list
      this.contactsList = Object.keys(grouped).map(key => ({ key, usuarios: grouped[key] }));
    });
  }

  salvarUsuario(): any{
    const currentUser = this.authfackservice.currentUserValue;
    const usuario: Usuario = {
      ds_nome: this.ds_nome,
      ds_usuario: this.ds_usuario,
      ds_senha: this.ds_senha,
      cd_empresa: currentUser.cd_empresa,
      ds_perfil_acesso: this.ds_perfil_acesso
    };
    this.usuarioService.postUsuario(usuario).subscribe(res => {
      this.modalService.dismissAll();
      this.toastr.success('Usuario salvo com sucesso');
      this.lerUsuarios();
      this.limpaCampos();
    });
  }

  deleteUsuario(event, item): any{
    event.stopPropagation();
    this.usuarioService.deleteUsuario(item.cd_codigo).subscribe(res => {
      this.lerUsuarios();
      this.limpaCampos();
      this.toastr.success('Usuário deletado com sucesso');
    } );
  }

  editarUsuario(event, item): any{
    event.stopPropagation();
    this.editarUsuario2 = item;
    this.ds_nome = item.ds_nome;
    this.ds_perfil_acesso = item.ds_perfil_acesso;
    this.ds_usuario = item.ds_usuario;
    this.ds_senha = item.ds_senha;
  }

  atualizarUsuario(event, item): any{
    event.stopPropagation();
    this.editarUsuario2.ds_nome = this.ds_nome;
    this.editarUsuario2.ds_perfil_acesso = this.ds_perfil_acesso;
    this.editarUsuario2.ds_usuario = this.ds_usuario;
    this.editarUsuario2.ds_senha = this.ds_senha;
    this.usuarioService.putUsuario(this.editarUsuario2).subscribe(res => {
        this.modalService.dismissAll();
        this.toastr.success('Usuario salvo com sucesso');
        this.lerUsuarios();
        this.limpaCampos();
    });
  }

  limpaCampos(): any{
    this.ds_nome = '';
    this.ds_perfil_acesso = '';
    this.ds_senha = '';
    this.ds_usuario = '';
  }

  onItemClick(event): any{
    this.ds_perfil_acesso = event.itemData;
  }

  showChat = (item) => {
    const currentUser = this.authfackservice.currentUserValue;
    this.chatUsuariosService.getCM_BuscarChatPorIdContato(item.cd_codigo, currentUser.cd_codigo).subscribe(res => {
      this.NovoChat = res;
      if (this.NovoChat === null){
        this.chatsService.CM_CriaNovoChatComChatsUsuariosParaUsuarios(item.cd_codigo, currentUser.cd_codigo).subscribe(x => {
          this.NovoChat = x;
          this.chatsService.getChatID(this.NovoChat.cd_codigo).subscribe(res3 => {
            this.chatativo.nomeia(this.NovoChat.cd_codigo);
            EventEmitterService.get('LerChat').emit(res3);
            setTimeout(() => {
            document.getElementById('chat-room').classList.add('user-chat-show');
        }, 3000);
        });
        });
      }else{
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

  showChat2 = (event, item) => {
    event.stopPropagation();
    const currentUser = this.authfackservice.currentUserValue;
    this.chatUsuariosService.getCM_BuscarChatPorIdContato(item.cd_codigo, currentUser.cd_codigo).subscribe(res => {
      this.NovoChat = res;
      if (this.NovoChat === null){
        this.chatsService.CM_CriaNovoChatComChatsUsuariosParaUsuarios(item.cd_codigo, currentUser.cd_codigo).subscribe(x => {
          this.NovoChat = x;
          this.chatsService.getChatID(this.NovoChat.cd_codigo).subscribe(res3 => {
            this.chatativo.nomeia(this.NovoChat.cd_codigo);
            EventEmitterService.get('LerChat').emit(res3);
            setTimeout(() => {
            document.getElementById('chat-room').classList.add('user-chat-show');
        }, 3000);
        });
        });
      }else{
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

  stop(event): any{
    event.stopPropagation();
  }

}
