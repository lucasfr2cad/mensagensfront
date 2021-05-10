import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';


import { Contato } from '../models/contato.models';
import { Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ContatoService {
  private contatoUrl = environment.baseUrl + 'Contatos/';
    constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
   getContatoID(cd_codigo: any): Observable<Contato>{
    return this.http.get<Contato>(this.contatoUrl + cd_codigo);
  }
  // tslint:disable-next-line: variable-name
  getContatoEmpresaID(cd_codigo: any): Observable<Contato[]>{
    return this.http.get<Contato[]>(this.contatoUrl + '?cd_codigo=' + cd_codigo);
  }
}
