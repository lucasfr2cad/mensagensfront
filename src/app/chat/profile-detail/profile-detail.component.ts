import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contato } from 'src/app/core/models/contato.models';
import { EventEmitterService } from 'src/app/core/services/eventemitter.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})

/**
 * Profile-detail component
 */
export class ProfileDetailComponent implements OnInit {
  sub3: Subscription;
  contato: Contato;
  constructor() {
    this.contato = {
      ds_nome: 'Selecione um contato'
     };
    this.sub3 = EventEmitterService.get('AbreContato').subscribe((contato) => {
     this.contato = contato;
    });
   }

  ngOnInit(): void {
  }

  /**
   * Hide user profile
   */
  // tslint:disable-next-line: typedef
  hideUserProfile() {
    document.getElementById('profile-detail').style.display = 'none';
  }
}
