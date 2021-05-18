import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chats } from '../../chat/tabs/chats/chats.model';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {Chat} from '../models/chat.models';


@Injectable({ providedIn: 'root' })
export class ChatsService {
  private chatUrl = environment.baseUrl + 'Chats/';
  constructor(private http: HttpClient) { }



  // tslint:disable-next-line: variable-name
  getAllChatId(cd_codigo): Observable<Chats[]>{
    return this.http.get<Chats[]>(this.chatUrl + `BuscaChatid?cd_codigo=` + cd_codigo);
  }

  // tslint:disable-next-line: variable-name
  getCM_BuscarPorEmpresaComESemAtendente(cd_empresa: string, cd_atendente: string): Observable<Chats[]>{
    return this.http.get<Chats[]>(this.chatUrl + `CM_BuscarPorEmpresaComESemAtendenteid?cd_empresa=` + cd_empresa +
      `&cd_atendente=` + cd_atendente);
  }

   // tslint:disable-next-line: variable-name
   CM_CriaNovoChatComChatsUsuarios(cd_empresa: string, cd_contato: string): Observable<Chats[]>{
    const chat = {
      cd_contato,
      cd_empresa
    };
    return this.http.post<Chats[]>(this.chatUrl + `CM_CriaNovoChatComChatsUsuarios`, chat);
  }

  // tslint:disable-next-line: variable-name
  getAllChatPorUsuario(cd_codigo: string): Observable<Chat[]>{
    return this.http.get<Chat[]>(this.chatUrl + `BuscaChatid?cd_codigo=` + cd_codigo);
  }

   // tslint:disable-next-line: variable-name
   getChatID(cd_codigo: any): Observable<Chat>{
    return this.http.get<Chat>(this.chatUrl + `id?cd_codigo=` + cd_codigo);
  }

  // tslint:disable-next-line: variable-name
  getChatsPorEmpresa(cd_codigo: string): Observable<Chats[]>{
    return this.http.get<Chats[]>(this.chatUrl + `BuscaChatPorEmpresa/id?cd_codigo=` + cd_codigo);
  }

    // tslint:disable-next-line: variable-name
  getChatsPorAtendente(cd_codigo: string): Observable<Chat[]>{
      return this.http.get<Chat[]>(this.chatUrl + `BuscaChatPorAtendente/id?cd_codigo=` + cd_codigo);
}

  // tslint:disable-next-line: variable-name
  postAtribuiAtendente(cd_chat: string, cd_atendente: string): Observable<Chat> {
    const atendente = {
      cd_chat,
      cd_atendente
    };
    return this.http.put<Chat>(this.chatUrl + `atribuiratendente`, atendente);
  }

  // tslint:disable-next-line: variable-name
  deleteChat(cd_codigo: string): Observable<boolean>{
    return this.http.delete<boolean>(this.chatUrl + 'cd_codigo?cd_codigo=' + cd_codigo);
  }


}



