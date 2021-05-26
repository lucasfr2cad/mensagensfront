import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Usuario} from '../models/usuario.models';
import { Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarioUrl = environment.baseUrl + 'Usuarios/';
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
  getContatoPorId(cd_codigo: any): Observable<Usuario>{
    return this.http.get<Usuario>(this.usuarioUrl + `id?cd_codigo=` + cd_codigo);
  }

  // tslint:disable-next-line: variable-name
  getUsuarioID(cd_codigo: any): Observable<Usuario>{
    return this.http.get<Usuario>(this.usuarioUrl + `id?cd_codigo=` + cd_codigo);
  }

  // tslint:disable-next-line: variable-name
  getContatosEmpresaID(cd_codigo: any): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.usuarioUrl + 'BuscarUsuarioPorEmpresaid?cd_codigo=' + cd_codigo);
  }

  postUsuario(usuario: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(this.usuarioUrl, usuario);
  }

  putUsuario(usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(this.usuarioUrl, usuario);
  }

  // tslint:disable-next-line: variable-name
  deleteUsuario(cd_codigo: any): Observable<boolean>{
    return this.http.delete<boolean>(this.usuarioUrl + 'cd_codigo?cd_codigo=' + cd_codigo);
  }


}
