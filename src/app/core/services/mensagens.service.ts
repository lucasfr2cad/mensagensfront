import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../../chat/index/chat.model';

import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErroService } from './error.service';

@Injectable({ providedIn: 'root' })
export class MensagensService {
  private mensagensUrl = environment.baseUrl + 'Mensagens/';
    constructor(private http: HttpClient, private errorService: ErroService) { }

    postMensagem(mensagem: Message): Observable<Message> {
        return this.http.post(this.mensagensUrl + `enviarmensagem`, mensagem)
        .pipe(
          catchError(this.errorService.handleError)
        );
    }

    // tslint:disable-next-line: variable-name
    getAllMensagemId(cd_codigo: string): Observable<Message[]>{
      return this.http.get<Message[]>(this.mensagensUrl + `BuscaMensagensid?cd_codigo=` + cd_codigo)
      .pipe(
        catchError(this.errorService.handleError)
      );
    }

    getAllMessages(): Observable<Message[]> {
      return this.http.get<Message[]>(this.mensagensUrl)
        .pipe(
          catchError(this.errorService.handleError)
        );
    }


}
