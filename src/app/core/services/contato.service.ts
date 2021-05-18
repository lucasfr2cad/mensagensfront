import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';



import { Contato } from '../models/contato.models';
import { Observable} from 'rxjs';
import { Contacts } from 'src/app/chat/tabs/contacts/contacts.model';


@Injectable({ providedIn: 'root' })
export class ContatoService {
  private contatoUrl = environment.baseUrl + 'Contatos/';
    constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
   getContatoID(cd_codigo: any): Observable<Contato>{
    return this.http.get<Contato>(this.contatoUrl + 'id?cd_codigo=' + cd_codigo);
  }
  // tslint:disable-next-line: variable-name
  getContatoEmpresaID(cd_codigo: any): Observable<Contacts[]>{
    return this.http.get<Contacts[]>(this.contatoUrl + '?cd_codigo=' + cd_codigo);
  }

  // tslint:disable-next-line: variable-name
  deleteContatoID(cd_codigo: any): Observable<boolean>{
    return this.http.delete<boolean>(this.contatoUrl + 'cd_codigo?cd_codigo=' + cd_codigo);
  }

  // tslint:disable-next-line: variable-name
  postContato(cd_empresa: string, ds_nome: string, ds_numero_wp: string): Observable<Contato>{
    const contato = {
      cd_empresa,
      ds_nome,
      ds_numero_wp
    };
    return this.http.post<Contato>(this.contatoUrl, contato);
  }
}
