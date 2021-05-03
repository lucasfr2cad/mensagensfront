import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.models';

@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {
    private currentUserSubject: BehaviorSubject<Usuario>;
    public currentUser: Observable<Usuario>;
    private chatUrl = environment.baseUrl;
    public envio: Usuario;


    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        this.envio = {
        ds_usuario : email,
        ds_senha : password
        };
        return this.http.post<Usuario>(this.chatUrl + `login`,  this.envio )
            .pipe(map(usuario => {
                // login successful if there's a jwt token in the response
                if (usuario && usuario.ds_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(usuario));
                    this.currentUserSubject.next(usuario);
                }
                return usuario;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
