import { environment } from '../../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {ChatativoService} from '../../core/services/chatativo.service';
import {EventEmitterService} from '../../core/services/eventemitter.service';
import {Mensagem} from '../../core/models/mensagem.models';





@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: HubConnection;
  connectionEstablished$ = new BehaviorSubject<boolean>(false);


   constructor(private chatativo: ChatativoService)
  {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

   private createConnection(): any {
      const user = {
        name: '555195817896@c.us',
        key: 12121
        };
      this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.baseUrl + 'notify' + '?user=' + JSON.stringify(user))
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private startConnection(): any {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Hub connection started!');
        this.connectionEstablished$.next(true);
      },
      error => console.error(error)
    );
  }
  private registerOnServerEvents(): void {
    this.hubConnection.on('NovaMensagem', (mensagem: Mensagem) => {
      if (mensagem.cd_chat === this.chatativo.retorna())
      {
        this.chatativo.nomeia(mensagem.cd_chat);
        EventEmitterService.get('NovaMensagem').emit(mensagem);
      }
    });
  }
}
