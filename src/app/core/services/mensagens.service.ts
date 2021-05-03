import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../../chat/index/chat.model';

import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MensagensService {
  private mensagensUrl = environment.baseUrl + 'Mensagens/';
    constructor(private http: HttpClient) { }

    postMensagem(mensagem: Message): Observable<Message> {
        return this.http.post(this.mensagensUrl + `enviarmensagem`, mensagem);
    }

    // tslint:disable-next-line: variable-name
    getAllMensagemId(cd_codigo: string): Observable<Message[]>{
      return this.http.get<Message[]>(this.mensagensUrl + `BuscaMensagensid?cd_codigo=` + cd_codigo);
    }

    getAllMessages(): Observable<Message[]> {
      return this.http.get<Message[]>(this.mensagensUrl);
    }


}
