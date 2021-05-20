import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/core/models/usuario.models';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
/**
 * Tabs-Profile component
 */
export class ProfileComponent implements OnInit {
  usuario: Usuario;

  constructor(private authfackservice: AuthfakeauthenticationService) {  }

  ngOnInit(): void {
    const currentUser = this.authfackservice.currentUserValue;
    this.usuario = currentUser;
  }

}
