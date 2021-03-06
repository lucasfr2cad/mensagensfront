import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';


import { Linha } from '../models/linha.models';
import { Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LinhaService {
  private linhaUrl = environment.baseUrl + 'Linhas/';
    constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
   getLinhaID(cd_codigo: any): Observable<Linha>{
    return this.http.get<Linha>(this.linhaUrl + cd_codigo);
  }

   // tslint:disable-next-line: variable-name
   getLinhaPeloDono(cd_codigo: any): Observable<Linha>{
    return this.http.get<Linha>(this.linhaUrl + 'CM_BuscarPeloDono/id?cd_codigo=' + cd_codigo);
  }

  putLinha(linha: Linha): Observable<Linha>{
    return this.http.put<Linha>(this.linhaUrl, linha);
  }
}
