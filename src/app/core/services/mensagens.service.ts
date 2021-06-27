import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../../chat/index/chat.model';

import { Observable, of} from 'rxjs';
import { environment } from 'src/environments/environment';
import {MensagemParametroModelo} from '../models/mensagemParametro.Models';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';
import { AuthfakeauthenticationService } from './authfake.service';
import {MensagemInterna} from '../models/mensagemInterna.Models';



@Injectable({ providedIn: 'root' })
export class MensagensService {
   TAGS = [
    ["*", "b"],
    ["_", "i"],
    ["~", "s"],
    ["```", "code"]
];
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
        if (x.ds_corpo_citado !== null){
          x.ds_corpo_citado = this.formatarWhats(x.ds_corpo_citado);
        }
        if (x.ds_corpo !== null){
         // x.message = x.ds_corpo.replace(/\*/g, '');
          x.message = this.formatarWhats(x.ds_corpo);
        }else{
          x.message = x.ds_corpo;
        }
        if (x.ds_tipo === 'interno'){
          if (currentUser.cd_codigo === x.ds_remetente){
            x.align = 'right';
          }else{
            x.align = 'left';
          }
        }else{
          x.align = x.st_de_mim ? 'right' : 'left';
        }
        x.time = format(new Date(x.dt_criacao), 'dd/MM HH:mm');
        // x.profile = 'assets/images/users/avatar-4.jpg';
        x.vl_status = x.vl_status;
        x.name = x.ds_nome_contato_curto;
        x.st_grupo = x.st_grupo;
        if (x.ds_mimetype !== null)
        {
          if (x.ds_mimetype.startsWith('image')){
          x.isimage = true;
          x. imageContent = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${x.ds_mimetype};base64, ${x.ds_data}`);
          }
          else if (x.ds_mimetype.startsWith('audio')){
              const byteCharacters = atob(x.ds_data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], {type: x.ds_mimetype});
              const blobUrl = URL.createObjectURL(blob);
              const santizado = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              x.isAudio = true;
              x.audio = santizado;
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

  postMensagemInterna(mensagem: MensagemInterna): Observable<Message[]> {
    return this.http.post<Message[]>(this.mensagensUrl + `enviarmensageminterna`, mensagem);
}

// tslint:disable-next-line: variable-name
deleteMessage(cd_codigo: string): Observable<boolean>{
  return this.http.delete<boolean>(this.mensagensUrl + 'cd_codigo?cd_codigo=' + cd_codigo);
}

// tslint:disable-next-line: variable-name
getMessage(cd_codigo: string): Observable<Message>{
  return this.http.get<Message>(this.mensagensUrl + 'cd_codigo?cd_codigo=' + cd_codigo);
}

putMessage(message: Message): Observable<Message> {
  const atualizado = {
    cd_codigo : message.cd_codigo
   };
   return this.http.post<Message>(this.mensagensUrl + 'MArcarLida', atualizado);
}

marcaNaoLida(cd_codigo): Observable<Message> {
  const atualizado = {
   cd_codigo
  };
  return this.http.post<Message>(this.mensagensUrl + 'MArcarNaoLida', atualizado);
}



formatarWhats(mensagem): any {
  var e = mensagem.replace(/&/g, "&").replace(/>/g, ">").replace(/</g, "&lt;").replace(/\n/g, "<br />");
  for (var n = 0; n < this.TAGS.length; n++) {
      var o = e.indexOf(this.TAGS[n][0]),
          a = e.indexOf(this.TAGS[n][0], o + 1);
      while (o > -1 && a > -1) {
          e = e.substring(0, o) + "<" + this.TAGS[n][1] + ">" + e.substring(o + this.TAGS[n][0].length, a) + "</" + this.TAGS[n][1] + ">" + e.substring(a + this.TAGS[n][0].length);
          o = e.indexOf(this.TAGS[n][0], a + 1);
          a = e.indexOf(this.TAGS[n][0], o + 1);
      }
  }
  return  e.length > 0 ? e : '<font color="silver">Sem mensagem</font>';
}
}
