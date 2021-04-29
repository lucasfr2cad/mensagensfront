import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chats } from '../../chat/tabs/chats/chats.model';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErroService } from './error.service';
import { environment } from 'src/environments/environment';
import {Chat} from '../models/chat.models';


@Injectable({ providedIn: 'root' })
export class ChatsService {
  private chatUrl = environment.baseUrl + 'Chats/';
  constructor(private http: HttpClient, private errorService: ErroService) { }



  // tslint:disable-next-line: variable-name
  getAllChatId(cd_codigo): Observable<Chats[]>{
    return this.http.get<Chats[]>(this.chatUrl + `BuscaChatid?cd_codigo=` + cd_codigo).pipe(
      catchError(this.errorService.handleError)
    );
  }

  // tslint:disable-next-line: variable-name
  getAllChatPorUsuario(cd_codigo: string): Observable<Chat[]>{
    return this.http.get<Chat[]>(this.chatUrl + `BuscaChatid?cd_codigo=` + cd_codigo).pipe(
      catchError(this.errorService.handleError)
    );
  }

   // tslint:disable-next-line: variable-name
   getChatID(cd_codigo: any): Observable<Chat>{
    return this.http.get<Chat>(this.chatUrl + `id?cd_codigo=` + cd_codigo)
    .pipe(
      catchError(this.errorService.handleError)
    );
  }


}



