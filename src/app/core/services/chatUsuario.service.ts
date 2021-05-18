import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chats } from '../../chat/tabs/chats/chats.model';
import { Observable} from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ChatUsuariosService {
  private chatUrl = environment.baseUrl + 'ChatsUsuarios/';
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
  getCM_BuscarChatPorIdContato(cd_contato: string, cd_empresa: string): Observable<Chats>{
    return this.http.get<Chats>(this.chatUrl + `contatoid/` + cd_contato +
      `/empresaid/` + cd_empresa);
  }

}
