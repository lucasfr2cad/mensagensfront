import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/auth.models';
import { Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(`/api/login`);
    }

    register(user: User): Observable<User> {
        return this.http.post(`/users/register`, user);
    }
}
