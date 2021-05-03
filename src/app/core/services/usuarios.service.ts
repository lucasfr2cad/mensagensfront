import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contatos } from '../models/contato.models';
import {Usuario} from '../models/usuario.models';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarioUrl = environment.baseUrl + 'Usuarios/';
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
  getContatoPorId(cd_codigo: any): Observable<Contatos>{
    return this.http.get<Contatos>(this.usuarioUrl + `id?cd_codigo=` + cd_codigo);
  }

  // tslint:disable-next-line: variable-name
  getUsuarioID(cd_codigo: any): Observable<Usuario>{
    return this.http.get<Usuario>(this.usuarioUrl + `id?cd_codigo=` + cd_codigo);
  }


}
