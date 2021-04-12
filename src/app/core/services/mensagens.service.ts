import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../../chat/index/chat.model';

@Injectable({ providedIn: 'root' })
export class MensagensService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Message[]>(`http://localhost:5666/Mensagens`);
    }

    postMensagem(mensagem: Message) {
        return this.http.post(`http://localhost:5666/Mensagens/enviarmensagem`, mensagem);
    }
}
