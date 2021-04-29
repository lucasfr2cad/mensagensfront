import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ChatativoService {
  activeChatId: string = null;

  retorna(): any{
    return this.activeChatId;
  }

  // tslint:disable-next-line: variable-name
  nomeia(cd_codigo: string): any{
    this.activeChatId = cd_codigo;
  }

}
