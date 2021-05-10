import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';


import { Empresa } from '../models/empresa.models';
import { Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private empresaUrl = environment.baseUrl + 'Empresas/';
    constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
   getEmpresaID(cd_codigo: any): Observable<Empresa>{
    return this.http.get<Empresa>(this.empresaUrl + cd_codigo);
  }
}
