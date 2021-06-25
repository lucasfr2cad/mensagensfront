import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';


import { Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class StatusMensagemService {
  private statusMensagensUrl = environment.baseUrl + 'StatusMensagens/';
    constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
   postCM_AtualizarMensagensLidas(cd_chat: any, cd_usuario): Observable<any>{
    return this.http.post<any>(this.statusMensagensUrl + 'chatID/' + cd_chat + '/usuarioID/' + cd_usuario, {});
  }
}
