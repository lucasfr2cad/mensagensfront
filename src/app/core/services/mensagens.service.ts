import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../../chat/index/chat.model';

import { Observable, of} from 'rxjs';
import { environment } from 'src/environments/environment';
import {MensagemParametroModelo} from '../models/mensagemParametro.Models';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';
import { AuthfakeauthenticationService } from './authfake.service';

@Injectable({ providedIn: 'root' })
export class MensagensService {
  private mensagensUrl = environment.baseUrl + 'Mensagens/';
    constructor(private http: HttpClient, private sanitizer: DomSanitizer,
                private authfackservice: AuthfakeauthenticationService) { }

    postMensagem(mensagem: Message): Observable<Message> {
        return this.http.post(this.mensagensUrl + `enviarmensagem`, mensagem);
    }

    // tslint:disable-next-line: variable-name
    postMensagemPorId(cd_codigo: string, mensagem: MensagemParametroModelo): Observable<Message[]> {
      return this.http.post<Message[]>(this.mensagensUrl + `BuscaMensagensPaginada?cd_codigo=` + cd_codigo, mensagem);
  }

  // tslint:disable-next-line: variable-name
  postMensagemPorIdOrdenada(cd_codigo: string, mensagem: MensagemParametroModelo): Observable<Message[]> {
    return this.http.post<Message[]>(this.mensagensUrl + `BuscaMensagensPaginadaOrdenada?cd_codigo=` + cd_codigo, mensagem);
}

    // tslint:disable-next-line: variable-name
    getAllMensagemId(cd_codigo: string): Observable<Message[]>{
      return this.http.get<Message[]>(this.mensagensUrl + `BuscaMensagensid?cd_codigo=` + cd_codigo);
    }

    getAllMessages(): Observable<Message[]> {
      return this.http.get<Message[]>(this.mensagensUrl);
    }

    bindarMensagens = (res: any): Promise<[]> => {
      const currentUser = this.authfackservice.currentUserValue;
      res.forEach(x => {
        x.message = x.ds_corpo;
        x.align = x.ds_remetente === currentUser.ds_numero_wp ? 'right' : 'left';
        x.time = format(new Date(x.dt_criacao), 'dd/MM HH:mm');
        // x.profile = 'assets/images/users/avatar-4.jpg';
        x.vl_status = x.vl_status;
       // x.name = x.ds_nome_contato_curto;
        if (x.ds_mimetype !== null)
        {
          if (x.ds_mimetype.startsWith('image')){
          x.isimage = true;
          x. imageContent = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${x.ds_mimetype};base64, ${x.ds_data}`);
        }
          else{
            x.isfile = true;
            x.fileContent = 'arquivo';
          }
        }
      });
      return res;
  }


  // tslint:disable-next-line: variable-name
  async lerMensagensPorChat(chatId: string, vl_Numero_da_Pagina: number, vl_Tamanho_da_Pagina: number): Promise<any>{
    // tslint:disable-next-line: deprecation
    const mensagemParametroModelo = {
      vl_Numero_da_Pagina,
      vl_Tamanho_da_Pagina
    };
    let teste;
    // tslint:disable-next-line: deprecation
    teste =  await this.postMensagemPorId(chatId, mensagemParametroModelo).toPromise();
    return this.bindarMensagens(teste);
  }

  // tslint:disable-next-line: variable-name
  async lerMensagensPorChatOrdenada(chatId: string, vl_Numero_da_Pagina: number, vl_Tamanho_da_Pagina: number): Promise<any>{
    // tslint:disable-next-line: deprecation
    const mensagemParametroModelo = {
      vl_Numero_da_Pagina,
      vl_Tamanho_da_Pagina
    };
    let teste;
    // tslint:disable-next-line: deprecation
    teste =  await this.postMensagemPorIdOrdenada(chatId, mensagemParametroModelo).toPromise();
    return this.bindarMensagens(teste);
  }


}
