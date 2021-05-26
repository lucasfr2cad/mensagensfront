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

  constructor(private modalService: NgbModal, private authfackservice: AuthfakeauthenticationService,
              public translate: TranslateService, private usuarioService: UsuarioService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.groups = groups;

    // collpsed value
    this.isCollapsed = true;

    this.lerUsuarios();
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

  deleteUsuario(event): any{
    this.usuarioService.deleteUsuario(event.cd_codigo).subscribe(res => {
      this.lerUsuarios();
      this.limpaCampos();
      this.toastr.success('Usuário deletado com sucesso');
    } );
  }

  editarUsuario(event): any{
    console.log(event);
    this.editarUsuario2 = event;
    this.ds_nome = event.ds_nome;
    this.ds_perfil_acesso = event.ds_perfil_acesso;
    this.ds_usuario = event.ds_usuario;
    this.ds_senha = event.ds_senha;
  }

  atualizarUsuario(event): any{
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

}
